'use client';

import { useGameStore } from '@/stores/gameStore';
import { PhaseBar } from './PhaseBar';
import { LocationMap } from './board/LocationMap';
import { AgendaActPanel } from './scenario/AgendaActPanel';
import { PlayerArea } from './player/PlayerArea';
import { ActionBar } from './player/ActionBar';
import { OtherPlayers } from './player/OtherPlayers';
import { GameLog } from './overlays/GameLog';
import { useUIStore } from '@/stores/uiStore';

export function GameBoard() {
  const { gameState } = useGameStore();
  const { showGameLog, toggleGameLog } = useUIStore();

  if (!gameState) return null;

  const myPlayer = gameState.players[gameState.myPlayerId];
  if (!myPlayer) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-ink-950">
      {/* Phase Bar */}
      <PhaseBar />

      {/* Main content: 3-column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar: Agenda/Act + Game Log */}
        <div className="w-56 border-r border-brass-700/20 flex flex-col bg-ink-900/40">
          <AgendaActPanel />
          <div className="flex-1 overflow-hidden">
            <GameLog />
          </div>
        </div>

        {/* Center: Location Map */}
        <div className="flex-1 relative overflow-hidden">
          <LocationMap />
        </div>

        {/* Right sidebar: Other Players */}
        <div className="w-56 border-l border-brass-700/20 bg-ink-900/40">
          <OtherPlayers />
        </div>
      </div>

      {/* Bottom: Player Area */}
      <div className="border-t border-brass-700/30 bg-ink-900/60">
        <PlayerArea />
        <ActionBar />
      </div>
    </div>
  );
}
