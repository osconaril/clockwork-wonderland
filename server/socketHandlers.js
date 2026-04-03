// ============================================================
// SOCKET HANDLERS - Wire Socket.io events to RoomManager
// (JavaScript version for direct Node.js require)
// ============================================================

const { v4: uuidv4 } = require('uuid');
const { GameEngine } = require('./GameEngine');
const { loadCardDefinitions } = require('./cardData');

// Active game engines per room
const gameEngines = new Map();

// --- Room Manager (inline to avoid TS compilation needs) ---

const RECONNECT_GRACE_PERIOD = 60000;

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generatePlayerId() {
  return 'player_' + Math.random().toString(36).substring(2, 10);
}

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(playerName, socketId) {
    let roomId = generateRoomCode();
    while (this.rooms.has(roomId)) {
      roomId = generateRoomCode();
    }

    const playerId = generatePlayerId();
    const player = {
      playerId,
      playerName,
      selectedExplorerId: null,
      isHost: true,
      connected: true,
    };

    const state = {
      roomId,
      status: 'waiting',
      players: [player],
      maxPlayers: 4,
      selectedScenarioId: 'clockwork_conspiracy',
      selectedDifficulty: 'standard',
      hostId: playerId,
    };

    this.rooms.set(roomId, {
      state,
      socketMap: new Map([[playerId, socketId]]),
      disconnectTimers: new Map(),
    });

    return { roomId, playerId, state };
  }

  joinRoom(roomId, playerName, socketId) {
    const entry = this.rooms.get(roomId);
    if (!entry) return { error: 'Room not found' };
    if (entry.state.status !== 'waiting') return { error: 'Game already in progress' };
    if (entry.state.players.length >= entry.state.maxPlayers) return { error: 'Room is full' };

    const playerId = generatePlayerId();
    const player = {
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

  leaveRoom(playerId, roomId) {
    const entry = this.rooms.get(roomId);
    if (!entry) return null;

    entry.state.players = entry.state.players.filter(p => p.playerId !== playerId);
    entry.socketMap.delete(playerId);

    if (entry.state.players.length === 0) {
      this.rooms.delete(roomId);
      return null;
    }

    if (entry.state.hostId === playerId) {
      const newHost = entry.state.players[0];
      newHost.isHost = true;
      entry.state.hostId = newHost.playerId;
    }

    return entry.state;
  }

  selectExplorer(roomId, playerId, explorerId) {
    const entry = this.rooms.get(roomId);
    if (!entry) return null;

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

  setDifficulty(roomId, playerId, difficulty) {
    const entry = this.rooms.get(roomId);
    if (!entry) return null;
    if (entry.state.hostId !== playerId) return null;
    entry.state.selectedDifficulty = difficulty;
    return entry.state;
  }

  canStartGame(roomId, playerId) {
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

  setGameStarted(roomId) {
    const entry = this.rooms.get(roomId);
    if (entry) {
      entry.state.status = 'in_game';
    }
  }

  getRoom(roomId) {
    const entry = this.rooms.get(roomId);
    return entry ? entry.state : null;
  }

  handleDisconnect(socketId) {
    for (const [roomId, entry] of this.rooms) {
      for (const [playerId, sid] of entry.socketMap) {
        if (sid === socketId) {
          const player = entry.state.players.find(p => p.playerId === playerId);
          if (!player) continue;

          player.connected = false;

          if (entry.state.status === 'waiting') {
            const timer = setTimeout(() => {
              this.leaveRoom(playerId, roomId);
            }, 10000);
            entry.disconnectTimers.set(playerId, timer);
          } else {
            const timer = setTimeout(() => {
              player.connected = false;
            }, RECONNECT_GRACE_PERIOD);
            entry.disconnectTimers.set(playerId, timer);
          }

          return { roomId, playerId, state: entry.state };
        }
      }
    }
    return null;
  }

  handleReconnect(roomId, playerId, socketId) {
    const entry = this.rooms.get(roomId);
    if (!entry) return null;

    const player = entry.state.players.find(p => p.playerId === playerId);
    if (!player) return null;

    const timer = entry.disconnectTimers.get(playerId);
    if (timer) {
      clearTimeout(timer);
      entry.disconnectTimers.delete(playerId);
    }

    player.connected = true;
    entry.socketMap.set(playerId, socketId);

    return entry.state;
  }

  getSocketId(roomId, playerId) {
    const entry = this.rooms.get(roomId);
    if (!entry) return null;
    return entry.socketMap.get(playerId) || null;
  }

  getPlayerRoom(socketId) {
    for (const [roomId, entry] of this.rooms) {
      for (const [playerId, sid] of entry.socketMap) {
        if (sid === socketId) {
          return { roomId, playerId };
        }
      }
    }
    return null;
  }
}

// --- Socket Handler Setup ---

const roomManager = new RoomManager();

function initializeSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    // Room: Create
    socket.on('room:create', (data, callback) => {
      try {
        const { roomId, playerId, state } = roomManager.createRoom(data.playerName, socket.id);
        socket.join(roomId);
        socket.roomId = roomId;
        socket.playerId = playerId;

        callback({ success: true, roomId, playerId });
        io.to(roomId).emit('room:state', state);
        console.log(`[Room] Created ${roomId} by ${data.playerName} (${playerId})`);
      } catch (err) {
        callback({ success: false, error: 'Failed to create room' });
      }
    });

    // Room: Join
    socket.on('room:join', (data, callback) => {
      try {
        const normalizedId = data.roomId.toUpperCase();
        const result = roomManager.joinRoom(normalizedId, data.playerName, socket.id);

        if (result.error) {
          callback({ success: false, error: result.error });
          return;
        }

        const { playerId, state } = result;
        socket.join(normalizedId);
        socket.roomId = normalizedId;
        socket.playerId = playerId;

        callback({ success: true, roomId: normalizedId, playerId });

        const player = state.players.find(p => p.playerId === playerId);
        if (player) {
          socket.to(normalizedId).emit('room:player_joined', player);
        }
        io.to(normalizedId).emit('room:state', state);
        console.log(`[Room] ${data.playerName} joined ${normalizedId}`);
      } catch (err) {
        callback({ success: false, error: 'Failed to join room' });
      }
    });

    // Room: Leave
    socket.on('room:leave', () => {
      const { roomId, playerId } = socket;
      if (!roomId || !playerId) return;

      const state = roomManager.leaveRoom(playerId, roomId);
      socket.leave(roomId);
      socket.roomId = null;
      socket.playerId = null;

      if (state) {
        io.to(roomId).emit('room:player_left', playerId);
        io.to(roomId).emit('room:state', state);
      }
    });

    // Room: Select Explorer
    socket.on('room:select_explorer', (data) => {
      const { roomId, playerId } = socket;
      if (!roomId || !playerId) return;

      const state = roomManager.selectExplorer(roomId, playerId, data.explorerId);
      if (state) {
        io.to(roomId).emit('room:state', state);
      } else {
        socket.emit('room:error', { message: 'Explorer already taken by another player' });
      }
    });

    // Room: Set Difficulty
    socket.on('room:set_difficulty', (data) => {
      const { roomId, playerId } = socket;
      if (!roomId || !playerId) return;

      const state = roomManager.setDifficulty(roomId, playerId, data.difficulty);
      if (state) io.to(roomId).emit('room:state', state);
    });

    // Room: Start Game
    socket.on('room:start_game', () => {
      const { roomId, playerId } = socket;
      if (!roomId || !playerId) return;

      const { canStart, reason } = roomManager.canStartGame(roomId, playerId);
      if (!canStart) {
        socket.emit('room:error', { message: reason || 'Cannot start game' });
        return;
      }

      roomManager.setGameStarted(roomId);
      const roomState = roomManager.getRoom(roomId);
      if (!roomState) return;

      // Initialize GameEngine
      try {
        const cardDefs = loadCardDefinitions();
        const engine = new GameEngine(roomState, cardDefs.scenario, cardDefs);
        engine.setIO(io);
        gameEngines.set(roomId, engine);

        // Send game state to each player
        for (const rp of roomState.players) {
          const clientState = engine.getClientState(rp.playerId);
          const playerSocketId = roomManager.getSocketId
            ? roomManager.getSocketId(roomId, rp.playerId)
            : null;

          // Emit to room with player-specific state
          io.to(roomId).emit('game:started', clientState);
        }

        io.to(roomId).emit('room:state', roomState);
        console.log(`[Game] Game started in room ${roomId} with ${roomState.players.length} players`);
      } catch (err) {
        console.error('[Game] Failed to initialize game:', err);
        socket.emit('room:error', { message: 'Failed to start game: ' + err.message });
      }
    });

    // Game: Action
    socket.on('game:action', (data, callback) => {
      const { roomId, playerId } = socket;
      if (!roomId || !playerId) {
        callback({ success: false, error: 'Not in a game' });
        return;
      }

      const engine = gameEngines.get(roomId);
      if (!engine) {
        callback({ success: false, error: 'Game not found' });
        return;
      }

      const result = engine.processAction(playerId, data.action);
      callback(result);
      // broadcastState() is called inside processAction already — don't double-emit
    });

    // Game: Reconnect
    socket.on('game:reconnect', (data, callback) => {
      const state = roomManager.handleReconnect(data.roomId, data.playerId, socket.id);
      if (state) {
        socket.join(data.roomId);
        socket.roomId = data.roomId;
        socket.playerId = data.playerId;
        callback({ success: true, roomState: state });
        io.to(data.roomId).emit('room:state', state);
      } else {
        callback({ success: false, error: 'Room not found or player not in room' });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`[Socket] Disconnected: ${socket.id}`);
      const result = roomManager.handleDisconnect(socket.id);
      if (result) {
        io.to(result.roomId).emit('room:state', result.state);
      }
    });
  });
}

module.exports = { initializeSocketHandlers };
