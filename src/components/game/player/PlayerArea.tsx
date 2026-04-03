'use client';

import { useGameStore } from '@/stores/gameStore';
import { ExplorerCard } from './ExplorerCard';
import { HandZone } from './HandZone';
import { ThreatArea } from './ThreatArea';
import { AssetGrid } from './AssetGrid';

export function PlayerArea() {
  const { gameState } = useGameStore();
  if (!gameState) return null;

  const myPlayer = gameState.players[gameState.myPlayerId];
  if (!myPlayer) return null;

  const hasAssets = myPlayer.playArea.length > 0;
  const hasEnemies = myPlayer.threatArea.length > 0;

  return (
    <div className="flex items-start gap-4 px-4 py-3 overflow-x-auto">
      {/* Explorer Card */}
      <div className="shrink-0">
        <ExplorerCard player={myPlayer} />
      </div>

      {/* Assets in play */}
      {hasAssets && (
        <div className="shrink-0 border-l border-ink-700/50 pl-4">
          <AssetGrid
            playArea={myPlayer.playArea}
            slots={myPlayer.slots}
            cardInstances={gameState.cardInstances}
          />
        </div>
      )}

      {/* Threat Area */}
      {hasEnemies && (
        <div className="shrink-0 border-l border-red-900/30 pl-4">
          <ThreatArea
            enemyIds={myPlayer.threatArea}
            enemies={gameState.enemies}
          />
        </div>
      )}

      {/* Hand */}
      <div className="flex-1 min-w-0 border-l border-ink-700/50 pl-4">
        <HandZone
          hand={myPlayer.hand}
          cardInstances={gameState.cardInstances}
          resources={myPlayer.resources}
        />
      </div>
    </div>
  );
}
