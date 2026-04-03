'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useLobbyStore } from '@/stores/lobbyStore';
import { useGameStore } from '@/stores/gameStore';
import { ClientToServerEvents, ServerToClientEvents } from '@/types/socket';

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let globalSocket: TypedSocket | null = null;

export function getSocket(): TypedSocket | null {
  return globalSocket;
}

export function useSocket() {
  const socketRef = useRef<TypedSocket | null>(null);
  const { setConnected, setRoomState, setError, addPlayer, removePlayer } = useLobbyStore();
  const { setGameState, applyPatch, addLogEntry } = useGameStore();

  useEffect(() => {
    if (globalSocket?.connected) {
      socketRef.current = globalSocket;
      return;
    }

    const socket: TypedSocket = io({
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    globalSocket = socket;
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      console.log('[Socket] Connected:', socket.id);
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('[Socket] Disconnected');
    });

    // Lobby events
    socket.on('room:state', (state) => {
      setRoomState(state);
    });

    socket.on('room:error', (error) => {
      setError(error.message);
    });

    socket.on('room:player_joined', (player) => {
      addPlayer(player);
    });

    socket.on('room:player_left', (playerId) => {
      removePlayer(playerId);
    });

    // Game events
    socket.on('game:started', (state) => {
      setGameState(state);
    });

    socket.on('game:full_state', (state) => {
      setGameState(state);
    });

    socket.on('game:state_update', (patch) => {
      applyPatch(patch);
    });

    socket.on('game:log', (entry) => {
      addLogEntry(entry);
    });

    return () => {
      // Don't disconnect on unmount in dev (React strict mode double-mounts)
      // socket.disconnect();
    };
  }, []);

  const createRoom = useCallback((playerName: string): Promise<{ roomId: string; playerId: string }> => {
    return new Promise((resolve, reject) => {
      const socket = socketRef.current;
      if (!socket) return reject(new Error('Not connected'));

      socket.emit('room:create', { playerName }, (response) => {
        if (response.success && response.roomId && response.playerId) {
          useLobbyStore.getState().setMyPlayer(response.playerId, playerName);
          resolve({ roomId: response.roomId, playerId: response.playerId });
        } else {
          reject(new Error(response.error || 'Failed to create room'));
        }
      });
    });
  }, []);

  const joinRoom = useCallback((roomId: string, playerName: string): Promise<{ playerId: string }> => {
    return new Promise((resolve, reject) => {
      const socket = socketRef.current;
      if (!socket) return reject(new Error('Not connected'));

      socket.emit('room:join', { roomId, playerName }, (response) => {
        if (response.success && response.playerId) {
          useLobbyStore.getState().setMyPlayer(response.playerId, playerName);
          resolve({ playerId: response.playerId });
        } else {
          reject(new Error(response.error || 'Failed to join room'));
        }
      });
    });
  }, []);

  const selectExplorer = useCallback((explorerId: string) => {
    socketRef.current?.emit('room:select_explorer', { explorerId });
  }, []);

  const setDifficulty = useCallback((difficulty: 'easy' | 'standard' | 'hard' | 'expert') => {
    socketRef.current?.emit('room:set_difficulty', { difficulty });
  }, []);

  const startGame = useCallback(() => {
    socketRef.current?.emit('room:start_game');
  }, []);

  const leaveRoom = useCallback(() => {
    socketRef.current?.emit('room:leave');
    useLobbyStore.getState().reset();
  }, []);

  return {
    socket: socketRef.current,
    createRoom,
    joinRoom,
    selectExplorer,
    setDifficulty,
    startGame,
    leaveRoom,
  };
}
