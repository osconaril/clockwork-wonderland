'use client';

interface LocationCardProps {
  location: {
    definitionId: string;
    instanceId: string;
    revealed: boolean;
    clues: number;
    doom: number;
    position: { x: number; y: number };
    enemies: string[];
    investigators: string[];
  };
  isPlayerHere: boolean;
  canMoveTo: boolean;
  playerNames: string[];
  enemyCount: number;
  onClick: () => void;
}

const LOCATION_NAMES: Record<string, string> = {
  loc_clocktower_square: 'Clocktower Square',
  loc_steam_market: 'Steam Market',
  loc_clockwork_garden: 'Clockwork Gardens',
  loc_hatters_workshop: "Hatter's Workshop",
  loc_mad_teahouse: 'Mad Tea House',
  loc_gear_undercity: 'Gear Undercity',
};

const LOCATION_SHROUD: Record<string, number> = {
  loc_clocktower_square: 2,
  loc_steam_market: 3,
  loc_clockwork_garden: 1,
  loc_hatters_workshop: 4,
  loc_mad_teahouse: 2,
  loc_gear_undercity: 5,
};

export function LocationCard({
  location,
  isPlayerHere,
  canMoveTo,
  playerNames,
  enemyCount,
  onClick,
}: LocationCardProps) {
  const name = LOCATION_NAMES[location.definitionId] || location.definitionId;
  const shroud = LOCATION_SHROUD[location.definitionId] || 0;

  return (
    <div
      className={`transition-all duration-200 cursor-pointer select-none w-[150px]
        ${canMoveTo ? 'glow-valid-target' : ''}
        ${isPlayerHere ? 'ring-2 ring-brass-400/70' : ''}
      `}
      onClick={onClick}
    >
      <div
        className={`rounded-lg border-2 p-2 text-center transition-all
          ${location.revealed
            ? 'bg-ink-800/90 border-brass-600/60 hover:border-brass-500'
            : 'bg-ink-900/80 border-ink-600/40'
          }
          ${canMoveTo ? 'hover:scale-105' : ''}
        `}
      >
        {/* Location name */}
        <div className={`font-display text-xs font-bold truncate ${
          location.revealed ? 'text-parchment-200' : 'text-ink-400'
        }`}>
          {location.revealed ? name : '???'}
        </div>

        {location.revealed && (
          <>
            {/* Shroud & Clues */}
            <div className="flex justify-between items-center mt-1 px-1">
              <div className="flex items-center gap-1" title="Shroud (investigation difficulty)">
                <span className="text-[10px] text-ink-400">S</span>
                <span className="text-xs font-mono font-bold text-parchment-400">{shroud}</span>
              </div>
              {location.clues > 0 && (
                <div className="flex items-center gap-0.5" title="Curiosities">
                  <span className="text-xs">✦</span>
                  <span className="text-xs font-mono font-bold text-brass-300">{location.clues}</span>
                </div>
              )}
              {location.doom > 0 && (
                <div className="flex items-center gap-0.5" title="Chaos">
                  <span className="text-xs text-red-400">☽</span>
                  <span className="text-xs font-mono font-bold text-red-400">{location.doom}</span>
                </div>
              )}
            </div>

            {/* Investigators here */}
            {playerNames.length > 0 && (
              <div className="flex flex-wrap gap-0.5 mt-1 justify-center">
                {playerNames.map((name, i) => (
                  <span
                    key={i}
                    className="text-[9px] px-1 py-0.5 rounded bg-brass-500/20 text-brass-300 border border-brass-600/30"
                    title={name}
                  >
                    {name.substring(0, 6)}
                  </span>
                ))}
              </div>
            )}

            {/* Enemies */}
            {enemyCount > 0 && (
              <div className="mt-1 flex justify-center">
                <span className="text-[9px] px-1 py-0.5 rounded bg-red-900/40 text-red-300 border border-red-700/30">
                  {enemyCount} {enemyCount === 1 ? 'enemy' : 'enemies'}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
