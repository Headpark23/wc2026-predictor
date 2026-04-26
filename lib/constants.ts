// =====================================================
// WORLD CUP 2026 — MASTER DATA FILE
// All data sourced from official FIFA / API-Football
// Groups confirmed from FIFA draw (December 5, 2024)
// Fixtures/times will be overridden by live API data
// =====================================================

export interface Team {
  name: string;
  code: string;          // ISO 3166-1 alpha-2 for flag
  fifaRank: number;      // FIFA ranking (approx. early 2026)
  attackRating: number;  // 0.5–2.5 (derived from ranking + form)
  defenseRating: number; // 0.5–2.5 (lower = harder to score against)
  avgCornersFor: number; // historical avg corners per game
  avgCardsPerGame: number; // historical avg yellow cards per game
}

export interface Fixture {
  id: string;
  group: string;
  matchday: number;
  homeTeam: string;
  awayTeam: string;
  date: string;          // ISO date string (UTC)
  time: string;          // e.g. "20:00" UTC
  venue: string;
  city: string;
  country: 'USA' | 'Mexico' | 'Canada';
  ukChannel: string;     // "BBC" | "ITV" | "BBC/ITV"
  apiFixtureId?: number; // API-Football fixture ID (populated at runtime)
  status?: string;                  // NS=Not started, LIVE/1H/2H/HT=Live, FT=Full time
  homeScore?: number;
  awayScore?: number;
  homeCorners?: number;
  awayCorners?: number;
  homeYellowCards?: number;
  awayYellowCards?: number;
  homeRedCards?: number;
  awayRedCards?: number;
}

