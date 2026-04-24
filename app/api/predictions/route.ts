import { NextResponse } from 'next/server';
import { predictMatch } from '@/lib/predictions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { homeTeam, awayTeam, actualHomeGoals, actualAwayGoals } = body;
    if (!homeTeam || !awayTeam) {
      return NextResponse.json({ error: 'homeTeam and awayTeam are required' }, { status: 400 });
    }
    const prediction = predictMatch(
      homeTeam, awayTeam,
      actualHomeGoals !== undefined
        ? { homeGoals: actualHomeGoals, awayGoals: actualAwayGoals }
        : undefined
    );
    return NextResponse.json({ prediction });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Prediction failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeTeam = searchParams.get('home');
  const awayTeam = searchParams.get('away');
  if (!homeTeam || !awayTeam) {
    return NextResponse.json(
      { error: 'Pass ?home=TeamName&away=TeamName in the URL' },
      { status: 400 }
    );
  }
  const prediction = predictMatch(homeTeam, awayTeam);
  return NextResponse.json({ homeTeam, awayTeam, prediction });
}
