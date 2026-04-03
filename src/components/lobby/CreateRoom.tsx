'use client';

import { useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useLobbyStore } from '@/stores/lobbyStore';

interface CreateRoomProps {
  onBack: () => void;
}

export function CreateRoom({ onBack }: CreateRoomProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { createRoom } = useSocket();
  const { error, setError } = useLobbyStore();

  async function handleCreate() {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createRoom(name.trim());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel-parchment w-full max-w-sm">
      <h2 className="text-2xl font-display text-brass-300 mb-6 text-center">
        Create a New Game
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
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="Enter your explorer name..."
            maxLength={20}
            className="w-full px-4 py-3 rounded-lg bg-ink-800 border border-brass-700/50
              text-parchment-200 placeholder-ink-500
              focus:outline-none focus:border-brass-500 focus:ring-1 focus:ring-brass-500/50
              transition-colors"
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
            onClick={handleCreate}
            disabled={loading || !name.trim()}
            className="btn-brass flex-1"
          >
            {loading ? 'Creating...' : 'Create Room'}
          </button>
        </div>
      </div>
    </div>
  );
}
