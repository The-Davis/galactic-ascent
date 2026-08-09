import type { BuildingDef } from '../types/buildings';

export const BUILDING_DEFS: BuildingDef[] = [
  // ─── Base Buildings (always available) ───────────────────────────────────
  {
    id: 'mining_station',
    name: 'Mining Station',
    description: 'Extracts raw minerals from asteroid fields orbiting your star system.',
    icon: '⛏️',
    baseProduction: { minerals: 2 },
    baseCost: { credits: 50 },
    costScale: 1.5,
    maxLevel: 10,
    productionPerLevel: 1.4,
    starterBuilding: true,
  },
  {
    id: 'trade_hub',
    name: 'Trade Hub',
    description: 'A bustling commerce center that generates steady credit income from passing merchants.',
    icon: '🏪',
    baseProduction: { credits: 3 },
    baseCost: { minerals: 40, credits: 30 },
    costScale: 1.5,
    maxLevel: 10,
    productionPerLevel: 1.4,
    starterBuilding: true,
  },
  {
    id: 'research_lab',
    name: 'Research Lab',
    description: 'Cutting-edge scientists work to advance your civilization\'s technological frontier.',
    icon: '🔬',
    baseProduction: { research: 1.5 },
    baseCost: { credits: 80, minerals: 30 },
    costScale: 1.6,
    maxLevel: 10,
    productionPerLevel: 1.5,
    unlockMissionId: 'first_contact',
  },
  {
    id: 'shipyard',
    name: 'Shipyard',
    description: 'Constructs and maintains your fleet, projecting military power across the sector.',
    icon: '🚀',
    baseProduction: { minerals: 1, influence: 0.5 },
    baseCost: { credits: 120, minerals: 80 },
    costScale: 1.6,
    maxLevel: 10,
    productionPerLevel: 1.4,
    unlockMissionId: 'resource_crisis',
  },
  {
    id: 'intelligence_outpost',
    name: 'Intelligence Outpost',
    description: 'Monitors rival factions and generates influence through information networks.',
    icon: '🕵️',
    baseProduction: { influence: 2 },
    baseCost: { credits: 100, research: 50 },
    costScale: 1.6,
    maxLevel: 10,
    productionPerLevel: 1.5,
    unlockMissionId: 'shadow_threat',
  },
  {
    id: 'habitation_dome',
    name: 'Habitation Dome',
    description: 'Houses millions of colonists, boosting all production through population growth.',
    icon: '🏙️',
    baseProduction: { credits: 1, minerals: 1, research: 0.5, influence: 0.5 },
    baseCost: { credits: 200, minerals: 150, research: 50 },
    costScale: 1.8,
    maxLevel: 5,
    productionPerLevel: 1.3,
    unlockMissionId: 'alliances_forged',
  },

  // ─── Faction-Exclusive Buildings ─────────────────────────────────────────
  {
    id: 'imperial_forge',
    name: 'Imperial Forge',
    description: 'The crown jewel of Stellar Dominion industry. Produces massive mineral and credit output.',
    icon: '⚒️',
    baseProduction: { minerals: 5, credits: 3 },
    baseCost: { credits: 300, minerals: 200 },
    costScale: 1.7,
    maxLevel: 8,
    productionPerLevel: 1.5,
    factionExclusive: 'stellar_dominion',
  },
  {
    id: 'void_extractor',
    name: 'Void Extractor',
    description: 'Harvests dark matter from the void between stars, converting it to pure credits.',
    icon: '🌑',
    baseProduction: { credits: 8 },
    baseCost: { credits: 250, influence: 100 },
    costScale: 1.7,
    maxLevel: 8,
    productionPerLevel: 1.5,
    factionExclusive: 'void_consortium',
  },
  {
    id: 'data_nexus',
    name: 'Data Nexus',
    description: 'A hyper-intelligence computing cluster that accelerates all research dramatically.',
    icon: '💻',
    baseProduction: { research: 6, influence: 1 },
    baseCost: { credits: 200, research: 150 },
    costScale: 1.7,
    maxLevel: 8,
    productionPerLevel: 1.6,
    factionExclusive: 'technocratic_hegemony',
  },
  {
    id: 'shadow_network',
    name: 'Shadow Network',
    description: 'A web of informants that generates influence and destabilizes rival operations.',
    icon: '🕸️',
    baseProduction: { influence: 5, credits: 2 },
    baseCost: { credits: 200, influence: 80 },
    costScale: 1.7,
    maxLevel: 8,
    productionPerLevel: 1.5,
    factionExclusive: 'shadow_syndicate',
  },
  {
    id: 'bio_synthesis_hub',
    name: 'Bio-Synthesis Hub',
    description: 'Living architecture that produces all resource types through biological processes.',
    icon: '🌿',
    baseProduction: { minerals: 2, research: 2, influence: 2, credits: 1 },
    baseCost: { credits: 220, minerals: 100, research: 80 },
    costScale: 1.7,
    maxLevel: 8,
    productionPerLevel: 1.4,
    factionExclusive: 'organic_collective',
  },
];

export const BUILDING_MAP = Object.fromEntries(
  BUILDING_DEFS.map((b) => [b.id, b])
) as Record<string, BuildingDef>;

/** Calculate the cost to upgrade a building to the next level */
export function getBuildingCost(def: BuildingDef, currentLevel: number): import('../types').Resources {
  const scale = Math.pow(def.costScale, currentLevel);
  return {
    credits: Math.floor((def.baseCost.credits ?? 0) * scale),
    minerals: Math.floor((def.baseCost.minerals ?? 0) * scale),
    research: Math.floor((def.baseCost.research ?? 0) * scale),
    influence: Math.floor((def.baseCost.influence ?? 0) * scale),
  };
}

/** Calculate production rate (per second) for a building at a given level */
export function getBuildingProduction(
  def: BuildingDef,
  level: number
): import('../types').Resources {
  const mult = level === 1 ? 1 : Math.pow(def.productionPerLevel, level - 1);
  return {
    credits: (def.baseProduction.credits ?? 0) * mult,
    minerals: (def.baseProduction.minerals ?? 0) * mult,
    research: (def.baseProduction.research ?? 0) * mult,
    influence: (def.baseProduction.influence ?? 0) * mult,
  };
}
