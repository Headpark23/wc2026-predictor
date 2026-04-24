import FixtureCard from '@/components/FixtureCard';
import { MATCHDAY_1_FIXTURES, GROUPS, type Fixture } from '@/lib/constants';
import { predictMatch } from '@/lib/predictions';

function getFixturesWithPredictions(fixtures: Fixture[]) {
  return fixtures.map(f => ({
    fixture: f,
    prediction: predictMatch(f.homeTeam, f.awayTeam,
      f.homeScore !== undefined && f.awayScore !== undefined
        ? { homeGoals: f.homeScore, awayGoals: f.awayScore } : undefined),
  }));
}

const matchday1WithPredictions = getFixturesWithPredictions(MATCHDAY_1_FIXTURES);

function groupByDate(fixtures: typeof matchday1WithPredictions) {
  const grouped = new Map<string, typeof fixtures>();
  fixtures.forEach(item => {
    const date = item.fixture.date;
    if (!grouped.has(date)) grouped.set(date, []);
    grouped.get(date)!.push(item);
  });
  return new Map([...grouped.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

const days: Record<string, string> = {
  '2026-06-11': 'Thursday 11 June', '2026-06-12': 'Friday 12 June',
  '2026-06-13': 'Saturday 13 June', '2026-06-14': 'Sunday 14 June',
  '2026-06-15': 'Monday 15 June', '2026-06-16': 'Tuesday 16 June',
  '2026-06-17': 'Wednesday 17 June',
};

export default function FixturesPage() {
  const groupedFixtures = groupByDate(matchday1WithPredictions);
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-white text-3xl font-black">📅 Fixtures & Predictions</h1>
        <p className="text-gray-400">Matchday 1 predictions across all 12 groups. All kick-off times in <strong className="text-white">UTC</strong> (+1 for BST).</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button className="bg-fifa-blue text-white px-4 py-2 rounded-lg text-sm font-bold">Matchday 1</button>
        <button className="bg-fifa-card border border-fifa-border text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed" disabled>Matchday 2 🔒</button>
        <button className="bg-fifa-card border border-fifa-border text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed" disabled>Matchday 3 🔒</button>
        <button className="bg-fifa-card border border-fifa-border text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed" disabled>Round of 32 🔒</button>
        <button className="bg-fifa-card border border-fifa-border text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed" disabled>Round of 16 🔒</button>
      </div>

      <div className="bg-blue-900/20 border border-blue-800/40 rounded-xl p-4 flex items-start gap-3">
        <span className="text-blue-400 text-xl">💡</span>
        <div>
          <p className="text-blue-200 text-sm font-semibold">How Predictions Update</p>
          <p className="text-gray-400 text-sm mt-1">Matchday 1 uses FIFA rankings. Once Matchday 1 results are in, Matchday 2 predictions unlock and incorporate actual match data for improved accuracy.</p>
        </div>
      </div>

      {[...groupedFixtures.entries()].map(([date, fixtures]) => (
        <section key={date} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-fifa-border" />
            <h2 className="text-white font-black text-lg whitespace-nowrap">{days[date] || date}</h2>
            <div className="h-px flex-1 bg-fifa-border" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {fixtures.map(({ fixture, prediction }) => (
              <FixtureCard key={fixture.id} fixture={fixture} prediction={prediction} showPrediction />
            ))}
          </div>
        </section>
      ))}

      <div className="text-center py-8 text-gray-600 text-sm border-t border-fifa-border">
        <p>Matchday 2 & 3 predictions unlock automatically once all Matchday 1 results are confirmed.</p>
        <p className="mt-1">Knockout round brackets will appear after the group stage.</p>
      </div>
    </div>
  );
}
