// ============================================================
// CARD DEFINITIONS - Static card data (not runtime state)
// ============================================================

import { ExplorerClass, SkillType, SkillIcons, SlotType, EnemyKeyword, TreacheryKeyword } from './game';

// --- Base Card Definition ---
export interface BaseCardDefinition {
  id: string;
  name: string;
  type: CardType;
  class: ExplorerClass;
  traits: string[];           // Flavor traits: "Item", "Weapon", "Spell", "Clockwork", etc.
  flavorText?: string;
  artUrl?: string;
  level: number;              // 0-5, for deck building XP cost
  isUnique: boolean;          // Can only have 1 copy in play by title
}

export type CardType = 'asset' | 'event' | 'skill' | 'enemy' | 'treachery' | 'location' | 'agenda' | 'act';

// --- Player Card Definitions ---

export interface AssetDefinition extends BaseCardDefinition {
  type: 'asset';
  cost: number;               // Gears to play
  skillIcons: SkillIcons;
  slot?: SlotType;
  twoHanded?: boolean;        // Takes both hand slots
  vitality?: number;          // Health soak capacity
  clarity?: number;           // Sanity soak capacity
  abilities: CardAbility[];
  keywords: string[];
}

export interface EventDefinition extends BaseCardDefinition {
  type: 'event';
  cost: number;
  skillIcons: SkillIcons;
  abilities: CardAbility[];
  fast?: boolean;             // Doesn't cost an action
  keywords: string[];
}

export interface SkillDefinition extends BaseCardDefinition {
  type: 'skill';
  skillIcons: SkillIcons;     // What they contribute when committed
  abilities: CardAbility[];   // Effects on success/failure
}

// --- Encounter Card Definitions ---

export interface EnemyDefinition extends BaseCardDefinition {
  type: 'enemy';
  fightValue: number;         // Difficulty to hit
  healthBase: number;         // Damage to defeat
  healthPerPlayer?: boolean;  // Scales with player count
  evadeValue: number;         // Difficulty to evade
  damageValue: number;        // Physical damage dealt on attack
  horrorValue: number;        // Mental horror dealt on attack
  keywords: EnemyKeyword[];
  prey?: string;              // Prey targeting rule
  spawn?: string;             // Spawn instruction (location trait/id)
  victoryPoints?: number;     // XP if defeated
  revelation?: CardEffect;    // Effect when drawn from encounter deck
  abilities: CardAbility[];
}

export interface TreacheryDefinition extends BaseCardDefinition {
  type: 'treachery';
  keywords: TreacheryKeyword[];
  revelation: CardEffect;     // Effect when drawn
  attachTo?: 'investigator' | 'location' | 'enemy'; // If persistent
  abilities: CardAbility[];
}

// --- Scenario Card Definitions ---

export interface LocationDefinition extends BaseCardDefinition {
  type: 'location';
  shroud: number;             // Investigation difficulty
  cluesBase: number;          // Base clues placed when revealed
  cluesPerPlayer: boolean;    // Whether clues scale per player
  connections: string[];      // Connection symbol IDs
  revealedAbilities: CardAbility[];
  traits: string[];
}

export interface AgendaDefinition {
  id: string;
  name: string;
  index: number;              // Position in agenda deck (0-based)
  doomThreshold: number;
  perPlayer: boolean;
  frontText: string;          // Flavor/story text
  backText: string;           // What happens when it advances
  advanceEffect?: CardEffect;
}

export interface ActDefinition {
  id: string;
  name: string;
  index: number;
  clueThreshold: number;
  perPlayer: boolean;
  frontText: string;
  backText: string;
  advanceEffect?: CardEffect;
}

// --- Card Effects & Abilities ---

export type AbilityTiming = 'action' | 'fast' | 'reaction' | 'forced' | 'revelation' | 'passive';

