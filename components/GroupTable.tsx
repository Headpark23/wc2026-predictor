import TeamFlag from './TeamFlag';

interface StandingRow {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
}

interface GroupTableProps {
  standings: StandingRow[];
  highlightTop?: number;
}

export default function GroupTable({ standings, highlightTop = 2 }: GroupTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500 text-xs uppercase tracking-wider">
            <th className="px-4 py-2 text-left w-6">#</th>
            <th className="px-4 py-2 text-left">Team</th>
            <th className="px-2 py-2 text-center w-8" title="Played">P</th>
            <th className="px-2 py-2 text-center w-8" title="Won">W</th>
            <th className="px-2 py-2 text-center w-8" title="Drawn">D</th>
            <th className="px-2 py-2 text-center w-8" title="Lost">L</th>
            <th className="px-2 py-2 text-center w-12" title="Goals For/Against">GF:GA</th>
            <th className="px-2 py-2 text-center w-8" title="Goal Difference">GD</th>
            <th className="px-3 py-2 text-center w-8 font-bold" title="Points">Pts</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-fifa-border">
          {standings.map((row, i) => {
            const isQualifying = i < highlightTop;
            const isThirdPlace = i === 2;
            return (
              <tr
                key={row.team}
                className={`${isQualifying ? 'bg-blue-950/20' : ''} hover:bg-white/5 transition-colors`}
              >
                <td className="px-4 py-2.5">
                  {isQualifying ? (
                    <span className="text-green-400 font-bold text-xs">{i + 1}</span>
                  ) : (
                    <span className="text-gray-600 text-xs">{i + 1}</span>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <TeamFlag teamName={row.team} size={16} />
                    <span className={`text-xs font-medium ${isQualifying ? 'text-white' : 'text-gray-400'}`}>
                      {row.team}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-2.5 text-center text-gray-400 text-xs">{row.played}</td>
                <td className="px-2 py-2.5 text-center text-gray-300 text-xs">{row.won}</td>
                <td className="px-2 py-2.5 text-center text-gray-400 text-xs">{row.drawn}</td>
                <td className="px-2 py-2.5 text-center text-gray-400 text-xs">{row.lost}</td>
                <td className="px-2 py-2.5 text-center text-gray-400 text-xs">{row.goalsFor}:{row.goalsAgainst}</td>
                <td className={`px-2 py-2.5 text-center text-xs ${row.goalDiff > 0 ? 'text-green-400' : row.goalDiff < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                  {row.goalDiff > 0 ? '+' : ''}{row.goalDiff}
                </td>
                <td className="px-3 py-2.5 text-center">
                  <span className={`font-black text-sm ${isQualifying ? 'text-white' : 'text-gray-500'}`}>
                    {row.points}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="px-4 py-2 flex items-center gap-3 text-xs text-gray-600 border-t border-fifa-border">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-blue-950/60 border border-blue-800" />
          Qualify (top 2)
        </span>
      </div>
    </div>
  );
}
