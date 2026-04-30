'use client';

import { useState, useEffect, useCallback } from 'react';
import FixtureCard from '@/components/FixtureCard';
import { MATCHDAY_1_FIXTURES, type Fixture } from '@/lib/constants';
import { predictMatch } from '@/lib/predictions';
import type { ApiFixture } from '@/lib/api-football';

// ---- Static data (computed once at module load) ----
function buildFixturesWithPredictions(fixtures: Fixture[]) {
  return fixtures.map(f => ({
    fixture: f,
    prediction: predictMatch(
      f.homeTeam,
      f.awayTeam,
      f.homeScore !== undefined && f.awayScore !== undefined
        ? { homeGoals: f.homeScore, awayGoals: f.awayScore }
        : undefined,
    ),
  }));
}

const md1 = buildFixturesWithPredictions(MATCHDAY_1_FIXTURES);

function groupByDate(fixtures: typeof md1) {
  const map = new Map<string, typeof md1>();
  fixtures.forEach(item => {
    const d = item.fixture.date;
    if (!map.has(d)) map.set(d, []);
    map.get(d)!.push(item);
  });
  return new Map([...map.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

const DAY_LABELS: Record<string, string> = {
  '2026-06-11': 'Thursday 11 June',
  '2026-06-12': 'Friday 12 June',
  '2026-06-13': 'Saturday 13 June',
  '2026-06-14': 'Sunday 14 June',
  '2026-06-15': 'Monday 15 June',
  '2026-06-16': 'Tuesday 16 June',
  '2026-06-17': 'Wednesday 17 June',
};

// ---- Types ----
type Mode = 'predictions' | 'results';

interface LiveState {
  configured: boolean;
  live: ApiFixture[];
  finished: ApiFixture[];
  error?: string;
}

// ---- Fuzzy match helper ----
function normalise(s: string) {
  return s.toLowerCase().replace(/[^a-z]/g, '');
}

function findApiMatch(fixture: Fixture, pool: ApiFixture[]): ApiFixture | undefined {
  const hN = normalise(fixture.homeTeam);
  const aN = normalise(fixture.awayTeam);
  return pool.find(f => {
    const apiH = normalise(f.teams.home.name);
    const apiA = normalise(f.teams.away.name);
    const homeMatch = apiH === hN || apiH.startsWith(hN.slice(0, 5)) || hN.startsWith(apiH.slice(0, 5));
    const awayMatch = apiA === aN || apiA.startsWith(aN.slice(0, 5)) || aN.startsWith(apiA.slice(0, 5));
    return homeMatch && awayMatch;
  });
}

// ---- Component ----
export default function FixturesPage() {
  const [mode, setMode]           = useState<Mode>('predictions');
  const [liveState, setLiveState] = useState<LiveState | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLive = useCallback(async () => {
    try {
      const res  = await fetch('/api/live');
      const data = (await res.json()) as LiveState;
      setLiveState(data);
      setLastUpdated(new Date());
    } catch {
      // non-critical â predictions still work without live data
    }
  }, []);

  useEffect(() => {
    fetchLive();
    const id = setInterval(fetchLive, 30_000);
    return () => clearInterval(id);
  }, [fetchLive]);

  const groupedFixtures = groupByDate(md1);
  const hasLive     = (liveState?.live.length ?? 0) > 0;
  const hasFinished = (liveState?.finished.length ?? 0) > 0;

  return (
    <div className="space-y-8">

      {/* ââ Header ââ */}
      <div className="space-y-2">
        <h1 className="text-white text-3xl font-black">ð Fixtures &amp; Predictions</h1>
        <p className="text-gray-400">
          Matchday 1 predictions across all 12 groups. All kick-off times in{' '}
          <strong className="text-white">UTC</strong> (+1 for BST).
        </p>
      </div>

      {/* ââ Mode toggle ââ */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="bg-fifa-card border border-fifa-border rounded-xl p-1 flex gap-1">
          <button
            onClick={() => setMode('predictions')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
              mode === 'predictions'
                ? 'bg-fifa-blue text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ð® Predictions
          </button>
          <button
            onClick={() => setMode('results')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
              mode === 'results'
                ? 'bg-green-700 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ð Results
            {hasFinished && (
              <span className="bg-green-500 text-white text-xs font-black rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                {liveState!.finished.length}
              </span>
            )}
          </button>
        </div>

        {/* Live badge */}
        {hasLive && (
          <div className="flex items-center gap-2 bg-red-900/30 border border-red-700/40 rounded-lg px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-sm font-black">
              {liveState!.live.length} LIVE
            </span>
          </div>
        )}

        {/* Last-updated timestamp */}
        {lastUpdated && liveState?.configured && (
          <span className="text-gray-600 text-xs ml-auto hidden sm:block">
            Scores updated {lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {/* ââ Matchday tabs ââ */}
      <div className="flex gap-2 flex-wrap">
        <button className="bg-fifa-blue text-white px-4 py-2 rounded-lg text-sm font-bold">Matchday 1</button>
        <button className="bg-fifa-card border border-fifa-border text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed" disabled>Matchday 2 ð</button>
        <button className="bg-fifa-card border border-fifa-border text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed" disabled>Matchday 3 ð</button>
        <button className="bg-fifa-card border border-fifa-border text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed" disabled>Round of 32 ð</button>
        <button className="bg-fifa-card border border-fifa-border text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed" disabled>Round of 16 ð</button>
      </div>

      {/* ââ Results mode â no results yet ââ */}
      {mode === 'results' && !hasFinished && (
        <div className="bg-gray-900/60 border border-gray-700/40 rounded-xl p-10 text-center">
          <div className="text-5xl mb-4">â³</div>
          <p className="text-white font-black text-xl mb-2">No results yet</p>
          <p className="text-gray-400 text-sm">
            Results will appear here automatically once Matchday 1 kicks off on{' '}
            <strong className="text-white">11 June 2026</strong>.
          </p>
          <p className="text-gray-600 text-xs mt-3">
            Scores are pulled live from API-Football every 30 seconds during matches.
          </p>
          <button
            onClick={() => setMode('predictions')}
            className="mt-6 bg-fifa-blue text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            View Predictions instead
          </button>
        </div>
      )}

      {/* ââ Predictions info banner ââ */}
      {mode === 'predictions' && (
        <div className="bg-blue-900/20 border border-blue-800/40 rounded-xl p-4 flex items-start gap-3">
          <span className="text-blue-400 text-xl flex-shrink-0">ð¡</span>
          <div>
            <p className="text-blue-200 text-sm font-semibold">How Predictions Update</p>
            <p className="text-gray-400 text-sm mt-1">
              Matchday 1 uses FIFA rankings &amp; historical attack/defence ratings. Once Matchday 1 results
              are in, Matchday 2 predictions unlock and incorporate actual match data for improved accuracy.
            </p>
          </div>
        </div>
      )}

      {/* ââ Fixture grid ââ */}
      {(mode === 'predictions' || hasFinished) &&
        [...groupedFixtures.entries()].map(([date, fixtures]) => (
          <section key={date} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-fifa-border" />
              <h2 className="text-white font-black text-lg whitespace-nowrap">
                {DAY_LABELS[date] ?? date}
              </h2>
              <div className="h-px flex-1 bg-fifa-border" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {fixtures.map(({ fixture, prediction }) => {
                const liveMatch     = liveState ? findApiMatch(fixture, liveState.live)     : undefined;
                const finishedMatch = liveState ? findApiMatch(fixture, liveState.finished) : undefined;

                return (
                  <div key={fixture.id} className="relative">

                    {/* ââ LIVE badge ââ */}
                    {liveMatch && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg shadow-red-900/60 whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        LIVE {liveMatch.fixture.status.elapsed}&apos;
                        <span className="mx-1">
                          {liveMatch.goals.home ?? 0}â{liveMatch.goals.away ?? 0}
                        </span>
                      </div>
                    )}

                    {/* ââ FT result badge ââ */}
                    {finishedMatch && mode === 'results' && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-green-700 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                        FT
                        <span className="mx-1">
                          {finishedMatch.goals.home ?? 0}â{finishedMatch.goals.away ?? 0}
                        </span>
                        {/* Correct prediction indicator */}
                        {(() => {
                          const ph = prediction.predictedScore.home;
                          const pa = prediction.predictedScore.away;
                          const ah = finishedMatch.goals.home ?? 0;
                          const aa = finishedMatch.goals.away ?? 0;
                          const predWin  = ph > pa ? 'home' : ph < pa ? 'away' : 'draw';
                          const actWin   = ah > aa ? 'home' : ah < aa ? 'away' : 'draw';
                          return predWin === actWin
                            ? <span className="ml-1 text-green-300" title="Correct result">â</span>
                            : <span className="ml-1 text-red-300"   title="Wrong result">â</span>;
                        })()}
                      </div>
                    )}

                    <FixtureCard
                      fixture={fixture}
                      prediction={prediction}
                      showPrediction={mode === 'predictions'}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        ))}

      {/* ââ Footer note ââ */}
      <div className="text-center py-8 text-gray-600 text-sm border-t border-fifa-border">
        <p>Matchday 2 &amp; 3 predictions unlock automatically once all Matchday 1 results are confirmed.</p>
        <p className="mt-1">Knockout round brackets will appear after the group stage.</p>
      </div>
    </div>
  );
}
