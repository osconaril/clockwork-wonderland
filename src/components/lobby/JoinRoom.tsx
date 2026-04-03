'use client';

import { useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useLobbyStore } from '@/stores/lobbyStore';

interface JoinRoomProps {
  onBack: () => void;
}

export function JoinRoom({ onBack }: JoinRoomProps) {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { joinRoom } = useSocket();
  const { error, setError } = useLobbyStore();

  async function handleJoin() {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!roomCode.trim() || roomCode.trim().length < 6) {
      setError('Please enter a valid room code');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await joinRoom(roomCode.trim().toUpperCase(), name.trim());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel-parchment w-full max-w-sm">
      <h2 className="text-2xl font-display text-brass-300 mb-6 text-center">
        Join a Game
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-parchment-400 text-sm mb-1 font-display">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your explorer name..."
            maxLength={20}
            className="w-full px-4 py-3 rounded-lg bg-ink-800 border border-brass-700/50
              text-parchment-200 placeholder-ink-500
              focus:outline-none focus:border-brass-500 focus:ring-1 focus:ring-brass-500/50
              transition-colors"
          />
        </div>

        <div>
          <label className="block text-parchment-400 text-sm mb-1 font-display">
            Room Code
          </label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            placeholder="ABCD12"
            maxLength={6}
            className="w-full px-4 py-3 rounded-lg bg-ink-800 border border-brass-700/50
              text-parchment-200 placeholder-ink-500 text-center text-2xl tracking-[0.5em] font-mono
              focus:outline-none focus:border-brass-500 focus:ring-1 focus:ring-brass-500/50
              transition-colors uppercase"
          />
        </div>

        {error && (
          <p className="text-copper-400 text-sm">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="btn-copper flex-1"
          >
            Back
          </button>
          <button
            onClick={handleJoin}
            disabled={loading || !name.trim() || roomCode.length < 6}
            className="btn-brass flex-1"
          >
            {loading ? 'Joining...' : 'Join Room'}
          </button>
        </div>
      </div>
    </div>
  );
}
