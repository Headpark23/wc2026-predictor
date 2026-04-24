// =====================================================
// STATISTICAL PREDICTION ENGINE
// Uses Poisson distribution model for goal prediction
// Corners & cards derived from team style ratings
// =====================================================

import { TEAMS, type Team } from './constants';

const WC_AVG_GOALS_PER_TEAM = 1.30;
const WC_AVG_CORNERS_PER_GAME = 10.2;
const WC_AVG_CARDS_PER_GAME = 3.1;

export interface ScorePrediction {
  homeGoals: number;
  awayGoals: number;
  probability: number;
}

export interface MatchPrediction {
  predictedScore: { home: number; away: number };
  scoreProbabilities: ScorePrediction[];
  homeWinProbability: number;
  drawProbability: number;
  awayWinProbability: number;
  predictedCorners: number;
  predictedHomeCorners: number;
  predictedAwayCorners: number;
  predictedYellowCards: number;
  predictedRedCards: number;
  expectedHomeGoals: number;
  expectedAwayGoals: number;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
  actualScore?: { home: number; away: number };
  scoreCorrect?: boolean;
  resultCorrect?: boolean;
  cornersActual?: number;
  cardsActual?: number;
}

function poissonPMF(lambda: number, k: number): number {
  if (k < 0) return 0;
  let logP = -lambda + k * Math.log(lambda);
  let logFactorial = 0;
  for (let i = 2; i <= k; i++) logFactorial += Math.log(i);
  return Math.exp(logP - logFactorial);
}

function getTeamSafe(teamName: string): Team | null {
  if (TEAMS[teamName]) return TEAMS[teamName];
  const aliases: Record<string, string> = {
    'United States': 'USA', 'USA': 'USA',
    'South Korea': 'South Korea', 'Korea Republic': 'South Korea',
    'Turkiye': 'Turkey', 'Türkiye': 'Turkey',
    'Ivory Coast': "Côte d'Ivoire", "Cote d'Ivoire": "Côte d'Ivoire",
    'Congo DR': 'DR Congo',
    'Bosnia and Herzegovina': 'Bosnia-Herzegovina',
    'Bosnia & Herzegovina': 'Bosnia-Herzegovina',
    'Cabo Verde': 'Cape Verde',
  };
  const resolved = aliases[teamName];
  if (resolved && TEAMS[resolved]) return TEAMS[resolved];
  return null;
}

function getDefaultTeam(teamName: string): Team {
  return { name: teamName, code: 'un', fifaRank: 50, attackRating: 1.0, defenseRating: 1.0, avgCornersFor: 4.5, avgCardsPerGame: 1.6 };
}

