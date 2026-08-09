import type { Leader } from '../types/leaders';

/** Base leader pool — all incarnations draw from this list */
export const LEADER_POOL: Omit<Leader, 'id' | 'level' | 'xp' | 'xpToNextLevel' | 'assignedTo'>[] = [
  {
    name: 'Admiral Rhonn',
    portrait: '👨‍✈️',
    specialization: 'military',
    gear: [
      { type: 'weapon', equipped: null },
      { type: 'armor', equipped: null },
    ],
    rarity: 'common',
    ability: 'Fleet Vanguard: +15% mission success in military operations',
  },
  {
    name: 'Commander Kael',
    portrait: '🧑‍🚀',
    specialization: 'military',
    gear: [
      { type: 'weapon', equipped: null },
      { type: 'armor', equipped: null },
    ],
    rarity: 'rare',
    ability: 'Iron Will: Assigned building produces +20% minerals',
  },
  {
    name: 'Dr. Lyra Sol',
    portrait: '👩‍🔬',
    specialization: 'science',
    gear: [
      { type: 'tech', equipped: null },
      { type: 'armor', equipped: null },
    ],
    rarity: 'legendary',
    ability: 'Quantum Insight: Assigned building produces +30% research',
  },
  {
    name: 'Merchant Voss',
    portrait: '🧔',
    specialization: 'economic',
    gear: [
      { type: 'tech', equipped: null },
      { type: 'armor', equipped: null },
    ],
    rarity: 'common',
    ability: 'Trade Routes: +10 credits per minute when assigned to Trade Hub',
  },
  {
    name: 'Chancellor Mira',
    portrait: '👩‍💼',
    specialization: 'economic',
    gear: [
      { type: 'tech', equipped: null },
      { type: 'armor', equipped: null },
    ],
    rarity: 'rare',
    ability: 'Diplomatic Leverage: +25% influence production system-wide',
  },
  {
    name: 'Aria Vex',
    portrait: '🧕',
    specialization: 'subterfuge',
    gear: [
      { type: 'intel', equipped: null },
      { type: 'armor', equipped: null },
    ],
    rarity: 'rare',
    ability: 'Ghost Protocol: Double influence generation when assigned to Intel Outpost',
  },
  {
    name: 'Wraith-7',
    portrait: '🤖',
    specialization: 'subterfuge',
    gear: [
      { type: 'intel', equipped: null },
      { type: 'tech', equipped: null },
    ],
    rarity: 'legendary',
    ability: 'Infiltration Matrix: Mission cost -20%, success rate +25%',
  },
  {
    name: 'Engineer Okafor',
    portrait: '👨‍🔧',
    specialization: 'science',
    gear: [
      { type: 'tech', equipped: null },
      { type: 'armor', equipped: null },
    ],
    rarity: 'common',
    ability: 'Overclock: Assigned building generates resources 10% faster',
  },
];

/** Leaders that are unlocked by specific missions */
export const MISSION_UNLOCKED_LEADERS: Record<string, string> = {
  aria_vex: 'Aria Vex',
  commander_kael: 'Commander Kael',
  dr_lyra_sol: 'Dr. Lyra Sol',
};

/** Starter leaders always available for recruitment */
export const STARTER_LEADER_NAMES = ['Admiral Rhonn', 'Merchant Voss', 'Engineer Okafor'];

/** Base cost to recruit a common leader */
export const RECRUIT_COSTS = {
  common: { credits: 150 },
  rare: { credits: 300, influence: 50 },
  legendary: { credits: 600, influence: 150, research: 100 },
} as const;

/** Compute leader production bonus factor (0.0 – 0.5 additive) */
export function getLeaderProductionBonus(leader: Leader): number {
  const rarityBonus = leader.rarity === 'legendary' ? 0.3 : leader.rarity === 'rare' ? 0.15 : 0.05;
  const levelBonus = (leader.level - 1) * 0.02;
  return rarityBonus + levelBonus;
}

/** Compute mission success bonus for a leader (0.0 – 1.0) */
export function getLeaderMissionBonus(leader: Leader): number {
  const base = leader.rarity === 'legendary' ? 0.35 : leader.rarity === 'rare' ? 0.2 : 0.1;
  return base + (leader.level - 1) * 0.03;
}
