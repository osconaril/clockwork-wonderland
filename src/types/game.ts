// ============================================================
// CORE GAME STATE - Steampunk Wonderland Card Game
// Inspired by Arkham Horror: The Card Game
// ============================================================

// --- Enums & Constants ---

export type ExplorerClass = 'guardian' | 'seeker' | 'mystic' | 'rogue' | 'survivor' | 'neutral';

export type SkillType = 'resolve' | 'wit' | 'might' | 'grace';

export type GamePhase = 'setup' | 'madness' | 'explorer' | 'enemy' | 'upkeep' | 'scenario_end';

export type SlotType = 'hand' | 'arcane' | 'body' | 'ally' | 'accessory';

export type CardZone =
  | 'deck'
  | 'hand'
  | 'play_area'
  | 'discard'
  | 'threat_area'
  | 'committed'
  | 'victory_display'
  | 'out_of_game';

export type TokenType =
  | 'plus_one'
  | 'zero'
  | 'minus_one'
  | 'minus_two'
  | 'minus_three'
  | 'minus_four'
  | 'minus_five'
  | 'minus_six'
  | 'minus_seven'
  | 'minus_eight'
  | 'skull'
  | 'cultist'
  | 'tablet'
  | 'elder_thing'
  | 'elder_sign'
  | 'auto_fail';

// Thematic renames for tokens
export type ChaosTokenType = TokenType; // "Chaos tokens" drawn from "The Mad Hatter's Hat"

export type Difficulty = 'easy' | 'standard' | 'hard' | 'expert';

export type EnemyKeyword = 'hunter' | 'aloof' | 'massive' | 'retaliate' | 'alert';
export type TreacheryKeyword = 'surge' | 'peril' | 'hidden';

// --- Skill Icons (on cards, for committing to tests) ---
export interface SkillIcons {
  resolve?: number;
  wit?: number;
  might?: number;
  grace?: number;
  wild?: number;
}

// --- Card Instance (runtime, with unique ID) ---
export interface CardInstance {
  instanceId: string;         // Unique runtime ID (uuid)
  definitionId: string;       // Reference to static card definition
  ownerId: string;            // Player who owns this card
  zone: CardZone;
  exhausted: boolean;
  damage: number;             // Only for assets with vitality
  horror: number;             // Only for assets with clarity
  attachments: string[];      // IDs of attached cards
  counters: Record<string, number>; // Generic counters (e.g., ammo, charges)
  faceUp: boolean;
}

// --- Location State ---
export interface LocationState {
  definitionId: string;
  instanceId: string;
  revealed: boolean;
  clues: number;              // "Curiosities" on this location
  doom: number;               // Chaos tokens placed on location
  enemies: string[];          // Enemy instanceIds at this location
  investigators: string[];    // Player IDs at this location
  position: { x: number; y: number }; // For rendering on the map
}

// --- Enemy State ---
export interface EnemyState {
  instanceId: string;
  definitionId: string;
  damage: number;
  doom: number;
  exhausted: boolean;
  engagedWith: string | null; // Player ID or null if unengaged
  locationId: string;         // Which location this enemy is at
  keywords: EnemyKeyword[];
}

// --- Skill Test State (sub-state machine) ---
export type SkillTestStep =
  | 'awaiting_commits'   // ST.2 - players committing cards
  | 'revealing_token'    // ST.3 - about to draw from the hat
  | 'token_revealed'     // ST.4 - token drawn, resolving effects
  | 'calculating'        // ST.5 - computing modified skill value
  | 'determining_result' // ST.6 - success or failure
  | 'applying_result'    // ST.7 - applying consequences
  | 'complete';          // ST.8 - cleanup

export interface SkillTestState {
  testingPlayerId: string;
  skillType: SkillType;
  difficulty: number;
  baseSkillValue: number;
  committedCards: { cardInstanceId: string; playerId: string }[];
  revealedToken: ChaosTokenType | null;
  tokenModifier: number;
  bonusModifiers: number;    // From card effects etc.
  modifiedSkillValue: number;
  success: boolean | null;
  step: SkillTestStep;
  // Context for what triggered the test
  context: {
    type: 'investigate' | 'fight' | 'evade' | 'treachery' | 'card_ability';
    targetId?: string;       // Location ID, enemy ID, etc.
    sourceCardId?: string;   // Card that triggered the test
  };
  // Players who have confirmed their commits
  commitsLockedIn: string[];
}

