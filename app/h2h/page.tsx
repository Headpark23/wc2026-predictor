'use client';

import { useState, useMemo } from 'react';
import { TEAMS, GROUPS, MATCHDAY_1_FIXTURES } from '@/lib/constants';
import { predictMatch } from '@/lib/predictions';
import TeamFlag from '@/components/TeamFlag';

const ALL_TEAMS = Object.keys(TEAMS).sort();

export default function H2HPage() {
  const [homeTeam, setHomeTeam] = useState('Brazil');
  const [awayTeam, setAwayTeam] = useState('Argentina');

  const prediction = useMemo(() => {
    if (homeTeam === awayTeam) return null;
    return predictMatch(homeTeam, awayTeam);
  }, [homeTeam, awayTeam]);

  const homeWin = prediction ? Math.round(prediction.homeWinProbability * 100) : 0;
  const draw = prediction ? Math.round(prediction.drawProbability * 100) : 0;
  const awayWin = prediction ? Math.round(prediction.awayWinProbability * 100) : 0;

  const homeData = TEAMS[homeTeam];
  const awayData = TEAMS[awayTeam];

  const swapTeams = () => {
    setHomeTeam(awayTeam);
    setAwayTeam(homeTeam);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-white text-3xl font-black">⚔️ Head-to-Head Predictor</h1>
        <p className="text-gray-400 text-sm">
          Pick any two teams and get an instant AI prediction for that matchup.
        </p>
      </div>

      {/* Team Selector */}
      <div className="bg-fifa-card border border-fifa-border rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          {/* Home team */}
          <div className="flex-1 space-y-3">
            <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block text-center">Home Team</label>
            <div className="flex flex-col items-center gap-2">
              <TeamFlag teamName={homeTeam} size={48} />
              <select
                value={homeTeam}
                onChange={e => setHomeTeam(e.target.value)}
                className="w-full bg-gray-900 border border-fifa-border text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                {ALL_TEAMS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap button */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <button
              onClick={swapTeams}
              className="bg-gray-800 hover:bg-gray-700 border border-fifa-border text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors text-lg"
              title="Swap teams"
            >
              ⇄
            </button>
            <span className="text-gray-600 text-xs">vs</span>
          </div>

          {/* Away team */}
          <div className="flex-1 space-y-3">
            <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block text-center">Away Team</label>
            <div className="flex flex-col items-center gap-2">
              <TeamFlag teamName={awayTeam} size={48} />
              <select
                value={awayTeam}
                onChange={e => setAwayTeam(e.target.value)}
                className="w-full bg-gray-900 border border-fifa-border text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                {ALL_TEAMS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {homeTeam === awayTeam && (
          <p className="text-yellow-400 text-sm text-center">⚠️ Please select two different teams.</p>
        )}
      </div>

      {/* Prediction Result */}
      {prediction && homeTeam !== awayTeam && (
        <>
          {/* Score */}
          <div className="bg-gradient-to-r from-fifa-blue/40 via-fifa-card to-fifa-card border border-blue-800/40 rounded-2xl p-6 text-center space-y-4">
            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider">AI Predicted Score</div>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <TeamFlag teamName={homeTeam} size={40} showName namePosition="below" />
              </div>
              <div className="text-center">
                <div className="text-blue-400 text-5xl font-black tabular-nums">
                  {prediction.predictedScore.home} – {prediction.predictedScore.away}
                </div>
              </div>
              <div className="text-center">
                <TeamFlag teamName={awayTeam} size={40} showName namePosition="below" />
              </div>
            </div>

            {/* Probability bar */}
            <div className="space-y-2">
              <div className="h-4 rounded-full overflow-hidden flex">
                <div className="bg-blue-500 flex items-center justify-center text-xs text-white font-bold" style={{ width: `${homeWin}%` }}>
                  {homeWin >= 15 ? `${homeWin}%` : ''}
                </div>
                <div className="bg-gray-600 flex items-center justify-center text-xs text-white font-bold" style={{ width: `${draw}%` }}>
                  {draw >= 12 ? `${draw}%` : ''}
                </div>
                <div className="bg-red-500 flex items-center justify-center text-xs text-white font-bold" style={{ width: `${awayWin}%` }}>
                  {awayWin >= 15 ? `${awayWin}%` : ''}
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span className="text-blue-400 font-semibold">{homeTeam} win {homeWin}%</span>
                <span className="text-gray-400">Draw {draw}%</span>
                <span className="text-red-400 font-semibold">{awayTeam} win {awayWin}%</span>
              </div>
            </div>
          </div>

          {/* Stats comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Corner & card prediction */}
            <div className="bg-fifa-card border border-fifa-border rounded-xl p-5 space-y-3">
              <h3 className="text-white font-bold text-sm">📊 Match Predictions</h3>
              {[
                { label: '🚩 Total Corners', value: `~${prediction.predictedCorners}` },
                { label: '🟨 Yellow Cards', value: `~${prediction.predictedYellowCards}` },
                { label: '⚽ Expected Goals', value: `${(prediction.predictedScore.home + prediction.predictedScore.away)}` },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{row.label}</span>
                  <span className="text-white font-bold">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Team ratings comparison */}
            <div className="bg-fifa-card border border-fifa-border rounded-xl p-5 space-y-4">
              <h3 className="text-white font-bold text-sm">⚡ Team Ratings</h3>
              {[
                { label: '⚔️ Attack', home: homeData?.attackRating ?? 0, away: awayData?.attackRating ?? 0, max: 2.5 },
                { label: '🛡️ Defence', home: 2.5 - (homeData?.defenseRating ?? 1), away: 2.5 - (awayData?.defenseRating ?? 1), max: 2.0 },
              ].map(stat => {
                const homeW = Math.round((stat.home / stat.max) * 100);
                const awayW = Math.round((stat.away / stat.max) * 100);
                return (
                  <div key={stat.label} className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span className="text-blue-400 font-semibold">{Math.round(stat.home * 100) / 100}</span>
                      <span>{stat.label}</span>
                      <span className="text-red-400 font-semibold">{Math.round(stat.away * 100) / 100}</span>
                    </div>
                    <div className="flex gap-1 h-2">
                      <div className="flex-1 bg-gray-800 rounded-full overflow-hidden flex justify-end">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(homeW, 100)}%` }} />
                      </div>
                      <div className="flex-1 bg-gray-800 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: `${Math.min(awayW, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-between text-xs text-gray-600 pt-1">
                <span>FIFA #{homeData?.fifaRank}</span>
                <span>FIFA Rank</span>
                <span>FIFA #{awayData?.fifaRank}</span>
              </div>
            </div>
          </div>

          {/* Verdict */}
          <div className="bg-fifa-card border border-fifa-border rounded-xl p-5">
            <h3 className="text-white font-bold mb-3">🤖 AI Verdict</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {homeWin > awayWin + 10
                ? `${homeTeam} are clear favourites at ${homeWin}% — their superior attack rating (${homeData?.attackRating.toFixed(2)}) and home advantage give them a significant edge over ${awayTeam}.`
                : awayWin > homeWin + 10
                ? `${awayTeam} are slight favourites at ${awayWin}% despite playing away — their FIFA ranking (#${awayData?.fifaRank}) and attack strength (${awayData?.attackRating.toFixed(2)}) outclass ${homeTeam}.`
                : `This is an extremely close contest — just ${Math.abs(homeWin - awayWin)}% separates the two sides. Either team can win on the day, with a draw also very much on the cards at ${draw}%.`
              }
            </p>
          </div>
        </>
      )}
    </div>
  );
}
