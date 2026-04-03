'use client';

import { useGameStore } from '@/stores/gameStore';
import { useGameActions } from '@/hooks/useGameActions';
import { LocationCard } from './LocationCard';

const CONNECTIONS: [string, string][] = [
  ['loc_clocktower_square', 'loc_steam_market'],
  ['loc_clocktower_square', 'loc_clockwork_garden'],
  ['loc_steam_market', 'loc_hatters_workshop'],
  ['loc_clockwork_garden', 'loc_mad_teahouse'],
  ['loc_hatters_workshop', 'loc_gear_undercity'],
  ['loc_mad_teahouse', 'loc_gear_undercity'],
];

// Percentage-based positions so the map scales with the container
const LAYOUT: Record<string, { x: number; y: number }> = {
  loc_clocktower_square: { x: 42, y: 35 },
  loc_steam_market:      { x: 72, y: 10 },
  loc_clockwork_garden:  { x: 12, y: 10 },
  loc_hatters_workshop:  { x: 72, y: 60 },
  loc_mad_teahouse:      { x: 12, y: 60 },
  loc_gear_undercity:    { x: 42, y: 80 },
};

const CARD_W = 150; // px width of a location card
const CARD_H = 80;  // approx height

export function LocationMap() {
  const { gameState } = useGameStore();
  const { move } = useGameActions();

  if (!gameState) return null;

  const locations = gameState.locations;
  const myPlayerId = gameState.myPlayerId;
  const isMyTurn = gameState.playerOrder[gameState.activePlayerIndex] === myPlayerId;
  const myPlayer = gameState.players[myPlayerId];
  const myActionsRemaining = myPlayer?.actionsRemaining || 0;

  let myLocationId: string | null = null;
  for (const [locId, loc] of Object.entries(locations)) {
    if (loc.investigators.includes(myPlayerId)) {
      myLocationId = locId;
      break;
    }
  }

  const canMoveTo = new Set<string>();
  if (isMyTurn && myLocationId && myActionsRemaining > 0 && gameState.phase === 'explorer') {
    for (const [a, b] of CONNECTIONS) {
      if (a === myLocationId) canMoveTo.add(b);
      if (b === myLocationId) canMoveTo.add(a);
    }
  }

  async function handleLocationClick(locId: string) {
    if (!canMoveTo.has(locId)) return;
    const result = await move(locId);
    if (!result.success) {
      console.error('Move failed:', result.error);
    }
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Connection lines via SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        {CONNECTIONS.map(([fromId, toId]) => {
          const from = LAYOUT[fromId];
          const to = LAYOUT[toId];
          if (!from || !to) return null;
          const fromLoc = locations[fromId];
          const toLoc = locations[toId];
          if (!fromLoc || !toLoc) return null;

          return (
            <line
              key={`${fromId}-${toId}`}
              x1={`${from.x + 6}%`}
              y1={`${from.y + 5}%`}
              x2={`${to.x + 6}%`}
              y2={`${to.y + 5}%`}
              stroke="rgb(163, 76, 22)"
              strokeWidth="2"
              strokeDasharray={(!fromLoc.revealed || !toLoc.revealed) ? '8 5' : 'none'}
              opacity={0.4}
            />
          );
        })}
      </svg>

      {/* Location cards */}
      {Object.entries(locations).map(([locId, loc]) => {
        const pos = LAYOUT[locId];
        if (!pos) return null;

        return (
          <div
            key={locId}
            className="absolute"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: loc.investigators.includes(myPlayerId) ? 10 : 1,
            }}
          >
            <LocationCard
              location={loc}
              isPlayerHere={loc.investigators.includes(myPlayerId)}
              canMoveTo={canMoveTo.has(locId)}
              playerNames={loc.investigators.map(pid => gameState.players[pid]?.playerName || '?')}
              enemyCount={loc.enemies.length}
              onClick={() => handleLocationClick(locId)}
            />
          </div>
        );
      })}
    </div>
  );
}
