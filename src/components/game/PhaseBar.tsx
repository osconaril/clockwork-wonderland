'use client';

import { useGameStore } from '@/stores/gameStore';

const PHASES = [
  { key: 'madness', label: 'Madness', icon: '🎭' },
  { key: 'explorer', label: 'Explorer', icon: '🔍' },
  { key: 'enemy', label: 'Enemy', icon: '⚔' },
  { key: 'upkeep', label: 'Upkeep', icon: '⚙' },
] as const;

export function PhaseBar() {
  const { gameState } = useGameStore();
  if (!gameState) return null;

  const activePlayer = gameState.players[gameState.playerOrder[gameState.activePlayerIndex]];
  const isMyTurn = gameState.playerOrder[gameState.activePlayerIndex] === gameState.myPlayerId;

  return (
    <header className="h-12 border-b border-brass-700/30 bg-ink-900/90 flex items-center px-4 gap-4 shrink-0">
      {/* Round counter */}
      <div className="flex items-center gap-2">
        <span className="text-brass-500 text-lg">⚙</span>
        <span className="font-display text-brass-300 text-sm">
          Round {gameState.round}
        </span>
      </div>

      {/* Phase indicators */}
      <div className="flex gap-1">
        {PHASES.map(({ key, label }) => {
          const isActive = gameState.phase === key;
          const isPast = PHASES.findIndex(p => p.key === gameState.phase) >
                         PHASES.findIndex(p => p.key === key);

          return (
            <div
              key={key}
              className={`px-3 py-1 rounded text-xs font-display capitalize border transition-all ${
                isActive
                  ? 'phase-active'
                  : isPast
                    ? 'phase-completed'
                    : 'phase-inactive'
              }`}
            >
              {label}
            </div>
          );
        })}
      </div>

      {/* Active player info */}
      <div className="ml-auto flex items-center gap-3">
        {gameState.phase === 'explorer' && activePlayer && (
          <>
            <span className={`text-sm font-display ${isMyTurn ? 'text-brass-300' : 'text-parchment-400'}`}>
              {isMyTurn ? 'Your Turn' : `${activePlayer.playerName}'s Turn`}
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full border ${
                    i < (activePlayer.actionsRemaining || 0)
                      ? 'bg-brass-400 border-brass-500'
                      : 'bg-ink-800 border-ink-600'
                  }`}
                />
              ))}
              <span className="text-xs text-ink-400 ml-1">actions</span>
            </div>
          </>
        )}

        {gameState.phase !== 'explorer' && (
          <span className="text-sm text-parchment-400 font-display capitalize animate-pulse">
            {gameState.phase} Phase...
          </span>
        )}
      </div>
    </header>
  );
}
