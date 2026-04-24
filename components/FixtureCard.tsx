import TeamFlag from './TeamFlag';
import { type Fixture } from '@/lib/constants';
import { type MatchPrediction } from '@/lib/predictions';
import { getStatusBadge, formatMatchDate } from '@/lib/utils';

interface FixtureCardProps {
  fixture: Fixture;
  prediction: MatchPrediction;
  showPrediction?: boolean;
  compact?: boolean;
}

export default function FixtureCard({ fixture, prediction, showPrediction = true, compact = false }: FixtureCardProps) {
  const { homeTeam, awayTeam, date, time, venue, city, country, group, ukChannel, status, homeScore, awayScore } = fixture;

  const isCompleted = status === 'FT';
  const isLive = status === 'LIVE' || status === '1H' || status === '2H' || status === 'HT';
  const statusBadge = getStatusBadge(status);

  const homeWinPct = Math.round(prediction.homeWinProbability * 100);
  const drawPct = Math.round(prediction.drawProbability * 100);
  const awayWinPct = Math.round(prediction.awayWinProbability * 100);

  const channelColor = ukChannel === 'BBC'
    ? 'bg-blue-900/50 text-blue-300 border-blue-700'
    : 'bg-red-900/50 text-red-300 border-red-800';

  return (
    <div className="bg-fifa-card border border-fifa-border hover:border-blue-800 rounded-2xl overflow-hidden transition-all card-hover">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-fifa-blue/30 to-transparent px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Group {group}</span>
          <span className="text-gray-600">·</span>
          <span className="text-gray-500 text-xs">{formatMatchDate(date)}</span>
        </div>
        <div className="flex items-center gap-2">
          {isLive && <span className="text-red-400 text-xs font-bold animate-pulse">● LIVE</span>}
          {ukChannel && (
            <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${channelColor}`}>{ukChannel}</span>
          )}
        </div>
      </div>

      {/* Teams & Score */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Home Team */}
          <div className="flex-1">
            <TeamFlag teamName={homeTeam} size={28} showName namePosition="below" />
          </div>

          {/* Score / Prediction */}
          <div className="text-center flex-shrink-0">
            {isCompleted && homeScore !== undefined ? (
              <div>
                <div className="text-white text-3xl font-black tabular-nums">
                  {homeScore} – {awayScore}
                </div>
                <div className="text-gray-500 text-xs mt-0.5">Full Time</div>
              </div>
            ) : isLive && homeScore !== undefined ? (
              <div>
                <div className="text-red-400 text-3xl font-black tabular-nums animate-pulse">
                  {homeScore} – {awayScore}
                </div>
                <div className="text-red-500 text-xs mt-0.5">Live</div>
              </div>
            ) : (
              <div>
                <div className="text-gray-500 text-xs mb-1 uppercase tracking-widest">{time} UTC</div>
                {showPrediction && (
                  <div className="text-blue-400 text-2xl font-black">
                    {prediction.predictedScore.home} – {prediction.predictedScore.away}
                  </div>
                )}
                <div className="text-gray-600 text-xs mt-0.5">Predicted</div>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex-1 flex justify-end">
            <TeamFlag teamName={awayTeam} size={28} showName namePosition="below" />
          </div>
        </div>

        {/* Win Probability Bar */}
        {showPrediction && !compact && (
          <div className="mt-4 space-y-1">
            <div className="h-2 rounded-full overflow-hidden flex">
              <div className="bg-blue-500 h-full transition-all" style={{ width: `${homeWinPct}%` }} />
              <div className="bg-gray-600 h-full" style={{ width: `${drawPct}%` }} />
              <div className="bg-red-500 h-full transition-all" style={{ width: `${awayWinPct}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{homeTeam.split(' ')[0]} {homeWinPct}%</span>
              <span>Draw {drawPct}%</span>
              <span>{awayWinPct}% {awayTeam.split(' ')[0]}</span>
            </div>
          </div>
        )}

        {/* Extra stats row */}
        {showPrediction && !compact && (
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-600">
            <span>🔄 {prediction.predictedCorners} corners</span>
            <span>🟨 {prediction.predictedYellowCards} cards</span>
            <span>📍 {city}</span>
          </div>
        )}
      </div>
    </div>
  );
}
