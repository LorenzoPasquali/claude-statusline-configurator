"use client";
import { useI18n } from '@/lib/i18n';
import { Button } from './ui/button';
import { Star } from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

import Image from "next/image";
import claudeLogo from "@/assets/images/claude.png";

export function Header() {
  const { locale, toggleLocale } = useI18n();

  return (
    <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between mx-auto max-w-5xl px-4">
        <div className="flex items-center gap-3">
          <Image
            src={claudeLogo}
            alt="Claude Logo"
            width={32}
            height={32}
            className="rounded-lg object-cover shadow-lg shadow-orange-500/20"
          />
          <div className="font-bold hidden sm:inline-block tracking-tight text-white/90">Claude Statusline Configurator</div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={toggleLocale} className="text-white/70 hover:text-white">
            {locale === 'pt' ? '🇺🇸 EN' : '🇧🇷 PT'}
          </Button>
          <a 
            href="https://github.com/LorenzoPasquali/claude-statusline-configurator" 
            target="_blank" 
            rel="noreferrer" 
            className="group flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all shadow-sm shadow-black/20"
          >
            <GithubIcon className="w-4 h-4 text-zinc-300 group-hover:text-white transition-colors" />
            <span className="text-zinc-300 group-hover:text-white text-xs font-semibold hidden sm:inline-block transition-colors">Star</span>
            <div className="hidden sm:block w-px h-3 bg-white/20 mx-0.5" />
            <Star className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-500 group-hover:fill-amber-500 transition-colors" />
          </a>
        </div>
      </div>
    </header>
  );
}
