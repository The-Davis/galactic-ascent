// ============================================================
// Resources
// ============================================================

export type ResourceType = 'credits' | 'minerals' | 'research' | 'influence';

export type Resources = Record<ResourceType, number>;

export const RESOURCE_LABELS: Record<ResourceType, string> = {
  credits: 'Credits',
  minerals: 'Minerals',
  research: 'Research',
  influence: 'Influence',
};

export const RESOURCE_ICONS: Record<ResourceType, string> = {
  credits: '💰',
  minerals: '⛏️',
  research: '🔬',
  influence: '🌐',
};

export const RESOURCE_COLORS: Record<ResourceType, string> = {
  credits: '#f5c842',
  minerals: '#7ed4e6',
  research: '#a78bfa',
  influence: '#34d399',
};

export const EMPTY_RESOURCES: Resources = {
  credits: 0,
  minerals: 0,
  research: 0,
  influence: 0,
};

export function addResources(a: Partial<Resources>, b: Partial<Resources>): Resources {
  return {
    credits: (a.credits ?? 0) + (b.credits ?? 0),
    minerals: (a.minerals ?? 0) + (b.minerals ?? 0),
    research: (a.research ?? 0) + (b.research ?? 0),
    influence: (a.influence ?? 0) + (b.influence ?? 0),
  };
}

export function subtractResources(a: Resources, b: Partial<Resources>): Resources {
  return {
    credits: a.credits - (b.credits ?? 0),
    minerals: a.minerals - (b.minerals ?? 0),
    research: a.research - (b.research ?? 0),
    influence: a.influence - (b.influence ?? 0),
  };
}

export function canAfford(available: Resources, cost: Partial<Resources>): boolean {
  return (
    available.credits >= (cost.credits ?? 0) &&
    available.minerals >= (cost.minerals ?? 0) &&
    available.research >= (cost.research ?? 0) &&
    available.influence >= (cost.influence ?? 0)
  );
}

export function scaleResources(r: Partial<Resources>, factor: number): Partial<Resources> {
  return {
    credits: r.credits !== undefined ? r.credits * factor : undefined,
    minerals: r.minerals !== undefined ? r.minerals * factor : undefined,
    research: r.research !== undefined ? r.research * factor : undefined,
    influence: r.influence !== undefined ? r.influence * factor : undefined,
  };
}
