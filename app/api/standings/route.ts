import { NextResponse } from 'next/server';
import { fetchStandings, isApiConfigured } from '@/lib/api-football';
import { GROUPS } from '@/lib/constants';

export const revalidate = 120;

export async function GET() {
  if (!isApiConfigured()) {
    const empty = Object.entries(GROUPS).map(([letter, teams]) => ({
      group: `Group ${letter}`,
      letter,
      standings: teams.map(team => ({
        team, played: 0, won: 0, drawn: 0, lost: 0,
        goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0,
      })),
    }));
    return NextResponse.json({
      source: 'local',
      standings: empty,
      message: 'Tournament not started or API key not configured',
    });
  }

  try {
    const apiStandings = await fetchStandings();
    return NextResponse.json({ source: 'api-football', standings: apiStandings });
  } catch (error) {
    console.error('Standings API error:', error);
    return NextResponse.json({
      source: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
