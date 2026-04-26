'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'ð  Home' },
  { href: '/fixtures', label: 'ð Fixtures' },
  { href: '/groups', label: 'ð Groups' },
  { href: '/stats', label: 'ð Stats' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-fifa-card border-b border-fifa-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">â½</span>
            <div>
              <div className="text-white font-black text-sm leading-tight">WC 2026</div>
              <div className="text-blue-400 text-xs leading-tight">AI Predictor</div>
            </div>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {NAV_LINKS.map(link => {
              const isActive = link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-fifa-blue text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Live badge */}
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 font-medium">Live from Jun 11</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
