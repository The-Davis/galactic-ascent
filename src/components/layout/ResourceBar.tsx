import { useGameStore, selectProductionCredits, selectProductionMinerals, selectProductionResearch, selectProductionInfluence } from '../../stores/gameStore';
import { RESOURCE_ICONS, RESOURCE_COLORS, type ResourceType } from '../../types/resources';
import { formatNumber, formatRate } from '../../utils/format';

const RESOURCES: ResourceType[] = ['credits', 'minerals', 'research', 'influence'];

// Per-resource production selectors (primitives) — safe from infinite-loop
const PROD_SELECTORS = {
  credits:   selectProductionCredits,
  minerals:  selectProductionMinerals,
  research:  selectProductionResearch,
  influence: selectProductionInfluence,
};

function ResourceItem({ res }: { res: ResourceType }) {
  const amount = useGameStore((s) => s.resources[res]);
  const rate   = useGameStore(PROD_SELECTORS[res]);

  return (
    <div className="flex flex-col items-center py-2 px-1">
      <div className="flex items-center gap-1 mb-0.5">
        <span className="text-base leading-none">{RESOURCE_ICONS[res]}</span>
        <span
          className="text-sm font-bold font-orbitron tabular-nums"
          style={{ color: RESOURCE_COLORS[res] }}
        >
          {formatNumber(amount)}
        </span>
      </div>
      <span className="text-[10px] text-slate-500 tabular-nums">
        +{formatRate(rate)}
      </span>
    </div>
  );
}

export function ResourceBar() {
  const playerName = useGameStore((s) => s.playerName);
  const incarnation = useGameStore((s) => s.incarnation);

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-white/10">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-white/5">
        <span className="text-xs font-orbitron text-blue-400 tracking-widest uppercase">
          Galactic Ascent
        </span>
        <span className="text-xs text-slate-500">
          {playerName} · Incarnation {incarnation}
        </span>
      </div>

      {/* Resources grid — each cell is its own component with primitive selectors */}
      <div className="grid grid-cols-4 gap-0 divide-x divide-white/5">
        {RESOURCES.map((res) => (
          <ResourceItem key={res} res={res} />
        ))}
      </div>
    </div>
  );
}
