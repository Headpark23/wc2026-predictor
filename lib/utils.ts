import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Format a UTC date string to UK display format */
export function formatMatchDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Format UTC time string (HH:MM) to BST display (UK) */
export function formatUTCTimeToBST(timeStr: string, dateStr: string): string {
  const [h, m] = timeStr.split(':').map(Number);
  const bstHour = (h + 1) % 24;
  const bstHourStr = String(bstHour).padStart(2, '0');
  const minStr = String(m).padStart(2, '0');
  return `${bstHourStr}:${minStr} BST`;
}

/** Parse API date string to UTC display time */
export function formatApiDate(isoString: string): { date: string; time: string } {
  const d = new Date(isoString);
  const date = d.toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'long', timeZone: 'UTC',
  });
  const hours = String(d.getUTCHours()).padStart(2, '0');
  const mins = String(d.getUTCMinutes()).padStart(2, '0');
  const bstHour = (d.getUTCHours() + 1) % 24;
  const bstStr = `${String(bstHour).padStart(2, '0')}:${mins} BST`;
  return { date, time: bstStr };
}

/** Returns time until tournament start */
export function getCountdown(targetDate: string): {
  days: number; hours: number; minutes: number; seconds: number; started: boolean;
} {
  const now = Date.now();
  const target = new Date(targetDate + 'T20:00:00Z').getTime();
  const diff = target - now;

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, started: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, started: false };
}

/** Get flag emoji from ISO code */
export function getFlagEmoji(countryCode: string): string {
  const code = countryCode.toUpperCase();
  if (code === 'GB-ENG') return '🏴󠁧󠁢󠁥󠁮󠁧󠁿';
  if (code === 'GB-SCT') return '🏴󠁧󠁢󠁳󠁣󠁴󠁿';
  if (code === 'GB-WLS') return '🏴󠁧󠁢󠁷󠁬󠁳󠁿';
  const codePoints = code.split('').map(c => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/** Get flag image URL from flagcdn.com */
export function getFlagUrl(code: string, size: number = 32): string {
  const c = code.toLowerCase();
  return `https://flagcdn.com/${size}x${Math.round(size * 0.75)}/${c}.png`;
}

/** Format probability as percentage */
export function fmtPct(prob: number): string {
  return `${Math.round(prob * 100)}%`;
}

/** Get match status display text */
export function getStatusBadge(status?: string): { text: string; color: string } {
  switch (status) {
    case 'FT': return { text: 'Full Time', color: 'bg-gray-600' };
    case 'LIVE':
    case '1H':
    case '2H':
    case 'HT': return { text: 'LIVE', color: 'bg-red-600 animate-pulse' };
    case 'NS': return { text: 'Upcoming', color: 'bg-blue-700' };
    case 'PST': return { text: 'Postponed', color: 'bg-yellow-700' };
    default: return { text: 'Upcoming', color: 'bg-blue-700' };
  }
}

/** Group name to ordinal display */
export function groupLabel(letter: string): string {
  return `Group ${letter}`;
    }
