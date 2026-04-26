import { MATCHDAY_1_FIXTURES, TEAMS } from '@/lib/constants';
import { predictMatch, calculateAccuracy } from '@/lib/predictions';
import TeamFlag from '@/components/TeamFlag';

// Pre-compute all matchday 1 predictions for stats display
const allPredictions = MATCHDAY_1_FIXTURES.map(f => ({
  fixture: f,
  prediction: predictMatch(f.homeTeam, f.awayTeam),
}));

// Aggregate stats across all predicted matches
const totalCorners = allPredictions.reduce((sum, { prediction }) => sum + prediction.predictedCorners, 0);
const totalCards = allPredictions.reduce((sum, { prediction }) => sum + prediction.predictedYellowCards, 0);
const avgGoals = allPredictions.reduce((sum, { prediction }) => sum + prediction.expectedHomeGoals + prediction.expectedAwayGoals, 0) / allPredictions.length;
const avgCorners = totalCorners / allPredictions.length;
const avgCards = totalCards / allPredictions.length;

// Top scorers â teams expected to score most
const teamExpectedGoals = Object.values(TEAMS).map(team => {
  const homeFixtures = MATCHDAY_1_FIXTURES.filter(f => f.homeTeam === team.name);
  const awayFixtures = MATCHDAY_1_FIXTURES.filter(f => f.awayTeam === team.name);
  let totalExpected = 0;
  homeFixtures.forEach(f => { totalExpected += predictMatch(f.homeTeam, f.awayTeam).expectedHomeGoals; });
  awayFixtures.forEach(f => { totalExpected += predictMatch(f.homeTeam, f.awayTeam).expectedAwayGoals; });
  return { team, expectedGoals: Math.round(totalExpected * 100) / 100 };
}).sort((a, b) => b.expectedGoals - a.expectedGoals).slice(0, 10);

// Most exciting matches (highest combined expected goals)
const excitingMatches = [...allPredictions]
  .sort((a, b) => (b.prediction.expectedHomeGoals + b.prediction.expectedAwayGoals) - (a.prediction.expectedHomeGoals + a.prediction.expectedAwayGoals))
  .slice(0, 5);

// Biggest mismatches (highest confidence predictions)
const biggestMismatches = [...allPredictions]
  .filter(({ prediction }) => prediction.confidence === 'high')
  .sort((a, b) => {
    const aGap = Math.abs(TEAMS[a.fixture.homeTeam]?.fifaRank - TEAMS[a.fixture.awayTeam]?.fifaRank) || 0;
    const bGap = Math.abs(TEAMS[b.fixture.homeTeam]?.fifaRank - TEAMS[b.fixture.awayTeam]?.fifaRank) || 0;
    return bGap - aGap;
  }).slice(0, 5);

// Closest contests (lowest confidence / most even)
const closestContests = [...allPredictions]
  .filter(({ prediction }) => prediction.confidence === 'low')
  .sort((a, b) => {
    const aBalance = Math.abs(a.prediction.homeWinProbability - a.prediction.awayWinProbability);
    const bBalance = Math.abs(b.prediction.homeWinProbability - b.prediction.awayWinProbability);
    return aBalance - bBalance;
  }).slice(0, 5);

