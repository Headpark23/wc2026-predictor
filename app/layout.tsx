import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import { Analytics } from '@vercel/analytics/react';

const siteUrl = 'https://wc2026-predictor.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'World Cup 2026 AI Predictor',
    template: '%s | WC2026 AI Predictor',
  },
  description: 'AI-powered predictions for every FIFA World Cup 2026 match. Score predictions, corners, cards and more — powered by statistical modelling.',
  keywords: ['World Cup 2026', 'FIFA', 'predictions', 'AI', 'football', 'soccer', 'WC2026', 'match predictions'],
  authors: [{ name: 'Martin White' }],
  creator: 'Martin White',
  openGraph: {
    title: 'World Cup 2026 AI Predictor',
    description: 'AI-powered predictions for every WC 2026 match — scores, corners, cards and more.',
    url: siteUrl,
    siteName: 'WC2026 AI Predictor',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'World Cup 2026 AI Predictor',
      },
    ],
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Cup 2026 AI Predictor',
    description: 'AI-powered predictions for every WC 2026 match — scores, corners, cards.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-fifa-dark">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="border-t border-fifa-border mt-16 py-8 text-center text-gray-600 text-sm">
          <p>
            ⚽ World Cup 2026 AI Predictor · Predictions powered by statistical modelling ·
            <span className="text-gray-700"> Not affiliated with FIFA</span>
          </p>
          <p className="mt-1 text-xs text-gray-700">
            Predictions are statistical estimates only. For entertainment purposes.
          </p>
          <p className="mt-2 text-xs text-gray-600">
            © {new Date().getFullYear()} Martin White
          </p>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
