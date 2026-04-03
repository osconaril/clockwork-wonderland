'use client';

import { useState } from 'react';
import { useSocket, useIsServerless } from '@/hooks/useSocket';
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
  const serverless = useIsServerless();
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

      {/* Serverless notice */}
      {serverless && view === 'home' && (
        <div className="panel-parchment max-w-md mb-8 text-center">
          <p className="text-brass-300 font-display text-sm mb-2">Preview Mode</p>
          <p className="text-parchment-400 text-xs leading-relaxed">
            This is a UI preview. The game server requires WebSockets which
            run locally. Clone the repo and run <code className="text-brass-400 bg-ink-800 px-1 rounded">node server.js</code> to play.
          </p>
          <a
            href="https://github.com/osconaril/clockwork-wonderland"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-xs text-brass-400 hover:text-brass-300 underline"
          >
            View on GitHub
          </a>
        </div>
      )}

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
