import type { Resources } from './resources';
import type { LeaderSpecialization } from './factions';

export type MissionId =
  | 'awakening'
  | 'first_contact'
  | 'resource_crisis'
  | 'shadow_threat'
  | 'alliances_forged'
  | 'the_nexus_war'
  | 'galactic_ascent';

export interface MissionReward {
  resources: Partial<Resources>;
  xp: number;
  /** Leader pool entry ID unlocked by completing this mission */
  unlocksLeader?: string;
  /** Building ID unlocked */
  unlocksBuilding?: string;
}

export interface MissionChoice {
  id: string;
  label: string;
  description: string;
  /** Extra bonus applied on top of base reward */
  bonusReward: Partial<MissionReward>;
}

export interface Mission {
  id: MissionId;
  chapter: number;
  title: string;
  description: string;
  flavor: string;
  /** Duration in seconds */
  duration: number;
  cost: Partial<Resources>;
  reward: MissionReward;
  /** Required specialization of assigned leader for bonus roll */
  recommendedSpec?: LeaderSpecialization;
  /** Mission that must be completed first */
  prerequisite?: MissionId;
  choices?: MissionChoice[];
}

export type MissionStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export interface MissionState {
  missionId: MissionId;
  startedAt: number;       // epoch ms
  completedAt?: number;    // epoch ms; undefined = still running
  choiceId?: string;
  rewardClaimed: boolean;
  assignedLeaderId?: string;
}
