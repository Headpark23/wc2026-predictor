'use client';

import { TEAMS } from '@/lib/constants';
import { getFlagEmoji } from '@/lib/utils';

interface TeamFlagProps {
  teamName: string;
  size?: number;
  showName?: boolean;
  namePosition?: 'right' | 'below';
  className?: string;
}

export default function TeamFlag({
  teamName,
  size = 32,
  showName = false,
  namePosition = 'right',
  className = '',
}: TeamFlagProps) {
  const team = TEAMS[teamName];
  const code = (team?.code || 'un').toLowerCase();

  const src = `https://flagcdn.com/w80/${code}.png`;
  const fallback = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24"><rect fill="%23374151" width="24" height="24" rx="2"/></svg>`;

  if (namePosition === 'below') {
    return (
      <div className={`flex flex-col items-center gap-1.5 ${className}`}>
        <div
          className="rounded overflow-hidden shadow-md border border-white/10"
          style={{ width: size * 1.5, height: size }}
        >
          <img
            src={src}
            alt={`${teamName} flag`}
            width={size * 1.5}
            height={size}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
          />
        </div>
        {showName && (
          <span className="text-white text-xs font-semibold text-center leading-tight max-w-[80px]">
            {teamName}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="rounded overflow-hidden shadow-md border border-white/10 flex-shrink-0"
        style={{ width: size * 1.5, height: size }}
      >
        <img
          src={src}
          alt={`${teamName} flag`}
          width={size * 1.5}
          height={size}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
        />
      </div>
      {showName && (
        <span className="text-white font-medium">{teamName}</span>
      )}
    </div>
  );
}
