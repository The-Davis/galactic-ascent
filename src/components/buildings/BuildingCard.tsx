import { useState } from 'react';
import { clsx } from 'clsx';
import { useGameStore } from '../../stores/gameStore';
import { BUILDING_MAP, getBuildingCost, getBuildingProduction } from '../../data/buildings';
import type { BuildingInstance } from '../../types/buildings';
import { RESOURCE_ICONS, type ResourceType } from '../../types/resources';
import { formatNumber, formatRate } from '../../utils/format';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const RESOURCE_TYPES: ResourceType[] = ['credits', 'minerals', 'research', 'influence'];

interface BuildingCardProps {
  building: BuildingInstance;
  onUpgrade?: () => void;
  onCollect?: () => void;
}

export function BuildingCard({ building, onUpgrade, onCollect }: BuildingCardProps) {
  const [expanded, setExpanded] = useState(false);
  const def = BUILDING_MAP[building.defId];
  const resources = useGameStore((s) => s.resources);
  const leaders = useGameStore((s) => s.leaders);

  if (!def) return null;

  const assignedLeader = leaders.find((l) => l.assignedTo === building.defId);
  const production = getBuildingProduction(def, building.level);
  const upgradeCost = getBuildingCost(def, building.level);
  const canUpgrade =
    building.level < def.maxLevel &&
    RESOURCE_TYPES.every((r) => resources[r] >= (upgradeCost[r] ?? 0));
  const atMax = building.level >= def.maxLevel;

  const pending = building.pendingResources ?? {};
  const hasPending = RESOURCE_TYPES.some((r) => (pending[r] ?? 0) >= 0.01);
  const pendingTotal = RESOURCE_TYPES.reduce((sum, r) => sum + (pending[r] ?? 0), 0);

  return (
    <Card
      hover
      glow={hasPending}
      glowColor="rgba(96,165,250,0.12)"
      padding="none"
      className="overflow-hidden"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-800/80 text-2xl shrink-0">
          {def.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-100 text-sm truncate">{def.name}</span>
            <span className="text-xs text-slate-500 shrink-0">Lv{building.level}</span>
            {atMax && <span className="text-xs text-amber-400 shrink-0">MAX</span>}
          </div>

          {/* Production rates */}
          <div className="flex flex-wrap gap-2 mt-0.5">
            {RESOURCE_TYPES.filter((r) => (production[r] ?? 0) > 0).map((r) => (
              <span key={r} className="text-xs text-slate-400">
                {RESOURCE_ICONS[r]} {formatRate(production[r])}
              </span>
            ))}
          </div>
        </div>

        {/* Pending / collect button */}
        {hasPending && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCollect?.();
            }}
            className="flex flex-col items-center shrink-0 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/40 rounded-xl px-2 py-1.5 transition-colors active:scale-95"
          >
            <span className="text-[10px] text-blue-300 font-medium">COLLECT</span>
            <span className="text-xs text-blue-200 font-bold tabular-nums">
              +{formatNumber(pendingTotal)}
            </span>
          </button>
        )}
      </div>

      {/* Assigned leader chip */}
      {assignedLeader && (
        <div className="mx-3 mb-2 flex items-center gap-1.5 bg-slate-800/60 rounded-lg px-2 py-1">
          <span className="text-sm">{assignedLeader.portrait}</span>
          <span className="text-xs text-slate-400">{assignedLeader.name}</span>
          <span className="ml-auto text-xs text-emerald-400">+{Math.round(assignedLeader.rarity === 'legendary' ? 30 : assignedLeader.rarity === 'rare' ? 15 : 5)}% boost</span>
        </div>
      )}

      {/* Expanded section */}
      {expanded && (
        <div className="border-t border-white/5 p-3 space-y-3" onClick={(e) => e.stopPropagation()}>
          <p className="text-xs text-slate-500 leading-relaxed">{def.description}</p>

          {/* Pending resources breakdown */}
          {hasPending && (
            <div className="bg-blue-950/30 rounded-xl p-2.5 space-y-1">
              <div className="text-xs text-blue-300 font-medium mb-1.5">Ready to collect:</div>
              {RESOURCE_TYPES.filter((r) => (pending[r] ?? 0) >= 0.01).map((r) => (
                <div key={r} className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{RESOURCE_ICONS[r]} {r}</span>
                  <span className="text-slate-200 font-medium">+{formatNumber(pending[r] ?? 0)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Level progress */}
          {!atMax && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-400">Upgrade to Lv{building.level + 1}</span>
                <span className="text-xs text-slate-500">
                  {RESOURCE_TYPES.filter((r) => (upgradeCost[r] ?? 0) > 0)
                    .map((r) => `${RESOURCE_ICONS[r]}${formatNumber(upgradeCost[r] ?? 0)}`)
                    .join(' · ')}
                </span>
              </div>
              <Button
                variant={canUpgrade ? 'primary' : 'secondary'}
                size="sm"
                fullWidth
                disabled={!canUpgrade}
                onClick={onUpgrade}
                className="mt-1"
              >
                {canUpgrade ? '⬆ Upgrade' : '🔒 Insufficient Resources'}
              </Button>
            </div>
          )}

          {atMax && (
            <div className="text-center text-xs text-amber-400">
              ✨ Maximum level reached
            </div>
          )}
        </div>
      )}

      {/* Pulse dot for pending */}
      {hasPending && (
        <div className={clsx(
          'absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-400',
          'animate-ping'
        )} />
      )}
    </Card>
  );
}
