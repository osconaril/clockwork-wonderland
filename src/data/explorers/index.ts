import { ExplorerDefinition } from '@/types/cards';

export const EXPLORERS: ExplorerDefinition[] = [
  {
    id: 'alice_gearwright',
    name: 'Alice Gearwright',
    subtitle: 'The Clockwork Detective',
    class: 'seeker',
    skills: { resolve: 2, wit: 5, might: 2, grace: 3 },
    vitality: 6,
    clarity: 8,
    elderSignAbility: { type: 'gain_clue', value: 1 },
    ability: {
      id: 'alice_ability',
      timing: 'reaction',
      description: 'After you discover a Curiosity: Draw 1 card.',
      effect: { type: 'draw_cards', value: 1 },
    },
    deckBuildingRules: {
      allowedClasses: [
        { class: 'seeker', maxLevel: 5 },
        { class: 'neutral', maxLevel: 5 },
        { class: 'rogue', maxLevel: 2 },
      ],
      deckSize: 30,
    },
    signatureCards: ['alice_looking_glass'],
    weaknessCards: ['alice_curiosity_killed'],
    flavorText: '"Curiouser and curiouser," she murmured, adjusting the brass monocle over her left eye. The gears whirred softly as they focused on what others could not see.',
  },
  {
    id: 'hatter_copperfield',
    name: 'Hatter Copperfield',
    subtitle: 'The Mad Artificer',
    class: 'mystic',
    skills: { resolve: 5, wit: 3, might: 2, grace: 2 },
    vitality: 6,
    clarity: 8,
    elderSignAbility: { type: 'remove_doom', value: 1 },
    ability: {
      id: 'hatter_ability',
      timing: 'action',
      cost: { actions: 1, exhaust: true },
      description: 'Place 1 Chaos on a card you control to draw 1 card and gain 1 Gear.',
      effect: { type: 'custom', custom: 'hatter_doom_for_resources' },
    },
    deckBuildingRules: {
      allowedClasses: [
        { class: 'mystic', maxLevel: 5 },
        { class: 'neutral', maxLevel: 5 },
        { class: 'survivor', maxLevel: 2 },
      ],
      deckSize: 30,
    },
    signatureCards: ['hatter_mercury_teacup'],
    weaknessCards: ['hatter_madness_spiral'],
    flavorText: '"Time and I had a quarrel once," he said, tightening a bolt on his automaton companion. "Now I simply build new clocks."',
  },
  {
    id: 'duchess_ironheart',
    name: 'Duchess Ironheart',
    subtitle: 'The Armored Sovereign',
    class: 'guardian',
    skills: { resolve: 3, wit: 2, might: 5, grace: 2 },
    vitality: 9,
    clarity: 5,
    elderSignAbility: { type: 'deal_damage', value: 1, target: 'enemy' },
    ability: {
      id: 'duchess_ability',
      timing: 'reaction',
      description: 'After an enemy engages you: Deal 1 damage to that enemy.',
      effect: { type: 'deal_damage', value: 1, target: 'enemy' },
    },
    deckBuildingRules: {
      allowedClasses: [
        { class: 'guardian', maxLevel: 5 },
        { class: 'neutral', maxLevel: 5 },
        { class: 'seeker', maxLevel: 2 },
      ],
      deckSize: 30,
    },
    signatureCards: ['duchess_croquet_mallet'],
    weaknessCards: ['duchess_off_with_their_heads'],
    flavorText: '"The Queen\'s croquet ground has become a battlefield. Very well -- I have always preferred direct action to polite conversation."',
  },
  {
    id: 'cheshire_thane',
    name: 'Cheshire Thane',
    subtitle: 'The Vanishing Trickster',
    class: 'rogue',
    skills: { resolve: 2, wit: 3, might: 2, grace: 5 },
    vitality: 6,
    clarity: 7,
    elderSignAbility: { type: 'gain_resources', value: 2 },
    ability: {
      id: 'cheshire_ability',
      timing: 'fast',
      cost: { resources: 1 },
      description: 'Spend 1 Gear: Disengage from each enemy engaged with you and move to a connected location.',
      effect: { type: 'custom', custom: 'cheshire_vanish' },
    },
    deckBuildingRules: {
      allowedClasses: [
        { class: 'rogue', maxLevel: 5 },
        { class: 'neutral', maxLevel: 5 },
        { class: 'mystic', maxLevel: 2 },
      ],
      deckSize: 30,
    },
    signatureCards: ['cheshire_grin_blade'],
    weaknessCards: ['cheshire_fading_existence'],
    flavorText: '"We\'re all mad here," he grinned, his form flickering between the gears and shadows. "But some of us have learned to use it."',
  },
];

export function getExplorerById(id: string): ExplorerDefinition | undefined {
  return EXPLORERS.find((e) => e.id === id);
}
