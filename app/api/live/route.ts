import { NextResponse } from 'next/server';
import { fetchFixtures, isApiConfigured } from '@/lib/api-football';

export const revalidate = 30;

const LIVE_STATUSES = new Set(['1H', '2H', 'HT', 'ET', 'BT', 'P', 'SUSP', 'INT', 'LIVE']);
const FINISHED_STATUSES = new Set(['FT', 'AET', 'PEN']);

export async function GET() {
  if (!isApiConfigured()) {
    return NextResponse.json({ configured: false, live: [], finished: [] });
  }
  try {
    const all = await fetchFixtures();
    const live     = all.filter(f => LIVE_STATUSES.has(f.fixture.status.short));
    const finished = all.filter(f => FINISHED_STATUSES.has(f.fixture.status.short));
    return NextResponse.json({ configured: true, live, finished });
  } catch (error) {
    return NextResponse.json(
      { configured: true, live: [], finished: [], error: String(error) },
      { status: 500 }
    );
  }
}
