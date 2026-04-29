'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/',          label: 'Home',      icon: '🏠' },
  { href: '/fixtures',  label: 'Fixtures',  icon: '📅' },
  { href: '/groups',    label: 'Groups',    icon: '📊' },
  { href: '/stats',     label: 'Stats',     icon: '🎯' },
  { href: '/h2h',       label: 'H2H',       icon: '⚔️' },
  { href: '/heatmap',   label: 'Heatmap',   icon: '🌡️' },
  { href: '/winner',    label: 'Winner',    icon: '🏆' },
  { href: '/standings', label: 'Standings', icon: '📋' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-fifa-darker border-b border-fifa-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl" onClick={() => setMobileOpen(false)}>
            <span className="text-2xl">⚽</span>
            <span className="text-white font-black tracking-tight hidden sm:block">
              WC<span className="text-fifa-red">2026</span>
              <span className="text-gray-400 font-normal text-sm ml-2">AI Predictor</span>
            </span>
            <span className="text-white font-black tracking-tight sm:hidden text-base">
              WC<span className="text-fifa-red">2026</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden sm:flex items-center gap-1">
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
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right side: live badge + hamburger */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
              <span className="text-gray-400 hidden md:inline">AI Predictions Live</span>
            </div>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="sm:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg hover:bg-white/10 transition-colors gap-1.5"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <span className={cn(
                'block w-5 h-0.5 bg-white transition-all duration-200 origin-center',
                mobileOpen ? 'rotate-45 translate-y-[7px]' : ''
              )} />
              <span className={cn(
                'block w-5 h-0.5 bg-white transition-all duration-200',
                mobileOpen ? 'opacity-0' : ''
              )} />
              <span className={cn(
                'block w-5 h-0.5 bg-white transition-all duration-200 origin-center',
                mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''
              )} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div className={cn(
        'sm:hidden border-t border-fifa-border bg-fifa-darker overflow-hidden transition-all duration-300',
        mobileOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="grid grid-cols-4 gap-1 p-3">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex flex-col items-center gap-1 py-3 px-1 rounded-xl text-xs font-medium transition-all duration-200',
                pathname === item.href
                  ? 'bg-fifa-blue text-white shadow-lg shadow-blue-900/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