export default function StatsPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-white text-3xl font-black">ð Prediction Statistics</h1>
        <p className="text-gray-400">AI-generated insights across all 24 Matchday 1 fixtures.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg Goals/Game', value: avgGoals.toFixed(1), icon: 'â½', color: 'text-green-400' },
          { label: 'Avg Corners/Game', value: avgCorners.toFixed(1), icon: 'ð', color: 'text-blue-400' },
          { label: 'Avg Cards/Game', value: avgCards.toFixed(1), icon: 'ð¨', color: 'text-yellow-400' },
          { label: 'Fixtures Predicted', value: String(allPredictions.length), icon: 'ð¤', color: 'text-purple-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-fifa-card border border-fifa-border rounded-xl p-4 text-center">
            <div className="text-3xl mb-1">{stat.icon}</div>
            <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Top Expected Scorers */}
        <section className="space-y-3">
          <h2 className="text-white text-xl font-black">ð¯ Top Teams by Expected Goals</h2>
          <p className="text-gray-500 text-sm">Expected goals across Matchday 1 based on the Poisson model.</p>
          <div className="space-y-2">
            {teamExpectedGoals.map(({ team, expectedGoals }, i) => (
              <div key={team.name} className="bg-fifa-card border border-fifa-border rounded-xl p-3 flex items-center gap-3">
                <span className="text-gray-600 text-sm font-bold w-5 text-right">{i + 1}</span>
                <TeamFlag teamName={team.name} size={24} />
                <span className="text-white text-sm flex-1">{team.name}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 rounded-full bg-blue-500/30 w-20">
                    <div
                      className="h-1.5 rounded-full bg-blue-400"
                      style={{ width: `${Math.min(100, (expectedGoals / 2.5) * 100)}%` }}
                    />
                  </div>
                  <span className="text-blue-400 text-sm font-bold w-8 text-right">{expectedGoals}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Most Exciting Matches */}
        <section className="space-y-3">
          <h2 className="text-white text-xl font-black">ð¥ Most Goals Expected</h2>
          <p className="text-gray-500 text-sm">Matches predicted to have the highest combined goal tally.</p>
          <div className="space-y-2">
            {excitingMatches.map(({ fixture, prediction }) => (
              <div key={fixture.id} className="bg-fifa-card border border-fifa-border rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <TeamFlag teamName={fixture.homeTeam} size={18} />
                    <span className="text-gray-300 text-sm truncate">{fixture.homeTeam}</span>
                  </div>
                  <div className="text-center px-3">
                    <div className="text-blue-400 font-black text-sm">{prediction.predictedScore.home}â{prediction.predictedScore.away}</div>
                    <div className="text-green-400 text-xs">{(prediction.expectedHomeGoals + prediction.expectedAwayGoals).toFixed(1)} xG</div>
                  </div>
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <span className="text-gray-300 text-sm truncate">{fixture.awayTeam}</span>
                    <TeamFlag teamName={fixture.awayTeam} size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Biggest Mismatches */}
        <section className="space-y-3">
          <h2 className="text-white text-xl font-black">ðª Biggest Mismatches</h2>
          <p className="text-gray-500 text-sm">Highest confidence predictions â largest FIFA ranking gaps.</p>
          <div className="space-y-2">
            {biggestMismatches.map(({ fixture, prediction }) => {
              const homeWin = Math.round(prediction.homeWinProbability * 100);
              const awayWin = Math.round(prediction.awayWinProbability * 100);
              const favourite = homeWin > awayWin ? fixture.homeTeam : fixture.awayTeam;
              const winPct = Math.max(homeWin, awayWin);
              return (
                <div key={fixture.id} className="bg-fifa-card border border-fifa-border rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <TeamFlag teamName={fixture.homeTeam} size={18} />
                      <span className="text-gray-300 text-sm truncate">{fixture.homeTeam}</span>
                    </div>
                    <div className="text-blue-400 font-black text-sm px-3">
                      {prediction.predictedScore.home}â{prediction.predictedScore.away}
                    </div>
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span className="text-gray-300 text-sm truncate">{fixture.awayTeam}</span>
                      <TeamFlag teamName={fixture.awayTeam} size={18} />
                    </div>
                  </div>
                  <div className="mt-1 text-center">
                    <span className="text-green-400 text-xs">{favourite} {winPct}% to win</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Closest Contests */}
        <section className="space-y-3">
          <h2 className="text-white text-xl font-black">âï¸ Tightest Contests</h2>
          <p className="text-gray-500 text-sm">Matches where the AI model rates both teams almost equal.</p>
          <div className="space-y-2">
            {closestContests.map(({ fixture, prediction }) => {
              const homeWin = Math.round(prediction.homeWinProbability * 100);
              const draw = Math.round(prediction.drawProbability * 100);
              const awayWin = Math.round(prediction.awayWinProbability * 100);
              return (
                <div key={fixture.id} className="bg-fifa-card border border-fifa-border rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <TeamFlag teamName={fixture.homeTeam} size={18} />
                      <span className="text-gray-300 text-sm truncate">{fixture.homeTeam}</span>
                    </div>
                    <div className="text-blue-400 font-black text-sm px-3">
                      {prediction.predictedScore.home}â{prediction.predictedScore.away}
                    </div>
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span className="text-gray-300 text-sm truncate">{fixture.awayTeam}</span>
                      <TeamFlag teamName={fixture.awayTeam} size={18} />
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full overflow-hidden flex">
                    <div className="bg-blue-500" style={{ width: `${homeWin}%` }} />
                    <div className="bg-gray-600" style={{ width: `${draw}%` }} />
                    <div className="bg-red-500" style={{ width: `${awayWin}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{homeWin}%</span><span>Draw {draw}%</span><span>{awayWin}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Methodology */}
      <section className="bg-fifa-card border border-fifa-border rounded-2xl p-6 space-y-4">
        <h2 className="text-white text-xl font-black">ð§ª Model Methodology</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-400 leading-relaxed">
          <div>
            <h3 className="text-white font-bold mb-2">Poisson Distribution Model</h3>
            <p>Expected goals for each team are calculated using: Î» = (attack / opponentâs defence) Ã historical WC average (1.30 goals/team).</p>
            <p className="mt-2">This gives us a probability matrix of all possible scores from 0â6 goals each. The most likely score is selected as the prediction.</p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-2">Team Ratings</h3>
            <p>Attack and defence ratings (0.5â2.5 scale) are derived from FIFA world rankings. The current world #1 (Argentina) has a 2.3 attack rating; the lowest-ranked teams have 0.5â0.8.</p>
            <p className="mt-2">Corner and card predictions use WC historical averages adjusted by team style factors from the ratings database.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
