import { AssetDefinition, EventDefinition, SkillDefinition } from '@/types/cards';

// ============================================================
// GUARDIAN CARDS (Blue - Combat/Protection)
// ============================================================
export const GUARDIAN_ASSETS: AssetDefinition[] = [
  {
    id: 'asset_steam_pistol',
    name: 'Steam Pistol',
    type: 'asset',
    class: 'guardian',
    traits: ['Item', 'Weapon', 'Firearm'],
    cost: 3,
    skillIcons: { might: 1 },
    slot: 'hand',
    abilities: [{
      id: 'steam_pistol_fight',
      timing: 'action',
      cost: { actions: 1, uses: 'ammo', usesAmount: 1 },
      actionDesignator: 'fight',
      description: 'Fight. You get +1 Might and deal +1 damage for this attack. Uses (4 ammo).',
      effect: { type: 'deal_damage', value: 2 },
    }],
    keywords: [],
    isUnique: false,
    level: 0,
  },
  {
    id: 'asset_brass_shield',
    name: 'Brass Shield',
    type: 'asset',
    class: 'guardian',
    traits: ['Item', 'Armor'],
    cost: 2,
    skillIcons: { might: 1 },
    slot: 'hand',
    vitality: 3,
    abilities: [],
    keywords: [],
    isUnique: false,
    level: 0,
  },
  {
    id: 'asset_clockwork_companion',
    name: 'Clockwork Companion',
    type: 'asset',
    class: 'guardian',
    traits: ['Ally', 'Automaton'],
    cost: 4,
    skillIcons: { might: 1, resolve: 1 },
    slot: 'ally',
    vitality: 3,
    clarity: 1,
    abilities: [{
      id: 'companion_ability',
      timing: 'reaction',
      description: 'After you defeat an enemy: Heal 1 damage from Clockwork Companion.',
      effect: { type: 'heal_damage', value: 1, target: 'self' },
    }],
    keywords: [],
    isUnique: false,
    level: 0,
  },
  {
    id: 'asset_reinforced_coat',
    name: 'Reinforced Coat',
    type: 'asset',
    class: 'guardian',
    traits: ['Item', 'Armor'],
    cost: 1,
    skillIcons: { resolve: 1 },
    slot: 'body',
    vitality: 2,
    clarity: 1,
    abilities: [],
    keywords: [],
    isUnique: false,
    level: 0,
  },
];

export const GUARDIAN_EVENTS: EventDefinition[] = [
  {
    id: 'event_defensive_stance',
    name: 'Defensive Stance',
    type: 'event',
    class: 'guardian',
    traits: ['Tactic'],
    cost: 1,
    skillIcons: { might: 1, grace: 1 },
    abilities: [{
      id: 'defensive_stance_effect',
      timing: 'fast',
      description: 'Fast. You get +2 Might until end of phase.',
      effect: { type: 'add_modifier', value: 2 },
    }],
    fast: true,
    keywords: [],
    isUnique: false,
    level: 0,
  },
  {
    id: 'event_emergency_repair',
    name: 'Emergency Repair',
    type: 'event',
    class: 'guardian',
    traits: ['Repair'],
    cost: 1,
    skillIcons: { resolve: 1 },
    abilities: [{
      id: 'repair_effect',
      timing: 'action',
      description: 'Heal 2 damage from an asset you control.',
      effect: { type: 'heal_damage', value: 2 },
    }],
    keywords: [],
    isUnique: false,
    level: 0,
  },
];

