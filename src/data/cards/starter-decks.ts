// Pre-built 30-card starter decks for each explorer
// Each deck has: class cards + neutral cards + skills

export const STARTER_DECKS: Record<string, string[]> = {
  alice_gearwright: [
    // Seeker assets x2 each
    'asset_magnifying_monocle', 'asset_magnifying_monocle',
    'asset_research_journal', 'asset_research_journal',
    'asset_analytical_engine', 'asset_analytical_engine',
    // Seeker events x2 each
    'event_eureka', 'event_eureka',
    'event_working_hypothesis', 'event_working_hypothesis',
    // Rogue splash (level 0-2 allowed)
    'asset_spring_blade', 'asset_spring_blade',
    'asset_thieves_toolkit',
    'event_quick_thinking', 'event_quick_thinking',
    // Neutral
    'asset_pocket_watch',
    // Neutral skills x2 each
    'skill_sharp_mind', 'skill_sharp_mind',
    'skill_quick_reflexes', 'skill_quick_reflexes',
    'skill_unexpected_courage', 'skill_unexpected_courage',
    'skill_determination', 'skill_determination',
    'skill_brute_force', 'skill_brute_force',
    // Pad to 30
    'event_eureka',
    'asset_magnifying_monocle',
    'event_working_hypothesis',
    'asset_research_journal',
  ],

  hatter_copperfield: [
    // Mystic assets x2 each
    'asset_enchanted_pocket_watch', 'asset_enchanted_pocket_watch',
    'asset_mirror_ward', 'asset_mirror_ward',
    'asset_cheshire_familiar', 'asset_cheshire_familiar',
    // Mystic events x2
    'event_temporal_shift', 'event_temporal_shift',
    // Survivor splash
    'asset_leather_satchel', 'asset_leather_satchel',
    'asset_lucky_coin', 'asset_lucky_coin',
    'event_lucky_break', 'event_lucky_break',
    'event_scrounge', 'event_scrounge',
    // Neutral
    'asset_pocket_watch',
    // Skills
    'skill_determination', 'skill_determination',
    'skill_sharp_mind', 'skill_sharp_mind',
    'skill_brute_force', 'skill_brute_force',
    'skill_quick_reflexes', 'skill_quick_reflexes',
    'skill_unexpected_courage', 'skill_unexpected_courage',
    // Pad to 30
    'event_temporal_shift',
    'asset_enchanted_pocket_watch',
    'asset_mirror_ward',
    'asset_cheshire_familiar',
  ],

  duchess_ironheart: [
    // Guardian assets x2 each
    'asset_steam_pistol', 'asset_steam_pistol',
    'asset_brass_shield', 'asset_brass_shield',
    'asset_clockwork_companion', 'asset_clockwork_companion',
    'asset_reinforced_coat', 'asset_reinforced_coat',
    // Guardian events x2 each
    'event_defensive_stance', 'event_defensive_stance',
    'event_emergency_repair', 'event_emergency_repair',
    // Seeker splash
    'asset_magnifying_monocle', 'asset_magnifying_monocle',
    'event_eureka',
    // Neutral
    'asset_pocket_watch',
    // Skills
    'skill_brute_force', 'skill_brute_force',
    'skill_determination', 'skill_determination',
    'skill_sharp_mind', 'skill_sharp_mind',
    'skill_quick_reflexes', 'skill_quick_reflexes',
    'skill_unexpected_courage', 'skill_unexpected_courage',
    // Pad to 30
    'asset_steam_pistol',
    'event_defensive_stance',
    'asset_reinforced_coat',
    'event_emergency_repair',
  ],

  cheshire_thane: [
    // Rogue assets x2 each
    'asset_spring_blade', 'asset_spring_blade',
    'asset_smoke_bomb', 'asset_smoke_bomb',
    'asset_thieves_toolkit', 'asset_thieves_toolkit',
    // Rogue events x2
    'event_quick_thinking', 'event_quick_thinking',
    // Mystic splash
    'asset_enchanted_pocket_watch', 'asset_enchanted_pocket_watch',
    'asset_mirror_ward', 'asset_mirror_ward',
    'event_temporal_shift', 'event_temporal_shift',
    // Neutral
    'asset_pocket_watch',
    // Skills
    'skill_quick_reflexes', 'skill_quick_reflexes',
    'skill_sharp_mind', 'skill_sharp_mind',
    'skill_determination', 'skill_determination',
    'skill_brute_force', 'skill_brute_force',
    'skill_unexpected_courage', 'skill_unexpected_courage',
    // Pad to 30
    'asset_spring_blade',
    'asset_smoke_bomb',
    'event_quick_thinking',
    'asset_thieves_toolkit',
  ],
};
