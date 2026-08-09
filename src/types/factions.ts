export type FactionId =
  | 'stellar_dominion'
  | 'void_consortium'
  | 'technocratic_hegemony'
  | 'shadow_syndicate'
  | 'organic_collective';

export type LeaderSpecialization = 'military' | 'science' | 'economic' | 'subterfuge';

export interface FactionBonus {
  /** Flat resource bonus applied to production each tick (per incarnation stack) */
  productionBonus: Partial<Record<import('./resources').ResourceType, number>>;
  /** Leader specialization that gets an XP multiplier from this faction */
  leaderAffinity: LeaderSpecialization;
  /** A short label describing the unique bonus building */
  bonusBuildingName: string;
}

export interface Faction {
  id: FactionId;
  name: string;
  tagline: string;
  description: string;
  lore: string;
  color: string;        // hex accent color
  gradientFrom: string; // tailwind gradient start class
  gradientTo: string;   // tailwind gradient end class
  icon: string;         // emoji icon
  bonus: FactionBonus;
  bonusBuildingId: string; // building ID unlocked by this faction
}
