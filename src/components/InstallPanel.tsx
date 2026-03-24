"use client";

import { useConfig } from "@/store/useConfig";
import { useI18n } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Terminal } from "lucide-react";
import { generateStatuslinePy } from "@/lib/generator";

export function InstallPanel() {
  const { global, modules } = useConfig();
  const { t } = useI18n();
  const [b64, setB64] = useState("");

  useEffect(() => {
    const json = JSON.stringify({ g: global, m: modules });
    const b = Buffer.from(json).toString("base64url");
    setB64(b);
  }, [global, modules]);

  // Determine current origin explicitly for Next.js app in browser
  const [origin, setOrigin] = useState("https://csc.vercel.app");
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const curlCmd = `curl -sL ${origin}/api/install/${b64} | python3 -`;
  const winCmd = `curl -sL ${origin}/api/install/${b64} | python -`;

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="bg-black/30 backdrop-blur border-white/10 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-600" />
      <CardContent className="p-6">
        <Tabs defaultValue="auto" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-white/5 mb-6 rounded-lg p-1">
            <TabsTrigger value="auto" className="rounded-md data-[state=active]:bg-zinc-800">{t.install.tabAuto}</TabsTrigger>
            <TabsTrigger value="manual" className="rounded-md data-[state=active]:bg-zinc-800">{t.install.tabManual}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="auto" className="space-y-5 animate-in fade-in duration-500">
            <p className="text-sm text-zinc-400">{t.install.requirements}</p>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-zinc-300 flex items-center gap-2"><Terminal className="w-4 h-4"/> Mac / Linux:</div>
              <div className="flex items-center gap-2">
                <code className="block flex-1 bg-black/50 p-3 rounded-lg font-mono text-xs text-green-400 border border-white/10 overflow-x-auto whitespace-nowrap">
                  {curlCmd}
                </code>
                <Button variant="secondary" size="icon" onClick={() => copy(curlCmd)} className="shrink-0 bg-white/10 hover:bg-white/20 border-white/10">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-sm font-medium text-zinc-300 flex items-center gap-2"><Terminal className="w-4 h-4"/> Windows:</div>
              <div className="flex items-center gap-2">
                <code className="block flex-1 bg-black/50 p-3 rounded-lg font-mono text-xs text-green-400 border border-white/10 overflow-x-auto whitespace-nowrap">
                  {winCmd}
                </code>
                <Button variant="secondary" size="icon" onClick={() => copy(winCmd)} className="shrink-0 bg-white/10 hover:bg-white/20 border-white/10">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-950/20 border border-blue-500/20 rounded-lg text-xs text-blue-300/80">
              {t.install.inspectHint}
            </div>
          </TabsContent>

          <TabsContent value="manual" className="space-y-6 animate-in fade-in duration-500">
             <div className="space-y-2">
               <div className="text-sm font-medium text-white/90">{t.install.manualStep1}</div>
               <div className="text-xs text-zinc-500 mb-2">{t.install.manualStep1Path}</div>
               <div className="flex gap-2">
                 <div className="flex-1 bg-black/50 p-4 rounded-lg font-mono text-xs text-zinc-300 border border-white/10 h-48 overflow-y-auto custom-scrollbar">
                   <pre>{generateStatuslinePy(global, modules)}</pre>
                 </div>
                 <Button variant="secondary" size="icon" onClick={() => copy(generateStatuslinePy(global, modules))} className="shrink-0 bg-white/10 hover:bg-white/20 border-white/10">
                   <Copy className="w-4 h-4" />
                 </Button>
               </div>
             </div>
             
             <div className="space-y-2 pt-2">
               <div className="text-sm font-medium text-white/90">{t.install.manualStep2}</div>
               <div className="text-xs text-zinc-500 mb-2">{t.install.manualStep2Path}</div>
               <div className="flex gap-2">
                 <code className="block flex-1 bg-black/50 p-4 rounded-lg font-mono text-xs text-zinc-300 border border-white/10 overflow-x-auto whitespace-pre">
                   {`"statusLine": {\n  "type": "command",\n  "command": "python3 ~/.claude/statusline.py"\n}`}
                 </code>
                 <Button variant="secondary" size="icon" onClick={() => copy(`"statusLine": {\n  "type": "command",\n  "command": "python3 ~/.claude/statusline.py"\n}`)} className="shrink-0 bg-white/10 hover:bg-white/20 border-white/10">
                   <Copy className="w-4 h-4" />
                 </Button>
               </div>
               <p className="text-xs text-zinc-500 mt-2">{t.install.manualWindowsNote}</p>
             </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
