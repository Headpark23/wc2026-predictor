import CountdownTimer from '@/components/CountdownTimer';
import TeamFlag from '@/components/TeamFlag';
import { TOURNAMENT, GROUPS, MATCHDAY_1_FIXTURES } from '@/lib/constants';
import { predictMatch } from '@/lib/predictions';
import Link from 'next/link';

const FEATURED_FIXTURES = [
  MATCHDAY_1_FIXTURES.find(f => f.id === 'L1a')!,
  MATCHDAY_1_FIXTURES.find(f => f.id === 'C1a')!,
  MATCHDAY_1_FIXTURES.find(f => f.id === 'A1a')!,
  MATCHDAY_1_FIXTURES.find(f => f.id === 'J1a')!,
].filter(Boolean);

export default function HomePage() {
  const featuredPredictions = FEATURED_FIXTURES.map(f => ({
    fixture: f,
    prediction: predictMatch(f.homeTeam, f.awayTeam),
  }));

  return (
    <div className="space-y-12">
      <section className="relative rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-fifa-blue via-[#001a5c] to-fifa-dark" />
        <div className="relative px-8 py-14 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-blue-200 font-medium">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            AI Predictions Now Live Â· Matchday 1
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
            Predicted score, corners, cards â and how likely each result is.
          </p>
          <div className="flex flex-col items-center gap-3">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">Tournament Begins In</p>
            <CountdownTimer targetDate={TOURNAMENT.startDate} />
            <p className="text-gray-500 text-xs">Opening Match: Mexico vs South Africa Â· 11 June 2026 Â· Estadio Azteca</p>
          </div>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link href="/fixtures" className="bg-fifa-red hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-red-900/30">
              ð View All Fixtures
            </Link>
            <Link href="/groups" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-xl transition-colors">
              ð Group Tables
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { country: 'USA', flag: 'us', cities: '11 cities', matches: '60 matches' },
          { country: 'Canada', flag: 'ca', cities: '2 cities', matches: '10 matches' },
          { country: 'Mexico', flag: 'mx', cities: '3 cities', matches: '13 matches' },
        ].map(h => (
          <div key={h.country} className="bg-fifa-card border border-fifa-border rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-center sm:text-left hover:border-blue-800 transition-colors">
            <img src={`https://flagcdn.com/w40/${h.flag}.png`} alt={h.country} className="w-10 h-7 object-cover rounded shadow flex-shrink-0" />
            <div>
              <div className="text-white font-bold text-sm sm:text-base truncate">{h.country}</div>
              <div className="text-gray-500 text-xs">{h.cities} Â· {h.matches}</div>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-2xl font-black">ð¥ Featured Matchday 1 Fixtures</h2>
          <Link href="/fixtures" className="text-blue-400 hover:text-blue-300 text-sm font-medium">See all â</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredPredictions.map(({ fixture, prediction }) => (
            <FeaturedFixtureCard key={fixture.id} fixture={fixture} prediction={prediction} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-white text-2xl font-black">ð All 12 Groups</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(GROUPS).map(([letter, teams]) => (
            <Link key={letter} href={`/groups#group-${letter}`} className="bg-fifa-card border border-fifa-border hover:border-blue-700 rounded-xl p-3 transition-all hover:bg-white/5">
              <div className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">Group {letter}</div>
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

      <section className="space-y-4">
        <h2 className="text-white text-2xl font-black">ð¤ How the AI Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: 'ð', title: 'Statistical Model', desc: 'Poisson distribution uses FIFA rankings, attack and defence ratings to calculate expected goals.' },
            { icon: 'ð', title: 'Live Updates', desc: 'As matches complete, results feed back into the model throughout the tournament.' },
            { icon: 'ð¯', title: 'Full Predictions', desc: 'Every match gets a predicted score, win/draw/loss probabilities, corners, cards, and AI reasoning.' },
          ].map(card => (
            <div key={card.title} className="bg-fifa-card border border-fifa-border rounded-xl p-5 space-y-2">
              <span className="text-3xl">{card.icon}</span>
              <h3 className="text-white font-bold">{card.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Teams', value: '48', icon: 'ð³ï¸' },
            { label: 'Groups', value: '12', icon: 'ð' },
            { label: 'Matches', value: '104', icon: 'â½' },
            { label: 'Host Cities', value: '16', icon: 'ðï¸' },
          ].map(stat => (
            <div key={stat.label} className="bg-fifa-card border border-fifa-border rounded-xl p-4 text-center">
              <div className="text-3xl mb-1">{stat.icon}</div>
              <div className="text-white text-3xl font-black">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function FeaturedFixtureCard({ fixture, prediction }: { fixture: typeof MATCHDAY_1_FIXTURES[0]; prediction: ReturnType<typeof predictMatch>; }) {
  const { homeTeam, awayTeam, date, time, venue, city, group, ukChannel } = fixture;
  const homeWinPct = Math.round(prediction.homeWinProbability * 100);
  const drawPct = Math.round(prediction.drawProbability * 100);
  const awayWinPct = Math.round(prediction.awayWinProbability * 100);
  const channelColor = ukChannel === 'BBC' ? 'bg-blue-900/50 text-blue-300' : 'bg-red-900/50 text-red-300';
  return (
    <div className="bg-fifa-card border border-fifa-border hover:border-blue-700 rounded-2xl overflow-hidden transition-all">
      <div className="bg-gradient-to-r from-fifa-accent/40 to-transparent px-4 py-2 flex justify-between items-center">
        <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Group {group}</span>
        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${channelColor}`}>{ukChannel}</span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 flex justify-center"><TeamFlag teamName={homeTeam} size={28} showName namePosition="below" /></div>
          <div className="text-center">
            <div className="text-blue-400 text-2xl font-black">{prediction.predictedScore.home} â {prediction.predictedScore.away}</div>
            <div className="text-gray-500 text-xs">{time} UTC Â· {date}</div>
          </div>
          <div className="flex-1 flex justify-center"><TeamFlag teamName={awayTeam} size={28} showName namePosition="below" /></div>
        </div>
        <div className="mt-3 h-2 rounded-full overflow-hidden flex">
          <div className="bg-blue-500" style={{ width: `${homeWinPct}%` }} />
          <div className="bg-gray-600" style={{ width: `${drawPct}%` }} />
          <div className="bg-red-500" style={{ width: `${awayWinPct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{homeWinPct}%</span><span>Draw {drawPct}%</span><span>{awayWinPct}%</span>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">ð {venue}, {city}</div>
      </div>
    </div>
  );
}
