"use client";
import { Header } from '@/components/Header';
import { TerminalPreview } from '@/components/TerminalPreview';
import { ModuleSelector } from '@/components/ModuleSelector';
import { GlobalSettings } from '@/components/GlobalSettings';
import { InstallPanel } from '@/components/InstallPanel';
import { Footer } from '@/components/Footer';
import { useI18n } from '@/lib/i18n';

export default function Home() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col selection:bg-orange-500/30">
      <Header />
      <main className="flex-1 container mx-auto max-w-3xl px-4 py-10 space-y-10">

        {/* Hero */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-600">
            {t.title}
          </h1>
          <p className="text-zinc-400 max-w-lg mx-auto text-base md:text-lg font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* Sticky terminal preview */}
        <div className="sticky top-16 z-40 shadow-2xl shadow-orange-900/10 rounded-xl">
          <TerminalPreview />
        </div>

        {/* Modules */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white/90 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-orange-400 to-amber-600 inline-block" />
            {t.settings.configure} — Modules
          </h2>
          <ModuleSelector />
        </section>

        {/* Global Settings */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white/90 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-blue-400 to-cyan-600 inline-block" />
            {t.settings.globalSettings}
          </h2>
          <GlobalSettings />
        </section>

        {/* Installation */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white/90 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-green-400 to-emerald-600 inline-block" />
            {t.install.title}
          </h2>
          <InstallPanel />
        </section>

      </main>
      <Footer />
    </div>
  );
}
