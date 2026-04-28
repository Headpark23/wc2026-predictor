'use client';

import { useState, useMemo } from 'react';
import { GROUPS, TEAMS } from '@/lib/constants';
import { predictMatch } from '@/lib/predictions';
import TeamFlag from '@/components/TeamFlag';

const SIMS = 1000;
const GK = Object.keys(GROUPS);

function simKO(a: string, b: string): string {
  const p = predictMatch(a, b);
  const t = p.homeWinProbability + p.awayWinProbability;
  return Math.random() < p.homeWinProbability / t ? a : b;
}

function simGroup(gk: string): { top2: [string, string]; third: { name: string; pts: number; gd: number; gf: number } } {
  const ts = GROUPS[gk];
  const s: Record<string, { pts: number; gd: number; gf: number }> = {};
  ts.forEach(t => { s[t] = { pts: 0, gd: 0, gf: 0 }; });
  for (let i = 0; i < ts.length; i++) {
    for (let j = i + 1; j < ts.length; j++) {
      const h = ts[i], a = ts[j];
      const p = predictMatch(h, a);
      const r = Math.random();
      const hg = Math.max(1, Math.round((TEAMS[h]?.attackRating ?? 1.2) * 0.9 + Math.random()));
      const ag = Math.max(0, Math.round((TEAMS[a]?.attackRating ?? 1.2) * 0.8 + Math.random()));
      if (r < p.homeWinProbability) {
        s[h].pts += 3; s[h].gf += hg + 1; s[h].gd += 1;
        s[a].gf += ag; s[a].gd -= 1;
      } else if (r < p.homeWinProbability + p.drawProbability) {
        s[h].pts += 1; s[a].pts += 1;
        s[h].gf += hg; s[a].gf += hg;
      } else {
        s[a].pts += 3; s[a].gf += ag + 1; s[a].gd += 1;
        s[h].gf += hg; s[h].gd -= 1;
      }
    }
  }
  const sorted = ts.slice().sort((x, y) =>
    s[y].pts !== s[x].pts ? s[y].pts - s[x].pts :
    s[y].gd !== s[x].gd ? s[y].gd - s[x].gd :
    s[y].gf - s[x].gf
  );
  return { top2: [sorted[0], sorted[1]], third: { name: sorted[2], ...s[sorted[2]] } };
}

function runSim(): Record<string, { r32: boolean; qf: boolean; sf: boolean; fin: boolean; win: boolean }> {
  const top2: Record<string, [string, string]> = {};
  const thirds: Array<{ name: string; pts: number; gd: number; gf: number }> = [];
  GK.forEach(g => {
    const { top2: t2, third } = simGroup(g);
    top2[g] = t2;
    thirds.push(third);
  });
  const best8 = thirds.sort((a, b) => b.pts !== a.pts ? b.pts - a.pts : b.gd - a.gd).slice(0, 8);
  const r32: string[] = [...GK.flatMap(g => top2[g]), ...best8.map(t => t.name)];
  const track: Record<string, { r32: boolean; qf: boolean; sf: boolean; fin: boolean; win: boolean }> = {};
  r32.forEach(t => { track[t] = { r32: true, qf: false, sf: false, fin: false, win: false }; });

  const wins = GK.map(g => top2[g][0]);
  const runners = GK.map(g => top2[g][1]);
  const thirdNames = best8.map(t => t.name);
  const pairs: [string, string][] = [];
  for (let i = 0; i < 8; i++) pairs.push([wins[i], thirdNames[i] ?? runners[i]]);
  for (let i = 0; i < 4; i++) pairs.push([runners[i], runners[i + 4] ?? wins[(i + 8) % 12]]);
  const inBracket = new Set(pairs.flat());
  const rem = r32.filter(t => !inBracket.has(t));
  for (let i = 0; i < rem.length - 1; i += 2) pairs.push([rem[i], rem[i + 1]]);

  const r16 = pairs.slice(0, 16).map(([a, b]) => { const w = simKO(a, b); track[w] && (track[w].qf = true); return w; });
  const qf: string[] = [];
  for (let i = 0; i < r16.length; i += 2) { const w = simKO(r16[i], r16[i + 1] ?? r16[i]); track[w] && (track[w].sf = true); qf.push(w); }
  const sf: string[] = [];
  for (let i = 0; i < qf.length; i += 2) { const w = simKO(qf[i], qf[i + 1] ?? qf[i]); track[w] && (track[w].fin = true); sf.push(w); }
  const champ = simKO(sf[0], sf[1] ?? sf[0]);
  track[champ] && (track[champ].win = true);
  return track;
}

const pct = (v: number) => Math.round((v / SIMS) * 100);

const barCol = (p: number) => p >= 15 ? 'bg-emerald-500' : p >= 8 ? 'bg-blue-500' : p >= 4 ? 'bg-yellow-500' : p >= 2 ? 'bg-orange-500' : 'bg-red-600';

interface Row { name: string; grp: string; win: number; fin: number; sf: number; qf: number; r32: number }

