import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { GameState, ScreenId, PermanentBonuses } from '../types/game';
import type { FactionId } from '../types/factions';
import type { BuildingId, BuildingInstance } from '../types/buildings';
import type { Leader } from '../types/leaders';
import type { MissionId } from '../types/missions';
import type { Resources } from '../types/resources';
import { EMPTY_RESOURCES, addResources, subtractResources, canAfford } from '../types/resources';
import { BUILDING_DEFS, BUILDING_MAP, getBuildingCost } from '../data/buildings';
import { MISSIONS, MISSION_MAP } from '../data/missions';
import { LEADER_POOL, RECRUIT_COSTS, MISSION_UNLOCKED_LEADERS, STARTER_LEADER_NAMES } from '../data/leaders';
import { saveGame, loadGame, deleteSave } from '../utils/storage';
import { calculateOfflineEarnings, calculateTotalProduction, accumulatePendingResources } from '../utils/gameEngine';
import { xpForLevel } from '../types/leaders';

// ─── Store Shape ──────────────────────────────────────────────────────────────

interface GameStore extends GameState {
  // ── Navigation ──
  navigate: (screen: ScreenId) => void;

  // ── New Game / Load ──
  startNewGame: (playerName: string, factionId: FactionId) => void;
  loadSavedGame: () => boolean;
  resetGame: () => void;

  // ── Resources ──
  addResources: (delta: Partial<Resources>) => void;
  tickResources: (now: number) => void;

  // ── Buildings ──
  buildBuilding: (defId: BuildingId) => boolean;
  upgradeBuilding: (defId: BuildingId) => boolean;
  collectBuilding: (defId: BuildingId) => void;
  collectAllBuildings: () => void;

  // ── Leaders ──
  recruitLeader: (leaderName: string) => boolean;
  assignLeader: (leaderId: string, target: string | null) => void;
  awardLeaderXp: (leaderId: string, xp: number) => void;

  // ── Missions ──
  startMission: (missionId: MissionId, leaderId?: string, choiceId?: string) => boolean;
  completeMission: (missionId: MissionId) => void;
  claimMissionReward: (missionId: MissionId) => void;

  // ── Reincarnation ──
  reincarnate: () => void;

  // ── Persistence ──
  saveToLocal: () => void;

