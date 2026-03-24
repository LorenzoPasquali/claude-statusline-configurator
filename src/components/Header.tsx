"use client";
import { useI18n } from '@/lib/i18n';
import { Button } from './ui/button';
import { Github } from 'lucide-react';

export function Header() {
  const { locale, toggleLocale } = useI18n();

  return (
    <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between mx-auto max-w-5xl px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-black font-extrabold text-xs shadow-lg shadow-orange-500/20">
            CSC
          </div>
          <div className="font-bold hidden sm:inline-block tracking-tight text-white/90">Claude Statusline</div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={toggleLocale} className="text-white/70 hover:text-white">
            {locale === 'pt' ? '🇺🇸 EN' : '🇧🇷 PT'}
          </Button>
          <Button variant="ghost" size="icon" asChild className="text-white/70 hover:text-white rounded-full">
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <Github className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
