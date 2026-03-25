"use client";

import { useConfig } from "@/store/useConfig";
import { formatSegments, MODULE_COLORS } from "@/lib/formatter";
import { useEffect, useState, useRef } from "react";
import { Terminal } from "lucide-react";

export function TerminalPreview() {
  const { global, modules } = useConfig();
  const [mounted, setMounted] = useState(false);
  const [blink, setBlink] = useState(true);
  const [flash, setFlash] = useState(false);
  const prevText = useRef("");

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setBlink(b => !b), 500);
    return () => clearInterval(interval);
  }, []);

  const segments = mounted ? formatSegments(global, modules) : [];
  const fullText = segments.map(s => s.text).join(global.defaultSeparator);

  // Flash effect when preview changes
  useEffect(() => {
    if (prevText.current && prevText.current !== fullText) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 400);
      return () => clearTimeout(timer);
    }
    prevText.current = fullText;
  }, [fullText]);

  if (!mounted) return <div className="h-48 bg-zinc-950 rounded-xl" />;

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0c0c0c] shadow-2xl relative">
      {/* Title bar */}
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

      {/* Terminal body */}
      <div className="p-6 font-mono text-sm leading-relaxed text-zinc-300">
        {/* Prompt line */}
        <div className="flex items-center text-white/70 mb-1">
          <span className="text-orange-400 font-bold mr-2">~/projects/my-app</span>
          <span>$</span>
          <span className="ml-2 w-2 h-4 bg-zinc-300 inline-block align-middle mix-blend-difference" style={{ opacity: blink ? 1 : 0 }} />
        </div>

        {/* Statusline preview */}
        <div
          className="mt-3 py-2 px-3 rounded-lg border border-white/5 bg-white/[0.02] transition-all duration-300"
          style={{
            boxShadow: flash ? '0 0 20px rgba(251, 146, 60, 0.15)' : 'none',
          }}
        >
          {segments.length === 0 ? (
            <span className="text-zinc-600 italic text-xs">Nenhum módulo ativo — ative módulos abaixo para ver o preview</span>
          ) : (
            <span className="flex flex-wrap items-center gap-0">
              {segments.map((seg, i) => (
                <span key={seg.moduleId} className="flex items-center">
                  {i > 0 && <span className="text-zinc-600 mx-0">{global.defaultSeparator}</span>}
                  <span
                    className="font-medium transition-colors duration-300"
                    style={{ color: MODULE_COLORS[seg.moduleId] || '#a1a1aa' }}
                  >
                    {seg.text}
                  </span>
                </span>
              ))}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
