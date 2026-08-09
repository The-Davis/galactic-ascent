import type { Faction } from '../types/factions';

export const FACTIONS: Faction[] = [
  {
    id: 'stellar_dominion',
    name: 'Stellar Dominion',
    tagline: 'Forge an empire among the stars',
    description:
      'A militaristic empire that believes strength is the only path to galactic order. Their industrial prowess is unmatched.',
    lore:
      'Born from the ashes of the old galactic republic, the Stellar Dominion rose to power through overwhelming military force. They maintain order across dozens of systems through an iron grip on resource production and shipyard dominance.',
    color: '#f59e0b',
    gradientFrom: 'from-amber-900',
    gradientTo: 'to-orange-950',
    icon: '⚔️',
    bonus: {
      productionBonus: { minerals: 2, credits: 1 },
      leaderAffinity: 'military',
      bonusBuildingName: 'Imperial Forge',
    },
    bonusBuildingId: 'imperial_forge',
  },
  {
    id: 'void_consortium',
    name: 'Void Consortium',
    tagline: 'Profit from the darkness between stars',
    description:
      'A ruthless mercantile federation that extracts wealth from the void itself. Credits flow where they lead.',
    lore:
      'Operating from mobile station fleets that drift through deep space, the Void Consortium has no homeworld — only profit margins. They discovered how to harvest dark matter as an energy currency, making them extraordinarily wealthy.',
    color: '#8b5cf6',
    gradientFrom: 'from-violet-900',
    gradientTo: 'to-purple-950',
    icon: '💠',
    bonus: {
      productionBonus: { credits: 3 },
      leaderAffinity: 'economic',
      bonusBuildingName: 'Void Extractor',
    },
    bonusBuildingId: 'void_extractor',
  },
  {
    id: 'technocratic_hegemony',
    name: 'Technocratic Hegemony',
    tagline: 'Knowledge is the ultimate weapon',
    description:
      'An advanced civilization governed entirely by scientific achievement. Research output is their measure of power.',
    lore:
      'The Hegemony emerged when a loose coalition of research stations achieved technological singularity. Their citizens earn status through academic merit, and their AI-assisted governance has never lost a technological arms race.',
    color: '#06b6d4',
    gradientFrom: 'from-cyan-900',
    gradientTo: 'to-sky-950',
    icon: '🔬',
    bonus: {
      productionBonus: { research: 3 },
      leaderAffinity: 'science',
      bonusBuildingName: 'Data Nexus',
    },
    bonusBuildingId: 'data_nexus',
  },
  {
    id: 'shadow_syndicate',
    name: 'Shadow Syndicate',
    tagline: 'Every secret has a price',
    description:
      'A decentralized network of spies, assassins, and information brokers. They control galactic politics from the shadows.',
    lore:
      'No one knows who leads the Shadow Syndicate — or if anyone does. Their agents are embedded in every major government, and their shadow networks relay intelligence across the galaxy faster than any official channel.',
    color: '#10b981',
    gradientFrom: 'from-emerald-900',
    gradientTo: 'to-teal-950',
    icon: '🕵️',
    bonus: {
      productionBonus: { influence: 3 },
      leaderAffinity: 'subterfuge',
      bonusBuildingName: 'Shadow Network',
    },
    bonusBuildingId: 'shadow_network',
  },
  {
    id: 'organic_collective',
    name: 'Organic Collective',
    tagline: 'Life finds a way across the cosmos',
    description:
      'A hive-mind alliance of living worlds. They grow, adapt, and overwhelm through sheer biological diversity.',
    lore:
      'The Collective was not founded — it evolved. When fungal neural networks on a dozen worlds spontaneously connected through spore-based FTL communication, a new consciousness emerged. They do not conquer; they absorb.',
    color: '#84cc16',
    gradientFrom: 'from-lime-900',
    gradientTo: 'to-green-950',
    icon: '🌿',
    bonus: {
      productionBonus: { minerals: 1, research: 1, influence: 1 },
      leaderAffinity: 'science',
      bonusBuildingName: 'Bio-Synthesis Hub',
    },
    bonusBuildingId: 'bio_synthesis_hub',
  },
];

export const FACTION_MAP = Object.fromEntries(
  FACTIONS.map((f) => [f.id, f])
) as Record<string, Faction>;
