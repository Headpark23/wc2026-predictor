import { TEAMS, GROUPS, MATCHDAY_1_FIXTURES } from '@/lib/constants';
import { predictMatch } from '@/lib/predictions';
import TeamFlag from '@/components/TeamFlag';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: { team: string };
}

export async function generateStaticParams() {
  return Object.keys(TEAMS).map(name => ({
    team: encodeURIComponent(name),
  }));
}

export default function TeamPage({ params }: Props) {
  const teamName = decodeURIComponent(params.team);
  const team = TEAMS[teamName];

  if (!team) notFound();

  const group = Object.entries(GROUPS).find(([, teams]) =>
    teams.includes(teamName)
  );
  const groupLetter = group ? group[0] : '?';
  const groupTeams = group ? group[1] : [];

  const fixtures = MATCHDAY_1_FIXTURES.filter(
    f => f.homeTeam === teamName || f.awayTeam === teamName
  );

  const fixtureWithPredictions = fixtures.map(f => ({
    fixture: f,
    prediction: predictMatch(f.homeTeam, f.awayTeam),
    isHome: f.homeTeam === teamName,
  }));

  const attackPct = Math.round((team.attackRating / 2.5) * 100);
  const defensePct = Math.round(((2.5 - team.defenseRating) / 2.0) * 100);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Link href="/groups" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
        ← Back to Groups
      </Link>

      <div className="bg-gradient-to-r from-fifa-blue/60 via-fifa-card to-fifa-card border border-fifa-border rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <TeamFlag teamName={teamName} size={80} />
          <div className="text-center sm:text-left space-y-2">
            <h1 className="text-white text-4xl font-black">{teamName}</h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span className="bg-blue-900/50 border border-blue-700/50 text-blue-300 text-sm font-bold px-3 py-1 rounded-full">Group {groupLetter}</span>
              <span className="bg-gray-800 border border-fifa-border text-gray-300 text-sm px-3 py-1 rounded-full">FIFA Rank #{team.fifaRank}</span>
              <span className="bg-gray-800 border border-fifa-border text-gray-300 text-sm px-3 py-1 rounded-full">{fixtures.length} MD1 Fixture{fixtures.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-white text-xl font-black">⚡ AI Prediction Ratings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-fifa-card border border-fifa-border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm font-medium">☔️ Attack Rating</span>
              <span className="text-white font-black text-lg">{team.attackRating.toFixed(2)}</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-red-500 rounded-full" style={{width:`${Math.min(attackPct,100)}%`}} />
            </div>
            <p className="text-gray-500 text-xs">Expected goals scored vs. average team per match</p>
          </div>
          <div className="bg-fifa-card border border-fifa-border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm font-medium">🛡️ Defense Rating</span>
              <span className="text-white font-black text-lg">{team.defenseRating.toFixed(2)}</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full" style={{width:`${Math.min(Math.max(defensePct,0),100)}%`}} />
            </div>
            <p className="text-gray-500 text-xs">Lower concession rate = longer bar (better defence)</p>
          </div>
          <div className="bg-fifa-card border border-fifa-border rounded-xl p-4 flex items-center justify-between">
            <div><div className="text-gray-400 text-sm">🚩 Avg Corners / Game</div><div className="text-white text-2xl font-black mt-1">{team.avgCornersFor}</div></div>
            <div className="text-5xl opacity-20">🚩</div>
          </div>
          <div className="bg-fifa-card border border-fifa-border rounded-xl p-4 flex items-center justify-between">
            <div><div className="text-gray-400 text-sm">🟨 Avg Cards / Game</div><div className="text-white text-2xl font-black mt-1">{team.avgCardsPerGame}</div></div>
            <div className="text-5xl opacity-20">🟨</div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-white text-xl font-black">📅 Matchday 1 Fixtures</h2>
        <div className="space-y-4">
          {fixtureWithPredictions.map(({ fixture: f, prediction: p, isHome }) => {
            const myWinProb = isHome ? p.homeWinProbability : p.awayWinProbability;
            const myScore = isHome ? p.predictedScore.home : p.predictedScore.away;
            const oppScore = isHome ? p.predictedScore.away : p.predictedScore.home;
            const isCompleted = f.status === 'FT';
            return (
              <div key={f.id} className="bg-fifa-card border border-fifa-border rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Group {f.group} · {f.date} · {f.time} UTC {f.ukChannel}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 flex justify-center"><TeamFlag teamName={f.homeTeam} size={36} showName namePosition="below" /></div>
                  <div className="text-center flex-shrink-0 min-w-[80px]">
                    {!isCompleted && <><div className="text-blue-400 text-2xl font-black">{p.predictedScore.home}–{p.predictedScore.away}</div><div className="text-gray-600 text-xs">predicted</div></>}
                    {isCompleted && <><div className="text-white text-2xl font-black">{f.homeScore}–{f.awayScore}</div><div className="text-green-400 text-xs font-bold">FINAL</div></>}
                  </div>
                  <div className="flex-1 flex justify-center"><TeamFlag teamName={f.awayTeam} size={36} showName namePosition="below" /></div>
                </div>
                <div>
                  <div className="h-2 rounded-full overflow-hidden flex">
                    <div className="bg-blue-500" style={{width:`${Math.round(p.homeWinProbability*100)}%`}} />
                    <div className="bg-gray-600" style={{width:`${Math.round(p.drawProbability*100)}%`}} />
                    <div className="bg-red-500" style={{width:`${Math.round(p.awayWinProbability*100)}%`}} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1"><span>{Math.round(p.homeWinProbability*100)}%</span><span>Draw {Math.round(p.drawProbability*100)}%</span><span>{Math.round(p.awayWinProbability*100)}%</span></div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3 text-sm">
                  <span className="text-gray-400">AI gives </span><strong className="text-white">{teamName}</strong><span className="text-gray-400"> a </span><strong className="text-green-400">{Math.round(myWinProb*100)}% win chance</strong><span className="text-gray-400"> · predicted </span><strong className="text-blue-400">{myScore}–{oppScore}</strong><span className="text-gray-400"> · {Math.round(p.predictedCorners)} corners · {p.predictedYellowCards} cards</span>
                </div>
                <div className="text-xs text-gray-600 text-center">📍 {f.venue}, {f.city}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-white text-xl font-black">📊 Group {groupLetter} Teams</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {groupTeams.map(t => {
            const td = TEAMS[t];
            const isCurrent = t === teamName;
            return (
              <Link key={t} href={`/teams/${encodeURIComponent(t)}`}
                className={`bg-fifa-card border rounded-xl p-3 text-center space-y-2 transition-all hover:bg-white/5 ${isCurrent ? 'border-blue-500 bg-blue-900/20' : 'border-fifa-border hover:border-blue-700'}`}>
                <TeamFlag teamName={t} size={28} className="mx-auto" />
                <div className={`text-xs font-semibold truncate ${isCurrent ? 'text-blue-300' : 'text-gray-300'}`}>{t}</div>
                <div className="text-gray-500 text-xs">#{td?.fifaRank ?? '?'}</div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
