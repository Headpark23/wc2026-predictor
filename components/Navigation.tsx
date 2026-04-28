'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/',          label: 'Home',     icon: '🏠' },
  { href: '/fixtures',  label: 'Fixtures', icon: '📅' },
  { href: '/groups',    label: 'Groups',   icon: '📊' },
  { href: '/stats',     label: 'Stats',    icon: '🎯' },
  { href: '/h2h',       label: 'H2H',      icon: '⚔️' },
  { href: '/heatmap',   label: 'Heatmap',  icon: '🌡️' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-fifa-darker border-b border-fifa-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <span className="text-2xl">⚽</span>
            <span className="text-white font-black tracking-tight hidden sm:block">
              WC<span className="text-fifa-red">2026</span>
              <span className="text-gray-400 font-normal text-sm ml-2">AI Predictor</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === item.href
                    ? 'bg-fifa-blue text-white shadow-lg shadow-blue-900/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                )}
              >
                <span className="text-base">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Live badge */}
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
            <span className="text-gray-400 hidden md:inline">AI Predictions Live</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