// ============================================================
// SEEKER CARDS (Amber - Investigation/Knowledge)
// ============================================================
export const SEEKER_ASSETS: AssetDefinition[] = [
  {
    id: 'asset_magnifying_monocle',
    name: 'Magnifying Monocle',
    type: 'asset',
    class: 'seeker',
    traits: ['Item', 'Tool'],
    cost: 1,
    skillIcons: { wit: 1 },
    slot: 'accessory',
    abilities: [{
      id: 'monocle_ability',
      timing: 'passive',
      description: 'You get +1 Wit while investigating.',
      effect: { type: 'add_modifier', value: 1 },
    }],
    keywords: [],
    isUnique: false,
    level: 0,
  },
  {
    id: 'asset_research_journal',
    name: 'Research Journal',
    type: 'asset',
    class: 'seeker',
    traits: ['Item', 'Tome'],
    cost: 2,
    skillIcons: { wit: 1, wild: 1 },
    slot: 'hand',
    abilities: [{
      id: 'journal_ability',
      timing: 'action',
      cost: { actions: 1, exhaust: true },
      description: 'Exhaust: Draw 2 cards, then discard 1 card from your hand.',
      effect: { type: 'draw_cards', value: 2 },
    }],
    keywords: [],
    isUnique: false,
    level: 0,
  },
  {
    id: 'asset_analytical_engine',
    name: 'Analytical Engine',
    type: 'asset',
    class: 'seeker',
    traits: ['Item', 'Clockwork'],
    cost: 3,
    skillIcons: { wit: 2 },
    slot: 'arcane',
    abilities: [{
      id: 'engine_ability',
      timing: 'action',
      cost: { actions: 1, exhaust: true },
      actionDesignator: 'investigate',
      description: 'Investigate. You get +2 Wit for this investigation.',
      effect: { type: 'gain_clue', value: 1 },
    }],
    keywords: [],
    isUnique: false,
    level: 0,
  },
];

export const SEEKER_EVENTS: EventDefinition[] = [
  {
    id: 'event_eureka',
    name: 'Eureka!',
    type: 'event',
    class: 'seeker',
    traits: ['Insight'],
    cost: 0,
    skillIcons: { wit: 1, wild: 1 },
    abilities: [{
      id: 'eureka_effect',
      timing: 'fast',
      description: 'Fast. After you succeed at an investigation: Draw 1 card.',
      effect: { type: 'draw_cards', value: 1 },
    }],
    fast: true,
    keywords: [],
    isUnique: false,
    level: 0,
  },
  {
    id: 'event_working_hypothesis',
    name: 'Working Hypothesis',
    type: 'event',
    class: 'seeker',
    traits: ['Insight'],
    cost: 2,
    skillIcons: { wit: 2 },
    abilities: [{
      id: 'hypothesis_effect',
      timing: 'action',
      description: 'Discover 1 Curiosity at your location (without a skill test).',
      effect: { type: 'gain_clue', value: 1 },
    }],
    keywords: [],
    isUnique: false,
    level: 0,
  },
];

// ============================================================
// MYSTIC CARDS (Purple - Willpower/Spells)
// ============================================================
export const MYSTIC_ASSETS: AssetDefinition[] = [
  {
    id: 'asset_enchanted_pocket_watch',
    name: 'Enchanted Pocket Watch',
    type: 'asset',
    class: 'mystic',
    traits: ['Spell', 'Clockwork'],
    cost: 3,
    skillIcons: { resolve: 1 },
    slot: 'arcane',
    abilities: [{
      id: 'watch_ability',
      timing: 'action',
      cost: { actions: 1, exhaust: true, uses: 'charge', usesAmount: 1 },
      actionDesignator: 'investigate',
      description: 'Investigate using Resolve instead of Wit. Uses (3 charges).',
      effect: { type: 'gain_clue', value: 1 },
    }],
    keywords: [],
    isUnique: false,
    level: 0,
  },
  {
    id: 'asset_mirror_ward',
    name: 'Mirror Ward',
    type: 'asset',
    class: 'mystic',
    traits: ['Spell'],
    cost: 2,
    skillIcons: { resolve: 1, grace: 1 },
    slot: 'arcane',
    abilities: [{
      id: 'ward_ability',
      timing: 'reaction',
      cost: { exhaust: true },
      description: 'When you would take horror: Cancel 1 horror.',
      effect: { type: 'heal_horror', value: 1 },
    }],
    keywords: [],
    isUnique: false,
    level: 0,
  },
  {
    id: 'asset_cheshire_familiar',
    name: 'Cheshire Familiar',
    type: 'asset',
    class: 'mystic',
    traits: ['Ally', 'Creature'],
    cost: 3,
    skillIcons: { resolve: 1, wild: 1 },
    slot: 'ally',
    clarity: 3,
    abilities: [{
      id: 'familiar_ability',
      timing: 'fast',
      cost: { exhaust: true },
      description: 'Exhaust: Look at the top card of the encounter deck.',
      effect: { type: 'custom', custom: 'peek_encounter' },
    }],
    keywords: [],
    isUnique: false,
    level: 0,
  },
];

