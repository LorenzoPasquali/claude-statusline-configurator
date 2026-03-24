"use client";
import { Header } from '@/components/Header';
import { TerminalPreview, ModuleSelector, GlobalSettings, InstallPanel } from '@/components/stubs';
import { useI18n } from '@/lib/i18n';

export default function Home() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col selection:bg-orange-500/30">
      <Header />
      <main className="flex-1 container mx-auto max-w-5xl px-4 py-12 grid gap-10 animate-in fade-in duration-1000">
        
        <div className="text-center space-y-4 mb-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-600 drop-shadow-sm">
            {t.title}
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-lg md:text-xl font-medium">
            {t.subtitle}
          </p>
        </div>

        <div className="shadow-2xl shadow-orange-900/10 rounded-xl">
          <TerminalPreview />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
             <div className="font-semibold text-xl text-white/90">Modules</div>
             <ModuleSelector />
          </div>
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="font-semibold text-xl text-white/90">Global Settings</div>
              <GlobalSettings />
            </div>
            <div className="space-y-6">
              <div className="font-semibold text-xl text-white/90">Installation</div>
              <InstallPanel />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
