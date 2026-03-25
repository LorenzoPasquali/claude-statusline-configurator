"use client";

import { useConfig } from "@/store/useConfig";
import { useI18n } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronDown, ChevronRight } from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ModuleConfig } from "@/types/config";
import { getModulePreviewText, MODULE_COLORS } from "@/lib/formatter";

function SortableItem({ module: m }: { module: ModuleConfig }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: m.id });
  const { updateModule } = useConfig();
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const modT = (t.modules as Record<string, {name: string, description: string}>)[m.id] || { name: m.id, description: m.id };
  const previewText = getModulePreviewText(m);
  const moduleColor = MODULE_COLORS[m.id] || '#a1a1aa';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border transition-all duration-300 overflow-hidden ${
        m.enabled
          ? 'bg-black/30 border-l-[3px] border-white/5 shadow-md hover:shadow-lg'
          : 'bg-black/10 border-white/[0.03] opacity-50'
      }`}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      style={{ ...style, borderLeftColor: m.enabled ? moduleColor : 'transparent' }}
    >
      {/* Main row */}
      <div className="flex items-center gap-3 p-3.5">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 p-1 transition-colors">
          <GripVertical className="w-4 h-4" />
        </div>

        <Switch
          checked={m.enabled}
          onCheckedChange={(checked) => updateModule(m.id, { enabled: !!checked })}
          className="data-[state=checked]:bg-orange-500 shrink-0 scale-110"
        />

        <div
          className="flex-1 min-w-0 cursor-pointer select-none"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-2">
            <span className={`font-semibold text-sm transition-all ${m.enabled ? 'text-zinc-100' : 'text-zinc-500 line-through'}`}>
              {modT.name}
            </span>
            {m.enabled && (
              <span className="text-xs text-zinc-600">
                {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </span>
            )}
          </div>

          {/* Inline preview chip — shows what this module outputs */}
          {m.enabled && previewText && (
            <div className="mt-1">
              <code
                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-black/40 border border-white/5 inline-block max-w-full truncate"
                style={{ color: moduleColor }}
              >
                {previewText}
              </code>
            </div>
          )}

          {!m.enabled && (
            <div className="text-xs text-zinc-600 mt-0.5">{modT.description}</div>
          )}
        </div>
      </div>

      {/* Expanded inline settings */}
      {expanded && m.enabled && (
        <div className="px-4 pb-4 pt-1 border-t border-white/5 bg-black/20 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="grid gap-2">
            <Label className="text-zinc-500 text-xs uppercase tracking-wider">{t.settings.label}</Label>
            <Input
              value={m.label}
              onChange={e => updateModule(m.id, { label: e.target.value })}
              className="bg-black/50 border-white/10 h-8 text-sm"
            />
          </div>

          {m.id === 'context' || m.id === 'session' ? (
            <div className="grid gap-2">
              <Label className="text-zinc-500 text-xs uppercase tracking-wider">{t.settings.barStyle}</Label>
              <Select value={m.barStyle || 'ascii'} onValueChange={(v) => updateModule(m.id, { barStyle: v as 'ascii' | 'unicode' | 'minimal' | 'none' })}>
                <SelectTrigger className="bg-black/50 border-white/10 h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ascii">{t.settings.styleOptions.ascii}</SelectItem>
                  <SelectItem value="unicode">{t.settings.styleOptions.unicode}</SelectItem>
                  <SelectItem value="minimal">{t.settings.styleOptions.minimal}</SelectItem>
                  <SelectItem value="none">{t.settings.styleOptions.none}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : null}

          {m.id === 'context' || m.id === 'session' ? (
            <div className="flex items-center justify-between py-1">
              <Label className="text-zinc-400 text-sm cursor-pointer">{t.settings.showPercentage}</Label>
              <Switch checked={m.showPercentage} onCheckedChange={checked => updateModule(m.id, { showPercentage: !!checked })} className="data-[state=checked]:bg-orange-500" />
            </div>
          ) : null}

          {m.id === 'context' ? (
            <div className="flex items-center justify-between py-1">
              <Label className="text-zinc-400 text-sm cursor-pointer">{t.settings.showAbsolute}</Label>
              <Switch checked={m.showAbsolute} onCheckedChange={checked => updateModule(m.id, { showAbsolute: !!checked })} className="data-[state=checked]:bg-orange-500" />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function ModuleSelector() {
  const { modules, reorderModules } = useConfig();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = modules.findIndex((item) => item.id === active.id);
      const newIndex = modules.findIndex((item) => item.id === over.id);

      const newModules = arrayMove(modules, oldIndex, newIndex).map((m, i) => ({ ...m, order: i }));
      reorderModules(newModules);
    }
  };

  const sortedModules = [...modules].sort((a, b) => a.order - b.order);

  if (!mounted) return <div className="space-y-3">{sortedModules.map(mod => <div key={mod.id} className="h-16 bg-black/20 rounded-xl animate-pulse" />)}</div>;

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sortedModules.map(m => m.id)} strategy={verticalListSortingStrategy}>
          {sortedModules.map(mod => (
            <SortableItem key={mod.id} module={mod} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