export function predictMatch(
  homeTeamName: string,
  awayTeamName: string,
  actualResult?: { homeGoals: number; awayGoals: number; corners?: number; yellowCards?: number }
): MatchPrediction {
  const homeTeam = getTeamSafe(homeTeamName) || getDefaultTeam(homeTeamName);
  const awayTeam = getTeamSafe(awayTeamName) || getDefaultTeam(awayTeamName);

  const expectedHomeGoals = (homeTeam.attackRating / awayTeam.defenseRating) * WC_AVG_GOALS_PER_TEAM;
  const expectedAwayGoals = (awayTeam.attackRating / homeTeam.defenseRating) * WC_AVG_GOALS_PER_TEAM;
  const lambdaHome = Math.max(0.2, Math.min(4.0, expectedHomeGoals));
  const lambdaAway = Math.max(0.2, Math.min(4.0, expectedAwayGoals));

  const maxGoals = 7;
  const scoreProbabilities: ScorePrediction[] = [];
  let homeWinProb = 0, drawProb = 0, awayWinProb = 0;

  for (let h = 0; h < maxGoals; h++) {
    for (let a = 0; a < maxGoals; a++) {
      const prob = poissonPMF(lambdaHome, h) * poissonPMF(lambdaAway, a);
      scoreProbabilities.push({ homeGoals: h, awayGoals: a, probability: prob });
      if (h > a) homeWinProb += prob;
      else if (h === a) drawProb += prob;
      else awayWinProb += prob;
    }
  }

  const mostLikely = scoreProbabilities.reduce((best, curr) => curr.probability > best.probability ? curr : best);
  const topScores = [...scoreProbabilities].sort((a, b) => b.probability - a.probability).slice(0, 8);

  const homeAttackFactor = homeTeam.attackRating / 1.3;
  const awayAttackFactor = awayTeam.attackRating / 1.3;
  const predictedHomeCorners = Math.round((WC_AVG_CORNERS_PER_GAME / 2) * homeAttackFactor * (awayTeam.defenseRating / 1.0) * 10) / 10;
  const predictedAwayCorners = Math.round((WC_AVG_CORNERS_PER_GAME / 2) * awayAttackFactor * (homeTeam.defenseRating / 1.0) * 10) / 10;
  const predictedCorners = Math.round((predictedHomeCorners + predictedAwayCorners) * 10) / 10;

  const rankDiff = Math.abs(homeTeam.fifaRank - awayTeam.fifaRank);
  const competitivenessMultiplier = rankDiff < 10 ? 1.2 : rankDiff < 20 ? 1.1 : 1.0;
  const avgTeamCards = (homeTeam.avgCardsPerGame + awayTeam.avgCardsPerGame) / 2;
  const predictedYellowCards = Math.round(avgTeamCards * competitivenessMultiplier * 10) / 10;
  const predictedRedCards = predictedYellowCards > 3.0 ? 0.3 : 0.1;

  const confidence: 'high' | 'medium' | 'low' = rankDiff > 25 ? 'high' : rankDiff > 10 ? 'medium' : 'low';

  const favourite = homeTeam.fifaRank < awayTeam.fifaRank ? homeTeam.name : awayTeam.name;
  const underdog = homeTeam.fifaRank < awayTeam.fifaRank ? awayTeam.name : homeTeam.name;
  const rankGap = Math.abs(homeTeam.fifaRank - awayTeam.fifaRank);
  let reasoning = '';
  if (rankGap <= 5) {
    reasoning = `Evenly matched sides. ${homeTeam.name} (ranked #${homeTeam.fifaRank}) vs ${awayTeam.name} (#${awayTeam.fifaRank}) — a genuine 50/50.`;
  } else if (rankGap <= 15) {
    reasoning = `${favourite} hold a slight edge, but ${underdog} are capable of a surprise. High-pressure group stage football produces tight scorelines.`;
  } else {
    reasoning = `${favourite} (ranked #${Math.min(homeTeam.fifaRank, awayTeam.fifaRank)}) are clear favourites against ${underdog} (#${Math.max(homeTeam.fifaRank, awayTeam.fifaRank)}). Their superior attack should see them through.`;
  }

  let scoreCorrect: boolean | undefined, resultCorrect: boolean | undefined;
  let cornersActual: number | undefined, cardsActual: number | undefined;
  if (actualResult) {
    const { homeGoals: ah, awayGoals: aa } = actualResult;
    scoreCorrect = mostLikely.homeGoals === ah && mostLikely.awayGoals === aa;
    const pRes = mostLikely.homeGoals > mostLikely.awayGoals ? 'H' : mostLikely.homeGoals === mostLikely.awayGoals ? 'D' : 'A';
    const aRes = ah > aa ? 'H' : ah === aa ? 'D' : 'A';
    resultCorrect = pRes === aRes;
    cornersActual = actualResult.corners;
    cardsActual = actualResult.yellowCards;
  }

  return {
    predictedScore: { home: mostLikely.homeGoals, away: mostLikely.awayGoals },
    scoreProbabilities: topScores,
    homeWinProbability: Math.round(homeWinProb * 100) / 100,
    drawProbability: Math.round(drawProb * 100) / 100,
    awayWinProbability: Math.round(awayWinProb * 100) / 100,
    predictedCorners: Math.round(predictedCorners * 10) / 10,
    predictedHomeCorners: Math.round(predictedHomeCorners * 10) / 10,
    predictedAwayCorners: Math.round(predictedAwayCorners * 10) / 10,
    predictedYellowCards: Math.round(predictedYellowCards * 10) / 10,
    predictedRedCards: Math.round(predictedRedCards * 10) / 10,
    expectedHomeGoals: Math.round(lambdaHome * 100) / 100,
    expectedAwayGoals: Math.round(lambdaAway * 100) / 100,
    confidence, reasoning,
    actualScore: actualResult ? { home: actualResult.homeGoals, away: actualResult.awayGoals } : undefined,
    scoreCorrect, resultCorrect, cornersActual, cardsActual,
  };
}

export function predictAll(fixtures: Array<{ homeTeam: string; awayTeam: string; homeScore?: number; awayScore?: number }>) {
  return fixtures.map(f => ({
    fixture: f,
    prediction: predictMatch(f.homeTeam, f.awayTeam,
      f.homeScore !== undefined && f.awayScore !== undefined ? { homeGoals: f.homeScore, awayGoals: f.awayScore } : undefined),
  }));
}

export interface PredictionAccuracy { totalPredicted: number; exactScoreCorrect: number; resultCorrect: number; exactScorePct: number; resultPct: number; }

export function calculateAccuracy(results: Array<{ scoreCorrect?: boolean; resultCorrect?: boolean }>): PredictionAccuracy {
  const completed = results.filter(r => r.scoreCorrect !== undefined);
  const exactScore = completed.filter(r => r.scoreCorrect).length;
  const resultRight = completed.filter(r => r.resultCorrect).length;
  return {
    totalPredicted: completed.length, exactScoreCorrect: exactScore, resultCorrect: resultRight,
    exactScorePct: completed.length > 0 ? Math.round((exactScore / completed.length) * 100) : 0,
    resultPct: completed.length > 0 ? Math.round((resultRight / completed.length) * 100) : 0,
  };
}
