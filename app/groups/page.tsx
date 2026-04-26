import GroupTable from '@/components/GroupTable';
import TeamFlag from '@/components/TeamFlag';
import { GROUPS, TEAMS, MATCHDAY_1_FIXTURES } from '@/lib/constants';
import { predictMatch } from '@/lib/predictions';

// Build static group standings from Matchday 1 predictions
// Once the tournament starts, real standings come from the /api/standings endpoint
function buildPredictedStandings(groupLetter: string) {
  const teams = GROUPS[groupLetter];
  const groupFixtures = MATCHDAY_1_FIXTURES.filter(f => f.group === groupLetter);

  const table = teams.map(team => ({
    team,
    played: 0, won: 0, drawn: 0, lost: 0,
    goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0,
  }));

  groupFixtures.forEach(fixture => {
    const prediction = predictMatch(fixture.homeTeam, fixture.awayTeam);
    const homeGoals = prediction.predictedScore.home;
    const awayGoals = prediction.predictedScore.away;
    const homeRow = table.find(r => r.team === fixture.homeTeam);
    const awayRow = table.find(r => r.team === fixture.awayTeam);
    if (homeRow && awayRow) {
      homeRow.played++; awayRow.played++;
      homeRow.goalsFor += homeGoals; homeRow.goalsAgainst += awayGoals;
      awayRow.goalsFor += awayGoals; awayRow.goalsAgainst += homeGoals;
      if (homeGoals > awayGoals) { homeRow.won++; homeRow.points += 3; awayRow.lost++; }
      else if (homeGoals === awayGoals) { homeRow.drawn++; homeRow.points++; awayRow.drawn++; awayRow.points++; }
      else { awayRow.won++; awayRow.points += 3; homeRow.lost++; }
    }
  });

  table.forEach(r => { r.goalDiff = r.goalsFor - r.goalsAgainst; });
  return table.sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff || b.goalsFor - a.goalsFor);
}

export default function GroupsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-white text-3xl font-black">ð Group Tables</h1>
        <p className="text-gray-400">
          Predicted standings based on Matchday 1 AI predictions. Tables update live once the tournament begins.
        </p>
        <div className="bg-yellow-900/20 border border-yellow-800/40 rounded-lg px-4 py-2 text-yellow-300 text-sm">
          â ï¸ Showing <strong>predicted</strong> standings â real standings will replace these from 11 June 2026
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Object.keys(GROUPS).map(letter => {
          const standings = buildPredictedStandings(letter);
          const groupFixtures = MATCHDAY_1_FIXTURES.filter(f => f.group === letter);
          return (
            <div key={letter} id={`group-${letter}`} className="bg-fifa-card border border-fifa-border rounded-2xl overflow-hidden">
              {/* Group Header */}
              <div className="bg-gradient-to-r from-fifa-blue/60 to-transparent px-4 py-3 flex items-center justify-between">
                <h2 className="text-white font-black text-lg">Group {letter}</h2>
                <div className="flex gap-1">
                  {standings.slice(0, 2).map(s => (
                    <span key={s.team} className="text-green-400 text-xs font-bold bg-green-400/10 px-1.5 py-0.5 rounded">Q</span>
                  ))}
                </div>
              </div>

              {/* Standings Table */}
              <GroupTable standings={standings} />

              {/* Matchday 1 Fixtures */}
              <div className="px-4 py-3 border-t border-fifa-border space-y-2">
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Matchday 1</p>
                {groupFixtures.map(f => {
                  const pred = predictMatch(f.homeTeam, f.awayTeam);
                  return (
                    <div key={f.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 flex-1">
                        <TeamFlag teamName={f.homeTeam} size={16} />
                        <span className="text-gray-300 text-xs truncate">{f.homeTeam}</span>
                      </div>
                      <div className="text-blue-400 font-black text-sm px-2">
                        {pred.predictedScore.home}â{pred.predictedScore.away}
                      </div>
                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <span className="text-gray-300 text-xs truncate">{f.awayTeam}</span>
                        <TeamFlag teamName={f.awayTeam} size={16} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