// --- Agenda / Act State ---
export interface AgendaState {
  currentIndex: number;       // Which agenda card we're on (0-based)
  totalAgendas: number;
  doom: number;               // Doom on the agenda card itself
  thresholdBase: number;      // Doom threshold (before per-player scaling)
  perPlayer: boolean;         // Whether threshold scales per player
}

export interface ActState {
  currentIndex: number;
  totalActs: number;
  clueThresholdBase: number;
  perPlayer: boolean;
}

// --- Player State ---
export interface PlayerState {
  playerId: string;
  playerName: string;
  explorerId: string;         // Which explorer they're playing
  connected: boolean;
  disconnectedAt: number | null;

  // Stats (copied from explorer definition, may be modified by cards)
  skills: Record<SkillType, number>;
  maxVitality: number;        // Max health
  maxClarity: number;         // Max sanity
  currentDamage: number;      // Damage taken (vitality lost)
  currentHorror: number;      // Horror taken (clarity lost)

  // Economy
  resources: number;          // "Gears"
  clues: number;              // "Curiosities" collected

  // Card zones
  deck: string[];             // CardInstance IDs (hidden from other players)
  hand: string[];             // CardInstance IDs (hidden from other players)
  discard: string[];          // CardInstance IDs (visible)
  playArea: string[];         // CardInstance IDs of assets in play
  threatArea: string[];       // Enemy instanceIds engaged with this player

  // Slots tracking
  slots: {
    hand: [string | null, string | null];    // 2 hand slots
    arcane: [string | null, string | null];  // 2 arcane slots
    body: string | null;
    ally: string | null;
    accessory: string | null;
  };

  // Turn state
  actionsRemaining: number;
  hasResigned: boolean;
  isDefeated: boolean;
  isEliminated: boolean;

  // Campaign state
  physicalTrauma: number;
  mentalTrauma: number;
  experience: number;
}

// --- Game Log Entry ---
export interface GameLogEntry {
  id: string;
  timestamp: number;
  type: 'action' | 'phase' | 'skill_test' | 'enemy' | 'narrative' | 'system';
  message: string;
  playerId?: string;
  details?: Record<string, unknown>;
}

// --- Pending Damage Assignment ---
export interface PendingDamageAssignment {
  targetPlayerId: string;
  damage: number;
  horror: number;
  isDirect: boolean;          // Direct damage cannot be soaked by assets
  source: string;             // Description of what caused the damage
}

// --- The Full Game State ---
export interface GameState {
  roomId: string;
  scenarioId: string;
  difficulty: Difficulty;

  // Phase management
  phase: GamePhase;
  round: number;
  leadInvestigatorIndex: number; // Rotates each round
  activePlayerIndex: number;     // Whose turn it is during explorer phase
  turnOrder: string[];           // Player IDs in turn order

  // Players
  players: Record<string, PlayerState>;
  playerOrder: string[];         // Ordered player IDs

  // Card registry (all card instances in the game)
  cardInstances: Record<string, CardInstance>;

  // Board state
  locations: Record<string, LocationState>;
  locationOrder: string[];       // For consistent rendering

  // Enemies in play
  enemies: Record<string, EnemyState>;

  // Scenario progress
  agenda: AgendaState;
  act: ActState;

  // Encounter deck
  encounterDeck: string[];       // CardInstance IDs
  encounterDiscard: string[];

  // The Mad Hatter's Hat (chaos bag)
  chaosTokens: ChaosTokenType[];

  // Victory display
  victoryDisplay: string[];      // CardInstance IDs

  // Active skill test (null when no test in progress)
  skillTest: SkillTestState | null;

  // Pending interactions waiting for player input
  pendingDamageAssignment: PendingDamageAssignment | null;
  pendingHandDiscard: { playerId: string; mustDiscardCount: number } | null;

  // Game log
  log: GameLogEntry[];

  // Scenario resolution
  scenarioEnded: boolean;
  resolution: string | null;     // Resolution ID/text
  earnedExperience: number;
}

// --- Room State (pre-game lobby) ---
export type RoomStatus = 'waiting' | 'selecting' | 'in_game' | 'finished';

export interface RoomPlayer {
  playerId: string;
  playerName: string;
  selectedExplorerId: string | null;
  isHost: boolean;
  connected: boolean;
}

export interface RoomState {
  roomId: string;
  status: RoomStatus;
  players: RoomPlayer[];
  maxPlayers: number;
  selectedScenarioId: string;
  selectedDifficulty: Difficulty;
  hostId: string;
}
