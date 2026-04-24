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
  teamName, size = 32, showName = false, namePosition = 'right', className = '',
}: TeamFlagProps) {
  const team = TEAMS[teamName];
  const code = team?.code || 'un';
  const isSubdivision = code.includes('-');
  const src = `https://flagcdn.com/w${size * 2}/${code}.png`;

  if (isSubdivision) {
    const emoji = getFlagEmoji(code);
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span style={{ fontSize: size * 0.7 }}>{emoji}</span>
        {showName && <span className="text-white font-medium">{teamName}</span>}
      </div>
    );
  }

  if (namePosition === 'below') {
    return (
      <div className={`flex flex-col items-center gap-1.5 ${className}`}>
        <div className="rounded overflow-hidden border border-white/10"
          style={{ width: size * 1.5, height: size }}>
          <img src={src} alt={teamName} className="w-full h-full object-cover" />
        </div>
        {showName && (
          <span className="text-white text-xs font-semibold text-center max-w-[80px] leading-tight">
            {teamName}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="rounded overflow-hidden border border-white/10 flex-shrink-0"
        style={{ width: size * 1.5, height: size }}>
        <img src={src} alt={teamName} className="w-full h-full object-cover" />
      </div>
      {showName && <span className="text-white font-medium">{teamName}</span>}
    </div>
  );
}
