'use client';

import { create } from 'zustand';
import { RoomState, RoomPlayer, Difficulty } from '@/types/game';

interface LobbyStore {
  // Connection state
  myPlayerId: string | null;
  myPlayerName: string | null;
  roomState: RoomState | null;
  isConnected: boolean;
  error: string | null;

  // Actions
  setMyPlayer: (playerId: string, playerName: string) => void;
  setRoomState: (state: RoomState) => void;
  setConnected: (connected: boolean) => void;
  setError: (error: string | null) => void;
  addPlayer: (player: RoomPlayer) => void;
  removePlayer: (playerId: string) => void;
  reset: () => void;
}

const initialState = {
  myPlayerId: null,
  myPlayerName: null,
  roomState: null,
  isConnected: false,
  error: null,
};

export const useLobbyStore = create<LobbyStore>((set) => ({
  ...initialState,

  setMyPlayer: (playerId, playerName) => set({ myPlayerId: playerId, myPlayerName: playerName }),

  setRoomState: (state) => set({ roomState: state, error: null }),

  setConnected: (connected) => set({ isConnected: connected }),

  setError: (error) => set({ error }),

  addPlayer: (player) =>
    set((s) => {
      if (!s.roomState) return s;
      return {
        roomState: {
          ...s.roomState,
          players: [...s.roomState.players, player],
        },
      };
    }),

  removePlayer: (playerId) =>
    set((s) => {
      if (!s.roomState) return s;
      return {
        roomState: {
          ...s.roomState,
          players: s.roomState.players.filter((p) => p.playerId !== playerId),
        },
      };
    }),

  reset: () => set(initialState),
}));
