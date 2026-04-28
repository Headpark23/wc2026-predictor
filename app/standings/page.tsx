'use client';

import { useState, useMemo } from 'react';
import { GROUPS } from '@/lib/constants';
import { predictMatch } from '@/lib/predictions';
import TeamFlag from '@/components/TeamFlag';

const SIMS = 500;
const GK = Object.keys(GROUPS);

interface TeamStanding {
  name: string;
  pts: number; gd: number; gf: number; ga: number; w: number; d: number; l: number;
  qualPct: number;  // % top 2
  thirdPct: number; // % 3rd
  elimPct: number;  // % 4th
}

function simGroupOnce(gk: string): Record<string, { pts: number; gd: number; gf: number; ga: number; w: number; d: number; l: number }> {
  const ts = GROUPS[gk];
  const s: Record<string, { pts: number; gd: number; gf: number; ga: number; w: number; d: number; l: number }> = {};
  ts.forEach(t => { s[t] = { pts: 0, gd: 0, gf: 0, ga: 0, w: 0, d: 0, l: 0 }; });

  for (let i = 0; i < ts.length; i++) {
    for (let j = i + 1; j < ts.length; j++) {
      const h = ts[i], a = ts[j];
      const p = predictMatch(h, a);
      const r = Math.random();
      const hg = Math.round(Math.random() * 2.5 + 0.3);
      const ag = Math.round(Math.random() * 2 + 0.2);
      if (r < p.homeWinProbability) {
        const hScore = Math.max(hg, ag + 1), aScore = Math.min(ag, hg - 1 < 0 ? 0 : hg - 1);
        s[h].pts += 3; s[h].gf += hScore; s[h].ga += aScore; s[h].gd += hScore - aScore; s[h].w++;
        s[a].gf += aScore; s[a].ga += hScore; s[a].gd -= hScore - aScore; s[a].l++;
      } else if (r < p.homeWinProbability + p.drawProbability) {
        const g = Math.max(0, Math.round((hg + ag) / 2));
        s[h].pts++; s[a].pts++;
        s[h].gf += g; s[h].ga += g; s[a].gf += g; s[a].ga += g; s[h].d++; s[a].d++;
      } else {
        const aScore = Math.max(ag, hg + 1), hScore = Math.min(hg, ag - 1 < 0 ? 0 : ag - 1);
        s[a].pts += 3; s[a].gf += aScore; s[a].ga += hScore; s[a].gd += aScore - hScore; s[a].w++;
        s[h].gf += hScore; s[h].ga += aScore; s[h].gd -= aScore - hScore; s[h].l++;
      }
    }
  }
  return s;
}

function runStandings(gk: string): TeamStanding[] {
  const acc: Record<string, { pts: number; gd: number; gf: number; ga: number; w: number; d: number; l: number; pos: number[] }> = {};
  GROUPS[gk].forEach(t => { acc[t] = { pts: 0, gd: 0, gf: 0, ga: 0, w: 0, d: 0, l: 0, pos: [0, 0, 0, 0] }; });

  for (let s = 0; s < SIMS; s++) {
    const res = simGroupOnce(gk);
    const sorted = GROUPS[gk].slice().sort((x, y) =>
      res[y].pts !== res[x].pts ? res[y].pts - res[x].pts :
      res[y].gd !== res[x].gd ? res[y].gd - res[x].gd :
      res[y].gf - res[x].gf
    );
    sorted.forEach((t, i) => {
      acc[t].pts += res[t].pts;
      acc[t].gd += res[t].gd;
      acc[t].gf += res[t].gf;
      acc[t].ga += res[t].ga;
      acc[t].w += res[t].w;
      acc[t].d += res[t].d;
      acc[t].l += res[t].l;
      acc[t].pos[i]++;
    });
  }

  return GROUPS[gk].map(t => ({
    name: t,
    pts: Math.round(acc[t].pts / SIMS * 10) / 10,
    gd: Math.round(acc[t].gd / SIMS * 10) / 10,
    gf: Math.round(acc[t].gf / SIMS * 10) / 10,
    ga: Math.round(acc[t].ga / SIMS * 10) / 10,
    w: Math.round(acc[t].w / SIMS * 10) / 10,
    d: Math.round(acc[t].d / SIMS * 10) / 10,
    l: Math.round(acc[t].l / SIMS * 10) / 10,
    qualPct: Math.round((acc[t].pos[0] + acc[t].pos[1]) / SIMS * 100),
    thirdPct: Math.round(acc[t].pos[2] / SIMS * 100),
    elimPct: Math.round(acc[t].pos[3] / SIMS * 100),
  })).sort((a, b) => b.qualPct !== a.qualPct ? b.qualPct - a.qualPct : b.pts - a.pts);
}

