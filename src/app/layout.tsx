import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";

const interSans = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Claude Statusline Configurator',
  description: 'Visually configure your Claude Code terminal status bar.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("dark", "font-sans", interSans.variable)}>
      <body className={`${interSans.className} bg-zinc-950 text-zinc-50 min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
