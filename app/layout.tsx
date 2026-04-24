import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'World Cup 2026 AI Predictor',
  description: 'AI-powered match predictions for FIFA World Cup 2026. Scores, corners, cards — powered by Poisson statistics.',
  keywords: 'World Cup 2026, FIFA, predictions, football, AI, Poisson',
  openGraph: {
    title: 'World Cup 2026 AI Predictor',
    description: 'Poisson-based AI predictions for every WC 2026 match',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen bg-fifa-dark">
          {children}
        </main>
        <footer className="bg-fifa-card border-t border-fifa-border py-6 text-center text-gray-500 text-sm">
          <p>World Cup 2026 AI Predictor &bull; Powered by Poisson Distribution &amp; API-Football</p>
          <p className="mt-1">Predictions are statistical estimates only. Not betting advice.</p>
        </footer>
      </body>
    </html>
  );
}