// =====================================================
// ALL 48 TEAMS — FIFA Rankings & Prediction Ratings
// Ratings derived from FIFA world ranking + qualifying form
// =====================================================
export const TEAMS: Record<string, Team> = {
  // ---- TOP TIER (FIFA Rank 1-10) ----
  Argentina: {
    name: 'Argentina', code: 'ar', fifaRank: 1,
    attackRating: 2.20, defenseRating: 0.62,
    avgCornersFor: 5.8, avgCardsPerGame: 1.5,
  },
  France: {
    name: 'France', code: 'fr', fifaRank: 2,
    attackRating: 2.10, defenseRating: 0.60,
    avgCornersFor: 5.6, avgCardsPerGame: 1.6,
  },
  Spain: {
    name: 'Spain', code: 'es', fifaRank: 3,
    attackRating: 2.05, defenseRating: 0.58,
    avgCornersFor: 6.2, avgCardsPerGame: 1.4,
  },
  England: {
    name: 'England', code: 'gb-eng', fifaRank: 4,
    attackRating: 1.95, defenseRating: 0.65,
    avgCornersFor: 5.9, avgCardsPerGame: 1.3,
  },
  Brazil: {
    name: 'Brazil', code: 'br', fifaRank: 5,
    attackRating: 2.00, defenseRating: 0.63,
    avgCornersFor: 5.5, avgCardsPerGame: 1.7,
  },
  Belgium: {
    name: 'Belgium', code: 'be', fifaRank: 6,
    attackRating: 1.85, defenseRating: 0.68,
    avgCornersFor: 5.4, avgCardsPerGame: 1.5,
  },
  Portugal: {
    name: 'Portugal', code: 'pt', fifaRank: 7,
    attackRating: 1.90, defenseRating: 0.70,
    avgCornersFor: 5.7, avgCardsPerGame: 1.4,
  },
  Netherlands: {
    name: 'Netherlands', code: 'nl', fifaRank: 8,
    attackRating: 1.88, defenseRating: 0.72,
    avgCornersFor: 5.5, avgCardsPerGame: 1.5,
  },
  Germany: {
    name: 'Germany', code: 'de', fifaRank: 9,
    attackRating: 1.85, defenseRating: 0.70,
    avgCornersFor: 5.6, avgCardsPerGame: 1.4,
  },
  // ---- STRONG (FIFA Rank 10-20) ----
  Uruguay: {
    name: 'Uruguay', code: 'uy', fifaRank: 10,
    attackRating: 1.65, defenseRating: 0.75,
    avgCornersFor: 4.8, avgCardsPerGame: 1.8,
  },
  Colombia: {
    name: 'Colombia', code: 'co', fifaRank: 11,
    attackRating: 1.60, defenseRating: 0.78,
    avgCornersFor: 5.0, avgCardsPerGame: 1.7,
  },
  Croatia: {
    name: 'Croatia', code: 'hr', fifaRank: 14,
    attackRating: 1.55, defenseRating: 0.80,
    avgCornersFor: 4.9, avgCardsPerGame: 1.6,
  },
  USA: {
    name: 'United States', code: 'us', fifaRank: 15,
    attackRating: 1.50, defenseRating: 0.82,
    avgCornersFor: 5.1, avgCardsPerGame: 1.5,
  },
  Mexico: {
    name: 'Mexico', code: 'mx', fifaRank: 16,
    attackRating: 1.48, defenseRating: 0.83,
    avgCornersFor: 5.2, avgCardsPerGame: 1.9,
  },
  Morocco: {
    name: 'Morocco', code: 'ma', fifaRank: 14,
    attackRating: 1.45, defenseRating: 0.76,
    avgCornersFor: 4.7, avgCardsPerGame: 1.8,
  },
  Ecuador: {
    name: 'Ecuador', code: 'ec', fifaRank: 17,
    attackRating: 1.40, defenseRating: 0.85,
    avgCornersFor: 4.6, avgCardsPerGame: 1.7,
  },
  Japan: {
    name: 'Japan', code: 'jp', fifaRank: 18,
    attackRating: 1.42, defenseRating: 0.84,
    avgCornersFor: 5.3, avgCardsPerGame: 1.2,
  },
  Senegal: {
    name: 'Senegal', code: 'sn', fifaRank: 19,
    attackRating: 1.38, defenseRating: 0.86,
    avgCornersFor: 4.5, avgCardsPerGame: 1.8,
  },
  // ---- MID-TIER (FIFA Rank 20-35) ----
  Switzerland: {
    name: 'Switzerland', code: 'ch', fifaRank: 20,
    attackRating: 1.35, defenseRating: 0.85,
    avgCornersFor: 5.0, avgCardsPerGame: 1.4,
  },
  Austria: {
    name: 'Austria', code: 'at', fifaRank: 23,
    attackRating: 1.30, defenseRating: 0.90,
    avgCornersFor: 5.1, avgCardsPerGame: 1.5,
  },
  Australia: {
    name: 'Australia', code: 'au', fifaRank: 24,
    attackRating: 1.28, defenseRating: 0.92,
    avgCornersFor: 4.8, avgCardsPerGame: 1.4,
  },
  Norway: {
    name: 'Norway', code: 'no', fifaRank: 25,
    attackRating: 1.32, defenseRating: 0.91,
    avgCornersFor: 4.9, avgCardsPerGame: 1.5,
  },
  Sweden: {
    name: 'Sweden', code: 'se', fifaRank: 27,
    attackRating: 1.25, defenseRating: 0.93,
    avgCornersFor: 4.7, avgCardsPerGame: 1.4,
  },
  'Côte d\'Ivoire': {
    name: "Côte d'Ivoire", code: 'ci', fifaRank: 28,
    attackRating: 1.28, defenseRating: 0.92,
    avgCornersFor: 4.6, avgCardsPerGame: 1.8,
  },
  Turkey: {
    name: 'Türkiye', code: 'tr', fifaRank: 29,
    attackRating: 1.30, defenseRating: 0.93,
    avgCornersFor: 5.0, avgCardsPerGame: 1.9,
  },
  Ghana: {
    name: 'Ghana', code: 'gh', fifaRank: 30,
    attackRating: 1.22, defenseRating: 0.95,
    avgCornersFor: 4.5, avgCardsPerGame: 1.7,
  },
  Tunisia: {
    name: 'Tunisia', code: 'tn', fifaRank: 31,
    attackRating: 1.18, defenseRating: 0.96,
    avgCornersFor: 4.4, avgCardsPerGame: 1.8,
  },
  'South Korea': {
    name: 'South Korea', code: 'kr', fifaRank: 22,
    attackRating: 1.30, defenseRating: 0.90,
    avgCornersFor: 5.0, avgCardsPerGame: 1.4,
  },
  // ---- LOWER-MID TIER (FIFA Rank 35-48) ----
  'Saudi Arabia': {
    name: 'Saudi Arabia', code: 'sa', fifaRank: 56,
    attackRating: 1.10, defenseRating: 1.02,
    avgCornersFor: 4.2, avgCardsPerGame: 1.8,
  },
  Algeria: {
    name: 'Algeria', code: 'dz', fifaRank: 35,
    attackRating: 1.18, defenseRating: 0.98,
    avgCornersFor: 4.3, avgCardsPerGame: 1.9,
  },
  Paraguay: {
    name: 'Paraguay', code: 'py', fifaRank: 37,
    attackRating: 1.15, defenseRating: 1.00,
    avgCornersFor: 4.2, avgCardsPerGame: 1.9,
  },
  'Cape Verde': {
    name: 'Cape Verde', code: 'cv', fifaRank: 40,
    attackRating: 1.12, defenseRating: 1.02,
    avgCornersFor: 4.0, avgCardsPerGame: 1.8,
  },
  Iran: {
    name: 'Iran', code: 'ir', fifaRank: 21,
    attackRating: 1.20, defenseRating: 0.95,
    avgCornersFor: 4.5, avgCardsPerGame: 2.0,
  },
  Scotland: {
    name: 'Scotland', code: 'gb-sct', fifaRank: 38,
    attackRating: 1.15, defenseRating: 1.02,
    avgCornersFor: 5.0, avgCardsPerGame: 1.6,
  },
  Canada: {
    name: 'Canada', code: 'ca', fifaRank: 41,
    attackRating: 1.20, defenseRating: 1.00,
    avgCornersFor: 4.8, avgCardsPerGame: 1.5,
  },
  Egypt: {
    name: 'Egypt', code: 'eg', fifaRank: 43,
    attackRating: 1.15, defenseRating: 1.02,
    avgCornersFor: 4.3, avgCardsPerGame: 1.8,
  },
  Jordan: {
    name: 'Jordan', code: 'jo', fifaRank: 67,
    attackRating: 0.95, defenseRating: 1.10,
    avgCornersFor: 3.8, avgCardsPerGame: 1.9,
  },
  'Bosnia-Herzegovina': {
    name: 'Bosnia-Herzegovina', code: 'ba', fifaRank: 59,
    attackRating: 1.05, defenseRating: 1.05,
    avgCornersFor: 4.0, avgCardsPerGame: 1.8,
  },
  Qatar: {
    name: 'Qatar', code: 'qa', fifaRank: 70,
    attackRating: 0.92, defenseRating: 1.12,
    avgCornersFor: 3.7, avgCardsPerGame: 1.7,
  },
  Czechia: {
    name: 'Czechia', code: 'cz', fifaRank: 33,
    attackRating: 1.20, defenseRating: 0.95,
    avgCornersFor: 4.9, avgCardsPerGame: 1.5,
  },
  'New Zealand': {
    name: 'New Zealand', code: 'nz', fifaRank: 97,
    attackRating: 0.82, defenseRating: 1.22,
    avgCornersFor: 3.5, avgCardsPerGame: 1.5,
  },
  Iraq: {
    name: 'Iraq', code: 'iq', fifaRank: 65,
    attackRating: 0.98, defenseRating: 1.08,
    avgCornersFor: 3.9, avgCardsPerGame: 2.0,
  },
  Uzbekistan: {
    name: 'Uzbekistan', code: 'uz', fifaRank: 72,
    attackRating: 0.90, defenseRating: 1.12,
    avgCornersFor: 3.8, avgCardsPerGame: 1.7,
  },
  'South Africa': {
    name: 'South Africa', code: 'za', fifaRank: 63,
    attackRating: 0.98, defenseRating: 1.08,
    avgCornersFor: 3.9, avgCardsPerGame: 1.8,
  },
  Curaçao: {
    name: 'Curaçao', code: 'cw', fifaRank: 88,
    attackRating: 0.82, defenseRating: 1.22,
    avgCornersFor: 3.4, avgCardsPerGame: 1.8,
  },
  'DR Congo': {
    name: 'DR Congo', code: 'cd', fifaRank: 50,
    attackRating: 1.05, defenseRating: 1.05,
    avgCornersFor: 4.0, avgCardsPerGame: 2.0,
  },
  Panama: {
    name: 'Panama', code: 'pa', fifaRank: 80,
    attackRating: 0.86, defenseRating: 1.18,
    avgCornersFor: 3.6, avgCardsPerGame: 1.9,
  },
  Haiti: {
    name: 'Haiti', code: 'ht', fifaRank: 82,
    attackRating: 0.84, defenseRating: 1.20,
    avgCornersFor: 3.5, avgCardsPerGame: 1.9,
  },
};

