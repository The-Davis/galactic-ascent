import { useGameStore, selectAvailableLeaders } from '../../stores/gameStore';
import { useShallow } from 'zustand/react/shallow';
import { RECRUIT_COSTS, LEADER_POOL } from '../../data/leaders';
import { RESOURCE_ICONS } from '../../types/resources';
import { formatNumber, rarityColor } from '../../utils/format';
import { LeaderCard } from './LeaderCard';
import { Button } from '../ui/Button';
import { Badge, SPEC_EMOJI } from '../ui/Badge';
import { canAfford } from '../../types/resources';

export function LeaderRoster() {
  const leaders = useGameStore((s) => s.leaders);
  const resources = useGameStore((s) => s.resources);
  const recruitLeader = useGameStore((s) => s.recruitLeader);
  const availableLeaders = useGameStore(useShallow(selectAvailableLeaders));

  const recruitableNames = availableLeaders
    .map((l) => l.name)
    .filter((name) => !leaders.some((l) => l.name === name));

  return (
    <div className="space-y-4">
      {/* Recruited leaders */}
      <div>
        <h2 className="text-sm font-orbitron text-slate-300 uppercase tracking-widest mb-3">
          Your Leaders ({leaders.length})
        </h2>
        {leaders.length === 0 ? (
          <div className="text-center py-8 text-slate-600 text-sm">
            No leaders recruited yet
          </div>
        ) : (
          <div className="space-y-3">
            {leaders.map((l) => (
              <LeaderCard key={l.id} leader={l} />
            ))}
          </div>
        )}
      </div>

      {/* Recruitment pool */}
      {recruitableNames.length > 0 && (
        <div>
          <h2 className="text-sm font-orbitron text-slate-300 uppercase tracking-widest mb-3">
            Available for Recruitment
          </h2>
          <div className="space-y-2">
            {recruitableNames.map((name) => {
              const template = LEADER_POOL.find((l) => l.name === name);
              if (!template) return null;

              const cost = RECRUIT_COSTS[template.rarity];
              const affordable = canAfford(resources, cost);
              const rarColor = rarityColor(template.rarity);

              return (
                <div
                  key={name}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-white/10"
                >
                  <div
                    className="w-11 h-11 flex items-center justify-center rounded-xl text-2xl shrink-0"
                    style={{ background: `${rarColor}20`, border: `1px solid ${rarColor}40` }}
                  >
                    {template.portrait}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-100">{name}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant={template.specialization} size="sm">
                        {SPEC_EMOJI[template.specialization]}
                      </Badge>
                      <span className="text-xs font-medium" style={{ color: rarColor }}>
                        {template.rarity.charAt(0).toUpperCase() + template.rarity.slice(1)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {(Object.entries(cost) as [string, number][]).map(([res, amt]) => (
                        <span
                          key={res}
                          className={`text-xs ${affordable ? 'text-emerald-400' : 'text-red-400'}`}
                        >
                          {RESOURCE_ICONS[res as keyof typeof RESOURCE_ICONS]} {formatNumber(amt)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={affordable ? 'primary' : 'secondary'}
                    disabled={!affordable}
                    onClick={() => recruitLeader(name)}
                    className="shrink-0"
                  >
                    Recruit
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
