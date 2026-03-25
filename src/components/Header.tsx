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

const BrazilFlag = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <rect width="512" height="512" rx="64" fill="#6DA544"/>
    <polygon fill="#FFDA44" points="256,100.2 467.5,256 256,411.8 44.5,256"/>
    <circle fill="#F0F0F0" cx="256" cy="256" r="89"/>
    <path fill="#0052B4" d="M211.5,236.5c-15.2,0-29.8,2.3-43.6,6.6C170.3,302.4,209.4,345,258.9,345c34,0,63.9-18.9,79.2-46.7C314.5,262.4,265.2,236.5,211.5,236.5z"/>
    <path fill="#F0F0F0" d="M216.7,259.1c-14.3,0-28,2-41,5.7c1.2,5.4,3,10.6,5.4,15.5c11.3-2.8,23.2-4.3,35.4-4.3c26,0,50.2,7.2,70.9,19.7c3.8-4.5,7.1-9.5,9.8-14.8C274.3,267.7,246.7,259.1,216.7,259.1z"/>
  </svg>
);

const USAFlag = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <rect width="512" height="512" rx="64" fill="#F0F0F0"/>
    <g fill="#D80027">
      <rect y="59.4" width="512" height="39.4"/>
      <rect y="138.2" width="512" height="39.4"/>
      <rect y="217" width="512" height="39.4"/>
      <rect y="295.9" width="512" height="39.4"/>
      <rect y="374.8" width="512" height="39.4"/>
      <rect y="453.6" width="512" height="39.4"/>
    </g>
    <rect fill="#0052B4" width="256" height="275.7"/>
    <g fill="#F0F0F0">
      <polygon points="47,62 51,73.5 63.3,73.5 53.1,80.7 57.2,92.2 47,85 36.8,92.2 40.9,80.7 30.7,73.5 43,73.5"/>
      <polygon points="103,62 107,73.5 119.3,73.5 109.1,80.7 113.2,92.2 103,85 92.8,92.2 96.9,80.7 86.7,73.5 99,73.5"/>
      <polygon points="159,62 163,73.5 175.3,73.5 165.1,80.7 169.2,92.2 159,85 148.8,92.2 152.9,80.7 142.7,73.5 155,73.5"/>
      <polygon points="215,62 219,73.5 231.3,73.5 221.1,80.7 225.2,92.2 215,85 204.8,92.2 208.9,80.7 198.7,73.5 211,73.5"/>
      <polygon points="75,105 79,116.5 91.3,116.5 81.1,123.7 85.2,135.2 75,128 64.8,135.2 68.9,123.7 58.7,116.5 71,116.5"/>
      <polygon points="131,105 135,116.5 147.3,116.5 137.1,123.7 141.2,135.2 131,128 120.8,135.2 124.9,123.7 114.7,116.5 127,116.5"/>
      <polygon points="187,105 191,116.5 203.3,116.5 193.1,123.7 197.2,135.2 187,128 176.8,135.2 180.9,123.7 170.7,116.5 183,116.5"/>
      <polygon points="47,148 51,159.5 63.3,159.5 53.1,166.7 57.2,178.2 47,171 36.8,178.2 40.9,166.7 30.7,159.5 43,159.5"/>
      <polygon points="103,148 107,159.5 119.3,159.5 109.1,166.7 113.2,178.2 103,171 92.8,178.2 96.9,166.7 86.7,159.5 99,159.5"/>
      <polygon points="159,148 163,159.5 175.3,159.5 165.1,166.7 169.2,178.2 159,171 148.8,178.2 152.9,166.7 142.7,159.5 155,159.5"/>
      <polygon points="215,148 219,159.5 231.3,159.5 221.1,166.7 225.2,178.2 215,171 204.8,178.2 208.9,166.7 198.7,159.5 211,159.5"/>
      <polygon points="75,191 79,202.5 91.3,202.5 81.1,209.7 85.2,221.2 75,214 64.8,221.2 68.9,209.7 58.7,202.5 71,202.5"/>
      <polygon points="131,191 135,202.5 147.3,202.5 137.1,209.7 141.2,221.2 131,214 120.8,221.2 124.9,209.7 114.7,202.5 127,202.5"/>
      <polygon points="187,191 191,202.5 203.3,202.5 193.1,209.7 197.2,221.2 187,214 176.8,221.2 180.9,209.7 170.7,202.5 183,202.5"/>
    </g>
  </svg>
);

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
          <Button variant="ghost" size="sm" onClick={toggleLocale} className="text-white/70 hover:text-white flex items-center gap-2">
            {locale === 'pt' ? (
              <><USAFlag className="w-5 h-5 rounded-sm" /> <span>EN</span></>
            ) : (
              <><BrazilFlag className="w-5 h-5 rounded-sm" /> <span>PT</span></>
            )}
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