export const MYSTIC_EVENTS: EventDefinition[] = [
  {
    id: 'event_temporal_shift',
    name: 'Temporal Shift',
    type: 'event',
    class: 'mystic',
    traits: ['Spell'],
    cost: 1,
    skillIcons: { resolve: 2 },
    abilities: [{
      id: 'shift_effect',
      timing: 'fast',
      description: 'Fast. Remove 1 Chaos from a card in play.',
      effect: { type: 'remove_doom', value: 1 },
    }],
    fast: true,
    keywords: [],
    isUnique: false,
    level: 0,
  },
];

// ============================================================
// ROGUE CARDS (Emerald - Evasion/Resources)
// ============================================================
export const ROGUE_ASSETS: AssetDefinition[] = [
  {
    id: 'asset_spring_blade',
    name: 'Spring-Loaded Blade',
    type: 'asset',
    class: 'rogue',
    traits: ['Item', 'Weapon', 'Melee'],
    cost: 2,
    skillIcons: { grace: 1, might: 1 },
    slot: 'hand',
    abilities: [{
      id: 'blade_ability',
      timing: 'action',
      cost: { actions: 1 },
      actionDesignator: 'fight',
      description: 'Fight. You get +1 Might. If you succeed by 2 or more, deal +1 damage.',
      effect: { type: 'deal_damage', value: 1 },
    }],
    keywords: [],
    isUnique: false,
    level: 0,
  },
  {
    id: 'asset_smoke_bomb',
    name: 'Smoke Bomb',
    type: 'asset',
    class: 'rogue',
    traits: ['Item', 'Gadget'],
    cost: 1,
    skillIcons: { grace: 2 },
    abilities: [{
      id: 'smoke_ability',
      timing: 'fast',
      cost: { discard: true },
      description: 'Disengage from each enemy engaged with you. Those enemies cannot engage you until end of round.',
      effect: { type: 'custom', custom: 'mass_disengage' },
    }],
    keywords: [],
    isUnique: false,
    level: 0,
  },
  {
    id: 'asset_thieves_toolkit',
    name: "Thief's Toolkit",
    type: 'asset',
    class: 'rogue',
    traits: ['Item', 'Tool', 'Illicit'],
    cost: 3,
    skillIcons: { grace: 1, wit: 1 },
    slot: 'hand',
    abilities: [{
      id: 'toolkit_ability',
      timing: 'action',
      cost: { actions: 1, exhaust: true },
      actionDesignator: 'investigate',
      description: 'Investigate using Grace instead of Wit. If you succeed, gain 1 Gear.',
      effect: { type: 'gain_clue', value: 1 },
    }],
    keywords: [],
    isUnique: false,
    level: 0,
  },
];

export const ROGUE_EVENTS: EventDefinition[] = [
  {
    id: 'event_quick_thinking',
    name: 'Quick Thinking',
    type: 'event',
    class: 'rogue',
    traits: ['Trick'],
    cost: 0,
    skillIcons: { grace: 1, wild: 1 },
    abilities: [{
      id: 'quick_effect',
      timing: 'fast',
      description: 'Fast. After you evade an enemy: Gain 1 action this turn.',
      effect: { type: 'custom', custom: 'gain_action' },
    }],
    fast: true,
    keywords: [],
    isUnique: false,
    level: 0,
  },
];

// ============================================================
// SURVIVOR CARDS (Red - Resilience/Luck)
// ============================================================
export const SURVIVOR_ASSETS: AssetDefinition[] = [
  {
    id: 'asset_leather_satchel',
    name: 'Leather Satchel',
    type: 'asset',
    class: 'survivor',
    traits: ['Item'],
    cost: 1,
    skillIcons: { resolve: 1 },
    slot: 'body',
    vitality: 2,
    clarity: 2,
    abilities: [],
    keywords: [],
    isUnique: false,
    level: 0,
  },
  {
    id: 'asset_lucky_coin',
    name: 'Lucky Coin',
    type: 'asset',
    class: 'survivor',
    traits: ['Item', 'Charm'],
    cost: 1,
    skillIcons: { wild: 1 },
    slot: 'accessory',
    abilities: [{
      id: 'coin_ability',
      timing: 'reaction',
      cost: { exhaust: true },
      description: 'After you reveal a chaos token: Get +1 to your skill value for this test.',
      effect: { type: 'add_modifier', value: 1 },
    }],
    keywords: [],
    isUnique: false,
    level: 0,
  },
];

