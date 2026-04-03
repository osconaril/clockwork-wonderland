'use client';

import { useGameStore } from '@/stores/gameStore';
import { useGameActions } from '@/hooks/useGameActions';

const btnAction = "px-3 py-1.5 rounded-lg font-display text-xs bg-ink-800/80 border border-brass-700/30 text-parchment-300 hover:bg-ink-700 hover:border-brass-600/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1.5";

export function ActionBar() {
  const { gameState } = useGameStore();
  const { investigate, draw, resource, endTurn, spendClues } = useGameActions();

  if (!gameState) return null;

  const isMyTurn = gameState.playerOrder[gameState.activePlayerIndex] === gameState.myPlayerId;
  const myPlayer = gameState.players[gameState.myPlayerId];
  const canAct = isMyTurn && gameState.phase === 'explorer' && (myPlayer?.actionsRemaining || 0) > 0;

  const actThreshold = gameState.act.perPlayer
    ? gameState.act.clueThresholdBase * gameState.playerOrder.length
    : gameState.act.clueThresholdBase;

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-t border-ink-800/50">
      <button onClick={() => investigate()} disabled={!canAct} className={btnAction} title="Investigate your location (Wit vs Shroud)">
        Investigate
      </button>
      <button onClick={() => draw()} disabled={!canAct} className={btnAction} title="Draw 1 card">
        Draw
      </button>
      <button onClick={() => resource()} disabled={!canAct} className={btnAction} title="Gain 1 Gear">
        Gear
      </button>

      <div className="border-l border-ink-700 h-6 mx-1" />

      {myPlayer && myPlayer.clues > 0 && (
        <button
          onClick={() => spendClues(myPlayer.clues)}
          className={`${btnAction} text-brass-300`}
          title={`Spend ${myPlayer.clues} Curiosities toward advancing the Act (need ${actThreshold})`}
        >
          Spend Clues ({myPlayer.clues})
        </button>
      )}

      <div className="ml-auto">
        <button
          onClick={() => endTurn()}
          disabled={!isMyTurn || gameState.phase !== 'explorer'}
          className="px-4 py-1.5 rounded-lg font-display text-sm bg-ink-800 border border-ink-600 text-parchment-400 hover:bg-ink-700 hover:border-ink-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          End Turn
        </button>
      </div>
    </div>
  );
}
