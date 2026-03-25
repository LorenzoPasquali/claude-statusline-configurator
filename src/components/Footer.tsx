import { Heart, Star } from "lucide-react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black/40 mt-auto py-10 mt-10">
      <div className="container mx-auto px-4 max-w-5xl flex flex-col items-center justify-center gap-6 text-sm text-zinc-400">
        
        {/* Credits Pill */}
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-lg shadow-black/50">
          <img
            src="https://github.com/LorenzoPasquali.png"
            alt="Lorenzo Pasquali"
            width={24}
            height={24}
            className="rounded-full ring-2 ring-white/10"
          />
          <span className="flex items-center gap-1.5">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by{' '}
            <a
              href="https://github.com/LorenzoPasquali"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white hover:text-orange-400 transition-colors"
            >
              Lorenzo Pasquali
            </a>
          </span>
        </div>

        {/* GitHub Repo Link & Star CTA */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-zinc-500">If you find this tool helpful, consider supporting open source!</p>
          <a
            href="https://github.com/LorenzoPasquali/claude-statusline-configurator"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 hover:border-zinc-700 hover:scale-105 active:scale-95 transition-all shadow-md shadow-orange-500/5 hover:shadow-orange-500/20"
          >
            <GithubIcon className="w-4 h-4 text-zinc-300 group-hover:text-white" />
            <span className="text-zinc-300 group-hover:text-white font-medium">claude-statusline-configurator</span>
            <div className="w-px h-4 bg-zinc-700 mx-1" />
            <div className="flex items-center gap-1.5 text-zinc-400 group-hover:text-amber-500 transition-colors">
              <Star className="w-4 h-4 group-hover:fill-amber-500" />
              <span className="font-semibold">Star</span>
            </div>
          </a>
        </div>

      </div>
    </footer>
  );
}