// =====================================================
// ALL 12 GROUPS
// Confirmed from FIFA draw — December 5, 2024
// =====================================================
export const GROUPS: Record<string, string[]> = {
  A: ['Mexico', 'South Africa', 'South Korea', 'Czechia'],
  B: ['Canada', 'Switzerland', 'Qatar', 'Bosnia-Herzegovina'],
  C: ['Brazil', 'Morocco', 'Haiti', 'Scotland'],
  D: ['USA', 'Paraguay', 'Australia', 'Turkey'],
  E: ['Germany', "Côte d'Ivoire", 'Curaçao', 'Ecuador'],
  F: ['Netherlands', 'Japan', 'Tunisia', 'Sweden'],
  G: ['Belgium', 'Egypt', 'Iran', 'New Zealand'],
  H: ['Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay'],
  I: ['France', 'Senegal', 'Iraq', 'Norway'],
  J: ['Argentina', 'Algeria', 'Austria', 'Jordan'],
  K: ['Portugal', 'Uzbekistan', 'Colombia', 'DR Congo'],
  L: ['England', 'Croatia', 'Ghana', 'Panama'],
};

// =====================================================
// VENUES — Official World Cup 2026 Stadiums
// =====================================================
export const VENUES: Record<string, { name: string; city: string; country: 'USA' | 'Mexico' | 'Canada'; capacity: number }> = {
  azteca:     { name: 'Estadio Azteca',         city: 'Mexico City',      country: 'Mexico', capacity: 87523 },
  akron:      { name: 'Estadio Akron',           city: 'Guadalajara',      country: 'Mexico', capacity: 49850 },
  bbva:       { name: 'Estadio BBVA',            city: 'Monterrey',        country: 'Mexico', capacity: 53500 },
  metlife:    { name: 'MetLife Stadium',         city: 'East Rutherford',  country: 'USA',    capacity: 82500 },
  sofi:       { name: 'SoFi Stadium',            city: 'Inglewood, CA',    country: 'USA',    capacity: 70240 },
  att:        { name: 'AT&T Stadium',            city: 'Arlington, TX',    country: 'USA',    capacity: 80000 },
  levis:      { name: "Levi's Stadium",          city: 'Santa Clara, CA',  country: 'USA',    capacity: 68500 },
  gillette:   { name: 'Gillette Stadium',        city: 'Foxborough, MA',   country: 'USA',    capacity: 65878 },
  nrg:        { name: 'NRG Stadium',             city: 'Houston, TX',      country: 'USA',    capacity: 72220 },
  lfc:        { name: 'Lincoln Financial Field', city: 'Philadelphia, PA', country: 'USA',    capacity: 69796 },
  lumen:      { name: 'Lumen Field',             city: 'Seattle, WA',      country: 'USA',    capacity: 68740 },
  arrowhead:  { name: 'Arrowhead Stadium',       city: 'Kansas City, MO',  country: 'USA',    capacity: 76416 },
  mercedes:   { name: 'Mercedes-Benz Stadium',   city: 'Atlanta, GA',      country: 'USA',    capacity: 71000 },
  hardrock:   { name: 'Hard Rock Stadium',       city: 'Miami Gardens, FL',country: 'USA',    capacity: 65326 },
  bmo:        { name: 'BMO Field',               city: 'Toronto',          country: 'Canada', capacity: 30000 },
  bcplace:    { name: 'BC Place',                city: 'Vancouver',        country: 'Canada', capacity: 54500 },
};