export default function WinnerPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [sort, setSort] = useState<keyof Row>('win');

  function run() {
    setRunning(true); setDone(false);
    setTimeout(() => {
      const acc: Record<string, { win: number; fin: number; sf: number; qf: number; r32: number; grp: string }> = {};
      for (let i = 0; i < SIMS; i++) {
        const res = runSim();
        Object.entries(res).forEach(([t, st]) => {
          if (!acc[t]) {
            const g = GK.find(k => GROUPS[k].includes(t)) ?? '?';
            acc[t] = { win: 0, fin: 0, sf: 0, qf: 0, r32: 0, grp: g };
          }
          if (st.win) acc[t].win++;
          if (st.fin) acc[t].fin++;
          if (st.sf) acc[t].sf++;
          if (st.qf) acc[t].qf++;
          if (st.r32) acc[t].r32++;
        });
      }
      setRows(Object.entries(acc).map(([name, s]) => ({ name, grp: s.grp, win: s.win, fin: s.fin, sf: s.sf, qf: s.qf, r32: s.r32 })));
      setRunning(false); setDone(true);
    }, 50);
  }

  const sorted = useMemo(() => [...rows].sort((a, b) => {
    const diff = (b[sort] as number) - (a[sort] as number);
    return diff !== 0 ? diff : b.win - a.win;
  }), [rows, sort]);

  const top = sorted[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-white text-3xl font-black">🏆 Tournament Winner Probability</h1>
        <p className="text-gray-400 text-sm">{SIMS.toLocaleString()} Monte Carlo simulations — group stage through Final.</p>
      </div>

      <div className="bg-fifa-card border border-fifa-border rounded-2xl p-6 text-center space-y-4">
        {!done && !running && (
          <>
            <p className="text-gray-400 text-sm">Simulate the full WC2026 {SIMS.toLocaleString()} times to estimate each team's trophy odds.</p>
            <button onClick={run} className="bg-fifa-blue hover:bg-blue-600 text-white font-black px-8 py-3 rounded-xl text-lg transition-colors shadow-lg">
              ⚡ Run Simulations
            </button>
          </>
        )}
        {running && (
          <div className="space-y-2">
            <div className="text-white font-bold">🔄 Simulating {SIMS.toLocaleString()} tournaments…</div>
            <div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-fifa-blue h-2 rounded-full animate-pulse w-2/3" /></div>
          </div>
        )}
        {done && (
          <div className="flex items-center justify-between">
            <span className="text-emerald-400 font-bold text-sm">✅ {SIMS.toLocaleString()} simulations complete</span>
            <button onClick={run} className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors">🔄 Re-run</button>
          </div>
        )}
      </div>

      {done && top && (
        <>
          <div className="bg-gradient-to-r from-yellow-900/30 via-fifa-card to-fifa-card border border-yellow-700/40 rounded-2xl p-6 flex items-center gap-6">
            <TeamFlag teamName={top.name} size={56} showName namePosition="below" />
            <div>
              <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Most Likely Champion</div>
              <div className="text-white text-5xl font-black">{pct(top.win)}%</div>
              <div className="text-gray-400 text-sm">Final {pct(top.fin)}% · SF {pct(top.sf)}% · QF {pct(top.qf)}%</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['win','fin','sf','qf','r32'] as const).map(k => (
              <button key={k} onClick={() => setSort(k)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${sort === k ? 'bg-fifa-blue text-white' : 'bg-fifa-card border border-fifa-border text-gray-400 hover:text-white'}`}>
                {k === 'win' ? '🏆 Winner' : k === 'fin' ? '🥈 Final' : k === 'sf' ? '🥉 Semi' : k === 'qf' ? '⚽ Quarter' : '📋 Round of 32'}
              </button>
            ))}
          </div>

          <div className="bg-fifa-card border border-fifa-border rounded-2xl p-4 space-y-1">
            <div className="grid grid-cols-[28px_1fr_64px_56px_56px_56px_56px] gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider pb-2 border-b border-fifa-border px-2">
              <div>#</div><div>Team</div><div className="text-center">🏆</div><div className="text-center">Final</div><div className="text-center">SF</div><div className="text-center">QF</div><div className="text-center">R32</div>
            </div>
            {sorted.map((row, i) => {
              const w = pct(row.win);
              return (
                <div key={row.name} className={`grid grid-cols-[28px_1fr_64px_56px_56px_56px_56px] gap-2 items-center py-2 px-2 rounded-lg ${i < 3 ? 'bg-gray-800/60' : 'hover:bg-gray-800/20'} transition-colors`}>
                  <div className={`text-sm font-bold text-center ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-orange-400' : 'text-gray-600'}`}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <TeamFlag teamName={row.name} size={20} />
                    <div className="min-w-0">
                      <div className="text-white text-sm font-bold truncate">{row.name}</div>
                      <div className="text-gray-600 text-xs">Grp {row.grp}</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-black ${w >= 10 ? 'text-emerald-400' : w >= 5 ? 'text-yellow-400' : 'text-gray-400'}`}>{w}%</div>
                    <div className="w-full bg-gray-700 rounded-full h-1 mt-0.5"><div className={`h-1 rounded-full ${barCol(w)}`} style={{ width: `${Math.min(100, w * 3)}%` }} /></div>
                  </div>
                  <div className="text-center text-sm font-bold text-gray-300">{pct(row.fin)}%</div>
                  <div className="text-center text-sm text-gray-400">{pct(row.sf)}%</div>
                  <div className="text-center text-sm text-gray-500">{pct(row.qf)}%</div>
                  <div className="text-center text-sm text-gray-600">{pct(row.r32)}%</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
