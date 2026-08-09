import type { Mission } from '../types/missions';

export const MISSIONS: Mission[] = [
  {
    id: 'awakening',
    chapter: 1,
    title: 'Chapter 1: The Awakening',
    description:
      'Your star system has been dormant for decades. A mysterious energy pulse has activated ancient beacon technology — someone out there knows you exist.',
    flavor: '"The stars do not sleep forever. Nor do those who claim them." — Unknown Transmission',
    duration: 60,
    cost: { credits: 20 },
    reward: {
      resources: { credits: 80, minerals: 50 },
      xp: 100,
    },
    recommendedSpec: 'military',
    prerequisite: undefined,
    choices: [
      {
        id: 'broadcast',
        label: 'Broadcast a Response',
        description: 'Answer the pulse with your own signal. Risky, but may attract allies.',
        bonusReward: { resources: { influence: 30 } },
      },
      {
        id: 'observe',
        label: 'Observe in Silence',
        description: 'Monitor incoming signals without revealing your position.',
        bonusReward: { resources: { research: 20 } },
      },
    ],
  },
  {
    id: 'first_contact',
    chapter: 1,
    title: 'Chapter 1: First Contact',
    description:
      'A trade convoy from a neighboring system has entered your space. Establish diplomatic relations before they grow suspicious of your rapid expansion.',
    flavor: '"Every empire begins with a single handshake — or a single shot." — Galactic Diplomatist Guild',
    duration: 120,
    cost: { credits: 40, influence: 20 },
    reward: {
      resources: { credits: 120, research: 60 },
      xp: 200,
      unlocksBuilding: 'research_lab',
    },
    recommendedSpec: 'economic',
    prerequisite: 'awakening',
    choices: [
      {
        id: 'trade_deal',
        label: 'Propose a Trade Agreement',
        description: 'Offer favorable terms. Builds trust and opens markets.',
        bonusReward: { resources: { credits: 60 } },
      },
      {
        id: 'intimidate',
        label: 'Show of Force',
        description: 'Escort the convoy with warships. They\'ll respect you, if not like you.',
        bonusReward: { resources: { influence: 50 } },
      },
    ],
  },
  {
    id: 'resource_crisis',
    chapter: 2,
    title: 'Chapter 2: Resource Crisis',
    description:
      'Seismic activity has disrupted your primary mining operations. Deploy engineers to restore output before your expansion plans collapse.',
    flavor: '"When the ground shakes, only the prepared do not fall." — Engineering Corps Motto',
    duration: 180,
    cost: { credits: 80, minerals: 60 },
    reward: {
      resources: { minerals: 200, credits: 100 },
      xp: 350,
      unlocksBuilding: 'shipyard',
    },
    recommendedSpec: 'science',
    prerequisite: 'first_contact',
  },
  {
    id: 'shadow_threat',
    chapter: 2,
    title: 'Chapter 2: Shadow Threat',
    description:
      'Intelligence reports indicate a covert faction is planting agents in your system. Root them out before they compromise your operations.',
    flavor: '"The knife you cannot see is the one that kills you." — Shadow Syndicate Proverb',
    duration: 240,
    cost: { credits: 100, influence: 80 },
    reward: {
      resources: { influence: 180, research: 80 },
      xp: 500,
      unlocksBuilding: 'intelligence_outpost',
      unlocksLeader: 'aria_vex',
    },
    recommendedSpec: 'subterfuge',
    prerequisite: 'resource_crisis',
    choices: [
      {
        id: 'expose',
        label: 'Public Exposure',
        description: 'Broadcast evidence of the infiltration to rally galactic support.',
        bonusReward: { resources: { influence: 80 } },
      },
      {
        id: 'double_agent',
        label: 'Turn a Double Agent',
        description: 'Recruit one of their own to feed you intel.',
        bonusReward: { resources: { research: 60 }, xp: 100 },
      },
    ],
  },
  {
    id: 'alliances_forged',
    chapter: 3,
    title: 'Chapter 3: Alliances Forged',
    description:
      'Three minor star systems are willing to join your sphere of influence — for a price. Negotiate the terms of your growing coalition.',
    flavor: '"Power is not held by those with the most weapons, but by those with the most friends." — High Council Archives',
    duration: 300,
    cost: { credits: 200, influence: 150 },
    reward: {
      resources: { credits: 300, influence: 200, research: 100 },
      xp: 750,
      unlocksBuilding: 'habitation_dome',
      unlocksLeader: 'commander_kael',
    },
    recommendedSpec: 'economic',
    prerequisite: 'shadow_threat',
  },
  {
    id: 'the_nexus_war',
    chapter: 3,
    title: 'Chapter 3: The Nexus War',
    description:
      'A rival power has attacked the Galactic Nexus — the ancient communications relay that connects all civilizations. You must decide: defend it, exploit the chaos, or broker a ceasefire.',
    flavor: '"The Nexus is not a place. It is the memory of what we once were." — Keeper Inscription',
    duration: 360,
    cost: { credits: 300, minerals: 200, research: 100 },
    reward: {
      resources: { credits: 500, minerals: 300, research: 200, influence: 200 },
      xp: 1200,
      unlocksLeader: 'dr_lyra_sol',
    },
    recommendedSpec: 'military',
    prerequisite: 'alliances_forged',
    choices: [
      {
        id: 'defend',
        label: 'Defend the Nexus',
        description: 'Deploy your fleet. Win the battle and earn galactic respect.',
        bonusReward: { resources: { influence: 150 }, xp: 300 },
      },
      {
        id: 'exploit',
        label: 'Exploit the Chaos',
        description: 'Seize Nexus infrastructure while others fight.',
        bonusReward: { resources: { credits: 200, research: 100 } },
      },
      {
        id: 'broker',
        label: 'Broker a Ceasefire',
        description: 'Position yourself as the galaxy\'s peacekeeper.',
        bonusReward: { resources: { influence: 200 } },
      },
    ],
  },
  {
    id: 'galactic_ascent',
    chapter: 4,
    title: 'Chapter 4: Galactic Ascent',
    description:
      'The moment of destiny has arrived. With your faction\'s full support, launch your bid for galactic supremacy. Victory here will cement your legacy across the stars — and unlock reincarnation.',
    flavor: '"From a single star, an empire was born. Today, the galaxy bends its knee." — The Ascendant Chronicle',
    duration: 600,
    cost: { credits: 500, minerals: 400, research: 300, influence: 300 },
    reward: {
      resources: { credits: 1000, minerals: 800, research: 500, influence: 500 },
      xp: 3000,
    },
    recommendedSpec: 'military',
    prerequisite: 'the_nexus_war',
  },
];

export const MISSION_MAP = Object.fromEntries(
  MISSIONS.map((m) => [m.id, m])
) as Record<string, Mission>;
