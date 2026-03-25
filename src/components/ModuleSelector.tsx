"use client";

import { useConfig } from "@/store/useConfig";
import { useI18n } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronDown, ChevronRight, Settings } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ModuleConfig } from "@/types/config";
import { getModulePreviewText } from "@/lib/formatter";

const COLOR_PRESETS = [
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Orange', value: '#fb923c' },
  { name: 'Emerald', value: '#34d399' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Sky', value: '#38bdf8' },
  { name: 'Violet', value: '#a78bfa' },
  { name: 'Pink', value: '#f472b6' },
  { name: 'Slate', value: '#94a3b8' },
  { name: 'White', value: '#ffffff' },
];

function TogglePill({ checked, onChange, label, activeLabel }: { checked: boolean, onChange: (v: boolean) => void, label?: string, activeLabel?: string }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
      className={`relative inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all active:scale-[0.96] outline-none select-none shrink-0 ${
        checked 
          ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.15)] hover:bg-orange-500/20' 
          : 'bg-zinc-800/50 text-zinc-500 border border-white/5 hover:text-zinc-300 hover:bg-zinc-800 focus:ring-2 focus:ring-white/10'
      }`}
    >
      {checked ? (activeLabel || 'ON') : (label || 'OFF')}
    </button>
  );
}

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
  const moduleColor = m.color || '#a1a1aa';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-xl border transition-all duration-300 ${
        m.enabled
          ? 'bg-black/30 border-l-[3px] border-white/5 shadow-md hover:shadow-lg'
          : 'bg-black/10 border-white/[0.03] opacity-50'
      }`}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      style={{ ...style, borderLeftColor: m.enabled ? moduleColor : 'transparent' }}
    >
      {/* Main row */}
      <div 
        className="flex items-center gap-3 p-3.5 cursor-pointer select-none group/row"
        onClick={() => updateModule(m.id, { enabled: !m.enabled })}
      >
        <div {...attributes} {...listeners} onClick={e => e.stopPropagation()} className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 p-1 transition-colors">
          <GripVertical className="w-4 h-4" />
        </div>

        <TogglePill checked={m.enabled} onChange={(c) => updateModule(m.id, { enabled: c })} activeLabel="ACTIVE" label="INACTIVE" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`font-semibold text-sm transition-all ${m.enabled ? 'text-zinc-100' : 'text-zinc-500 line-through'}`}>
                {modT.name}
              </span>
            </div>

            {m.enabled && (
              <button 
                onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                className={`p-1.5 rounded-md transition-colors ${expanded ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
              >
                {expanded ? <ChevronDown className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
              </button>
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

      {/* Floating settings panel */}
      {expanded && m.enabled && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl shadow-black/60 px-4 pb-4 pt-3 space-y-4 animate-in slide-in-from-top-2 duration-200">
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
            <div className="flex items-center justify-between py-2 border-b border-white/[0.05]">
              <Label className="text-zinc-400 text-sm cursor-pointer select-none">{t.settings.showPercentage}</Label>
              <TogglePill checked={m.showPercentage} onChange={checked => updateModule(m.id, { showPercentage: checked })} />
            </div>
          ) : null}

          {m.id === 'context' ? (
            <div className="flex items-center justify-between py-2 border-b border-white/[0.05]">
              <Label className="text-zinc-400 text-sm cursor-pointer select-none">{t.settings.showAbsolute}</Label>
              <TogglePill checked={m.showAbsolute} onChange={checked => updateModule(m.id, { showAbsolute: checked })} />
            </div>
          ) : null}

          {m.id === 'session' ? (
            <div className="flex items-center justify-between py-2 border-b border-white/[0.05]">
              {/* @ts-ignore - translation property dynamically added */}
              <Label className="text-zinc-400 text-sm cursor-pointer select-none">{t.settings.showResetTime}</Label>
              <TogglePill checked={!!m.showResetTime} onChange={checked => updateModule(m.id, { showResetTime: checked })} />
            </div>
          ) : null}

          {/* Color Picker */}
          <div className="grid gap-2">
            <Label className="text-zinc-500 text-xs uppercase tracking-wider">{t.settings.color || 'Color'}</Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => updateModule(m.id, { color: p.value })}
                  className={`w-6 h-6 rounded-full border transition-all hover:scale-110 active:scale-90 ${
                    m.color === p.value ? 'border-white scale-110 ring-2 ring-white/20' : 'border-white/10'
                  }`}
                  style={{ backgroundColor: p.value }}
                  title={p.name}
                />
              ))}
            </div>
          </div>
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

  if (!mounted) return <div className="grid grid-cols-1 md:grid-cols-2 gap-2">{sortedModules.map(mod => <div key={mod.id} className="h-14 bg-black/20 rounded-xl animate-pulse" />)}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
