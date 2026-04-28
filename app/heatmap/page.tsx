'use client';

import { useState, useMemo } from 'react';
import { TEAMS, GROUPS } from '@/lib/constants';
import { predictMatch } from '@/lib/predictions';
import TeamFlag from '@/components/TeamFlag';

const GROUP_KEYS = Object.keys(GROUPS) as string[];

function getConfidenceColor(maxProb: number): string {
  // maxProb is 0-1: probability of the favourite winning
  // High confidence (>70%) = deep green
  // Medium (55-70%) = yellow/amber
  // Contested (<55%) = red/orange
  if (maxProb >= 0.70) return 'bg-emerald-600';
  if (maxProb >= 0.62) return 'bg-emerald-500';
  if (maxProb >= 0.55) return 'bg-yellow-500';
  if (maxProb >= 0.48) return 'bg-orange-500';
  return 'bg-red-500';
}

function getConfidenceLabel(maxProb: number): string {
  if (maxProb >= 0.70) return 'Banker';
  if (maxProb >= 0.62) return 'Likely';
  if (maxProb >= 0.55) return 'Slight fav.';
  if (maxProb >= 0.48) return 'Contested';
  return 'Toss-up';
}

interface MatchCell {
  home: string;
  away: string;
  homeWin: number;
  draw: number;
  awayWin: number;
  maxProb: number;
  favourite: string;
}

