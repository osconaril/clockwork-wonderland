// ============================================================
// SOCKET EVENT TYPES - Client <-> Server communication
// ============================================================

import { GameState, RoomState, RoomPlayer, Difficulty, GameLogEntry, SkillTestState, PendingDamageAssignment, PlayerState } from './game';
import { PlayerAction } from './actions';

// --- Client -> Server Events ---
export interface ClientToServerEvents {
  // Lobby
  'room:create': (data: { playerName: string }, callback: (response: RoomResponse) => void) => void;
  'room:join': (data: { roomId: string; playerName: string }, callback: (response: RoomResponse) => void) => void;
  'room:leave': () => void;
  'room:select_explorer': (data: { explorerId: string }) => void;
  'room:set_scenario': (data: { scenarioId: string }) => void;
  'room:set_difficulty': (data: { difficulty: Difficulty }) => void;
  'room:start_game': () => void;

  // In-Game Actions
  'game:action': (data: { action: PlayerAction }, callback: (response: ActionResponse) => void) => void;

  // Reconnection
  'game:reconnect': (data: { roomId: string; playerId: string }, callback: (response: ReconnectResponse) => void) => void;
}

// --- Server -> Client Events ---
export interface ServerToClientEvents {
  // Lobby updates
  'room:state': (state: RoomState) => void;
  'room:error': (error: { message: string }) => void;
  'room:player_joined': (player: RoomPlayer) => void;
  'room:player_left': (playerId: string) => void;

  // Game state sync
  'game:started': (state: ClientGameState) => void;
  'game:state_update': (patch: GameStatePatch) => void;
  'game:full_state': (state: ClientGameState) => void;

  // Phase transitions
  'game:phase_change': (data: { phase: string; round: number }) => void;
  'game:active_player': (data: { playerId: string; actionsRemaining: number }) => void;

  // Skill test events
  'game:skill_test_start': (data: SkillTestState) => void;
  'game:skill_test_update': (data: SkillTestState) => void;
  'game:skill_test_end': (data: { success: boolean; details: string }) => void;

  // Combat / damage
  'game:damage_assignment_required': (data: PendingDamageAssignment) => void;
  'game:enemy_attack': (data: { enemyId: string; playerId: string; damage: number; horror: number }) => void;

  // Encounter
  'game:encounter_draw': (data: { playerId: string; cardId: string; cardDefinitionId: string }) => void;

  // Hand management
  'game:hand_discard_required': (data: { playerId: string; mustDiscardCount: number }) => void;

  // Narrative / story
  'game:narrative': (data: { title: string; text: string; choices?: string[] }) => void;

  // Log
  'game:log': (entry: GameLogEntry) => void;

  // Game end
  'game:scenario_ended': (data: { resolution: string; xp: number }) => void;

  // Errors
  'game:error': (error: { message: string; code?: string }) => void;
}

// --- Response Types ---
export interface RoomResponse {
  success: boolean;
  roomId?: string;
  playerId?: string;
  error?: string;
}

export interface ActionResponse {
  success: boolean;
  error?: string;
}

export interface ReconnectResponse {
  success: boolean;
  gameState?: ClientGameState;
  roomState?: RoomState;
  error?: string;
}

// --- Client Game State (filtered for a specific player) ---
// Hides: other players' decks and hands, encounter deck order, chaos token order
export interface ClientGameState extends Omit<GameState, 'players' | 'encounterDeck' | 'chaosTokens'> {
  players: Record<string, ClientPlayerState>;
  encounterDeckSize: number;
  chaosTokenTypes: string[];  // What token types are in the hat (but not order)
  myPlayerId: string;
}

export interface ClientPlayerState extends Omit<PlayerState, 'deck' | 'hand'> {
  deckSize: number;
  hand: string[];             // Only populated for the viewing player; empty for others
  handSize: number;           // Always visible (count of cards)
}

// --- Game State Patch (incremental updates) ---
export interface GameStatePatch {
  type: 'patch';
  operations: PatchOperation[];
  timestamp: number;
}

export interface PatchOperation {
  op: 'add' | 'remove' | 'replace';
  path: string;               // JSON Pointer path
  value?: unknown;
}
