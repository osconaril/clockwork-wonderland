'use client';

import { useParams } from 'next/navigation';
import { useSocket } from '@/hooks/useSocket';
import { useGameStore } from '@/stores/gameStore';
import { GameBoard } from '@/components/game/GameBoard';

export default function GamePage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const { gameState, isLoaded } = useGameStore();

  useSocket();

  if (!isLoaded || !gameState) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-gear-spin inline-block">&#9881;</div>
          <p className="text-parchment-400 font-display">Loading game...</p>
          <p className="text-ink-500 text-sm mt-2">Room: {roomId}</p>
        </div>
      </main>
    );
  }

  return <GameBoard />;
}
