// ============================================================
// SOCKET HANDLERS - Wire Socket.io events to RoomManager
// ============================================================

import { Server as SocketServer, Socket } from 'socket.io';
import { RoomManager } from './RoomManager';

const roomManager = new RoomManager();

export function initializeSocketHandlers(io: SocketServer): void {
  io.on('connection', (socket: Socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    // --- Room: Create ---
    socket.on('room:create', (data: { playerName: string }, callback) => {
      try {
        const { roomId, playerId, state } = roomManager.createRoom(data.playerName, socket.id);
        socket.join(roomId);
        (socket as any).roomId = roomId;
        (socket as any).playerId = playerId;

        callback({ success: true, roomId, playerId });
        io.to(roomId).emit('room:state', state);
        console.log(`[Room] Created ${roomId} by ${data.playerName} (${playerId})`);
      } catch (err) {
        callback({ success: false, error: 'Failed to create room' });
      }
    });

    // --- Room: Join ---
    socket.on('room:join', (data: { roomId: string; playerName: string }, callback) => {
      try {
        const result = roomManager.joinRoom(data.roomId.toUpperCase(), data.playerName, socket.id);
        if ('error' in result) {
          callback({ success: false, error: result.error });
          return;
        }

        const { playerId, state } = result;
        socket.join(data.roomId.toUpperCase());
        (socket as any).roomId = data.roomId.toUpperCase();
        (socket as any).playerId = playerId;

        callback({ success: true, roomId: data.roomId.toUpperCase(), playerId });

        const player = state.players.find(p => p.playerId === playerId);
        if (player) {
          socket.to(data.roomId.toUpperCase()).emit('room:player_joined', player);
        }
        io.to(data.roomId.toUpperCase()).emit('room:state', state);
        console.log(`[Room] ${data.playerName} joined ${data.roomId.toUpperCase()}`);
      } catch (err) {
        callback({ success: false, error: 'Failed to join room' });
      }
    });

    // --- Room: Leave ---
    socket.on('room:leave', () => {
      const roomId = (socket as any).roomId;
      const playerId = (socket as any).playerId;
      if (!roomId || !playerId) return;

      const state = roomManager.leaveRoom(playerId, roomId);
      socket.leave(roomId);
      (socket as any).roomId = null;
      (socket as any).playerId = null;

      if (state) {
        io.to(roomId).emit('room:player_left', playerId);
        io.to(roomId).emit('room:state', state);
      }
    });

    // --- Room: Select Explorer ---
    socket.on('room:select_explorer', (data: { explorerId: string }) => {
      const roomId = (socket as any).roomId;
      const playerId = (socket as any).playerId;
      if (!roomId || !playerId) return;

      const state = roomManager.selectExplorer(roomId, playerId, data.explorerId);
      if (state) {
        io.to(roomId).emit('room:state', state);
      } else {
        socket.emit('room:error', { message: 'Explorer already taken by another player' });
      }
    });

    // --- Room: Set Scenario ---
    socket.on('room:set_scenario', (data: { scenarioId: string }) => {
      const roomId = (socket as any).roomId;
      const playerId = (socket as any).playerId;
      if (!roomId || !playerId) return;

      const state = roomManager.setScenario(roomId, playerId, data.scenarioId);
      if (state) io.to(roomId).emit('room:state', state);
    });

    // --- Room: Set Difficulty ---
    socket.on('room:set_difficulty', (data: { difficulty: any }) => {
      const roomId = (socket as any).roomId;
      const playerId = (socket as any).playerId;
      if (!roomId || !playerId) return;

      const state = roomManager.setDifficulty(roomId, playerId, data.difficulty);
      if (state) io.to(roomId).emit('room:state', state);
    });

    // --- Room: Start Game ---
    socket.on('room:start_game', () => {
      const roomId = (socket as any).roomId;
      const playerId = (socket as any).playerId;
      if (!roomId || !playerId) return;

      const { canStart, reason } = roomManager.canStartGame(roomId, playerId);
      if (!canStart) {
        socket.emit('room:error', { message: reason || 'Cannot start game' });
        return;
      }

      roomManager.setGameStarted(roomId);
      const roomState = roomManager.getRoom(roomId);
      if (!roomState) return;

      // TODO: Initialize GameEngine and emit game:started
      // For now, emit the room state change
      io.to(roomId).emit('room:state', roomState);
      console.log(`[Game] Starting game in room ${roomId}`);
    });

    // --- Game: Action ---
    socket.on('game:action', (data: { action: any }, callback) => {
      // TODO: Route to GameEngine
      callback({ success: false, error: 'Game engine not yet initialized' });
    });

    // --- Game: Reconnect ---
    socket.on('game:reconnect', (data: { roomId: string; playerId: string }, callback) => {
      const state = roomManager.handleReconnect(data.roomId, data.playerId, socket.id);
      if (state) {
        socket.join(data.roomId);
        (socket as any).roomId = data.roomId;
        (socket as any).playerId = data.playerId;

        callback({ success: true, roomState: state });
        io.to(data.roomId).emit('room:state', state);
      } else {
        callback({ success: false, error: 'Room not found or player not in room' });
      }
    });

    // --- Disconnect ---
    socket.on('disconnect', () => {
      console.log(`[Socket] Disconnected: ${socket.id}`);
      const result = roomManager.handleDisconnect(socket.id);
      if (result) {
        io.to(result.roomId).emit('room:state', result.state);
      }
    });
  });
}