export default function HeatmapPage() {
  const [activeGroup, setActiveGroup] = useState('A');
  const [hoveredCell, setHoveredCell] = useState<MatchCell | null>(null);

  const teams = GROUPS[activeGroup] ?? [];

  // Build all n×n match cells (home × away, skip same team)
  const cells = useMemo<MatchCell[][]>(() => {
    return teams.map(home =>
      teams.map(away => {
        if (home === away) return null as unknown as MatchCell;
        const pred = predictMatch(home, away);
        const homeWin = Math.round(pred.homeWinProbability * 100);
        const draw = Math.round(pred.drawProbability * 100);
        const awayWin = Math.round(pred.awayWinProbability * 100);
        const maxProb = Math.max(pred.homeWinProbability, pred.awayWinProbability);
        const favourite = pred.homeWinProbability >= pred.awayWinProbability ? home : away;
        return { home, away, homeWin, draw, awayWin, maxProb, favourite };
      })
    );
  }, [teams]);

  // Flatten to matchups (home < away index, so no dupes)
  const matchups = useMemo(() => {
    const result: MatchCell[] = [];
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        result.push(cells[i][j]);
      }
    }
    return result;
  }, [cells, teams]);

  // Summary stats
  const bankers = matchups.filter(m => m.maxProb >= 0.70).length;
  const tossups = matchups.filter(m => m.maxProb < 0.48).length;
  const avgConf = Math.round(
    (matchups.reduce((s, m) => s + m.maxProb, 0) / matchups.length) * 100
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-white text-3xl font-black">🌡️ Prediction Confidence Heatmap</h1>
        <p className="text-gray-400 text-sm">
          How certain is the AI about each group stage match? Colour intensity shows favourite's win probability.
        </p>
      </div>

      {/* Legend */}
      <div className="bg-fifa-card border border-fifa-border rounded-xl p-4">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Confidence Scale</p>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Banker (>70%)', color: 'bg-emerald-600' },
            { label: 'Likely (62-70%)', color: 'bg-emerald-500' },
            { label: 'Slight fav. (55-62%)', color: 'bg-yellow-500' },
            { label: 'Contested (48-55%)', color: 'bg-orange-500' },
            { label: 'Toss-up (<48%)', color: 'bg-red-500' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-sm ${color} flex-shrink-0`} />
              <span className="text-gray-300 text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Group Tabs */}
      <div className="flex flex-wrap gap-2">
        {GROUP_KEYS.map(g => (
          <button
            key={g}
            onClick={() => setActiveGroup(g)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeGroup === g
                ? 'bg-fifa-blue text-white shadow-lg shadow-blue-900/30'
                : 'bg-fifa-card border border-fifa-border text-gray-400 hover:text-white hover:border-gray-500'
            }`}
          >
            Group {g}
          </button>
        ))}
      </div>

      {/* Group summary pills */}
      <div className="flex gap-4 flex-wrap">
        <div className="bg-emerald-900/40 border border-emerald-700/50 rounded-lg px-4 py-2 text-center">
          <div className="text-emerald-400 text-2xl font-black">{bankers}</div>
          <div className="text-gray-400 text-xs">Bankers</div>
        </div>
        <div className="bg-orange-900/40 border border-orange-700/50 rounded-lg px-4 py-2 text-center">
          <div className="text-orange-400 text-2xl font-black">{tossups}</div>
          <div className="text-gray-400 text-xs">Toss-ups</div>
        </div>
        <div className="bg-blue-900/40 border border-blue-700/50 rounded-lg px-4 py-2 text-center">
          <div className="text-blue-400 text-2xl font-black">{avgConf}%</div>
          <div className="text-gray-400 text-xs">Avg Confidence</div>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="bg-fifa-card border border-fifa-border rounded-2xl p-6">
        <h2 className="text-white font-bold mb-4">
          Group {activeGroup} — All Matchups
        </h2>

        {/* n×n grid */}
        <div className="overflow-x-auto">
          {/* Column headers */}
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `140px repeat(${teams.length}, 1fr)` }}
          >
            <div />
            {teams.map(t => (
              <div key={t} className="flex flex-col items-center gap-1 pb-2">
                <TeamFlag teamName={t} size={28} />
                <span className="text-gray-400 text-xs text-center leading-tight" style={{ fontSize: '10px' }}>
                  {t.split(' ').slice(0, 2).join(' ')}
                </span>
              </div>
            ))}

            {/* Rows */}
            {teams.map((home, i) => (
              <>
                {/* Row label */}
                <div key={`label-${home}`} className="flex items-center gap-2 pr-2">
                  <TeamFlag teamName={home} size={24} />
                  <span className="text-gray-300 text-xs leading-tight" style={{ fontSize: '11px' }}>
                    {home.split(' ').slice(0, 2).join(' ')}
                  </span>
                </div>
                {/* Row cells */}
                {teams.map((away, j) => {
                  if (home === away) {
                    return (
                      <div
                        key={`${home}-${away}`}
                        className="h-14 rounded-md bg-gray-800/50 flex items-center justify-center"
                      >
                        <span className="text-gray-600 text-lg">—</span>
                      </div>
                    );
                  }
                  const cell = cells[i][j];
                  const isHovered = hoveredCell?.home === home && hoveredCell?.away === away;
                  return (
                    <div
                      key={`${home}-${away}`}
                      className={`h-14 rounded-md ${getConfidenceColor(cell.maxProb)} cursor-pointer transition-all duration-150 flex flex-col items-center justify-center gap-0.5 ${
                        isHovered ? 'ring-2 ring-white scale-105' : 'opacity-80 hover:opacity-100'
                      }`}
                      onMouseEnter={() => setHoveredCell(cell)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <span className="text-white font-black text-sm">
                        {Math.round(cell.maxProb * 100)}%
                      </span>
                      <span className="text-white/80 text-xs" style={{ fontSize: '9px' }}>
                        {getConfidenceLabel(cell.maxProb)}
                      </span>
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>

        <p className="text-gray-600 text-xs mt-3">
          Row = Home team · Column = Away team · Cell = favourite's win probability
        </p>
      </div>

      {/* Hover detail panel */}
      {hoveredCell && (
        <div className="bg-gradient-to-r from-fifa-blue/30 via-fifa-card to-fifa-card border border-blue-800/40 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <TeamFlag teamName={hoveredCell.home} size={40} showName namePosition="below" />
            </div>
            <div className="text-gray-400 font-bold text-lg">vs</div>
            <div className="flex flex-col items-center gap-1">
              <TeamFlag teamName={hoveredCell.away} size={40} showName namePosition="below" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-blue-900/40 rounded-lg p-3">
              <div className="text-blue-400 text-2xl font-black">{hoveredCell.homeWin}%</div>
              <div className="text-gray-400 text-xs">{hoveredCell.home.split(' ')[0]} Win</div>
            </div>
            <div className="bg-gray-700/40 rounded-lg p-3">
              <div className="text-gray-300 text-2xl font-black">{hoveredCell.draw}%</div>
              <div className="text-gray-400 text-xs">Draw</div>
            </div>
            <div className="bg-red-900/40 rounded-lg p-3">
              <div className="text-red-400 text-2xl font-black">{hoveredCell.awayWin}%</div>
              <div className="text-gray-400 text-xs">{hoveredCell.away.split(' ')[0]} Win</div>
            </div>
          </div>
          <p className="text-center text-gray-400 text-sm">
            <span className={`font-bold ${hoveredCell.maxProb >= 0.55 ? 'text-emerald-400' : 'text-orange-400'}`}>
              {hoveredCell.favourite}
            </span>{' '}
            favoured — {getConfidenceLabel(hoveredCell.maxProb).toLowerCase()} prediction
            {' '}({Math.round(hoveredCell.maxProb * 100)}% confidence)
          </p>
        </div>
      )}

      {/* All matchups ranking — sorted by confidence */}
      <div className="bg-fifa-card border border-fifa-border rounded-2xl p-6 space-y-3">
        <h2 className="text-white font-bold">
          Group {activeGroup} — Matchups Ranked by Confidence
        </h2>
        <p className="text-gray-400 text-xs">Most predictable → least predictable</p>
        <div className="space-y-2">
          {[...matchups]
            .sort((a, b) => b.maxProb - a.maxProb)
            .map((m, idx) => (
              <div
                key={`${m.home}-${m.away}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-gray-600 text-sm w-5 text-right flex-shrink-0">
                  {idx + 1}
                </span>
                <div
                  className={`w-2 h-8 rounded-full flex-shrink-0 ${getConfidenceColor(m.maxProb)}`}
                />
                <div className="flex items-center gap-2 flex-1">
                  <TeamFlag teamName={m.home} size={20} />
                  <span className="text-gray-300 text-sm">{m.home}</span>
                  <span className="text-gray-600 text-xs">vs</span>
                  <TeamFlag teamName={m.away} size={20} />
                  <span className="text-gray-300 text-sm">{m.away}</span>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-white font-bold text-sm">
                    {Math.round(m.maxProb * 100)}%
                  </div>
                  <div className="text-gray-500 text-xs">{getConfidenceLabel(m.maxProb)}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
