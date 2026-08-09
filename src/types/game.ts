import type { FactionId } from './factions';
import type { Resources } from './resources';
import type { BuildingInstance } from './buildings';
import type { Leader } from './leaders';
import type { MissionState } from './missions';

export type ScreenId =
  | 'intro'
  | 'faction_select'
  | 'base'
  | 'missions'
  | 'leaders'
  | 'reincarnate';

/** Permanent bonuses earned per faction across all incarnations */
export type PermanentBonuses = Partial<Record<FactionId, number>>;

export interface GameState {
  // Meta
  playerName: string;
  incarnation: number;
  factionId: FactionId | null;
  currentScreen: ScreenId;

  // Economy
  resources: Resources;

  // Entities
  buildings: BuildingInstance[];
  leaders: Leader[];
  missionStates: MissionState[];

  // Progression
  permanentBonuses: PermanentBonuses;
  /** Timestamp of last game save */
  lastSaved: number;
  /** Timestamp of game creation */
  createdAt: number;

  // Notification
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
}

export const DEFAULT_GAME_STATE: Omit<GameState, 'createdAt' | 'lastSaved'> = {
  playerName: '',
  incarnation: 1,
  factionId: null,
  currentScreen: 'intro',
  resources: { credits: 0, minerals: 0, research: 0, influence: 0 },
  buildings: [],
  leaders: [],
  missionStates: [],
  permanentBonuses: {},
  notification: null,
};
