import type { FactionId } from './factions';
import type { Resources } from './resources';

export type BuildingId =
  | 'mining_station'
  | 'research_lab'
  | 'shipyard'
  | 'trade_hub'
  | 'intelligence_outpost'
  | 'habitation_dome'
  | 'imperial_forge'        // Stellar Dominion exclusive
  | 'void_extractor'        // Void Consortium exclusive
  | 'data_nexus'            // Technocratic Hegemony exclusive
  | 'shadow_network'        // Shadow Syndicate exclusive
  | 'bio_synthesis_hub';    // Organic Collective exclusive

export interface BuildingDef {
  id: BuildingId;
  name: string;
  description: string;
  icon: string;
  /** Base production per second */
  baseProduction: Partial<Resources>;
  /** Base build cost */
  baseCost: Partial<Resources>;
  /** Cost multiplier per level: baseCost * (costScale ^ level) */
  costScale: number;
  /** Maximum upgrade level */
  maxLevel: number;
  /** Production multiplier per level above 1 */
  productionPerLevel: number;
  /** Mission ID that must be completed to unlock this building */
  unlockMissionId?: string;
  /** Faction required to build this */
  factionExclusive?: FactionId;
  /** Is this building available from the start? */
  starterBuilding?: boolean;
}

export interface BuildingInstance {
  defId: BuildingId;
  level: number;
  /** Timestamp (ms) of last manual collection */
  lastCollected: number;
  /** Accumulated resources not yet collected */
  pendingResources: Partial<Resources>;
}
