'use client';

import { useGameActions } from '@/hooks/useGameActions';
import { useGameStore } from '@/stores/gameStore';
import { CardInstance } from '@/types/game';
import { GameCard } from '../cards/GameCard';

interface HandZoneProps {
  hand: string[];
  cardInstances: Record<string, CardInstance>;
  resources: number;
}

export function HandZone({ hand, cardInstances, resources }: HandZoneProps) {
  const { playCard } = useGameActions();
  const { gameState } = useGameStore();
  const isMyTurn = gameState?.playerOrder[gameState.activePlayerIndex] === gameState?.myPlayerId;
  const canPlay = isMyTurn && gameState?.phase === 'explorer';

  async function handlePlayCard(cardId: string) {
    if (!canPlay) return;
    const result = await playCard(cardId);
    if (!result.success) {
      console.error('Play card failed:', result.error);
    }
  }

  if (hand.length === 0) {
    return (
      <div className="h-44 flex items-center justify-center text-ink-500 text-sm font-display">
        No cards in hand
      </div>
    );
  }

  // Calculate overlap: more cards = more overlap, but never less than 60px visible
  const cardWidth = 120;
  const minVisible = 65;
  const maxOverlap = cardWidth - minVisible;
  const overlap = hand.length > 1
    ? Math.min(maxOverlap, Math.max(0, (hand.length * cardWidth - 700) / (hand.length - 1)))
    : 0;

  return (
    <div className="flex flex-col">
      <div className="text-[10px] text-ink-500 font-display mb-1 px-1">
        Hand ({hand.length}/8) — <span className="text-parchment-400">Right-click a card to inspect</span>
      </div>
      <div className="flex items-end py-1 px-1" style={{ minHeight: '180px' }}>
        {hand.map((cardId, index) => {
          const card = cardInstances[cardId];
          if (!card) return null;

          return (
            <div
              key={cardId}
              className="shrink-0 transition-all duration-200 hover:-translate-y-3 hover:z-20"
              style={{
                marginLeft: index > 0 ? `-${overlap}px` : '0',
                zIndex: index,
              }}
            >
              <GameCard
                card={card}
                size="hand"
                interactive={canPlay}
                onClick={() => handlePlayCard(cardId)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
