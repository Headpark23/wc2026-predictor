'use client';
import { useState, useEffect } from 'react';
import { getCountdown } from '@/lib/utils';

interface Props { targetDate: string; }

export default function CountdownTimer({ targetDate }: Props) {
  const [countdown, setCountdown] = useState(getCountdown(targetDate));

  useEffect(() => {
    if (countdown.started) return;
    const timer = setInterval(() => {
      const next = getCountdown(targetDate);
      setCountdown(next);
      if (next.started) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate, countdown.started]);

  if (countdown.started) {
    return (
      <div className="flex items-center gap-2 bg-green-900/30 border border-green-700 rounded-xl px-6 py-3">
        <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
        <span className="text-green-400 font-black text-lg">Tournament is LIVE!</span>
      </div>
    );
  }

  const units = [
    { value: countdown.days, label: 'Days' },
    { value: countdown.hours, label: 'Hours' },
    { value: countdown.minutes, label: 'Mins' },
    { value: countdown.seconds, label: 'Secs' },
  ];

  return (
    <div className="flex items-center gap-3">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-3">
          <div className="bg-fifa-card border border-fifa-border rounded-xl px-4 py-2 text-center min-w-[64px]">
            <div className="text-white text-2xl font-black tabular-nums">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="text-gray-500 text-xs uppercase tracking-wider">{unit.label}</div>
          </div>
          {i < units.length - 1 && (
            <span className="text-gray-600 text-xl font-bold">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
