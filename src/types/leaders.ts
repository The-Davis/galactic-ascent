import type { LeaderSpecialization } from './factions';

export type GearSlotType = 'weapon' | 'armor' | 'tech' | 'intel';

export interface GearItem {
  id: string;
  name: string;
  slot: GearSlotType;
  description: string;
  /** Bonus multiplier on mission success (0.0 – 0.5) */
  missionBonus: number;
  /** Bonus to production rate (0.0 – 0.3) */
  productionBonus: number;
}

export interface GearSlot {
  type: GearSlotType;
  equipped: GearItem | null;
}

export interface Leader {
  id: string;
  name: string;
  /** Emoji portrait key */
  portrait: string;
  specialization: LeaderSpecialization;
  level: number;
  xp: number;
  /** XP required to reach next level */
  xpToNextLevel: number;
  /** ID of building, mission, or 'defense' they're assigned to; null = unassigned */
  assignedTo: string | null;
  gear: GearSlot[];
  /** Rarity tier: common, rare, legendary */
  rarity: 'common' | 'rare' | 'legendary';
  /** Passive ability description */
  ability: string;
}

export const XP_PER_LEVEL_BASE = 100;
export const XP_LEVEL_SCALE = 1.5;

export function xpForLevel(level: number): number {
  return Math.floor(XP_PER_LEVEL_BASE * Math.pow(XP_LEVEL_SCALE, level - 1));
}
