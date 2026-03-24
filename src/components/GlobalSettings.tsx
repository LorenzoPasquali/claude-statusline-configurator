"use client";

import { useConfig } from "@/store/useConfig";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function GlobalSettings() {
  const { global, setGlobal } = useConfig();
  const { t } = useI18n();

  return (
    <Card className="bg-black/30 backdrop-blur border-white/10 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-amber-600" />
      <CardContent className="p-6 space-y-6">
        
        <div className="space-y-3">
          <Label className="text-zinc-400">{t.settings.separator}</Label>
          <Input 
            value={global.defaultSeparator}
            onChange={(e) => setGlobal({ defaultSeparator: e.target.value })}
            className="bg-black/40 border-white/10 font-mono text-orange-200"
            placeholder=" | "
          />
          <p className="text-xs text-zinc-500">Use \\n para quebra de linha</p>
        </div>

        <div className="space-y-3">
          <Label className="text-zinc-400">{t.settings.encoding}</Label>
          <Select 
            value={global.encoding} 
            onValueChange={(val: string) => setGlobal({ encoding: val as 'utf-8' | 'ascii' })}
          >
            <SelectTrigger className="bg-black/40 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="utf-8">UTF-8 (Standard)</SelectItem>
              <SelectItem value="ascii">ASCII (Fallback)</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </CardContent>
    </Card>
  );
}
