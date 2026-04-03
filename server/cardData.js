// ============================================================
// CARD DATA LOADER - Provides all card/scenario definitions
// (Plain JS version of the TypeScript data files)
// ============================================================

function loadCardDefinitions() {
  const explorers = {
    alice_gearwright: {
      id: 'alice_gearwright', name: 'Alice Gearwright', subtitle: 'The Clockwork Detective',
      class: 'seeker', skills: { resolve: 2, wit: 5, might: 2, grace: 3 },
      vitality: 6, clarity: 8,
    },
    hatter_copperfield: {
      id: 'hatter_copperfield', name: 'Hatter Copperfield', subtitle: 'The Mad Artificer',
      class: 'mystic', skills: { resolve: 5, wit: 3, might: 2, grace: 2 },
      vitality: 6, clarity: 8,
    },
    duchess_ironheart: {
      id: 'duchess_ironheart', name: 'Duchess Ironheart', subtitle: 'The Armored Sovereign',
      class: 'guardian', skills: { resolve: 3, wit: 2, might: 5, grace: 2 },
      vitality: 9, clarity: 5,
    },
    cheshire_thane: {
      id: 'cheshire_thane', name: 'Cheshire Thane', subtitle: 'The Vanishing Trickster',
      class: 'rogue', skills: { resolve: 2, wit: 3, might: 2, grace: 5 },
      vitality: 6, clarity: 7,
    },
  };

  // All player card definitions
  const allCards = {};
  const assetDefs = [
    { id: 'asset_steam_pistol', name: 'Steam Pistol', type: 'asset', class: 'guardian', cost: 3, slot: 'hand', skillIcons: { might: 1 }, abilities: [{ id: 'sp_fight', timing: 'action', actionDesignator: 'fight', description: 'Fight. +1 Might, +1 damage. Uses (4 ammo).', cost: { actions: 1, uses: 'ammo', usesAmount: 4 }, effect: { type: 'deal_damage', value: 2 } }] },
    { id: 'asset_brass_shield', name: 'Brass Shield', type: 'asset', class: 'guardian', cost: 2, slot: 'hand', skillIcons: { might: 1 }, vitality: 3, abilities: [] },
    { id: 'asset_clockwork_companion', name: 'Clockwork Companion', type: 'asset', class: 'guardian', cost: 4, slot: 'ally', skillIcons: { might: 1, resolve: 1 }, vitality: 3, clarity: 1, abilities: [] },
    { id: 'asset_reinforced_coat', name: 'Reinforced Coat', type: 'asset', class: 'guardian', cost: 1, slot: 'body', skillIcons: { resolve: 1 }, vitality: 2, clarity: 1, abilities: [] },
    { id: 'asset_magnifying_monocle', name: 'Magnifying Monocle', type: 'asset', class: 'seeker', cost: 1, slot: 'accessory', skillIcons: { wit: 1 }, abilities: [] },
    { id: 'asset_research_journal', name: 'Research Journal', type: 'asset', class: 'seeker', cost: 2, slot: 'hand', skillIcons: { wit: 1, wild: 1 }, abilities: [{ id: 'rj_draw', timing: 'action', cost: { actions: 1, exhaust: true }, description: 'Draw 2, discard 1.', effect: { type: 'draw_cards', value: 2 } }] },
    { id: 'asset_analytical_engine', name: 'Analytical Engine', type: 'asset', class: 'seeker', cost: 3, slot: 'arcane', skillIcons: { wit: 2 }, abilities: [{ id: 'ae_inv', timing: 'action', cost: { actions: 1, exhaust: true }, actionDesignator: 'investigate', description: 'Investigate. +2 Wit.', effect: { type: 'gain_clue', value: 1 } }] },
    { id: 'asset_enchanted_pocket_watch', name: 'Enchanted Pocket Watch', type: 'asset', class: 'mystic', cost: 3, slot: 'arcane', skillIcons: { resolve: 1 }, abilities: [{ id: 'epw_inv', timing: 'action', cost: { actions: 1, exhaust: true, uses: 'charge', usesAmount: 3 }, actionDesignator: 'investigate', description: 'Investigate with Resolve. Uses (3 charges).', effect: { type: 'gain_clue', value: 1 } }] },
    { id: 'asset_mirror_ward', name: 'Mirror Ward', type: 'asset', class: 'mystic', cost: 2, slot: 'arcane', skillIcons: { resolve: 1, grace: 1 }, abilities: [] },
    { id: 'asset_cheshire_familiar', name: 'Cheshire Familiar', type: 'asset', class: 'mystic', cost: 3, slot: 'ally', skillIcons: { resolve: 1, wild: 1 }, clarity: 3, abilities: [] },
    { id: 'asset_spring_blade', name: 'Spring-Loaded Blade', type: 'asset', class: 'rogue', cost: 2, slot: 'hand', skillIcons: { grace: 1, might: 1 }, abilities: [{ id: 'sb_fight', timing: 'action', cost: { actions: 1 }, actionDesignator: 'fight', description: 'Fight. +1 Might. +1 damage if succeed by 2+.', effect: { type: 'deal_damage', value: 1 } }] },
    { id: 'asset_smoke_bomb', name: 'Smoke Bomb', type: 'asset', class: 'rogue', cost: 1, skillIcons: { grace: 2 }, abilities: [] },
    { id: 'asset_thieves_toolkit', name: "Thief's Toolkit", type: 'asset', class: 'rogue', cost: 3, slot: 'hand', skillIcons: { grace: 1, wit: 1 }, abilities: [] },
    { id: 'asset_leather_satchel', name: 'Leather Satchel', type: 'asset', class: 'survivor', cost: 1, slot: 'body', skillIcons: { resolve: 1 }, vitality: 2, clarity: 2, abilities: [] },
    { id: 'asset_lucky_coin', name: 'Lucky Coin', type: 'asset', class: 'survivor', cost: 1, slot: 'accessory', skillIcons: { wild: 1 }, abilities: [] },
    { id: 'asset_pocket_watch', name: 'Pocket Watch', type: 'asset', class: 'neutral', cost: 1, slot: 'accessory', skillIcons: { wild: 1 }, abilities: [] },
  ];

  const eventDefs = [
    { id: 'event_defensive_stance', name: 'Defensive Stance', type: 'event', class: 'guardian', cost: 1, fast: true, skillIcons: { might: 1, grace: 1 }, abilities: [] },
    { id: 'event_emergency_repair', name: 'Emergency Repair', type: 'event', class: 'guardian', cost: 1, skillIcons: { resolve: 1 }, abilities: [] },
    { id: 'event_eureka', name: 'Eureka!', type: 'event', class: 'seeker', cost: 0, fast: true, skillIcons: { wit: 1, wild: 1 }, abilities: [] },
    { id: 'event_working_hypothesis', name: 'Working Hypothesis', type: 'event', class: 'seeker', cost: 2, skillIcons: { wit: 2 }, abilities: [] },
    { id: 'event_temporal_shift', name: 'Temporal Shift', type: 'event', class: 'mystic', cost: 1, fast: true, skillIcons: { resolve: 2 }, abilities: [] },
    { id: 'event_quick_thinking', name: 'Quick Thinking', type: 'event', class: 'rogue', cost: 0, fast: true, skillIcons: { grace: 1, wild: 1 }, abilities: [] },
    { id: 'event_lucky_break', name: 'Lucky Break', type: 'event', class: 'survivor', cost: 1, fast: true, skillIcons: { wild: 2 }, abilities: [] },
    { id: 'event_scrounge', name: 'Scrounge', type: 'event', class: 'survivor', cost: 0, skillIcons: { resolve: 1, wit: 1 }, abilities: [] },
  ];

  const skillDefs = [
    { id: 'skill_determination', name: 'Determination', type: 'skill', class: 'neutral', skillIcons: { resolve: 1, wild: 1 }, abilities: [] },
    { id: 'skill_sharp_mind', name: 'Sharp Mind', type: 'skill', class: 'neutral', skillIcons: { wit: 1, wild: 1 }, abilities: [] },
    { id: 'skill_brute_force', name: 'Brute Force', type: 'skill', class: 'neutral', skillIcons: { might: 1, wild: 1 }, abilities: [] },
    { id: 'skill_quick_reflexes', name: 'Quick Reflexes', type: 'skill', class: 'neutral', skillIcons: { grace: 1, wild: 1 }, abilities: [] },
    { id: 'skill_unexpected_courage', name: 'Unexpected Courage', type: 'skill', class: 'neutral', skillIcons: { wild: 2 }, abilities: [] },
  ];

  // Index all cards
  for (const def of [...assetDefs, ...eventDefs, ...skillDefs]) {
    allCards[def.id] = def;
  }

  // Enemy definitions
  const enemyDefs = {};
  const encounterEnemies = [
    { id: 'enemy_clockwork_soldier', name: 'Clockwork Soldier', type: 'enemy', fightValue: 3, healthBase: 3, evadeValue: 2, damageValue: 1, horrorValue: 1, keywords: ['hunter'], isUnique: false },
    { id: 'enemy_brass_spider', name: 'Brass Spider', type: 'enemy', fightValue: 2, healthBase: 2, evadeValue: 4, damageValue: 1, horrorValue: 0, keywords: ['retaliate'], isUnique: false },
    { id: 'enemy_gear_wraith', name: 'Gear Wraith', type: 'enemy', fightValue: 4, healthBase: 4, evadeValue: 3, damageValue: 1, horrorValue: 2, keywords: ['hunter'], victoryPoints: 1, isUnique: false },
    { id: 'enemy_card_guard', name: 'Card Guard', type: 'enemy', fightValue: 2, healthBase: 2, evadeValue: 3, damageValue: 1, horrorValue: 0, keywords: [], prey: 'lowest might', isUnique: false },
    { id: 'enemy_mechanical_jabberwock', name: 'Mechanical Jabberwock', type: 'enemy', fightValue: 5, healthBase: 5, healthPerPlayer: true, evadeValue: 3, damageValue: 2, horrorValue: 2, keywords: ['hunter', 'retaliate'], victoryPoints: 2, spawn: 'loc_gear_undercity', isUnique: true },
    { id: 'enemy_rogue_automaton', name: 'Rogue Automaton', type: 'enemy', fightValue: 3, healthBase: 2, evadeValue: 2, damageValue: 2, horrorValue: 0, keywords: [], isUnique: false },
  ];
  for (const e of encounterEnemies) {
    enemyDefs[e.id] = e;
    allCards[e.id] = e;
  }

  // Treachery definitions
  const treacheryDefs = {};
  const encounterTreacheries = [
    { id: 'treachery_grinding_gears', name: 'Grinding Gears', type: 'treachery', keywords: [], revelation: { type: 'skill_test', skillTest: { skill: 'grace', difficulty: 3, onFailure: { type: 'deal_damage', value: 2, target: 'self' } } }, isUnique: false },
    { id: 'treachery_tick_tock', name: 'Tick Tock Tick Tock', type: 'treachery', keywords: [], revelation: { type: 'skill_test', skillTest: { skill: 'resolve', difficulty: 3, onFailure: { type: 'deal_horror', value: 2, target: 'self' } } }, isUnique: false },
    { id: 'treachery_spring_malfunction', name: 'Spring Malfunction', type: 'treachery', keywords: ['surge'], revelation: { type: 'place_doom', value: 1 }, isUnique: false },
    { id: 'treachery_fog_of_mercury', name: 'Fog of Mercury', type: 'treachery', keywords: [], revelation: { type: 'skill_test', skillTest: { skill: 'wit', difficulty: 4, onFailure: { type: 'deal_horror', value: 1, target: 'self' } } }, isUnique: false },
    { id: 'treachery_winding_down', name: 'Winding Down', type: 'treachery', keywords: ['peril'], revelation: { type: 'discard_cards', value: 2, target: 'self' }, isUnique: false },
    { id: 'treachery_time_distortion', name: 'Time Distortion', type: 'treachery', keywords: [], revelation: { type: 'custom', custom: 'lose_1_action_next_turn' }, isUnique: false },
  ];
  for (const t of encounterTreacheries) {
    treacheryDefs[t.id] = t;
    allCards[t.id] = t;
  }

  // Combine encounter cards (for building the encounter deck)
  const encounterCards = [...encounterEnemies, ...encounterTreacheries];

  // Starter decks
  const starterDecks = {
    alice_gearwright: [
      'asset_magnifying_monocle', 'asset_magnifying_monocle',
      'asset_research_journal', 'asset_research_journal',
      'asset_analytical_engine', 'asset_analytical_engine',
      'event_eureka', 'event_eureka',
      'event_working_hypothesis', 'event_working_hypothesis',
      'asset_spring_blade', 'asset_spring_blade',
      'asset_thieves_toolkit',
      'event_quick_thinking', 'event_quick_thinking',
      'asset_pocket_watch',
      'skill_sharp_mind', 'skill_sharp_mind',
      'skill_quick_reflexes', 'skill_quick_reflexes',
      'skill_unexpected_courage', 'skill_unexpected_courage',
      'skill_determination', 'skill_determination',
      'skill_brute_force', 'skill_brute_force',
      'event_eureka', 'asset_magnifying_monocle',
      'event_working_hypothesis', 'asset_research_journal',
    ],
    hatter_copperfield: [
      'asset_enchanted_pocket_watch', 'asset_enchanted_pocket_watch',
      'asset_mirror_ward', 'asset_mirror_ward',
      'asset_cheshire_familiar', 'asset_cheshire_familiar',
      'event_temporal_shift', 'event_temporal_shift',
      'asset_leather_satchel', 'asset_leather_satchel',
      'asset_lucky_coin', 'asset_lucky_coin',
      'event_lucky_break', 'event_lucky_break',
      'event_scrounge', 'event_scrounge',
      'asset_pocket_watch',
      'skill_determination', 'skill_determination',
      'skill_sharp_mind', 'skill_sharp_mind',
      'skill_brute_force', 'skill_brute_force',
      'skill_quick_reflexes', 'skill_quick_reflexes',
      'skill_unexpected_courage', 'skill_unexpected_courage',
      'event_temporal_shift', 'asset_enchanted_pocket_watch',
      'asset_mirror_ward', 'asset_cheshire_familiar',
    ],
    duchess_ironheart: [
      'asset_steam_pistol', 'asset_steam_pistol',
      'asset_brass_shield', 'asset_brass_shield',
      'asset_clockwork_companion', 'asset_clockwork_companion',
      'asset_reinforced_coat', 'asset_reinforced_coat',
      'event_defensive_stance', 'event_defensive_stance',
      'event_emergency_repair', 'event_emergency_repair',
      'asset_magnifying_monocle', 'asset_magnifying_monocle',
      'event_eureka',
      'asset_pocket_watch',
      'skill_brute_force', 'skill_brute_force',
      'skill_determination', 'skill_determination',
      'skill_sharp_mind', 'skill_sharp_mind',
      'skill_quick_reflexes', 'skill_quick_reflexes',
      'skill_unexpected_courage', 'skill_unexpected_courage',
      'asset_steam_pistol', 'event_defensive_stance',
      'asset_reinforced_coat', 'event_emergency_repair',
    ],
    cheshire_thane: [
      'asset_spring_blade', 'asset_spring_blade',
      'asset_smoke_bomb', 'asset_smoke_bomb',
      'asset_thieves_toolkit', 'asset_thieves_toolkit',
      'event_quick_thinking', 'event_quick_thinking',
      'asset_enchanted_pocket_watch', 'asset_enchanted_pocket_watch',
      'asset_mirror_ward', 'asset_mirror_ward',
      'event_temporal_shift', 'event_temporal_shift',
      'asset_pocket_watch',
      'skill_quick_reflexes', 'skill_quick_reflexes',
      'skill_sharp_mind', 'skill_sharp_mind',
      'skill_determination', 'skill_determination',
      'skill_brute_force', 'skill_brute_force',
      'skill_unexpected_courage', 'skill_unexpected_courage',
      'asset_spring_blade', 'asset_smoke_bomb',
      'event_quick_thinking', 'asset_thieves_toolkit',
    ],
  };

  // Scenario
  const scenario = {
    id: 'clockwork_conspiracy',
    name: 'The Clockwork Conspiracy',
    difficulty: {
      easy: ['plus_one','plus_one','zero','zero','zero','minus_one','minus_one','minus_two','skull','skull','cultist','tablet','elder_sign','auto_fail'],
      standard: ['plus_one','zero','zero','minus_one','minus_one','minus_one','minus_two','minus_two','minus_three','minus_four','skull','skull','cultist','tablet','elder_sign','auto_fail'],
      hard: ['zero','minus_one','minus_one','minus_two','minus_two','minus_three','minus_three','minus_four','minus_five','skull','skull','skull','cultist','tablet','elder_thing','elder_sign','auto_fail'],
      expert: ['zero','minus_one','minus_two','minus_two','minus_three','minus_four','minus_five','minus_six','minus_eight','skull','skull','skull','cultist','tablet','elder_thing','elder_sign','auto_fail'],
    },
    locations: [
      { id: 'loc_clocktower_square', name: 'Clocktower Square', shroud: 2, cluesBase: 1, cluesPerPlayer: true, connections: ['square','market','garden'] },
      { id: 'loc_steam_market', name: 'Steam-Powered Market', shroud: 3, cluesBase: 2, cluesPerPlayer: true, connections: ['market','square','workshop'] },
      { id: 'loc_clockwork_garden', name: 'Clockwork Gardens', shroud: 1, cluesBase: 1, cluesPerPlayer: true, connections: ['garden','square','teahouse'] },
      { id: 'loc_hatters_workshop', name: "Hatter's Workshop", shroud: 4, cluesBase: 2, cluesPerPlayer: true, connections: ['workshop','market','undercity'] },
      { id: 'loc_mad_teahouse', name: 'The Mad Tea House', shroud: 2, cluesBase: 1, cluesPerPlayer: true, connections: ['teahouse','garden','undercity'] },
      { id: 'loc_gear_undercity', name: 'The Gear Undercity', shroud: 5, cluesBase: 3, cluesPerPlayer: false, connections: ['undercity','workshop','teahouse'] },
    ],
    locationConnections: [
      ['loc_clocktower_square', 'loc_steam_market'],
      ['loc_clocktower_square', 'loc_clockwork_garden'],
      ['loc_steam_market', 'loc_hatters_workshop'],
      ['loc_clockwork_garden', 'loc_mad_teahouse'],
      ['loc_hatters_workshop', 'loc_gear_undercity'],
      ['loc_mad_teahouse', 'loc_gear_undercity'],
    ],
    agendas: [
      { id: 'agenda_1', name: 'The Gears Begin to Turn', index: 0, doomThreshold: 4, perPlayer: false, frontText: 'The automata grow more aggressive...', backText: 'The mechanical servants break free! Each investigator takes 1 horror.' },
      { id: 'agenda_2', name: 'The Clockwork Awakens', index: 1, doomThreshold: 6, perPlayer: false, frontText: 'The city shudders...', backText: 'The Clockwork King rises! Scenario ends in defeat.' },
    ],
    acts: [
      { id: 'act_1', name: 'Following the Gears', index: 0, clueThreshold: 3, perPlayer: true, frontText: 'Gather evidence to find the source...', backText: 'A hidden passage beneath the Workshop is revealed!' },
      { id: 'act_2', name: 'The Heart of the Machine', index: 1, clueThreshold: 3, perPlayer: false, frontText: 'Reach the Undercity and disable the mechanism...', backText: 'You destroy the corrupted gear! Wonderland is safe.' },
    ],
    resolutions: [
      { id: 'resolution_1', title: 'The Gears Fall Silent', text: 'With the corrupted mechanism destroyed, peace returns to Wonderland.', xpBonus: 1, xpPenalty: 0, campaignLogEntries: ['clockwork_king_defeated'] },
      { id: 'resolution_2', title: 'The Clockwork King Rises', text: 'The massive automaton tears free. Wonderland falls.', xpBonus: 0, xpPenalty: 0, campaignLogEntries: ['clockwork_king_risen'] },
      { id: 'no_resolution', title: 'A Retreat Through the Gears', text: 'Overwhelmed, you escape. The ticking follows you...', xpBonus: 0, xpPenalty: 0, campaignLogEntries: ['investigators_fled'] },
    ],
  };

  return {
    explorers,
    allCards,
    enemyDefs,
    treacheryDefs,
    encounterCards,
    starterDecks,
    scenario,
  };
}

module.exports = { loadCardDefinitions };