// =====================================================
// MATCHDAY 1 FIXTURES
// All times in UTC. BBC/ITV assignments are confirmed
// where known; shared England matches are BBC/ITV.
// Live API data will override/supplement this data.
// Sources: FIFA official schedule, BBC/ITV press releases
// =====================================================
export const MATCHDAY_1_FIXTURES: Fixture[] = [
  // ---- GROUP A ----
  {
    id: 'A1a',
    group: 'A', matchday: 1,
    homeTeam: 'Mexico', awayTeam: 'South Africa',
    date: '2026-06-11', time: '20:00',
    venue: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico',
    ukChannel: 'BBC',
  },
  {
    id: 'A1b',
    group: 'A', matchday: 1,
    homeTeam: 'South Korea', awayTeam: 'Czechia',
    date: '2026-06-12', time: '03:00',
    venue: 'Estadio Akron', city: 'Guadalajara', country: 'Mexico',
    ukChannel: 'ITV',
  },
  // ---- GROUP B ----
  {
    id: 'B1a',
    group: 'B', matchday: 1,
    homeTeam: 'Canada', awayTeam: 'Bosnia-Herzegovina',
    date: '2026-06-12', time: '19:00',
    venue: 'BMO Field', city: 'Toronto', country: 'Canada',
    ukChannel: 'BBC',
  },
  {
    id: 'B1b',
    group: 'B', matchday: 1,
    homeTeam: 'Qatar', awayTeam: 'Switzerland',
    date: '2026-06-13', time: '22:00',
    venue: "Levi's Stadium", city: 'Santa Clara, CA', country: 'USA',
    ukChannel: 'ITV',
  },
  // ---- GROUP C ----
  {
    id: 'C1a',
    group: 'C', matchday: 1,
    homeTeam: 'Brazil', awayTeam: 'Morocco',
    date: '2026-06-13', time: '22:00',
    venue: 'MetLife Stadium', city: 'East Rutherford, NJ', country: 'USA',
    ukChannel: 'BBC',
  },
  {
    id: 'C1b',
    group: 'C', matchday: 1,
    homeTeam: 'Haiti', awayTeam: 'Scotland',
    date: '2026-06-14', time: '01:00',
    venue: 'Gillette Stadium', city: 'Foxborough, MA', country: 'USA',
    ukChannel: 'ITV',
  },
  // ---- GROUP D ----
  {
    id: 'D1a',
    group: 'D', matchday: 1,
    homeTeam: 'USA', awayTeam: 'Paraguay',
    date: '2026-06-13', time: '00:00',
    venue: 'SoFi Stadium', city: 'Inglewood, CA', country: 'USA',
    ukChannel: 'BBC',
  },
  {
    id: 'D1b',
    group: 'D', matchday: 1,
    homeTeam: 'Australia', awayTeam: 'Turkey',
    date: '2026-06-13', time: '04:00',
    venue: 'BC Place', city: 'Vancouver', country: 'Canada',
    ukChannel: 'ITV',
  },
  // ---- GROUP E ----
  {
    id: 'E1a',
    group: 'E', matchday: 1,
    homeTeam: 'Germany', awayTeam: 'Curaçao',
    date: '2026-06-14', time: '18:00',
    venue: 'NRG Stadium', city: 'Houston, TX', country: 'USA',
    ukChannel: 'BBC',
  },
  {
    id: 'E1b',
    group: 'E', matchday: 1,
    homeTeam: "Côte d'Ivoire", awayTeam: 'Ecuador',
    date: '2026-06-14', time: '23:00',
    venue: 'Lincoln Financial Field', city: 'Philadelphia, PA', country: 'USA',
    ukChannel: 'ITV',
  },
  // ---- GROUP F ----
  {
    id: 'F1a',
    group: 'F', matchday: 1,
    homeTeam: 'Netherlands', awayTeam: 'Japan',
    date: '2026-06-15', time: '21:00',
    venue: 'MetLife Stadium', city: 'East Rutherford, NJ', country: 'USA',
    ukChannel: 'BBC',
  },
  {
    id: 'F1b',
    group: 'F', matchday: 1,
    homeTeam: 'Tunisia', awayTeam: 'Sweden',
    date: '2026-06-15', time: '18:00',
    venue: 'Lumen Field', city: 'Seattle, WA', country: 'USA',
    ukChannel: 'ITV',
  },
  // ---- GROUP G ----
  {
    id: 'G1a',
    group: 'G', matchday: 1,
    homeTeam: 'Belgium', awayTeam: 'Egypt',
    date: '2026-06-15', time: '21:00',
    venue: 'Hard Rock Stadium', city: 'Miami Gardens, FL', country: 'USA',
    ukChannel: 'ITV',
  },
  {
    id: 'G1b',
    group: 'G', matchday: 1,
    homeTeam: 'Iran', awayTeam: 'New Zealand',
    date: '2026-06-16', time: '00:00',
    venue: 'Arrowhead Stadium', city: 'Kansas City, MO', country: 'USA',
    ukChannel: 'BBC',
  },
  // ---- GROUP H ----
  {
    id: 'H1a',
    group: 'H', matchday: 1,
    homeTeam: 'Spain', awayTeam: 'Cape Verde',
    date: '2026-06-15', time: '23:00',
    venue: 'AT&T Stadium', city: 'Arlington, TX', country: 'USA',
    ukChannel: 'BBC',
  },
  {
    id: 'H1b',
    group: 'H', matchday: 1,
    homeTeam: 'Saudi Arabia', awayTeam: 'Uruguay',
    date: '2026-06-16', time: '02:00',
    venue: 'Mercedes-Benz Stadium', city: 'Atlanta, GA', country: 'USA',
    ukChannel: 'ITV',
  },
  // ---- GROUP I ----
  {
    id: 'I1a',
    group: 'I', matchday: 1,
    homeTeam: 'France', awayTeam: 'Senegal',
    date: '2026-06-16', time: '19:00',
    venue: 'MetLife Stadium', city: 'East Rutherford, NJ', country: 'USA',
    ukChannel: 'BBC',
  },
  {
    id: 'I1b',
    group: 'I', matchday: 1,
    homeTeam: 'Iraq', awayTeam: 'Norway',
    date: '2026-06-16', time: '22:00',
    venue: 'Gillette Stadium', city: 'Foxborough, MA', country: 'USA',
    ukChannel: 'ITV',
  },
  // ---- GROUP J ----
  {
    id: 'J1a',
    group: 'J', matchday: 1,
    homeTeam: 'Argentina', awayTeam: 'Algeria',
    date: '2026-06-16', time: '22:00',
    venue: 'Arrowhead Stadium', city: 'Kansas City, MO', country: 'USA',
    ukChannel: 'BBC',
  },
  {
    id: 'J1b',
    group: 'J', matchday: 1,
    homeTeam: 'Austria', awayTeam: 'Jordan',
    date: '2026-06-17', time: '02:00',
    venue: "Levi's Stadium", city: 'Santa Clara, CA', country: 'USA',
    ukChannel: 'ITV',
  },
  // ---- GROUP K ----
  {
    id: 'K1a',
    group: 'K', matchday: 1,
    homeTeam: 'Portugal', awayTeam: 'DR Congo',
    date: '2026-06-15', time: '18:00',
    venue: 'NRG Stadium', city: 'Houston, TX', country: 'USA',
    ukChannel: 'ITV',
  },
  {
    id: 'K1b',
    group: 'K', matchday: 1,
    homeTeam: 'Uzbekistan', awayTeam: 'Colombia',
    date: '2026-06-16', time: '03:00',
    venue: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico',
    ukChannel: 'BBC',
  },
  // ---- GROUP L ----
  {
    id: 'L1a',
    group: 'L', matchday: 1,
    homeTeam: 'England', awayTeam: 'Croatia',
    date: '2026-06-17', time: '21:00',
    venue: 'AT&T Stadium', city: 'Arlington, TX', country: 'USA',
    ukChannel: 'ITV',
  },
  {
    id: 'L1b',
    group: 'L', matchday: 1,
    homeTeam: 'Ghana', awayTeam: 'Panama',
    date: '2026-06-17', time: '23:00',
    venue: 'BMO Field', city: 'Toronto', country: 'Canada',
    ukChannel: 'BBC',
  },
];

// Tournament metadata
export const TOURNAMENT = {
  name: 'FIFA World Cup 2026',
  startDate: '2026-06-11',
  endDate: '2026-07-19',
  hosts: ['USA', 'Canada', 'Mexico'],
  totalTeams: 48,
  totalMatches: 104,
  groupCount: 12,
};