export const SURVIVOR_EVENTS: EventDefinition[] = [
  {
    id: 'event_lucky_break',
    name: 'Lucky Break',
    type: 'event',
    class: 'survivor',
    traits: ['Fortune'],
    cost: 1,
    skillIcons: { wild: 2 },
    abilities: [{
      id: 'lucky_effect',
      timing: 'fast',
      description: 'Fast. After you fail a skill test: Get +2 to your skill value for this test. (This may change the result to a success.)',
      effect: { type: 'add_modifier', value: 2 },
    }],
    fast: true,
    keywords: [],
    isUnique: false,
    level: 0,
  },
  {
    id: 'event_scrounge',
    name: 'Scrounge',
    type: 'event',
    class: 'survivor',
    traits: ['Fortune'],
    cost: 0,
    skillIcons: { resolve: 1, wit: 1 },
    abilities: [{
      id: 'scrounge_effect',
      timing: 'action',
      description: 'Choose a level 0 card in your discard pile and add it to your hand.',
      effect: { type: 'custom', custom: 'recover_from_discard' },
    }],
    keywords: [],
    isUnique: false,
    level: 0,
  },
];

// ============================================================
// NEUTRAL CARDS
// ============================================================
export const NEUTRAL_ASSETS: AssetDefinition[] = [
  {
    id: 'asset_pocket_watch',
    name: 'Pocket Watch',
    type: 'asset',
    class: 'neutral',
    traits: ['Item', 'Clockwork'],
    cost: 1,
    skillIcons: { wild: 1 },
    slot: 'accessory',
    abilities: [{
      id: 'watch_ability',
      timing: 'action',
      cost: { actions: 1, exhaust: true, discard: true },
      description: 'Exhaust and discard: Gain 2 actions this turn.',
      effect: { type: 'custom', custom: 'gain_2_actions' },
    }],
    keywords: [],
    isUnique: false,
    level: 0,
  },
];

export const NEUTRAL_SKILLS: SkillDefinition[] = [
  {
    id: 'skill_determination',
    name: 'Determination',
    type: 'skill',
    class: 'neutral',
    traits: ['Innate'],
    skillIcons: { resolve: 1, wild: 1 },
    abilities: [],
    isUnique: false,
    level: 0,
  },
  {
    id: 'skill_sharp_mind',
    name: 'Sharp Mind',
    type: 'skill',
    class: 'neutral',
    traits: ['Innate'],
    skillIcons: { wit: 1, wild: 1 },
    abilities: [],
    isUnique: false,
    level: 0,
  },
  {
    id: 'skill_brute_force',
    name: 'Brute Force',
    type: 'skill',
    class: 'neutral',
    traits: ['Innate'],
    skillIcons: { might: 1, wild: 1 },
    abilities: [],
    isUnique: false,
    level: 0,
  },
  {
    id: 'skill_quick_reflexes',
    name: 'Quick Reflexes',
    type: 'skill',
    class: 'neutral',
    traits: ['Innate'],
    skillIcons: { grace: 1, wild: 1 },
    abilities: [],
    isUnique: false,
    level: 0,
  },
  {
    id: 'skill_unexpected_courage',
    name: 'Unexpected Courage',
    type: 'skill',
    class: 'neutral',
    traits: ['Innate'],
    skillIcons: { wild: 2 },
    abilities: [],
    isUnique: false,
    level: 0,
  },
];

// ============================================================
// ALL CARDS INDEX
// ============================================================
export const ALL_PLAYER_ASSETS = [
  ...GUARDIAN_ASSETS,
  ...SEEKER_ASSETS,
  ...MYSTIC_ASSETS,
  ...ROGUE_ASSETS,
  ...SURVIVOR_ASSETS,
  ...NEUTRAL_ASSETS,
];

export const ALL_PLAYER_EVENTS = [
  ...GUARDIAN_EVENTS,
  ...SEEKER_EVENTS,
  ...MYSTIC_EVENTS,
  ...ROGUE_EVENTS,
  ...SURVIVOR_EVENTS,
];

export const ALL_PLAYER_SKILLS = [
  ...NEUTRAL_SKILLS,
];

export const ALL_PLAYER_CARDS = [
  ...ALL_PLAYER_ASSETS,
  ...ALL_PLAYER_EVENTS,
  ...ALL_PLAYER_SKILLS,
];

export function getCardDefinition(id: string) {
  return ALL_PLAYER_CARDS.find(c => c.id === id);
}