  // ── Notifications ──
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  clearNotification: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function createLeaderFromPool(name: string): Leader | null {
  const template = LEADER_POOL.find((l) => l.name === name);
  if (!template) return null;
  return {
    ...template,
    id: generateId(),
    level: 1,
    xp: 0,
    xpToNextLevel: xpForLevel(1),
    assignedTo: null,
  };
}

function createStarterBuildings(factionId: FactionId): BuildingInstance[] {
  const now = Date.now();
  const starters = BUILDING_DEFS.filter((b) => b.starterBuilding);
  const factionBuilding = BUILDING_DEFS.find((b) => b.factionExclusive === factionId);

  const all = factionBuilding ? [...starters, factionBuilding] : starters;
  return all.map((b) => ({
    defId: b.id,
    level: 1,
    lastCollected: now,
    pendingResources: { ...EMPTY_RESOURCES },
  }));
}

function createStarterLeaders(): Leader[] {
  return STARTER_LEADER_NAMES
    .map(createLeaderFromPool)
    .filter(Boolean) as Leader[];
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    // ── Initial State ─────────────────────────────────────────────────────────
    playerName: '',
    incarnation: 1,
    factionId: null,
    currentScreen: 'intro',
    resources: { ...EMPTY_RESOURCES },
    buildings: [],
    leaders: [],
    missionStates: [],
    permanentBonuses: {},
    lastSaved: Date.now(),
    createdAt: Date.now(),
    notification: null,

    // ── Navigation ────────────────────────────────────────────────────────────
    navigate: (screen) => set({ currentScreen: screen }),

    // ── New Game ──────────────────────────────────────────────────────────────
    startNewGame: (playerName, factionId) => {
      const now = Date.now();
      const savedBonuses = get().permanentBonuses;

      set({
        playerName,
        factionId,
        incarnation: 1,
        currentScreen: 'base',
        resources: { credits: 200, minerals: 100, research: 0, influence: 0 },
        buildings: createStarterBuildings(factionId),
        leaders: createStarterLeaders(),
        missionStates: [],
        permanentBonuses: savedBonuses,
        createdAt: now,
        lastSaved: now,
      });

      get().saveToLocal();
    },

    // ── Load Saved Game ───────────────────────────────────────────────────────
    loadSavedGame: () => {
      const saved = loadGame();
      if (!saved) return false;

      // Calculate offline earnings
      const production = saved.factionId
        ? calculateTotalProduction(
            saved.buildings ?? [],
            saved.leaders ?? [],
            saved.factionId,
            saved.permanentBonuses ?? {}
          )
        : { ...EMPTY_RESOURCES };

      const offline = calculateOfflineEarnings(saved.lastSaved ?? Date.now(), production);
      const mergedResources = addResources(saved.resources ?? EMPTY_RESOURCES, offline);

      set({
        ...saved,
        resources: mergedResources,
        lastSaved: Date.now(),
        notification:
          Object.values(offline).some((v) => v > 0.5)
            ? { message: `Welcome back! Earned resources while you were away.`, type: 'info' }
            : null,
      } as GameState);

      return true;
    },

    // ── Reset Game ────────────────────────────────────────────────────────────
    resetGame: () => {
      deleteSave();
      set({
        playerName: '',
        factionId: null,
        incarnation: 1,
        currentScreen: 'intro',
        resources: { ...EMPTY_RESOURCES },
        buildings: [],
        leaders: [],
        missionStates: [],
        permanentBonuses: {},
        lastSaved: Date.now(),
        createdAt: Date.now(),
        notification: null,
      });
    },

    // ── Resources ─────────────────────────────────────────────────────────────
    addResources: (delta) => {
      set((state) => ({
        resources: addResources(state.resources, delta),
      }));
    },

    tickResources: (now) => {
      set((state) => {
        if (!state.factionId) return state;

        // Accumulate pending resources on all buildings
        const updatedBuildings = accumulatePendingResources(
          state.buildings,
          state.leaders,
          state.factionId,
          state.permanentBonuses,
          now
        );

        // Check for newly completed missions
        const updatedMissions = state.missionStates.map((ms) => {
          if (!ms.completedAt && ms.startedAt) {
            const mission = MISSION_MAP[ms.missionId];
            if (mission && now >= ms.startedAt + mission.duration * 1000) {
              return { ...ms, completedAt: now };
            }
          }
          return ms;
        });

        return {
          buildings: updatedBuildings,
          missionStates: updatedMissions,
        };
      });
    },

    // ── Buildings ─────────────────────────────────────────────────────────────
    buildBuilding: (defId) => {
      const state = get();
      const def = BUILDING_MAP[defId];
      if (!def) return false;

      // Check faction exclusivity
      if (def.factionExclusive && def.factionExclusive !== state.factionId) {
        get().showNotification('This building requires a different faction.', 'error');
        return false;
      }

      // Check already built
      if (state.buildings.some((b) => b.defId === defId)) {
        get().showNotification('Building already constructed.', 'error');
        return false;
      }

      const cost = getBuildingCost(def, 0);
      if (!canAfford(state.resources, cost)) {
        get().showNotification('Not enough resources.', 'error');
        return false;
      }

      const now = Date.now();
      set((s) => ({
        resources: subtractResources(s.resources, cost),
        buildings: [
          ...s.buildings,
          { defId, level: 1, lastCollected: now, pendingResources: { ...EMPTY_RESOURCES } },
        ],
      }));
      get().showNotification(`${def.name} constructed!`, 'success');
      get().saveToLocal();
      return true;
    },

    upgradeBuilding: (defId) => {
      const state = get();
      const building = state.buildings.find((b) => b.defId === defId);
      const def = BUILDING_MAP[defId];
      if (!building || !def) return false;
      if (building.level >= def.maxLevel) {
        get().showNotification('Already at maximum level.', 'error');
        return false;
      }

      const cost = getBuildingCost(def, building.level);
      if (!canAfford(state.resources, cost)) {
        get().showNotification('Not enough resources.', 'error');
        return false;
      }

      set((s) => ({
        resources: subtractResources(s.resources, cost),
        buildings: s.buildings.map((b) =>
          b.defId === defId ? { ...b, level: b.level + 1 } : b
        ),
      }));
      get().showNotification(`${def.name} upgraded to Lv${building.level + 1}!`, 'success');
      get().saveToLocal();
      return true;
    },

    collectBuilding: (defId) => {
      const state = get();
      const building = state.buildings.find((b) => b.defId === defId);
      if (!building) return;

      const pending = building.pendingResources ?? {};
      if (Object.values(pending).every((v) => (v ?? 0) < 0.01)) return;

      set((s) => ({
        resources: addResources(s.resources, pending),
        buildings: s.buildings.map((b) =>
          b.defId === defId ? { ...b, pendingResources: { ...EMPTY_RESOURCES } } : b
        ),
      }));
    },

    collectAllBuildings: () => {
      const state = get();
      let collected = { ...EMPTY_RESOURCES };

      const updatedBuildings = state.buildings.map((b) => {
        const pending = b.pendingResources ?? {};
        collected = addResources(collected, pending) as Resources;
        return { ...b, pendingResources: { ...EMPTY_RESOURCES } };
      });

      set((s) => ({
        resources: addResources(s.resources, collected),
        buildings: updatedBuildings,
      }));
      get().showNotification('All resources collected!', 'success');
    },

    // ── Leaders ───────────────────────────────────────────────────────────────
    recruitLeader: (leaderName) => {
      const state = get();

      // Already recruited?
      if (state.leaders.some((l) => l.name === leaderName)) {
        get().showNotification('Leader already recruited.', 'error');
        return false;
      }

      const template = LEADER_POOL.find((l) => l.name === leaderName);
      if (!template) return false;

      const cost = RECRUIT_COSTS[template.rarity];
      if (!canAfford(state.resources, cost)) {
        get().showNotification('Not enough resources to recruit.', 'error');
        return false;
      }

      const leader = createLeaderFromPool(leaderName);
      if (!leader) return false;

      set((s) => ({
        resources: subtractResources(s.resources, cost),
        leaders: [...s.leaders, leader],
      }));
      get().showNotification(`${leaderName} recruited!`, 'success');
      get().saveToLocal();
      return true;
    },

    assignLeader: (leaderId, target) => {
      set((s) => ({
        leaders: s.leaders.map((l) => {
          // Unassign any leader currently assigned to this target
          if (target && l.assignedTo === target && l.id !== leaderId) {
            return { ...l, assignedTo: null };
          }
          if (l.id === leaderId) return { ...l, assignedTo: target };
          return l;
        }),
      }));
      get().saveToLocal();
    },

    awardLeaderXp: (leaderId, xp) => {
      set((s) => ({
        leaders: s.leaders.map((l) => {
          if (l.id !== leaderId) return l;
          let newXp = l.xp + xp;
          let newLevel = l.level;
          let newXpToNext = l.xpToNextLevel;

          while (newXp >= newXpToNext && newLevel < 20) {
            newXp -= newXpToNext;
            newLevel++;
            newXpToNext = xpForLevel(newLevel);
          }

          return { ...l, xp: newXp, level: newLevel, xpToNextLevel: newXpToNext };
        }),
      }));
    },

    // ── Missions ──────────────────────────────────────────────────────────────
    startMission: (missionId, leaderId, choiceId) => {
      const state = get();
      const mission = MISSION_MAP[missionId];
      if (!mission) return false;

      // Already in progress or completed?
      const existing = state.missionStates.find((m) => m.missionId === missionId);
      if (existing) return false;

      // Prerequisite check
      if (mission.prerequisite) {
        const prereq = state.missionStates.find(
          (m) => m.missionId === mission.prerequisite && m.rewardClaimed
        );
        if (!prereq) {
          get().showNotification('Complete the previous mission first.', 'error');
          return false;
        }
      }

      if (!canAfford(state.resources, mission.cost)) {
        get().showNotification('Not enough resources to start this mission.', 'error');
        return false;
      }

      // Assign leader to mission if provided
      if (leaderId) {
        get().assignLeader(leaderId, missionId);
      }

      const now = Date.now();
      set((s) => ({
        resources: subtractResources(s.resources, mission.cost),
        missionStates: [
          ...s.missionStates,
          { missionId, startedAt: now, rewardClaimed: false, choiceId, assignedLeaderId: leaderId },
        ],
      }));

      get().showNotification(`Mission started: ${mission.title}`, 'info');
      return true;
    },

    completeMission: (missionId) => {
      const state = get();
      const ms = state.missionStates.find((m) => m.missionId === missionId);
      if (!ms || ms.completedAt) return;

      set((s) => ({
        missionStates: s.missionStates.map((m) =>
          m.missionId === missionId ? { ...m, completedAt: Date.now() } : m
        ),
      }));
    },

    claimMissionReward: (missionId) => {
      const state = get();
      const ms = state.missionStates.find((m) => m.missionId === missionId);
      const mission = MISSION_MAP[missionId];
      if (!ms || !mission || ms.rewardClaimed || !ms.completedAt) return;

      let reward = { ...mission.reward };

      // Apply choice bonus
      if (ms.choiceId && mission.choices) {
        const choice = mission.choices.find((c) => c.id === ms.choiceId);
        if (choice?.bonusReward.resources) {
          reward.resources = addResources(reward.resources, choice.bonusReward.resources) as Partial<Resources>;
        }
        if (choice?.bonusReward.xp) {
          reward.xp = (reward.xp ?? 0) + (choice.bonusReward.xp ?? 0);
        }
      }

      // Award resources
      if (reward.resources) {
        set((s) => ({ resources: addResources(s.resources, reward.resources!) }));
      }

      // Award XP to assigned leader
      if (ms.assignedLeaderId && reward.xp) {
        get().awardLeaderXp(ms.assignedLeaderId, reward.xp);
        // Unassign leader from mission
        get().assignLeader(ms.assignedLeaderId, null);
      }

      // Unlock mission-gated building
      if (reward.unlocksBuilding) {
        const def = BUILDING_MAP[reward.unlocksBuilding as BuildingId];
        if (def) get().showNotification(`${def.name} is now available to build!`, 'info');
      }

      // Unlock mission leader
      if (reward.unlocksLeader) {
        const leaderName = MISSION_UNLOCKED_LEADERS[reward.unlocksLeader];
        if (leaderName) {
          const alreadyRecruited = state.leaders.some((l) => l.name === leaderName);
          if (!alreadyRecruited) {
            const leader = createLeaderFromPool(leaderName);
            if (leader) {
              set((s) => ({ leaders: [...s.leaders, leader] }));
              get().showNotification(`${leaderName} has joined your cause!`, 'success');
            }
          }
        }
      }

      set((s) => ({
        missionStates: s.missionStates.map((m) =>
          m.missionId === missionId ? { ...m, rewardClaimed: true } : m
        ),
      }));

      get().saveToLocal();
    },

    // ── Reincarnation ─────────────────────────────────────────────────────────
    reincarnate: () => {
      const state = get();
      if (!state.factionId) return;

      // Stack permanent bonus for current faction
      const newBonuses: PermanentBonuses = {
        ...state.permanentBonuses,
        [state.factionId]: (state.permanentBonuses[state.factionId] ?? 0) + 1,
      };

      const now = Date.now();
      set({
        incarnation: state.incarnation + 1,
        currentScreen: 'faction_select',
        resources: { ...EMPTY_RESOURCES },
        buildings: [],
        leaders: [],
        missionStates: [],
        permanentBonuses: newBonuses,
        lastSaved: now,
        createdAt: now,
        notification: { message: 'Reincarnation complete. Choose your new allegiance.', type: 'info' },
      });

      get().saveToLocal();
    },

    // ── Persistence ───────────────────────────────────────────────────────────
    saveToLocal: () => {
      const state = get();
      saveGame({ ...state, lastSaved: Date.now() });
    },

    // ── Notifications ─────────────────────────────────────────────────────────
    showNotification: (message, type = 'info') => {
      set({ notification: { message, type } });
      setTimeout(() => {
        const current = get().notification;
        if (current?.message === message) {
          set({ notification: null });
        }
      }, 3500);
    },

    clearNotification: () => set({ notification: null }),
  }))
);

