"use client";

import { useConfig } from "@/store/useConfig";
import { formatStatusline } from "@/lib/formatter";
import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";

export function TerminalPreview() {
  const { global, modules } = useConfig();
  const [mounted, setMounted] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setBlink(b => !b), 500);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return <div className="h-48 bg-zinc-950 rounded-xl" />;

  const statuslineText = formatStatusline(global, modules);

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0c0c0c] shadow-2xl relative">
      <div className="flex items-center px-4 py-3 bg-[#1c1c1c] border-b border-white/5">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="absolute inset-x-0 text-center text-xs font-semibold text-white/40 flex items-center justify-center gap-2">
          <Terminal className="w-3.5 h-3.5" />
          terminal — claude-code
        </div>
      </div>
      
      <div className="p-6 font-mono text-sm leading-relaxed text-zinc-300">
        <div className="flex items-center text-white/70 mb-1">
          <span className="text-orange-400 font-bold mr-2">~/projects/my-app</span>
          <span>$</span>
          <span className="ml-2 w-2 h-4 bg-zinc-300 inline-block align-middle mix-blend-difference" style={{ opacity: blink ? 1 : 0 }} />
        </div>
        
        {/* Render statusline as multiple lines if newline separator is used */}
        <div className="text-zinc-400 mt-2">
          {statuslineText.split('\\n').map((line, i) => (
            <div key={i} className="whitespace-pre-wrap">{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