function qualColor(qualPct: number, elimPct: number) {
  if (qualPct >= 70) return 'border-l-4 border-emerald-500';
  if (qualPct >= 40) return 'border-l-4 border-blue-500';
  if (elimPct >= 70) return 'border-l-4 border-red-600';
  return 'border-l-4 border-orange-500';
}

function qualBadge(qualPct: number, elimPct: number) {
  if (qualPct >= 70) return { text: 'Likely through', cls: 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/50' };
  if (qualPct >= 40) return { text: 'Contention', cls: 'bg-blue-900/50 text-blue-400 border border-blue-700/50' };
  if (elimPct >= 70) return { text: 'Likely out', cls: 'bg-red-900/50 text-red-400 border border-red-700/50' };
  return { text: 'Uncertain', cls: 'bg-orange-900/50 text-orange-400 border border-orange-700/50' };
}

export default function StandingsPage() {
  const [activeGroup, setActiveGroup] = useState('A');
  const [cache, setCache] = useState<Record<string, TeamStanding[]>>({});
  const [loading, setLoading] = useState(false);

  const standings = useMemo(() => cache[activeGroup] ?? null, [cache, activeGroup]);

  function calculate() {
    if (cache[activeGroup]) return;
    setLoading(true);
    setTimeout(() => {
      const result = runStandings(activeGroup);
      setCache(prev => ({ ...prev, [activeGroup]: result }));
      setLoading(false);
    }, 20);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-white text-3xl font-black">📊 Group Stage Standings Predictor</h1>
        <p className="text-gray-400 text-sm">
          {SIMS} simulations per group — predicted final standings with qualification probabilities.
        </p>
      </div>

      {/* Legend */}
      <div className="bg-fifa-card border border-fifa-border rounded-xl p-4 flex flex-wrap gap-4">
        {[
          { color: 'bg-emerald-500', label: 'Likely through (top 2)' },
          { color: 'bg-blue-500',    label: 'In contention' },
          { color: 'bg-orange-500',  label: 'Uncertain' },
          { color: 'bg-red-600',     label: 'Likely eliminated' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-3 h-5 rounded-sm ${color}`} />
            <span className="text-gray-400 text-xs">{label}</span>
          </div>
        ))}
      </div>

      {/* Group tabs */}
      <div className="flex flex-wrap gap-2">
        {GK.map(g => (
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

      {/* Calculate button or results */}
      {!standings && !loading && (
        <div className="bg-fifa-card border border-fifa-border rounded-2xl p-8 text-center space-y-3">
          <p className="text-gray-400 text-sm">Run {SIMS} simulations for Group {activeGroup} to see predicted standings.</p>
          <button
            onClick={calculate}
            className="bg-fifa-blue hover:bg-blue-600 text-white font-black px-8 py-3 rounded-xl text-lg transition-colors shadow-lg"
          >
            ⚡ Predict Group {activeGroup}
          </button>
        </div>
      )}

      {loading && (
        <div className="bg-fifa-card border border-fifa-border rounded-2xl p-8 text-center space-y-2">
          <div className="text-white font-bold">🔄 Simulating Group {activeGroup}…</div>
          <div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-fifa-blue h-2 rounded-full animate-pulse w-1/2" /></div>
        </div>
      )}

      {standings && (
        <div className="bg-fifa-card border border-fifa-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-fifa-border flex items-center justify-between">
            <h2 className="text-white font-bold">Group {activeGroup} — Predicted Final Standings</h2>
            <button onClick={() => { setCache(prev => { const n = {...prev}; delete n[activeGroup]; return n; }); }}
              className="text-gray-500 hover:text-gray-300 text-xs transition-colors">↻ Recalculate</button>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-[4px_1fr_48px_40px_40px_40px_52px_52px_52px_80px] gap-1 text-gray-500 text-xs font-bold uppercase tracking-wider px-4 py-2 border-b border-fifa-border/50">
            <div/>
            <div>Team</div>
            <div className="text-center">Pts</div>
            <div className="text-center">W</div>
            <div className="text-center">D</div>
            <div className="text-center">L</div>
            <div className="text-center">GF</div>
            <div className="text-center">GD</div>
            <div className="text-center hidden sm:block">Qual%</div>
            <div className="text-center">Status</div>
          </div>

          {standings.map((t, i) => {
            const badge = qualBadge(t.qualPct, t.elimPct);
            return (
              <div key={t.name} className={`grid grid-cols-[4px_1fr_48px_40px_40px_40px_52px_52px_52px_80px] gap-1 items-center px-4 py-3 ${i < standings.length - 1 ? 'border-b border-fifa-border/30' : ''} hover:bg-white/5 transition-colors ${qualColor(t.qualPct, t.elimPct)}`}>
                <div/>
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`text-xs font-black w-4 text-center ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-orange-400' : 'text-gray-600'}`}>{i + 1}</span>
                  <TeamFlag teamName={t.name} size={22} />
                  <span className="text-white text-sm font-semibold truncate">{t.name}</span>
                </div>
                <div className="text-center text-white font-black text-sm">{t.pts}</div>
                <div className="text-center text-gray-300 text-sm">{t.w}</div>
                <div className="text-center text-gray-400 text-sm">{t.d}</div>
                <div className="text-center text-gray-500 text-sm">{t.l}</div>
                <div className="text-center text-gray-400 text-sm">{t.gf}</div>
                <div className={`text-center text-sm font-bold ${t.gd > 0 ? 'text-emerald-400' : t.gd < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                  {t.gd > 0 ? '+' : ''}{t.gd}
                </div>
                <div className="text-center hidden sm:block">
                  <div className={`text-sm font-bold ${t.qualPct >= 70 ? 'text-emerald-400' : t.qualPct >= 40 ? 'text-blue-400' : 'text-gray-500'}`}>
                    {t.qualPct}%
                  </div>
                </div>
                <div className={`text-center text-xs font-bold px-1 py-0.5 rounded ${badge.cls}`}>
                  {badge.text}
                </div>
              </div>
            );
          })}

          <div className="p-3 border-t border-fifa-border/50">
            <p className="text-gray-600 text-xs text-center">
              Qual% = probability of finishing top 2 · Stats are averages across {SIMS} simulations
            </p>
          </div>
        </div>
      )}

      {standings && (
        <div className="bg-fifa-card border border-fifa-border rounded-2xl p-4">
          <h3 className="text-white font-bold text-sm mb-3">Group {activeGroup} — Qualification Odds</h3>
          <div className="space-y-2">
            {standings.map(t => (
              <div key={t.name} className="flex items-center gap-3">
                <TeamFlag teamName={t.name} size={18} />
                <span className="text-gray-300 text-xs w-28 truncate">{t.name}</span>
                <div className="flex-1 bg-gray-700 rounded-full h-3 relative overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full absolute left-0" style={{ width: `${t.qualPct}%` }} />
                  <div className="h-full bg-orange-500/60 rounded-full absolute" style={{ left: `${t.qualPct}%`, width: `${t.thirdPct}%` }} />
                </div>
                <span className={`text-xs font-bold w-8 text-right ${t.qualPct >= 70 ? 'text-emerald-400' : t.qualPct >= 40 ? 'text-blue-400' : 'text-gray-500'}`}>{t.qualPct}%</span>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-2">Green = top-2 probability · Orange = 3rd place · Calculate other groups via tabs above</p>
        </div>
      )}
    </div>
  );
}
