# Planning: Upcoming Features & Roadmap

The Galactic Ascent MVP is functionally complete. Moving forward, the project roadmap focuses on deepening the game loops, enhancing progression systems, and polishing the user experience.

## Phase 2: Gear & Equipment System
Leaders currently gain XP and levels, but their gear slots are unused.
- **Implementation:** Expose the `GearItem` and `GearSlot` systems defined in `src/types/leaders.ts`.
- **Mechanics:** Missions can drop gear items instead of just resources. Players can equip these items to leaders (Weapon, Armor, Tech, Intel) to provide further multipliers to production (+X%) and mission success chances (+Y%).
- **UI:** Expand the `LeaderCard` to include 4 equippable slots.

## Phase 3: Advanced Mission Mechanics
The current mission system uses a guaranteed success (100%) or partial success mechanic based on leader specialization.
- **Mission Failure / Risk:** Implement failure chances where leaders can be "injured" (placed on a cooldown where they provide no production bonuses) if a mission fails.
- **Dynamic Encounters:** Introduce random events that pop up during active missions requiring player intervention (e.g., choosing to spend extra resources to guarantee success).

## Phase 4: Combat & Fleet Management
A major expansion beyond base building.
- **Ships:** A new entity type built at the Shipyard. Ships have stats (Attack, Defense, Speed).
- **Galactic Map:** A new screen showing neighboring star systems.
- **PvE Encounters:** Send fleets led by Military-specialized leaders to conquer pirate outposts for rare resources.

## Phase 5: Faction Depth & Prestige Enhancements
- **Unique Faction UI Themes:** When you pledge to a faction, the app's global accent colors (and maybe the starfield background) shift to match that faction's aesthetic.
- **Incarnation Milestones:** Beyond just a +5% production boost, reaching Incarnation 5 or 10 with a faction unlocks a unique passive ability (e.g., "Missions take 20% less time").

## Phase 6: Polish & Game Feel
- **Audio:** Background ambient space music and satisfying sci-fi UI sound effects for clicking, collecting resources, and completing missions.
- **Particle Effects:** Subtle CSS/Canvas particle animations that fire when a building finishes upgrading or when a large sum of resources is collected.
- **Notifications:** Expand the toast notification system to show offline earning breakdowns dynamically upon login.
