'use client';

import { create } from 'zustand';
import { ClientGameState, ClientPlayerState, GameStatePatch, PatchOperation } from '@/types/socket';
import { GamePhase, SkillTestState, PendingDamageAssignment, GameLogEntry } from '@/types/game';

interface GameStore {
  gameState: ClientGameState | null;
  isLoaded: boolean;

  // Setters
  setGameState: (state: ClientGameState) => void;
  applyPatch: (patch: GameStatePatch) => void;
  addLogEntry: (entry: GameLogEntry) => void;
  clearGame: () => void;

  // Selectors (computed)
  getMyPlayer: () => ClientPlayerState | null;
  getActivePlayer: () => ClientPlayerState | null;
  isMyTurn: () => boolean;
  getCurrentPhase: () => GamePhase | null;
}

function applyOperation(obj: any, op: PatchOperation): any {
  const parts = op.path.split('/').filter(Boolean);
  if (parts.length === 0) return op.value;

  const result = { ...obj };
  let current = result;

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (Array.isArray(current[key])) {
      current[key] = [...current[key]];
    } else if (typeof current[key] === 'object' && current[key] !== null) {
      current[key] = { ...current[key] };
    }
    current = current[key];
  }

  const lastKey = parts[parts.length - 1];

  switch (op.op) {
    case 'add':
    case 'replace':
      current[lastKey] = op.value;
      break;
    case 'remove':
      if (Array.isArray(current)) {
        current.splice(Number(lastKey), 1);
      } else {
        delete current[lastKey];
      }
      break;
  }

  return result;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  isLoaded: false,

  setGameState: (state) => set({ gameState: state, isLoaded: true }),

  applyPatch: (patch) =>
    set((s) => {
      if (!s.gameState) return s;
      let newState = s.gameState as any;
      for (const op of patch.operations) {
        newState = applyOperation(newState, op);
      }
      return { gameState: newState as ClientGameState };
    }),

  addLogEntry: (entry) =>
    set((s) => {
      if (!s.gameState) return s;
      return {
        gameState: {
          ...s.gameState,
          log: [...s.gameState.log, entry],
        },
      };
    }),

  clearGame: () => set({ gameState: null, isLoaded: false }),

  getMyPlayer: () => {
    const { gameState } = get();
    if (!gameState) return null;
    return gameState.players[gameState.myPlayerId] ?? null;
  },

  getActivePlayer: () => {
    const { gameState } = get();
    if (!gameState) return null;
    const activeId = gameState.playerOrder[gameState.activePlayerIndex];
    return gameState.players[activeId] ?? null;
  },

  isMyTurn: () => {
    const { gameState } = get();
    if (!gameState) return false;
    if (gameState.phase !== 'explorer') return false;
    const activeId = gameState.playerOrder[gameState.activePlayerIndex];
    return activeId === gameState.myPlayerId;
  },

  getCurrentPhase: () => {
    const { gameState } = get();
    return gameState?.phase ?? null;
  },
}));
