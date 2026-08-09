import { useState } from 'react';
import { useGameStore, selectUnlockedBuildings } from '../../stores/gameStore';
import { useShallow } from 'zustand/react/shallow';
import { getBuildingCost } from '../../data/buildings';
import { BuildingCard } from './BuildingCard';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { RESOURCE_ICONS, type ResourceType } from '../../types/resources';
import { formatNumber } from '../../utils/format';

const RESOURCE_TYPES: ResourceType[] = ['credits', 'minerals', 'research', 'influence'];

export function BuildingGrid() {
  const buildings = useGameStore((s) => s.buildings);
  const resources = useGameStore((s) => s.resources);
  const unlockedDefs = useGameStore(useShallow(selectUnlockedBuildings));
  const buildBuilding = useGameStore((s) => s.buildBuilding);
  const upgradeBuilding = useGameStore((s) => s.upgradeBuilding);
  const collectBuilding = useGameStore((s) => s.collectBuilding);
  const collectAll = useGameStore((s) => s.collectAllBuildings);
  const [showBuild, setShowBuild] = useState(false);

  const builtIds = new Set(buildings.map((b) => b.defId));
  const buildableIds = unlockedDefs.filter((d) => !builtIds.has(d.id));

  const hasPending = buildings.some((b) =>
    Object.values(b.pendingResources ?? {}).some((v) => (v ?? 0) >= 0.01)
  );

  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-orbitron text-slate-300 uppercase tracking-widest">
          Structures ({buildings.length})
        </h2>
        <div className="flex gap-2">
          {hasPending && (
            <Button variant="secondary" size="sm" onClick={collectAll}>
              Collect All
            </Button>
          )}
          <Button size="sm" onClick={() => setShowBuild(true)}>
            + Build
          </Button>
        </div>
      </div>

      {/* Building cards */}
      {buildings.length === 0 ? (
        <div className="text-center py-12 text-slate-600 text-sm">
          No structures built yet
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 relative">
          {buildings.map((b) => (
            <BuildingCard
              key={b.defId}
              building={b}
              onUpgrade={() => upgradeBuilding(b.defId)}
              onCollect={() => collectBuilding(b.defId)}
            />
          ))}
        </div>
      )}

      {/* Build modal */}
      <Modal
        open={showBuild}
        onClose={() => setShowBuild(false)}
        title="Construct Building"
      >
        {buildableIds.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">
            No new buildings available. Complete more missions to unlock them.
          </p>
        ) : (
          <div className="space-y-3">
            {buildableIds.map((def) => {
              const cost = getBuildingCost(def, 0);
              const canAfford = RESOURCE_TYPES.every((r) => resources[r] >= (cost[r] ?? 0));

              return (
                <div
                  key={def.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-white/10"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-700 text-xl shrink-0">
                    {def.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-100">{def.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{def.description}</div>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {RESOURCE_TYPES.filter((r) => (cost[r] ?? 0) > 0).map((r) => (
                        <span
                          key={r}
                          className={`text-xs px-1.5 py-0.5 rounded-full ${
                            resources[r] >= (cost[r] ?? 0)
                              ? 'bg-emerald-900/50 text-emerald-300'
                              : 'bg-red-900/50 text-red-300'
                          }`}
                        >
                          {RESOURCE_ICONS[r]} {formatNumber(cost[r] ?? 0)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant={canAfford ? 'primary' : 'secondary'}
                    size="sm"
                    disabled={!canAfford}
                    onClick={() => {
                      if (buildBuilding(def.id)) setShowBuild(false);
                    }}
                    className="shrink-0 mt-1"
                  >
                    Build
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
}