// ── Selectors ─────────────────────────────────────────────────────────────────
//
// RULE: Selectors used directly with useGameStore(selector) MUST return a
// primitive (string, number, boolean) or a STABLE reference. Returning a new
// object/array on every call violates useSyncExternalStore's getSnapshot
// contract and causes an infinite render loop.
//
// FIX: Production is split into four number selectors (primitives are compared
// by value so they never trigger false re-renders). Array/object selectors
// (buildings, leaders, missions) must be consumed with `useShallow`.

// ── Production — 4 stable primitive selectors ──────────────────────────────
const _prod = (state: GameStore) =>
  state.factionId
    ? calculateTotalProduction(state.buildings, state.leaders, state.factionId, state.permanentBonuses)
    : { credits: 0, minerals: 0, research: 0, influence: 0 };

export const selectProductionCredits   = (s: GameStore): number => _prod(s).credits;
export const selectProductionMinerals  = (s: GameStore): number => _prod(s).minerals;
export const selectProductionResearch  = (s: GameStore): number => _prod(s).research;
export const selectProductionInfluence = (s: GameStore): number => _prod(s).influence;

// ── Mission status — returns a string literal (primitive) ──────────────────
export const selectMissionStatus = (missionId: MissionId) => (state: GameStore): string => {
  const ms = state.missionStates.find((m) => m.missionId === missionId);
  const mission = MISSION_MAP[missionId];
  if (!ms) {
    if (mission?.prerequisite) {
      const prereq = state.missionStates.find(
        (m) => m.missionId === mission.prerequisite && m.rewardClaimed
      );
      return prereq ? 'available' : 'locked';
    }
    return 'available';
  }
  if (!ms.completedAt) return 'in_progress';
  if (!ms.rewardClaimed) return 'completed';
  return 'claimed';
};

