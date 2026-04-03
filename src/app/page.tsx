'use client';

import { useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useLobbyStore } from '@/stores/lobbyStore';
import { useGameStore } from '@/stores/gameStore';
import { CreateRoom } from '@/components/lobby/CreateRoom';
import { JoinRoom } from '@/components/lobby/JoinRoom';
import { WaitingRoom } from '@/components/lobby/WaitingRoom';
import { GameBoard } from '@/components/game/GameBoard';

type LobbyView = 'home' | 'create' | 'join';

export default function HomePage() {
  const [view, setView] = useState<LobbyView>('home');
  const { roomState, myPlayerId } = useLobbyStore();
  const { gameState, isLoaded } = useGameStore();
  useSocket();

  // If game is started, show the game board
  if (isLoaded && gameState) {
    return <GameBoard />;
  }

  // If we're in a room, show the waiting room
  if (roomState && myPlayerId) {
    return <WaitingRoom />;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-display font-bold text-brass-300 mb-2 tracking-wide">
          Clockwork Wonderland
        </h1>
        <div className="gear-divider">
          <span className="text-brass-500 text-2xl">&#9881;</span>
        </div>
        <p className="text-parchment-400 text-lg font-display italic">
          A Cooperative Game of Mystery &amp; Madness
        </p>
      </div>

      {/* Main menu */}
      {view === 'home' && (
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            className="btn-brass text-lg"
            onClick={() => setView('create')}
          >
            Create Game
          </button>
          <button
            className="btn-copper text-lg text-center"
            onClick={() => setView('join')}
          >
            Join Game
          </button>
        </div>
      )}

      {view === 'create' && (
        <CreateRoom onBack={() => setView('home')} />
      )}

      {view === 'join' && (
        <JoinRoom onBack={() => setView('home')} />
      )}

      {/* Footer flavor */}
      <div className="mt-16 text-ink-500 text-sm text-center font-display">
        <p>&ldquo;Down the rabbit hole and through the gears...&rdquo;</p>
        <p className="mt-1">2-4 Explorers | Cooperative</p>
      </div>
    </main>
  );
}
