'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';

const TYPE_COLORS: Record<string, string> = {
  action: 'text-parchment-300',
  phase: 'text-brass-400',
  skill_test: 'text-purple-300',
  enemy: 'text-red-300',
  narrative: 'text-brass-200 italic',
  system: 'text-ink-300',
};

export function GameLog() {
  const { gameState } = useGameStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [gameState?.log.length]);

  if (!gameState) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-1.5 text-[9px] text-ink-400 uppercase tracking-wider font-display border-b border-ink-800/50">
        Game Log
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5"
      >
        {gameState.log.slice(-50).map((entry) => (
          <div key={entry.id} className={`text-[9px] leading-relaxed ${TYPE_COLORS[entry.type] || 'text-ink-400'}`}>
            {entry.message}
          </div>
        ))}
      </div>
    </div>
  );
}
