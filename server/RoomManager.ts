// ============================================================
// ROOM MANAGER - Lobby and room lifecycle management
// ============================================================

import { RoomState, RoomPlayer, RoomStatus, Difficulty } from '../src/types/game';

interface RoomEntry {
  state: RoomState;
  socketMap: Map<string, string>; // playerId -> socketId
  disconnectTimers: Map<string, NodeJS.Timeout>; // playerId -> timeout
}

const RECONNECT_GRACE_PERIOD = 60_000; // 60 seconds

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I/O/0/1 for clarity
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generatePlayerId(): string {
  return 'player_' + Math.random().toString(36).substring(2, 10);
}

export class RoomManager {
  private rooms: Map<string, RoomEntry> = new Map();

  createRoom(playerName: string, socketId: string): { roomId: string; playerId: string; state: RoomState } {
    let roomId = generateRoomCode();
    while (this.rooms.has(roomId)) {
      roomId = generateRoomCode();
    }

    const playerId = generatePlayerId();
    const player: RoomPlayer = {
      playerId,
      playerName,
      selectedExplorerId: null,
      isHost: true,
      connected: true,
    };

    const state: RoomState = {
      roomId,
      status: 'waiting',
      players: [player],
      maxPlayers: 4,
      selectedScenarioId: 'clockwork_conspiracy',
      selectedDifficulty: 'standard',
      hostId: playerId,
    };

    const entry: RoomEntry = {
      state,
      socketMap: new Map([[playerId, socketId]]),
      disconnectTimers: new Map(),
    };

    this.rooms.set(roomId, entry);
    return { roomId, playerId, state };
  }

  joinRoom(roomId: string, playerName: string, socketId: string): { playerId: string; state: RoomState } | { error: string } {
    const entry = this.rooms.get(roomId);
    if (!entry) return { error: 'Room not found' };
    if (entry.state.status !== 'waiting') return { error: 'Game already in progress' };
    if (entry.state.players.length >= entry.state.maxPlayers) return { error: 'Room is full' };

    const playerId = generatePlayerId();
    const player: RoomPlayer = {
      playerId,
      playerName,
      selectedExplorerId: null,
      isHost: false,
      connected: true,
    };

    entry.state.players.push(player);
    entry.socketMap.set(playerId, socketId);

    return { playerId, state: entry.state };
  }

  leaveRoom(playerId: string, roomId: string): RoomState | null {
    const entry = this.rooms.get(roomId);
    if (!entry) return null;

    entry.state.players = entry.state.players.filter(p => p.playerId !== playerId);
    entry.socketMap.delete(playerId);

    // If no players left, delete the room
    if (entry.state.players.length === 0) {
      this.rooms.delete(roomId);
      return null;
    }

    // If host left, assign new host
    if (entry.state.hostId === playerId) {
      const newHost = entry.state.players[0];
      newHost.isHost = true;
      entry.state.hostId = newHost.playerId;
    }

    return entry.state;
  }

  selectExplorer(roomId: string, playerId: string, explorerId: string): RoomState | null {
    const entry = this.rooms.get(roomId);
    if (!entry) return null;

    // Check if another player already selected this explorer
    const alreadySelected = entry.state.players.some(
      p => p.playerId !== playerId && p.selectedExplorerId === explorerId
    );
    if (alreadySelected) return null;

    const player = entry.state.players.find(p => p.playerId === playerId);
    if (player) {
      player.selectedExplorerId = explorerId;
    }

    return entry.state;
  }

  setScenario(roomId: string, playerId: string, scenarioId: string): RoomState | null {
    const entry = this.rooms.get(roomId);
    if (!entry) return null;
    if (entry.state.hostId !== playerId) return null;

    entry.state.selectedScenarioId = scenarioId;
    return entry.state;
  }

  setDifficulty(roomId: string, playerId: string, difficulty: Difficulty): RoomState | null {
    const entry = this.rooms.get(roomId);
    if (!entry) return null;
    if (entry.state.hostId !== playerId) return null;

    entry.state.selectedDifficulty = difficulty;
    return entry.state;
  }

  canStartGame(roomId: string, playerId: string): { canStart: boolean; reason?: string } {
    const entry = this.rooms.get(roomId);
    if (!entry) return { canStart: false, reason: 'Room not found' };
    if (entry.state.hostId !== playerId) return { canStart: false, reason: 'Only the host can start the game' };
    if (entry.state.players.length < 1) return { canStart: false, reason: 'Need at least 1 player' };

    const allSelected = entry.state.players.every(p => p.selectedExplorerId !== null);
    if (!allSelected) return { canStart: false, reason: 'All players must select an explorer' };

    const uniqueExplorers = new Set(entry.state.players.map(p => p.selectedExplorerId));
    if (uniqueExplorers.size !== entry.state.players.length) {
      return { canStart: false, reason: 'Each player must select a different explorer' };
    }

    return { canStart: true };
  }

  setGameStarted(roomId: string): void {
    const entry = this.rooms.get(roomId);
    if (entry) {
      entry.state.status = 'in_game';
    }
  }

  handleDisconnect(socketId: string): { roomId: string; playerId: string; state: RoomState } | null {
    for (const [roomId, entry] of this.rooms) {
      for (const [playerId, sid] of entry.socketMap) {
        if (sid === socketId) {
          const player = entry.state.players.find(p => p.playerId === playerId);
          if (!player) continue;

          player.connected = false;

          // In waiting room, just remove after a short delay
          if (entry.state.status === 'waiting') {
            const timer = setTimeout(() => {
              this.leaveRoom(playerId, roomId);
            }, 10_000);
            entry.disconnectTimers.set(playerId, timer);
          } else {
            // In-game: grace period for reconnection
            const timer = setTimeout(() => {
              player.connected = false;
              // Don't remove from game, just mark as disconnected
            }, RECONNECT_GRACE_PERIOD);
            entry.disconnectTimers.set(playerId, timer);
          }

          return { roomId, playerId, state: entry.state };
        }
      }
    }
    return null;
  }

  handleReconnect(roomId: string, playerId: string, socketId: string): RoomState | null {
    const entry = this.rooms.get(roomId);
    if (!entry) return null;

    const player = entry.state.players.find(p => p.playerId === playerId);
    if (!player) return null;

    // Clear disconnect timer
    const timer = entry.disconnectTimers.get(playerId);
    if (timer) {
      clearTimeout(timer);
      entry.disconnectTimers.delete(playerId);
    }

    player.connected = true;
    entry.socketMap.set(playerId, socketId);

    return entry.state;
  }

  getRoom(roomId: string): RoomState | null {
    return this.rooms.get(roomId)?.state ?? null;
  }

  getSocketId(roomId: string, playerId: string): string | null {
    return this.rooms.get(roomId)?.socketMap.get(playerId) ?? null;
  }

  getPlayerRoom(socketId: string): { roomId: string; playerId: string } | null {
    for (const [roomId, entry] of this.rooms) {
      for (const [playerId, sid] of entry.socketMap) {
        if (sid === socketId) {
          return { roomId, playerId };
        }
      }
    }
    return null;
  }

  getRoomSocketIds(roomId: string): string[] {
    const entry = this.rooms.get(roomId);
    if (!entry) return [];
    return Array.from(entry.socketMap.values());
  }
}
