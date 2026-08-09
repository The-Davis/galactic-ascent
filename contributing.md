# Contributing to Galactic Ascent

Galactic Ascent is built on a data-driven architecture. Adding new content (factions, buildings, missions, and leaders) rarely requires changing core logic. Instead, you define new entities in the `src/data/` directory.

This guide explains how to define and add new content to the game.

---

## 1. Defining Factions

Factions define the core alignments a player can choose. They are defined in `src/data/factions.ts`.

### Steps:
1. **Update Types:** First, add your new faction ID to the `FactionId` union type in `src/types/factions.ts`.
2. **Add Data:** Add a new `Faction` object to the `FACTIONS` array in `src/data/factions.ts`.

### Example Faction:
```typescript
{
  id: 'new_faction_id', // Must match the type you added
  name: 'The Obsidian Vanguard',
  tagline: 'Strength in Unity',
  description: 'A militant order dedicated to protecting the outer rim.',
  lore: 'Forged in the fires of the First Galactic War...',
  color: '#ef4444', // Used for UI accents and the sun color
  icon: '⚔️',
  bonus: {
    productionBonus: { minerals: 2, influence: 1 }, // Flat bonus per tick
    leaderAffinity: 'military', // Boosts XP gain for military leaders
    bonusBuildingName: 'Obsidian Citadel',
  },
}
```
*Note: If you add a faction, you MUST also add their exclusive building to `src/data/buildings.ts` matching the `factionExclusive` property to your new faction ID.*

---

## 2. Defining Buildings

Buildings are the core of the economy. Defined in `src/data/buildings.ts`.

### Key Properties:
- `baseCost`: The initial cost to construct the building.
- `costMultiplier`: The exponential scaling factor for upgrades (usually between `1.15` and `1.3`).
- `baseProduction`: The resources generated per second at level 1.
- `productionMultiplier`: How much production increases per level (usually between `1.1` and `1.25`).
- `unlockMissionId`: (Optional) The ID of a mission that must be completed before this building appears in the build menu.
- `factionExclusive`: (Optional) If set, only players aligned with this faction can build it.

---

## 3. Defining Missions

Missions drive the story and unlock content. Defined in `src/data/missions.ts`.

### Key Properties:
- `durationMs`: Real-time duration of the mission.
- `prerequisite`: (Optional) The `MissionId` of the mission that must be completed first. This creates mission chains.
- `cost`: Resources required to start the mission.
- `reward`: Defines the payout (`resources`, `xp`, and optional `unlocksLeader` or `unlocksBuilding`).
- `choices`: (Optional) An array of choices presented when claiming the reward. Choices can apply dynamic multipliers to the base rewards.
- `recommendedSpec`: The leader specialization (e.g., `'science'`) that grants the highest success chance.

### Steps:
1. Add the new mission ID to the `MissionId` type in `src/types/missions.ts`.
2. Add the mission object to the `MISSIONS` array in `src/data/missions.ts`.

---

## 4. Defining Leaders

Leaders boost building production and run missions. Defined in `src/data/leaders.ts`.

### Key Properties:
- `specialization`: `'military' | 'science' | 'economic' | 'subterfuge'`
- `rarity`: `'common' | 'rare' | 'legendary'` (Dictates recruit cost and background glow)
- `productionBonus`: Base production multiplier applied to the building they are assigned to (e.g., `0.1` = +10%). This scales up as they level up.

### How Leaders are Unlocked:
- **Starter Leaders:** Added to the `STARTER_LEADER_NAMES` array to be available immediately.
- **Mission Unlocked:** Mapped in the `MISSION_UNLOCKED_LEADERS` record (e.g., `'unlock_lyra': 'Dr. Lyra Sol'`). A mission's `reward.unlocksLeader` property points to this key.

## 5. State Management Note

If you add entirely new *mechanics* (like combat or ship inventory), you will need to expand `GameState` in `src/types/game.ts` and add the corresponding actions to `src/stores/gameStore.ts`. Always remember to ensure that new state selectors that return Objects or Arrays are wrapped in `useShallow()` at the component level to prevent React infinite loops!
