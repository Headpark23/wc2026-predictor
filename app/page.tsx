import CountdownTimer from '@/components/CountdownTimer';
import TeamFlag from '@/components/TeamFlag';
import { TOURNAMENT, GROUPS, MATCHDAY_1_FIXTURES } from '@/lib/constants';
import { predictMatch } from '@/lib/predictions';
import Link from 'next/link';

// Featured matchday 1 fixtures to highlight on homepage
const FEATURED_FIXTURES = [
  MATCHDAY_1_FIXTURES.find(f => f.id === 'L1a')!, // England vs Croatia
  MATCHDAY_1_FIXTURES.find(f => f.id === 'C1a')!, // Brazil vs Morocco
  MATCHDAY_1_FIXTURES.find(f => f.id === 'A1a')!, // Mexico vs South Africa
  MATCHDAY_1_FIXTURES.find(f => f.id === 'J1a')!, // Argentina vs Algeria
].filter(Boolean);

export default function HomePage() {
  const featuredPredictions = FEATURED_FIXTURES.map(f => ({
    fixture: f,
    prediction: predictMatch(f.homeTeam, f.awayTeam),
  }));

  return (
    <div className="space-y-12">
      {/* ===================== HERO ===================== */}
      <section className="relative rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-fifa-blue via-[#001a5c] to-fifa-dark" />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(255,255,255,0.05) 30px, rgba(255,255,255,0.05) 31px)',
          }}
        />
        <div className="relative px-8 py-14 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-blue-200 font-medium">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            AI Predictions Now Live · Matchday 1
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
            FIFA World Cup
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400">
              2026 Predictor
            </span>
          </h1>

          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            AI-powered predictions for all <strong className="text-white">104 matches</strong> across{' '}
            <strong className="text-white">12 groups</strong> and <strong className="text-white">48 teams</strong>.
            Predicted score, corners, cards — and how likely each result is.
          </p>

          {/* Countdown */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">
              Tournament Begins In
            </p>
            <CountdownTimer targetDate={TOURNAMENT.startDate} />
            <p className="text-gray-500 text-xs">
              Opening Match: Mexico vs South Africa · 11 June 2026 · 21:00 BST · Estadio Azteca
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              href="/fixtures"
              className="bg-fifa-red hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-red-900/30"
            >
              📅 View All Fixtures
            </Link>
            <Link
              href="/groups"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              📊 Group Tables
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== HOST NATIONS ===================== */}
      <section className="grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { country: 'USA', flag: 'us', cities: '11 cities', matches: '60 matches' },
          { country: 'Canada', flag: 'ca', cities: '2 cities', matches: '10 matches' },
          { country: 'Mexico', flag: 'mx', cities: '3 cities', matches: '13 matches' },
        ].map(h => (
          <div
            key={h.country}
            className="bg-fifa-card border border-fifa-border rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-center sm:text-left hover:border-blue-800 transition-colors"
          >
            <img
              src={`https://flagcdn.com/w40/${h.flag}.png`}
              alt={h.country}
              className="w-10 h-7 object-cover rounded shadow flex-shrink-0"
            />
            <div className="min-w-0">
              <div className="text-white font-bold text-sm sm:text-base truncate">{h.country}</div>
              <div className="text-gray-500 text-xs hidden sm:block">{h.cities} · {h.matches}</div>
            </div>
          </div>
        ))}
      </section>

      {/* ===================== TODAY'S MATCHES ===================== */}
      <TodayMatchesSection />

      {/* ===================== FEATURED FIXTURES ===================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-2xl font-black">
            🔥 Featured Matchday 1 Fixtures
          </h2>
          <Link href="/fixtures" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
            See all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredPredictions.map(({ fixture, prediction }) => (
            <FeaturedFixtureCard key={fixture.id} fixture={fixture} prediction={prediction} />
          ))}
        </div>
      </section>

      {/* ===================== CLOSEST BATTLES ===================== */}
      <BiggestUpsetsSection />

      {/* ===================== GROUP OVERVIEW ===================== */}
      <section className="space-y-4">
        <h2 className="text-white text-2xl font-black">📋 All 12 Groups</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(GROUPS).map(([letter, teams]) => (
            <Link
              key={letter}
              href={`/groups#group-${letter}`}
              className="bg-fifa-card border border-fifa-border hover:border-blue-700 rounded-xl p-3 transition-all hover:bg-white/5"
            >
              <div className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                Group {letter}
              </div>
              <div className="space-y-1.5">
                {teams.map(team => (
                  <div key={team} className="flex items-center gap-2">
                    <TeamFlag teamName={team} size={14} />
                    <span className="text-gray-300 text-xs truncate">{team}</span>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="space-y-4">
        <h2 className="text-white text-2xl font-black">🤖 How the AI Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: '📊',
              title: 'Statistical Model',
              desc: 'Poisson distribution model uses FIFA rankings, attack and defence ratings to calculate expected goals for each team.',
            },
            {
              icon: '🔄',
              title: 'Live Updates',
              desc: 'As matches complete, results feed back into the model. Round 2 predictions use Round 1 data, and so on throughout the tournament.',
            },
            {
              icon: '🎯',
              title: 'Full Predictions',
              desc: 'Every match gets a predicted score, win/draw/loss probabilities, expected corners, yellow cards, and AI reasoning.',
            },
          ].map(card => (
            <div key={card.title} className="bg-fifa-card border border-fifa-border rounded-xl p-5 space-y-2">
              <span className="text-3xl">{card.icon}</span>
              <h3 className="text-white font-bold">{card.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== TOURNAMENT STATS ===================== */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Teams', value: '48', icon: '🏳️' },
            { label: 'Groups', value: '12', icon: '📋' },
            { label: 'Matches', value: '104', icon: '⚽' },
            { label: 'Host Cities', value: '16', icon: '🏟️' },
          ].map(stat => (
            <div key={stat.label} className="bg-fifa-card border border-fifa-border rounded-xl p-4 text-center">
              <div className="text-3xl mb-1">{stat.icon}</div>
              <div className="text-white text-3xl font-black">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== COPYRIGHT ===================== */}
      <footer className="text-center text-gray-600 text-xs pt-4 border-t border-fifa-border/30">
        © 2026 Martin White · AI predictions powered by Poisson distribution model
      </footer>
    </div>
  );
}

// =====================================================
// Featured Fixture Card (compact version for homepage)
// =====================================================
function FeaturedFixtureCard({
  fixture,
  prediction,
}: {
  fixture: typeof MATCHDAY_1_FIXTURES[0];
  prediction: ReturnType<typeof predictMatch>;
}) {
  const { homeTeam, awayTeam, date, time, venue, city, group, ukChannel } = fixture;
  const homeWinPct = Math.round(prediction.homeWinProbability * 100);
  const drawPct = Math.round(prediction.drawProbability * 100);
  const awayWinPct = Math.round(prediction.awayWinProbability * 100);

  const channelColor = ukChannel === 'BBC'
    ? 'bg-blue-900/50 text-blue-300'
    : 'bg-red-900/50 text-red-300';

  return (
    <div className="bg-fifa-card border border-fifa-border hover:border-blue-700 rounded-2xl overflow-hidden transition-all">
      {/* Header */}
      <div className="bg-gradient-to-r from-fifa-accent/40 to-transparent px-4 py-2 flex justify-between items-center">
        <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Group {group}</span>
        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${channelColor}`}>{ukChannel}</span>
      </div>

      {/* Teams */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 flex justify-center">
            <TeamFlag teamName={homeTeam} size={28} showName namePosition="below" />
          </div>
          <div className="text-center flex-shrink-0 min-w-[64px]">
            <div className="text-blue-400 text-xl font-black">
              {prediction.predictedScore.home} – {prediction.predictedScore.away}
            </div>
            <div className="text-gray-500 text-xs">{time} UTC</div>
            <div className="text-gray-600 text-xs">{date.split('T')[0]}</div>
          </div>
          <div className="flex-1 flex justify-center">
            <TeamFlag teamName={awayTeam} size={28} showName namePosition="below" />
          </div>
        </div>

        {/* Probability bar */}
        <div className="mt-3 h-2 rounded-full overflow-hidden flex">
          <div className="bg-blue-500" style={{ width: `${homeWinPct}%` }} />
          <div className="bg-gray-600" style={{ width: `${drawPct}%` }} />
          <div className="bg-red-500" style={{ width: `${awayWinPct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{homeWinPct}%</span>
          <span>Draw {drawPct}%</span>
          <span>{awayWinPct}%</span>
        </div>

        <div className="mt-2 text-xs text-gray-500 text-center">📍 {venue}, {city}</div>
      </div>
    </div>
  );
}

// =====================================================
// Today's Matches Section
// =====================================================
function TodayMatchesSection() {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayFixtures = MATCHDAY_1_FIXTURES.filter(f => f.date === todayStr);

  if (todayFixtures.length === 0) {
    const future = [...MATCHDAY_1_FIXTURES]
      .filter(f => f.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date));
    const nextDate = future[0]?.date;
    const nextCount = nextDate ? MATCHDAY_1_FIXTURES.filter(f => f.date === nextDate).length : 0;
    return (
      <section className="space-y-4">
        <h2 className="text-white text-2xl font-black">📅 Today&apos;s Matches</h2>
        <div className="bg-fifa-card border border-fifa-border rounded-xl p-6 text-center space-y-2">
          <div className="text-4xl">😴</div>
          <p className="text-white font-semibold">No matches today</p>
          {nextDate && (
            <p className="text-gray-400 text-sm">
              Next up: <strong className="text-white">{nextDate}</strong> — {nextCount} fixture{nextCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-white text-2xl font-black">📅 Today&apos;s Matches</h2>
        <span className="bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
          LIVE TODAY
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {todayFixtures.map(f => {
          const p = predictMatch(f.homeTeam, f.awayTeam);
          const homeWin = Math.round(p.homeWinProbability * 100);
          const draw = Math.round(p.drawProbability * 100);
          const awayWin = Math.round(p.awayWinProbability * 100);
          return (
            <div key={f.id} className="bg-fifa-card border border-green-800/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Group {f.group}</span>
                <span className="text-green-400 font-semibold">{f.time} UTC · {f.ukChannel}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 flex justify-center">
                  <TeamFlag teamName={f.homeTeam} size={24} showName namePosition="below" />
                </div>
                <div className="text-center min-w-[60px] flex-shrink-0">
                  <div className="text-blue-400 text-xl font-black">{p.predictedScore.home}–{p.predictedScore.away}</div>
                  <div className="text-gray-600 text-xs">predicted</div>
                </div>
                <div className="flex-1 flex justify-center">
                  <TeamFlag teamName={f.awayTeam} size={24} showName namePosition="below" />
                </div>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden flex">
                <div className="bg-blue-500" style={{ width: `${homeWin}%` }} />
                <div className="bg-gray-600" style={{ width: `${draw}%` }} />
                <div className="bg-red-500" style={{ width: `${awayWin}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{homeWin}%</span><span>Draw {draw}%</span><span>{awayWin}%</span>
              </div>
              <div className="text-xs text-gray-600 text-center">📍 {f.venue}, {f.city}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// =====================================================
// Closest Battles / Upset Picks Section
// =====================================================
function BiggestUpsetsSection() {
  const battles = MATCHDAY_1_FIXTURES
    .map(f => ({ f, p: predictMatch(f.homeTeam, f.awayTeam) }))
    .filter(({ p }) => {
      const min = Math.min(p.homeWinProbability, p.awayWinProbability);
      const max = Math.max(p.homeWinProbability, p.awayWinProbability);
      return min >= 0.18 && max <= 0.58;
    })
    .sort((a, b) => {
      const aGap = Math.abs(a.p.homeWinProbability - a.p.awayWinProbability);
      const bGap = Math.abs(b.p.homeWinProbability - b.p.awayWinProbability);
      return aGap - bGap;
    })
    .slice(0, 6);

  if (battles.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-white text-2xl font-black">⚡ Closest Predicted Battles</h2>
      <p className="text-gray-400 text-sm">
        Matches where neither team is a clear favourite — expect the unexpected.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {battles.map(({ f, p }) => {
          const homeWin = Math.round(p.homeWinProbability * 100);
          const draw = Math.round(p.drawProbability * 100);
          const awayWin = Math.round(p.awayWinProbability * 100);
          const gap = Math.abs(homeWin - awayWin);
          return (
            <div key={f.id} className="bg-fifa-card border border-yellow-800/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Group {f.group} · {f.date.slice(5)}</span>
                <span className="bg-yellow-500/20 text-yellow-400 font-bold px-2 py-0.5 rounded-full text-xs">
                  {gap <= 5 ? '🔥 Coin flip' : '⚡ Too close'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-1">
                <div className="flex-1 flex justify-center">
                  <TeamFlag teamName={f.homeTeam} size={20} showName namePosition="below" />
                </div>
                <div className="text-center min-w-[50px] flex-shrink-0">
                  <div className="text-white font-black text-lg">{p.predictedScore.home}–{p.predictedScore.away}</div>
                </div>
                <div className="flex-1 flex justify-center">
                  <TeamFlag teamName={f.awayTeam} size={20} showName namePosition="below" />
                </div>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden flex">
                <div className="bg-blue-500" style={{ width: `${homeWin}%` }} />
                <div className="bg-gray-600" style={{ width: `${draw}%` }} />
                <div className="bg-red-500" style={{ width: `${awayWin}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{homeWin}%</span><span>Draw {draw}%</span><span>{awayWin}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
