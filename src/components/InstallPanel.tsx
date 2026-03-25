"use client";

import { useConfig } from "@/store/useConfig";
import { useI18n } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Check, Terminal } from "lucide-react";
import { generateStatuslinePy } from "@/lib/generator";

function CodeWithCopy({ text, scrollable }: { text: string; scrollable?: boolean }) {
  const [copied, setCopied] = useState(false);
  const doCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-2">
      <div
        className={`w-full bg-black/60 p-4 rounded-lg font-mono text-xs text-orange-400 border border-white/10 custom-scrollbar ${
          scrollable ? 'max-h-52 overflow-auto whitespace-pre' : 'overflow-x-auto whitespace-nowrap'
        }`}
      >
        {text}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={doCopy}
        className="w-full h-8 bg-white/5 hover:bg-white/10 border-white/10 text-zinc-400 hover:text-white text-xs flex items-center justify-center gap-2"
      >
        {copied ? <><Check className="w-3.5 h-3.5 text-orange-400" /> Copiado!</> : <><Copy className="w-3.5 h-3.5" /> Copiar comando</>}
      </Button>
    </div>
  );
}

export function InstallPanel() {
  const { global, modules } = useConfig();
  const { t } = useI18n();
  const [b64, setB64] = useState("");

  useEffect(() => {
    const json = JSON.stringify({ g: global, m: modules });
    const bytes = new TextEncoder().encode(json);
    const binStr = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
    const b = btoa(binStr).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    setB64(b);
  }, [global, modules]);

  const [origin, setOrigin] = useState("https://csc.vercel.app");
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const curlCmd = `curl -sL ${origin}/api/install/${b64} | python3 -`;
  const winCmd = `curl -sL ${origin}/api/install/${b64} | python -`;

  const settingsJson = `"statusLine": {\n  "type": "command",\n  "command": "python3 ~/.claude/statusline.py"\n}`;

  return (
    <Card className="bg-black/30 backdrop-blur border-orange-500/10 shadow-xl relative w-full overflow-hidden">
      <CardContent className="p-6 w-full max-w-full min-w-0">
        <Tabs defaultValue="auto" className="w-full">
          <TabsList className="flex w-full bg-black/40 border border-white/5 mb-6 rounded-lg p-1">
            <TabsTrigger value="auto" className="flex-1 rounded-md data-[state=active]:bg-zinc-800">{t.install.tabAuto}</TabsTrigger>
            <TabsTrigger value="manual" className="flex-1 rounded-md data-[state=active]:bg-zinc-800">{t.install.tabManual}</TabsTrigger>
          </TabsList>

          <TabsContent value="auto" className="space-y-5 w-full">
            <p className="text-sm text-zinc-400">{t.install.requirements}</p>

            <div className="space-y-2 w-full">
              <div className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Mac / Linux:
              </div>
              <CodeWithCopy text={curlCmd} />
            </div>

            <div className="space-y-2 w-full">
              <div className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Windows:
              </div>
              <CodeWithCopy text={winCmd} />
            </div>

            <div className="p-3 bg-orange-950/20 border border-orange-500/20 rounded-lg text-xs text-orange-300/80">
              {t.install.inspectHint}
            </div>
          </TabsContent>

          <TabsContent value="manual" className="space-y-6 w-full">
            <div className="space-y-3 w-full">
              <div>
                <div className="text-sm font-medium text-white/90">{t.install.manualStep1}</div>
                <div className="text-xs text-zinc-500 mt-1">{t.install.manualStep1Path}</div>
              </div>
              <CodeWithCopy text={generateStatuslinePy(global, modules)} scrollable />
            </div>

            <div className="space-y-3 w-full">
              <div>
                <div className="text-sm font-medium text-white/90">{t.install.manualStep2}</div>
                <div className="text-xs text-zinc-500 mt-1">{t.install.manualStep2Path}</div>
              </div>
              <div className="w-full space-y-2">
                <div className="w-full bg-black/60 p-4 rounded-lg font-mono text-xs text-zinc-300 border border-white/10 overflow-x-auto whitespace-pre custom-scrollbar">
                  {settingsJson}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(settingsJson)}
                  className="w-full h-8 bg-white/5 hover:bg-white/10 border-white/10 text-zinc-400 hover:text-white text-xs flex items-center justify-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5" /> Copiar JSON
                </Button>
              </div>
              <p className="text-xs text-zinc-500">{t.install.manualWindowsNote}</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
