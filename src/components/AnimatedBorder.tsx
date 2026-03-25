import React from 'react';

export function AnimatedBorder({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-[2rem] p-[1px] bg-gradient-to-br from-orange-500/25 via-amber-600/15 to-orange-400/20 shadow-[0_0_20px_-8px_rgba(249,115,22,0.12)]">
      {/* Container Background */}
      <div className="relative h-full w-full rounded-[calc(2rem-1px)] bg-zinc-950/90 backdrop-blur-3xl p-4 md:p-6 z-10">
        {children}
      </div>
    </div>
  );
}
