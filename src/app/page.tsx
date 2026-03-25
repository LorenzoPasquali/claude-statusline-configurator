"use client";
import { Header } from '@/components/Header';
import { TerminalPreview } from '@/components/TerminalPreview';
import { ModuleSelector } from '@/components/ModuleSelector';
import { InstallPanel } from '@/components/InstallPanel';
import { Footer } from '@/components/Footer';
import { useI18n } from '@/lib/i18n';
import { AnimatedBorder } from '@/components/AnimatedBorder';
import { useConfig } from '@/store/useConfig';

const SEPARATOR_OPTIONS = [
  { label: ' | ', value: ' | ' },
  { label: ' · ', value: ' · ' },
  { label: '   ', value: '   ' },
  { label: ' — ', value: ' — ' },
  { label: ' / ', value: ' / ' },
];

export default function Home() {
  const { t } = useI18n();
  const { global, setGlobal } = useConfig();
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col selection:bg-orange-500/30 font-sans">
      <Header />
      <main className="flex-1 container mx-auto max-w-[1400px] px-4 md:px-8 py-6 md:py-10 space-y-8">

        {/* Subtitle */}
        <p className="text-center text-zinc-400 max-w-xl mx-auto text-sm md:text-base font-medium tracking-wide">
          {t.subtitle}
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          
          {/* Left Column */}
          <div className="space-y-8">
            {/* Sticky terminal preview */}
            <div className="sticky top-16 z-40 space-y-6">
              <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
                {t.settings.terminalPreview}
              </h2>
              <AnimatedBorder>
                <TerminalPreview />
              </AnimatedBorder>
            </div>

            {/* Modules */}
            <AnimatedBorder>
              <section className="space-y-6">
                <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
                  {t.settings.configure} — Modules
                </h2>
                <ModuleSelector />
              </section>
            </AnimatedBorder>
          </div>

          {/* Right Column */}
          <div className="space-y-8">

            {/* Separator Selector */}
            <AnimatedBorder>
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
                  {t.settings.separator}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {SEPARATOR_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setGlobal({ defaultSeparator: opt.value })}
                      className={`px-4 py-2 rounded-lg font-mono text-sm transition-all active:scale-[0.96] border ${
                        global.defaultSeparator === opt.value
                          ? 'bg-orange-500/15 text-orange-400 border-orange-500/30 shadow-[0_0_12px_rgba(249,115,22,0.15)]'
                          : 'bg-zinc-800/40 text-zinc-400 border-white/5 hover:bg-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      <code>{JSON.stringify(opt.label)}</code>
                    </button>
                  ))}
                </div>
              </section>
            </AnimatedBorder>
            <AnimatedBorder>
              <section className="space-y-6">
                <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
                  {t.install.title}
                </h2>
                <InstallPanel />
              </section>
            </AnimatedBorder>
          </div>

        </div>

      </main>
      <Footer />
    </div>
  );
}
