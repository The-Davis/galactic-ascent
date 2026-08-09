import type { Resources } from '../types/resources';
import type { BuildingInstance } from '../types/buildings';
import type { Leader } from '../types/leaders';
import type { PermanentBonuses } from '../types/game';
import type { FactionId } from '../types/factions';
import { BUILDING_MAP, getBuildingProduction } from '../data/buildings';
import { FACTION_MAP } from '../data/factions';
import { EMPTY_RESOURCES, addResources } from '../types/resources';
import { getLeaderProductionBonus } from '../data/leaders';

/**
 * Calculate total production rate per second across all buildings,
 * accounting for leader bonuses and permanent faction bonuses.
 */
export function calculateTotalProduction(
  buildings: BuildingInstance[],
  leaders: Leader[],
  factionId: FactionId | null,
  permanentBonuses: PermanentBonuses
): Resources {
  let total = { ...EMPTY_RESOURCES };

  // Permanent bonus multiplier: 5% per stack per faction
  const permBonus = factionId ? (permanentBonuses[factionId] ?? 0) * 0.05 : 0;

  for (const building of buildings) {
    const def = BUILDING_MAP[building.defId];
    if (!def) continue;

    const baseRate = getBuildingProduction(def, building.level);

    // Find assigned leader
    const assignedLeader = leaders.find((l) => l.assignedTo === building.defId);
    const leaderBonus = assignedLeader ? getLeaderProductionBonus(assignedLeader) : 0;

    // Combined multiplier
    const mult = 1 + leaderBonus + permBonus;

    total = {
      credits: total.credits + baseRate.credits * mult,
      minerals: total.minerals + baseRate.minerals * mult,
      research: total.research + baseRate.research * mult,
      influence: total.influence + baseRate.influence * mult,
    };
  }

  // Apply faction production bonus from permanent data
  if (factionId) {
    const faction = FACTION_MAP[factionId];
    if (faction) {
      const stacks = permanentBonuses[factionId] ?? 0;
      const bonus = faction.bonus.productionBonus;
      total = addResources(total, {
        credits: (bonus.credits ?? 0) * stacks,
        minerals: (bonus.minerals ?? 0) * stacks,
        research: (bonus.research ?? 0) * stacks,
        influence: (bonus.influence ?? 0) * stacks,
      });
    }
  }

  return total;
}

/**
 * Calculate resources earned offline since lastSaved.
 */
export function calculateOfflineEarnings(
  lastSaved: number,
  production: Resources,
  maxOfflineSeconds = 8 * 3600 // cap at 8 hours
): Resources {
  const elapsedSeconds = Math.min(
    (Date.now() - lastSaved) / 1000,
    maxOfflineSeconds
  );
  if (elapsedSeconds <= 0) return { ...EMPTY_RESOURCES };
  return {
    credits: production.credits * elapsedSeconds,
    minerals: production.minerals * elapsedSeconds,
    research: production.research * elapsedSeconds,
    influence: production.influence * elapsedSeconds,
  };
}

/**
 * Accumulate pending resources on buildings since their last collection.
 */
export function accumulatePendingResources(
  buildings: BuildingInstance[],
  leaders: Leader[],
  factionId: FactionId | null,
  permanentBonuses: PermanentBonuses,
  now: number
): BuildingInstance[] {
  const permBonus = factionId ? (permanentBonuses[factionId] ?? 0) * 0.05 : 0;

  return buildings.map((building) => {
    const def = BUILDING_MAP[building.defId];
    if (!def) return building;

    const elapsedSeconds = (now - building.lastCollected) / 1000;
    if (elapsedSeconds <= 0) return building;

    const baseRate = getBuildingProduction(def, building.level);
    const assignedLeader = leaders.find((l) => l.assignedTo === building.defId);
    const leaderBonus = assignedLeader ? getLeaderProductionBonus(assignedLeader) : 0;
    const mult = 1 + leaderBonus + permBonus;

    const earned: Resources = {
      credits: baseRate.credits * mult * elapsedSeconds,
      minerals: baseRate.minerals * mult * elapsedSeconds,
      research: baseRate.research * mult * elapsedSeconds,
      influence: baseRate.influence * mult * elapsedSeconds,
    };

    const pending = building.pendingResources ?? {};
    return {
      ...building,
      lastCollected: now,
      pendingResources: {
        credits: (pending.credits ?? 0) + earned.credits,
        minerals: (pending.minerals ?? 0) + earned.minerals,
        research: (pending.research ?? 0) + earned.research,
        influence: (pending.influence ?? 0) + earned.influence,
      },
    };
  });
}

/**
 * Compute mission success probability based on assigned leader's spec match.
 */
export function getMissionSuccessChance(
  requiredSpec: Leader['specialization'] | undefined,
  assignedLeader: Leader | undefined
): number {
  const base = 0.75;
  if (!assignedLeader) return base;

  const specMatch = requiredSpec && assignedLeader.specialization === requiredSpec ? 0.15 : 0;
  const levelBonus = (assignedLeader.level - 1) * 0.02;
  const rarityBonus =
    assignedLeader.rarity === 'legendary' ? 0.08 :
    assignedLeader.rarity === 'rare' ? 0.05 : 0;

  return Math.min(0.98, base + specMatch + levelBonus + rarityBonus);
}
