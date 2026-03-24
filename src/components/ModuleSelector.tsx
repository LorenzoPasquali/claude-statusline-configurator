"use client";

import { useConfig } from "@/store/useConfig";
import { useI18n } from "@/lib/i18n";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Settings2 } from "lucide-react";
import { Switch } from "./ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ModuleConfig } from "@/types/config";

function SortableItem({ module: m }: { module: ModuleConfig }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: m.id });
  const { updateModule } = useConfig();
  const { t } = useI18n();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Safe fallback for TypeScript error regarding index typing, since t.modules might technically lack it
  const modT = (t.modules as any)[m.id] || { name: m.id, description: m.id };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-3 bg-black/20 hover:bg-black/40 border border-white/5 rounded-lg group transition-colors shadow-sm">
      <div {...attributes} {...listeners} className="cursor-grab hover:text-white text-zinc-500 p-1">
        <GripVertical className="w-4 h-4" />
      </div>
      
      <Switch 
        checked={m.enabled} 
        onCheckedChange={(checked) => updateModule(m.id, { enabled: checked })} 
        className="data-[state=checked]:bg-orange-500"
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <div className="font-medium text-sm text-zinc-200 truncate">{modT.name}</div>
        <div className="text-xs text-zinc-500 truncate">{modT.description}</div>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 h-8 w-8 rounded-full">
            <Settings2 className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-zinc-950/95 backdrop-blur-xl border border-white/10 p-5 space-y-4 shadow-2xl" align="end" side="left" sideOffset={15}>
          <h4 className="font-semibold text-lg text-white mb-2">{modT.name}</h4>
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="label" className="text-zinc-400">{t.settings.label}</Label>
              <Input 
                id="label"
                value={m.label} 
                onChange={e => updateModule(m.id, { label: e.target.value })} 
                className="bg-black/50 border-white/10"
              />
            </div>
            
            <div className="grid gap-2">
              <Label className="text-zinc-400">{t.settings.barStyle}</Label>
              <Select value={m.barStyle} onValueChange={(v: string) => updateModule(m.id, { barStyle: v as any })}>
                <SelectTrigger className="bg-black/50 border-white/10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ascii">{t.settings.styleOptions.ascii}</SelectItem>
                  <SelectItem value="unicode">{t.settings.styleOptions.unicode}</SelectItem>
                  <SelectItem value="minimal">{t.settings.styleOptions.minimal}</SelectItem>
                  <SelectItem value="none">{t.settings.styleOptions.none}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-zinc-400 cursor-pointer" htmlFor="pct">{t.settings.showPercentage}</Label>
              <Switch id="pct" checked={m.showPercentage} onCheckedChange={checked => updateModule(m.id, { showPercentage: checked })} className="data-[state=checked]:bg-orange-500" />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-zinc-400 cursor-pointer" htmlFor="abs">{t.settings.showAbsolute}</Label>
              <Switch id="abs" checked={m.showAbsolute} onCheckedChange={checked => updateModule(m.id, { showAbsolute: checked })} className="data-[state=checked]:bg-orange-500" />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function ModuleSelector() {
  const { modules, reorderModules } = useConfig();
  
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

  return (
    <div className="space-y-2 p-1">
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
