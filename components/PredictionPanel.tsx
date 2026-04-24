import { type MatchPrediction } from '@/lib/predictions';
import { fmtPct } from '@/lib/utils';

interface PredictionPanelProps {
  prediction: MatchPrediction;
  homeTeam: string;
  awayTeam: string;
  compact?: boolean;
}

function ConfidenceBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  const styles = {
    high: 'bg-green-900/40 text-green-400 border-green-800',
    medium: 'bg-yellow-900/40 text-yellow-400 border-yellow-800',
    low: 'bg-gray-800 text-gray-400 border-gray-700',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${styles[level]}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)} confidence
    </span>
  );
}

export default function PredictionPanel({ prediction, homeTeam, awayTeam, compact = false }: PredictionPanelProps) {
  const {
    predictedScore, homeWinProbability, drawProbability, awayWinProbability,
    predictedCorners, predictedHomeCorners, predictedAwayCorners,
    predictedYellowCards, predictedRedCards, expectedHomeGoals, expectedAwayGoals,
    confidence, reasoning, scoreProbabilities, scoreCorrect, resultCorrect, actualScore,
  } = prediction;

  const homeWinPct = Math.round(homeWinProbability * 100);
  const drawPct = Math.round(drawProbability * 100);
  const awayWinPct = Math.round(awayWinProbability * 100);

  return (
    <div className="space-y-4">
      {/* Predicted Score + Confidence */}
      <div className="bg-gradient-to-r from-fifa-blue/20 to-transparent rounded-xl p-4 flex items-center justify-between">
        <div>
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">AI Predicted Score</div>
          <div className="text-white text-4xl font-black">
            {predictedScore.home} – {predictedScore.away}
          </div>
          {actualScore !== undefined && (
            <div className="mt-1 flex items-center gap-2">
              <span className="text-gray-500 text-xs">Actual: {actualScore.home}–{actualScore.away}</span>
              {scoreCorrect ? (
                <span className="text-green-400 text-xs font-bold">✓ Exact</span>
              ) : resultCorrect ? (
                <span className="text-yellow-400 text-xs font-bold">~ Result correct</span>
              ) : (
                <span className="text-red-400 text-xs font-bold">✗ Wrong</span>
              )}
            </div>
          )}
        </div>
        <ConfidenceBadge level={confidence} />
      </div>

      {/* Win Probabilities */}
      <div className="space-y-2">
        <div className="text-gray-500 text-xs uppercase tracking-wider">Win Probabilities</div>
        <div className="h-3 rounded-full overflow-hidden flex">
          <div className="bg-blue-500" style={{ width: `${homeWinPct}%` }} />
          <div className="bg-gray-600" style={{ width: `${drawPct}%` }} />
          <div className="bg-red-500" style={{ width: `${awayWinPct}%` }} />
        </div>
        <div className="grid grid-cols-3 text-xs text-center">
          <div><div className="text-white font-bold">{homeWinPct}%</div><div className="text-gray-500 truncate">{homeTeam}</div></div>
          <div><div className="text-gray-300 font-bold">{drawPct}%</div><div className="text-gray-500">Draw</div></div>
          <div><div className="text-white font-bold">{awayWinPct}%</div><div className="text-gray-500 truncate">{awayTeam}</div></div>
        </div>
      </div>

      {/* Expected Goals */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-fifa-dark rounded-lg p-2">
          <div className="text-blue-400 font-bold text-lg">{expectedHomeGoals}</div>
          <div className="text-gray-600">xG Home</div>
        </div>
        <div className="bg-fifa-dark rounded-lg p-2">
          <div className="text-yellow-400 font-bold text-lg">{predictedCorners}</div>
          <div className="text-gray-600">Corners</div>
        </div>
        <div className="bg-fifa-dark rounded-lg p-2">
          <div className="text-red-400 font-bold text-lg">{expectedAwayGoals}</div>
          <div className="text-gray-600">xG Away</div>
        </div>
      </div>

      {/* Cards & Corners Detail */}
      {!compact && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-fifa-dark rounded-lg p-3 space-y-1">
            <div className="text-gray-500 text-xs uppercase tracking-wider">Corners</div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{homeTeam.split(' ')[0]}</span>
              <span className="text-white font-bold">{predictedHomeCorners}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{awayTeam.split(' ')[0]}</span>
              <span className="text-white font-bold">{predictedAwayCorners}</span>
            </div>
          </div>
          <div className="bg-fifa-dark rounded-lg p-3 space-y-1">
            <div className="text-gray-500 text-xs uppercase tracking-wider">Cards</div>
            <div className="flex justify-between text-sm">
              <span className="text-yellow-400">🟨 Yellow</span>
              <span className="text-white font-bold">{predictedYellowCards}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-red-400">🟥 Red</span>
              <span className="text-white font-bold">{predictedRedCards}</span>
            </div>
          </div>
        </div>
      )}

      {/* AI Reasoning */}
      {!compact && reasoning && (
        <div className="bg-blue-950/20 border border-blue-900/40 rounded-xl p-3">
          <div className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">🤖 AI Reasoning</div>
          <p className="text-gray-300 text-sm leading-relaxed">{reasoning}</p>
        </div>
      )}

      {/* Top score probabilities */}
      {!compact && scoreProbabilities.length > 0 && (
        <div className="space-y-2">
          <div className="text-gray-500 text-xs uppercase tracking-wider">Most Likely Scores</div>
          <div className="grid grid-cols-4 gap-1.5">
            {scoreProbabilities.slice(0, 8).map((sp, i) => (
              <div
                key={i}
                className={`rounded-lg p-2 text-center text-xs border ${
                  i === 0 ? 'bg-blue-900/40 border-blue-700' : 'bg-fifa-dark border-fifa-border'
                }`}
              >
                <div className={`font-bold ${i === 0 ? 'text-blue-300' : 'text-white'}`}>
                  {sp.homeGoals}–{sp.awayGoals}
                </div>
                <div className="text-gray-500">{fmtPct(sp.probability)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