// ── Array selectors — MUST be wrapped in useShallow at the call-site ───────
export const selectUnlockedBuildings = (state: GameStore) => {
  const claimedMissions = new Set(
    state.missionStates.filter((m) => m.rewardClaimed).map((m) => m.missionId)
  );
  return BUILDING_DEFS.filter((def) => {
    if (def.factionExclusive && def.factionExclusive !== state.factionId) return false;
    if (def.unlockMissionId && !claimedMissions.has(def.unlockMissionId as MissionId)) return false;
    return true;
  });
};

export const selectAvailableLeaders = (state: GameStore) => {
  const claimedMissions = new Set(
    state.missionStates.filter((m) => m.rewardClaimed).map((m) => m.missionId)
  );
  return LEADER_POOL.filter((leader) => {
    if (STARTER_LEADER_NAMES.includes(leader.name)) return true;
    const unlockKey = Object.keys(MISSION_UNLOCKED_LEADERS).find(
      (k) => MISSION_UNLOCKED_LEADERS[k] === leader.name
    );
    if (unlockKey) {
      const unlockMission = MISSIONS.find((m) => m.reward.unlocksLeader === unlockKey);
      if (unlockMission) return claimedMissions.has(unlockMission.id);
    }
    return false;
  });
};

// ── Boolean selectors — primitives, always safe ────────────────────────────
export const selectCanReincarnate = (state: GameStore): boolean =>
  state.missionStates.some((m) => m.missionId === 'galactic_ascent' && m.rewardClaimed);

