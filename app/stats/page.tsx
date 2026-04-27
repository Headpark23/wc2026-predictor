import { MATCHDAY_1_FIXTURES, TEAMS } from '@/lib/constants';
import { predictMatch, calculateAccuracy } from '@/lib/predictions';
import TeamFlag from '@/components/TeamFlag';

const allPredictions = MATCHDAY_1_FIXTURES.map(f => ({
  fixture: f,
  prediction: predictMatch(
    f.homeTeam, f.awayTeam,
    f.homeScore !== undefined && f.awayScore !== undefined
      ? { homeGoals: f.homeScore, awayGoals: f.awayScore }
      : undefined
  ),
}));

const completed = allPredictions.filter(p => p.fixture.status === 'FT');
const accuracy = calculateAccuracy(completed.map(p => p.prediction));

function cornersCorrect(pred: number, homeC?: number, awayC?: number) {
  if (homeC === undefined || awayC === undefined) return null;
  return Math.abs(pred - (homeC + awayC)) <= 2;
}
function cardsCorrect(pred: number, homeY?: number, awayY?: number) {
  if (homeY === undefined || awayY === undefined) return null;
  return Math.abs(pred - (homeY + awayY)) <= 1;
}

export default function StatsPage() {
  const totalGoals = completed.reduce((s,p)=>s+(p.fixture.homeScore??0)+(p.fixture.awayScore??0),0);
  const totalCorners = completed.reduce((s,p)=>s+(p.fixture.homeCorners??0)+(p.fixture.awayCorners??0),0);
  const totalYellows = completed.reduce((s,p)=>s+(p.fixture.homeYellowCards??0)+(p.fixture.awayYellowCards??0),0);
  const avgGoals = completed.length > 0 ? (totalGoals/completed.length).toFixed(2) : '—';
  const avgCorners = completed.length > 0 ? (totalCorners/completed.length).toFixed(1) : '—';
  const avgYellows = completed.length > 0 ? (totalYellows/completed.length).toFixed(1) : '—';

  // Corners & cards accuracy
  const cornersChecked = completed.filter(p=>p.fixture.homeCorners!==undefined);
  const cornersRight = cornersChecked.filter(p=>cornersCorrect(p.prediction.predictedCorners,p.fixture.homeCorners,p.fixture.awayCorners)===true);
  const cardsChecked = completed.filter(p=>p.fixture.homeYellowCards!==undefined);
  const cardsRight = cardsChecked.filter(p=>cardsCorrect(p.prediction.predictedYellowCards,p.fixture.homeYellowCards,p.fixture.awayYellowCards)===true);
  const cornersPct = cornersChecked.length>0?Math.round(cornersRight.length/cornersChecked.length*100):null;
  const cardsPct = cardsChecked.length>0?Math.round(cardsRight.length/cardsChecked.length*100):null;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-white text-3xl font-black">🎯 Stats & Prediction Accuracy</h1>
        <p className="text-gray-400">Live match statistics and running prediction accuracy tracker. Updates after every completed match.</p>
      </div>

      {completed.length === 0 && (
        <div className="bg-blue-900/20 border border-blue-800/40 rounded-xl p-6 text-center space-y-2">
          <div className="text-4xl">⏳</div>
          <h2 className="text-white font-bold text-lg">No matches played yet</h2>
          <p className="text-gray-400 text-sm">Stats will populate once Matchday 1 kicks off on <strong className="text-white">11 June 2026</strong>.</p>
        </div>
      )}

      {/* Accuracy Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-fifa-card border border-fifa-border rounded-xl p-5 text-center">
          <div className="text-gray-500 text-sm font-medium mb-2">Matches Predicted</div>
          <div className="text-white text-4xl font-black">{accuracy.totalPredicted||MATCHDAY_1_FIXTURES.length}</div>
          <div className="text-gray-600 text-xs mt-1">{completed.length} completed of {MATCHDAY_1_FIXTURES.length}</div>
        </div>
        <div className="bg-fifa-card border border-green-800/40 rounded-xl p-5 text-center">
          <div className="text-gray-500 text-sm font-medium mb-2">✅ Correct Results</div>
          <div className="text-green-400 text-4xl font-black">{completed.length>0?`${accuracy.resultPct}%`:'—'}</div>
          <div className="text-gray-600 text-xs mt-1">Win / draw / loss</div>
        </div>
        <div className="bg-fifa-card border border-blue-800/40 rounded-xl p-5 text-center">
          <div className="text-gray-500 text-sm font-medium mb-2">🎯 Exact Scores</div>
          <div className="text-blue-400 text-4xl font-black">{completed.length>0?`${accuracy.exactScorePct}%`:'—'}</div>
          <div className="text-gray-600 text-xs mt-1">Exact scoreline</div>
        </div>
        <div className="bg-fifa-card border border-purple-800/40 rounded-xl p-5 text-center">
          <div className="text-gray-500 text-sm font-medium mb-2">🚩 Corners ±2</div>
          <div className="text-purple-400 text-4xl font-black">{cornersPct!==null?`${cornersPct}%`:'—'}</div>
          <div className="text-gray-600 text-xs mt-1">{cornersRight.length}/{cornersChecked.length} within 2</div>
        </div>
      </div>

      {/* Cards accuracy row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-fifa-card border border-yellow-800/40 rounded-xl p-5 text-center">
          <div className="text-gray-500 text-sm font-medium mb-2">🟨 Cards ±1</div>
          <div className="text-yellow-400 text-4xl font-black">{cardsPct!==null?`${cardsPct}%`:'—'}</div>
          <div className="text-gray-600 text-xs mt-1">{cardsRight.length}/{cardsChecked.length} within 1 card</div>
        </div>
        <div className="bg-fifa-card border border-fifa-border rounded-xl p-5 text-center">
          <div className="text-gray-500 text-sm font-medium mb-2">⚽ Avg Goals/Match</div>
          <div className="text-white text-4xl font-black">{avgGoals}</div>
          <div className="text-gray-600 text-xs mt-1">{totalGoals} total goals</div>
        </div>
        <div className="bg-fifa-card border border-fifa-border rounded-xl p-5 text-center">
          <div className="text-gray-500 text-sm font-medium mb-2">📅 Matches Played</div>
          <div className="text-white text-4xl font-black">{completed.length}</div>
          <div className="text-gray-600 text-xs mt-1">of 104 total</div>
        </div>
      </div>

      {/* Match-by-Match Tracker */}
      <section className="space-y-4">
        <h2 className="text-white text-xl font-black">📋 Match-by-Match Prediction Tracker</h2>
        <div className="bg-fifa-card border border-fifa-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-fifa-border text-gray-500 text-xs uppercase">
                  <th className="text-left px-3 py-3">Match</th>
                  <th className="px-3 py-3">Pred.</th>
                  <th className="px-3 py-3">Actual</th>
                  <th className="px-3 py-3">Result</th>
                  <th className="px-3 py-3">Score</th>
                  <th className="px-3 py-3 hidden sm:table-cell">Corners</th>
                  <th className="px-3 py-3 hidden sm:table-cell">Cards</th>
                </tr>
              </thead>
              <tbody>
                {allPredictions.map(({fixture,prediction})=>{
                  const done=fixture.status==='FT';
                  const actCorners=fixture.homeCorners!==undefined?(fixture.homeCorners!+fixture.awayCorners!):undefined;
                  const actCards=fixture.homeYellowCards!==undefined?(fixture.homeYellowCards!+fixture.awayYellowCards!):undefined;
                  const cOk=cornersCorrect(prediction.predictedCorners,fixture.homeCorners,fixture.awayCorners);
                  const yOk=cardsCorrect(prediction.predictedYellowCards,fixture.homeYellowCards,fixture.awayYellowCards);
                  return (
                    <tr key={fixture.id} className="border-b border-fifa-border/50 hover:bg-white/5">
                      <td className="px-3 py-3 max-w-[160px]">
                        <div className="flex flex-wrap items-center gap-1 text-xs">
                          <TeamFlag teamName={fixture.homeTeam} size={12} />
                          <span className="text-gray-300 truncate max-w-[55px] sm:max-w-none">{fixture.homeTeam}</span>
                          <span className="text-gray-600 text-[10px]">vs</span>
                          <TeamFlag teamName={fixture.awayTeam} size={12} />
                          <span className="text-gray-300 truncate max-w-[55px] sm:max-w-none">{fixture.awayTeam}</span>
                        </div>
                        <div className="text-gray-600 text-xs mt-0.5">Grp {fixture.group} · {fixture.date}</div>
                      </td>
                      <td className="px-3 py-3 text-center"><span className="text-white font-bold">{prediction.predictedScore.home}–{prediction.predictedScore.away}</span></td>
                      <td className="px-3 py-3 text-center">{done?<span className="text-white font-bold">{fixture.homeScore}–{fixture.awayScore}</span>:<span className="text-gray-600">TBP</span>}</td>
                      <td className="px-3 py-3 text-center">{done?(prediction.resultCorrect?<span className="text-green-400 font-bold">✓</span>:<span className="text-red-400 font-bold">✗</span>):<span className="text-gray-600">—</span>}</td>
                      <td className="px-3 py-3 text-center">{done?(prediction.scoreCorrect?<span className="text-green-400 font-bold">✓</span>:<span className="text-red-400 font-bold">✗</span>):<span className="text-gray-600">—</span>}</td>
                      <td className="px-3 py-3 text-center hidden sm:table-cell">
                        <span className="text-gray-400">{prediction.predictedCorners}</span>
                        {actCorners!==undefined&&<span className="text-gray-600 ml-1">({actCorners})</span>}
                        {cOk!==null&&(cOk?<span className="text-green-400 ml-1">✓</span>:<span className="text-red-400 ml-1">✗</span>)}
                      </td>
                      <td className="px-3 py-3 text-center hidden sm:table-cell">
                        <span className="text-yellow-500">{prediction.predictedYellowCards}</span>
                        {actCards!==undefined&&<span className="text-gray-600 ml-1">({actCards})</span>}
                        {yOk!==null&&(yOk?<span className="text-green-400 ml-1">✓</span>:<span className="text-red-400 ml-1">✗</span>)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-gray-600 text-xs">Corners ✓ = within ±2 of actual. Cards ✓ = within ±1 of actual. Pred. shown first, actual in brackets.</p>
      </section>

      {/* Team Ratings */}
      <section className="space-y-4">
        <h2 className="text-white text-xl font-black">⚡ Team Prediction Ratings</h2>
        <p className="text-gray-400 text-sm">Attack = expected goals per game vs average opponent. Defense = goals conceded factor (lower = better).</p>
        <div className="bg-fifa-card border border-fifa-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-fifa-border text-gray-500 text-xs uppercase">
                  <th className="text-left px-4 py-3">Team</th>
                  <th className="px-3 py-3">Rank</th>
                  <th className="px-3 py-3">⚔️ Attack</th>
                  <th className="px-3 py-3">🛡️ Defense</th>
                  <th className="px-3 py-3 hidden md:table-cell">Corners</th>
                  <th className="px-3 py-3 hidden md:table-cell">Cards</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(TEAMS).sort((a,b)=>a[1].fifaRank-b[1].fifaRank).map(([name,team])=>(
                  <tr key={name} className="border-b border-fifa-border/50 hover:bg-white/5">
                    <td className="px-4 py-2.5"><TeamFlag teamName={name} size={16} showName namePosition="right" /></td>
                    <td className="px-3 py-2.5 text-center text-gray-400 font-medium">#{team.fifaRank}</td>
                    <td className="px-3 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-2 rounded-full bg-gradient-to-r from-yellow-500 to-red-500" style={{width:`${(team.attackRating/2.5)*60}px`}}/>
                        <span className="text-white font-mono text-xs">{team.attackRating.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500" style={{width:`${((2.5-team.defenseRating)/2.0)*60}px`}}/>
                        <span className="text-white font-mono text-xs">{team.defenseRating.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-center text-gray-400 hidden md:table-cell">{team.avgCornersFor}</td>
                    <td className="px-3 py-2.5 text-center text-yellow-500 hidden md:table-cell">{team.avgCardsPerGame}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
