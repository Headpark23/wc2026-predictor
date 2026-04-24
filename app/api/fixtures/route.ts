import { NextResponse } from 'next/server';
import { fetchFixtures, isApiConfigured } from '@/lib/api-football';
import { MATCHDAY_1_FIXTURES } from '@/lib/constants';
import { predictMatch } from '@/lib/predictions';

export const revalidate = 120;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const round = searchParams.get('round') || undefined;

  if (!isApiConfigured()) {
    const fixtures = MATCHDAY_1_FIXTURES.map(f => ({
      ...f,
      prediction: predictMatch(f.homeTeam, f.awayTeam),
      source: 'local',
    }));
    return NextResponse.json({ source: 'local', fixtures });
  }

  try {
    const apiFixtures = await fetchFixtures(round);
    const enriched = apiFixtures.map(f => ({
      ...f,
      prediction: predictMatch(
        f.teams.home.name,
        f.teams.away.name,
        f.goals.home !== null && f.goals.away !== null
          ? { homeGoals: f.goals.home, awayGoals: f.goals.away }
          : undefined
      ),
    }));
    return NextResponse.json({ source: 'api-football', fixtures: enriched });
  } catch (error) {
    console.error('Fixtures API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
