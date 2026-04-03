'use client';

import { useGameStore } from '@/stores/gameStore';

const AGENDA_NAMES = ['The Gears Begin to Turn', 'The Clockwork Awakens'];
const ACT_NAMES = ['Following the Gears', 'The Heart of the Machine'];

export function AgendaActPanel() {
  const { gameState } = useGameStore();
  if (!gameState) return null;

  const { agenda, act } = gameState;
  const playerCount = gameState.playerOrder.length;

  const agendaThreshold = agenda.perPlayer ? agenda.thresholdBase * playerCount : agenda.thresholdBase;
  const actThreshold = act.perPlayer ? act.clueThresholdBase * playerCount : act.clueThresholdBase;

  // Calculate total clues held by all players
  const totalPlayerClues = gameState.playerOrder.reduce(
    (sum, pid) => sum + (gameState.players[pid]?.clues || 0), 0
  );

  return (
    <div className="p-3 space-y-3 border-b border-ink-800/50">
      {/* Agenda (Doom clock - enemy timer) */}
      <div className="rounded-lg border border-red-800/40 bg-red-950/20 p-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-red-400 uppercase tracking-wider font-display">Agenda</span>
          <span className="text-[8px] text-ink-400">{agenda.currentIndex + 1}/{agenda.totalAgendas}</span>
        </div>
        <div className="font-display text-xs text-red-300 mt-0.5 truncate">
          {AGENDA_NAMES[agenda.currentIndex] || 'Unknown'}
        </div>
        {/* Doom progress */}
        <div className="mt-1.5">
          <div className="flex justify-between text-[8px]">
            <span className="text-red-400">Chaos</span>
            <span className="text-red-300 font-mono">{agenda.doom}/{agendaThreshold}</span>
          </div>
          <div className="h-2 bg-ink-900 rounded-full overflow-hidden mt-0.5">
            <div
              className="h-full bg-gradient-to-r from-red-800 to-red-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, (agenda.doom / agendaThreshold) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Act (Clue clock - player timer) */}
      <div className="rounded-lg border border-brass-700/40 bg-brass-900/10 p-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-brass-400 uppercase tracking-wider font-display">Act</span>
          <span className="text-[8px] text-ink-400">{act.currentIndex + 1}/{act.totalActs}</span>
        </div>
        <div className="font-display text-xs text-brass-300 mt-0.5 truncate">
          {ACT_NAMES[act.currentIndex] || 'Unknown'}
        </div>
        {/* Clue progress */}
        <div className="mt-1.5">
          <div className="flex justify-between text-[8px]">
            <span className="text-brass-400">Curiosities</span>
            <span className="text-brass-300 font-mono">{totalPlayerClues}/{actThreshold}</span>
          </div>
          <div className="h-2 bg-ink-900 rounded-full overflow-hidden mt-0.5">
            <div
              className="h-full bg-gradient-to-r from-brass-700 to-brass-400 rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalPlayerClues / actThreshold) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Encounter deck info */}
      <div className="flex items-center gap-2 text-[9px] text-ink-400">
        <span>Encounter Deck: {gameState.encounterDeckSize}</span>
      </div>
    </div>
  );
}
