'use client';

import { useGameActions } from '@/hooks/useGameActions';
import { useGameStore } from '@/stores/gameStore';
import { EnemyState } from '@/types/game';

const ENEMY_NAMES: Record<string, string> = {
  enemy_clockwork_soldier: 'Clockwork Soldier',
  enemy_brass_spider: 'Brass Spider',
  enemy_gear_wraith: 'Gear Wraith',
  enemy_card_guard: 'Card Guard',
  enemy_mechanical_jabberwock: 'Mechanical Jabberwock',
  enemy_rogue_automaton: 'Rogue Automaton',
};

interface ThreatAreaProps {
  enemyIds: string[];
  enemies: Record<string, EnemyState>;
}

export function ThreatArea({ enemyIds, enemies }: ThreatAreaProps) {
  const { fight, evade } = useGameActions();
  const { gameState } = useGameStore();
  const isMyTurn = gameState?.playerOrder[gameState.activePlayerIndex] === gameState?.myPlayerId;

  return (
    <div className="shrink-0">
      <div className="text-[9px] text-red-400 mb-0.5">Threat Area</div>
      <div className="flex gap-1.5">
        {enemyIds.map((enemyId) => {
          const enemy = enemies[enemyId];
          if (!enemy) return null;

          const name = ENEMY_NAMES[enemy.definitionId] || enemy.definitionId;

          return (
            <div
              key={enemyId}
              className={`rounded-lg border-2 border-red-700/60 bg-red-950/50 p-1.5 min-w-[100px]
                ${enemy.exhausted ? 'opacity-50' : ''}`}
            >
              <div className="font-display text-[9px] text-red-300 font-bold">{name}</div>
              <div className="flex gap-2 mt-0.5 text-[8px]">
                <span className="text-red-400">HP: {enemy.damage}/3</span>
                {enemy.exhausted && <span className="text-ink-500 italic">exhausted</span>}
              </div>

              {isMyTurn && gameState?.phase === 'explorer' && !enemy.exhausted && (
                <div className="flex gap-1 mt-1">
                  <button
                    onClick={() => fight(enemyId)}
                    className="text-[8px] px-1.5 py-0.5 rounded bg-red-800/50 text-red-300 hover:bg-red-700/50 border border-red-700/30"
                  >
                    Fight
                  </button>
                  <button
                    onClick={() => evade(enemyId)}
                    className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-800/50 text-emerald-300 hover:bg-emerald-700/50 border border-emerald-700/30"
                  >
                    Evade
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