export type EffectType =
  | 'deal_damage'
  | 'deal_horror'
  | 'heal_damage'
  | 'heal_horror'
  | 'gain_resources'
  | 'lose_resources'
  | 'draw_cards'
  | 'discard_cards'
  | 'gain_clue'
  | 'place_doom'
  | 'remove_doom'
  | 'move_investigator'
  | 'spawn_enemy'
  | 'engage_enemy'
  | 'exhaust_card'
  | 'ready_card'
  | 'add_modifier'
  | 'skill_test'
  | 'advance_act'
  | 'advance_agenda'
  | 'custom';

export interface CardEffect {
  type: EffectType;
  value?: number;
  target?: 'self' | 'other' | 'any' | 'all' | 'enemy' | 'location';
  skillTest?: {
    skill: SkillType;
    difficulty: number;
    onSuccess?: CardEffect;
    onFailure?: CardEffect;
  };
  custom?: string;            // For complex effects handled by game logic
}

export interface CardAbility {
  id: string;
  name?: string;
  timing: AbilityTiming;
  cost?: AbilityCost;
  effect: CardEffect;
  actionDesignator?: 'fight' | 'investigate' | 'evade'; // Bold action type
  usesPerRound?: number;
  description: string;        // Human-readable text
}

export interface AbilityCost {
  actions?: number;           // Number of actions (usually 1)
  exhaust?: boolean;          // Must exhaust this card
  resources?: number;         // Gears to spend
  damage?: number;            // Damage to self
  horror?: number;            // Horror to self
  discard?: boolean;          // Discard this card
  uses?: string;              // Counter to spend (e.g., "ammo", "charge")
  usesAmount?: number;        // How many to spend
}

// --- Explorer Definition ---
export interface ExplorerDefinition {
  id: string;
  name: string;
  subtitle: string;           // e.g., "The Clockwork Detective"
  class: ExplorerClass;
  skills: Record<SkillType, number>;
  vitality: number;           // Max health
  clarity: number;            // Max sanity
  elderSignAbility: CardEffect; // When Elder Sign token drawn
  ability: CardAbility;       // Unique investigator ability
  deckBuildingRules: DeckBuildingRules;
  signatureCards: string[];   // Card definition IDs that must be in deck
  weaknessCards: string[];    // Required weakness card IDs
  flavorText: string;
  artUrl?: string;
}

export interface DeckBuildingRules {
  allowedClasses: { class: ExplorerClass; maxLevel: number }[];
  deckSize: number;           // Usually 30
  specialRules?: string;      // Any extra rules text
}

// --- Scenario Definition ---
export interface ScenarioDefinition {
  id: string;
  name: string;
  description: string;
  difficulty: {
    easy: ChaosTokenSetup;
    standard: ChaosTokenSetup;
    hard: ChaosTokenSetup;
    expert: ChaosTokenSetup;
  };
  locations: LocationDefinition[];
  locationConnections: [string, string][]; // Pairs of location IDs
  agendas: AgendaDefinition[];
  acts: ActDefinition[];
  encounterSets: string[];    // Which encounter set IDs to include
  setupInstructions: string;
  resolutions: ScenarioResolution[];
  specialRules?: string;
  // Token effects for this scenario
  tokenEffects: Record<string, TokenEffect>;
}

export type ChaosTokenSetup = import('./game').ChaosTokenType[];

export interface TokenEffect {
  modifier: number | 'variable'; // Number or computed at runtime
  additionalEffect?: CardEffect;
  description: string;
}

export interface ScenarioResolution {
  id: string;
  title: string;
  text: string;
  xpBonus: number;
  xpPenalty: number;
  campaignLogEntries: string[];
}

// --- All card definitions union ---
export type PlayerCardDefinition = AssetDefinition | EventDefinition | SkillDefinition;
export type EncounterCardDefinition = EnemyDefinition | TreacheryDefinition;
export type AnyCardDefinition = PlayerCardDefinition | EncounterCardDefinition | LocationDefinition;
