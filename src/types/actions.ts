// ============================================================
// PLAYER ACTIONS - All actions a player can take
// ============================================================

export type PlayerAction =
  | DrawAction
  | ResourceAction
  | PlayCardAction
  | MoveAction
  | InvestigateAction
  | FightAction
  | EvadeAction
  | EngageAction
  | ActivateAction
  | ResignAction
  | EndTurnAction
  | CommitCardAction
  | LockInCommitsAction
  | AssignDamageAction
  | DiscardFromHandAction
  | SpendCluesAction;

export interface DrawAction {
  type: 'draw';
}

export interface ResourceAction {
  type: 'resource';
}

export interface PlayCardAction {
  type: 'play_card';
  cardInstanceId: string;
  targetSlot?: string;        // Which slot to place it in (for assets)
  targetId?: string;          // Target for the card effect
}

export interface MoveAction {
  type: 'move';
  targetLocationId: string;
}

export interface InvestigateAction {
  type: 'investigate';
  locationId?: string;        // Defaults to current location
}

export interface FightAction {
  type: 'fight';
  enemyInstanceId: string;
  usingCardId?: string;       // Optional weapon/spell to use
}

export interface EvadeAction {
  type: 'evade';
  enemyInstanceId: string;
}

export interface EngageAction {
  type: 'engage';
  enemyInstanceId: string;
}

export interface ActivateAction {
  type: 'activate';
  cardInstanceId: string;
  abilityId: string;
  targetId?: string;
}

export interface ResignAction {
  type: 'resign';
}

export interface EndTurnAction {
  type: 'end_turn';
}

// --- Skill Test Actions ---

export interface CommitCardAction {
  type: 'commit_card';
  cardInstanceId: string;
  skillTestId?: string;       // For when helping another player's test
}

export interface LockInCommitsAction {
  type: 'lock_in_commits';
}

// --- Damage Assignment ---

export interface AssignDamageAction {
  type: 'assign_damage';
  assignments: DamageAssignment[];
}

export interface DamageAssignment {
  targetType: 'explorer' | 'asset';
  targetId: string;           // Player ID or card instance ID
  damage: number;
  horror: number;
}

// --- Hand Management ---

export interface DiscardFromHandAction {
  type: 'discard_from_hand';
  cardInstanceIds: string[];
}

// --- Clue Spending ---

export interface SpendCluesAction {
  type: 'spend_clues';
  amount: number;
}

// --- Action Validation Result ---
export interface ActionValidation {
  valid: boolean;
  reason?: string;
}
