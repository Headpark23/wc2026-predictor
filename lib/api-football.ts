// =====================================================
// API-FOOTBALL CLIENT (api-football.com v3)
// Fetches live World Cup 2026 data: fixtures, standings,
// match stats (corners, cards, scorers)
// =====================================================

const BASE_URL = 'https://v3.football.api-sports.io';
const WC_LEAGUE_ID = parseInt(process.env.API_FOOTBALL_WC_LEAGUE_ID || '1');
const WC_SEASON = parseInt(process.env.API_FOOTBALL_WC_SEASON || '2026');

function getHeaders(): HeadersInit {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key || key === 'your_api_football_key_here') {
    throw new Error('API_FOOTBALL_KEY is not set. Please add it to .env.local');
  }
  return {
    'x-apisports-key': key,
    'Content-Type': 'application/json',
  };
}

async function apiFetch<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }
  const res = await fetch(url.toString(), {
    headers: getHeaders(),
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`API-Football error: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  if (json.errors && Object.keys(json.errors).length > 0) {
    throw new Error(`API-Football error: ${JSON.stringify(json.errors)}`);
  }
  return json.response as T;
}

export interface ApiFixture {
  fixture: {
    id: number;
    date: string;
    status: { short: string; elapsed: number | null };
    venue: { name: string; city: string };
  };
  league: { name: string; round: string };
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean | null };
    away: { id: number; name: string; logo: string; winner: boolean | null };
  };
  goals: { home: number | null; away: number | null };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
  };
}

export interface ApiStanding {
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  goalsDiff: number;
  group: string;
  all: {
    played: number; win: number; draw: number; lose: number;
    goals: { for: number; against: number };
  };
}

export interface ApiMatchStatistic { type: string; value: string | number | null; }
export interface ApiMatchStats { team: { id: number; name: string }; statistics: ApiMatchStatistic[]; }
export interface ApiEvent {
  time: { elapsed: number };
  team: { id: number; name: string };
  player: { id: number; name: string };
  type: 'Goal' | 'Card' | 'subst' | 'Var';
  detail: string;
}

export async function fetchFixtures(round?: string): Promise<ApiFixture[]> {
  const params: Record<string, string | number> = { league: WC_LEAGUE_ID, season: WC_SEASON };
  if (round) params.round = round;
  return apiFetch<ApiFixture[]>('/fixtures', params);
}

export async function fetchFixturesByDate(date: string): Promise<ApiFixture[]> {
  return apiFetch<ApiFixture[]>('/fixtures', { league: WC_LEAGUE_ID, season: WC_SEASON, date });
}

export async function fetchStandings(): Promise<ApiStanding[][]> {
  const response = await apiFetch<Array<{ league: { standings: ApiStanding[][] } }>>('/standings', {
    league: WC_LEAGUE_ID, season: WC_SEASON,
  });
  return response[0]?.league?.standings || [];
}

export async function fetchMatchStatistics(fixtureId: number): Promise<ApiMatchStats[]> {
  return apiFetch<ApiMatchStats[]>('/fixtures/statistics', { fixture: fixtureId });
}

export async function fetchMatchEvents(fixtureId: number): Promise<ApiEvent[]> {
  return apiFetch<ApiEvent[]>('/fixtures/events', { fixture: fixtureId });
}

export function extractStatsFromResponse(stats: ApiMatchStats[]) {
  const getStat = (team: ApiMatchStats, typeName: string): number => {
    const s = team.statistics.find(s => s.type === typeName);
    return typeof s?.value === 'number' ? s.value : 0;
  };
  const home = stats[0]; const away = stats[1];
  if (!home || !away) return null;
  return {
    homeCorners: getStat(home, 'Corner Kicks'), awayCorners: getStat(away, 'Corner Kicks'),
    homeYellowCards: getStat(home, 'Yellow Cards'), awayYellowCards: getStat(away, 'Yellow Cards'),
    homeRedCards: getStat(home, 'Red Cards'), awayRedCards: getStat(away, 'Red Cards'),
    homePossession: getStat(home, 'Ball Possession'), awayPossession: getStat(away, 'Ball Possession'),
    homeShotsOnTarget: getStat(home, 'Shots on Goal'), awayShotsOnTarget: getStat(away, 'Shots on Goal'),
    homeTotalShots: getStat(home, 'Total Shots'), awayTotalShots: getStat(away, 'Total Shots'),
    homeFouls: getStat(home, 'Fouls'), awayFouls: getStat(away, 'Fouls'),
    homeOffsides: getStat(home, 'Offsides'), awayOffsides: getStat(away, 'Offsides'),
  };
}

export function parseMatchday(roundString: string): number {
  const match = roundString.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

export function isApiConfigured(): boolean {
  const key = process.env.API_FOOTBALL_KEY;
  return !!(key && key !== 'your_api_football_key_here');
}
