'use client';

import { useGameStore } from '@/stores/gameStore';

export function OtherPlayers() {
  const { gameState } = useGameStore();
  if (!gameState) return null;

  const otherPlayers = gameState.playerOrder
    .filter(pid => pid !== gameState.myPlayerId)
    .map(pid => gameState.players[pid])
    .filter(Boolean);

  if (otherPlayers.length === 0) {
    return (
      <div className="p-3 text-center text-ink-500 text-xs">
        Solo mode
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      <div className="text-xs font-display text-brass-500 uppercase tracking-wider">
        Other Explorers
      </div>
      {otherPlayers.map((player) => {
        const vRemaining = player.maxVitality - player.currentDamage;
        const cRemaining = player.maxClarity - player.currentHorror;

        return (
          <div
            key={player.playerId}
            className={`rounded-lg border p-2 ${
              player.isEliminated
                ? 'border-red-800/30 bg-red-950/20 opacity-50'
                : player.connected
                  ? 'border-ink-700 bg-ink-800/50'
                  : 'border-ink-800 bg-ink-900/50 opacity-60'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${player.connected ? 'bg-emerald-400' : 'bg-ink-500'}`} />
              <span className="font-display text-xs text-parchment-300 truncate">{player.playerName}</span>
            </div>

            <div className="grid grid-cols-2 gap-1 mt-1.5 text-[9px]">
              <div className="flex items-center gap-0.5">
                <span className="text-red-400">VIT</span>
                <span className={`font-mono ${vRemaining <= 2 ? 'text-red-300' : 'text-parchment-400'}`}>
                  {vRemaining}/{player.maxVitality}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <span className="text-blue-400">CLR</span>
                <span className={`font-mono ${cRemaining <= 2 ? 'text-blue-300' : 'text-parchment-400'}`}>
                  {cRemaining}/{player.maxClarity}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <span className="text-brass-400">⚙</span>
                <span className="font-mono text-parchment-400">{player.resources}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <span className="text-brass-300">✦</span>
                <span className="font-mono text-parchment-400">{player.clues}</span>
              </div>
            </div>

            <div className="flex justify-between mt-1 text-[8px] text-ink-400">
              <span>Hand: {player.handSize}</span>
              <span>Deck: {player.deckSize}</span>
            </div>

            {player.threatArea.length > 0 && (
              <div className="mt-1 text-[8px] text-red-400">
                {player.threatArea.length} engaged {player.threatArea.length === 1 ? 'enemy' : 'enemies'}
              </div>
            )}

            {player.isEliminated && (
              <div className="mt-1 text-[8px] text-red-400 font-bold">
                {player.hasResigned ? 'Resigned' : 'Defeated'}
              </div>
            )}
          </div>
        );
      })}

      {/* Victory Display */}
      {gameState.victoryDisplay.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-display text-brass-500 uppercase tracking-wider mb-1">
            Victory Display
          </div>
          <div className="text-xs text-brass-300">
            {gameState.victoryDisplay.length} card{gameState.victoryDisplay.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}
