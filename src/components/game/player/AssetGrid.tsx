'use client';

import { CardInstance } from '@/types/game';
import { GameCard } from '../cards/GameCard';

interface AssetGridProps {
  playArea: string[];
  slots: {
    hand: [string | null, string | null];
    arcane: [string | null, string | null];
    body: string | null;
    ally: string | null;
    accessory: string | null;
  };
  cardInstances: Record<string, CardInstance>;
}

export function AssetGrid({ playArea, slots, cardInstances }: AssetGridProps) {
  if (playArea.length === 0) return null;

  return (
    <div className="shrink-0">
      <div className="text-[10px] text-ink-500 font-display mb-1">Assets in Play</div>
      <div className="flex gap-2 flex-wrap">
        {playArea.map((cardId) => {
          const card = cardInstances[cardId];
          if (!card) return null;

          return (
            <GameCard
              key={cardId}
              card={card}
              size="play"
            />
          );
        })}
      </div>
    </div>
  );
}
