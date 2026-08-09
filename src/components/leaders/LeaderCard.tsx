import { useState } from 'react';
import { clsx } from 'clsx';
import { useGameStore } from '../../stores/gameStore';
import type { Leader } from '../../types/leaders';
import { Badge, SPEC_EMOJI } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { rarityColor, rarityLabel } from '../../utils/format';

interface LeaderCardProps {
  leader: Leader;
  compact?: boolean;
}

export function LeaderCard({ leader, compact = false }: LeaderCardProps) {
  const [showAssign, setShowAssign] = useState(false);
  const buildings = useGameStore((s) => s.buildings);
  const assignLeader = useGameStore((s) => s.assignLeader);

  const rarColor = rarityColor(leader.rarity);

  const handleAssign = (target: string | null) => {
    assignLeader(leader.id, target);
    setShowAssign(false);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-white/10">
        <span className="text-2xl">{leader.portrait}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-slate-200 truncate">{leader.name}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant={leader.specialization} size="sm">
              {SPEC_EMOJI[leader.specialization]} {leader.specialization}
            </Badge>
            <span className="text-xs text-slate-500">Lv {leader.level}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card
      glow={leader.rarity === 'legendary'}
      glowColor={`${rarColor}25`}
      padding="none"
      className="overflow-hidden"
    >
      {/* Rarity accent stripe */}
      <div className="h-0.5" style={{ background: rarColor }} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <div
            className="w-14 h-14 flex items-center justify-center rounded-2xl text-3xl shrink-0"
            style={{ background: `${rarColor}20`, border: `1px solid ${rarColor}40` }}
          >
            {leader.portrait}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-sm">{leader.name}</span>
              <span className="text-xs font-medium" style={{ color: rarColor }}>
                {rarityLabel(leader.rarity)}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <Badge variant={leader.specialization} size="sm">
                {SPEC_EMOJI[leader.specialization]} {leader.specialization}
              </Badge>
              <span className="text-xs text-slate-500">Level {leader.level}</span>
            </div>

            {/* XP bar */}
            <ProgressBar
              value={leader.xp}
              max={leader.xpToNextLevel}
              color="bg-gradient-to-r from-violet-500 to-purple-400"
              height="xs"
              className="mt-2"
            />
            <div className="text-[10px] text-slate-600 mt-0.5">
              {leader.xp} / {leader.xpToNextLevel} XP to Lv{leader.level + 1}
            </div>
          </div>
        </div>

        {/* Ability */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-800/60 border border-white/5">
          <p className="text-xs text-slate-400 leading-relaxed">{leader.ability}</p>
        </div>

        {/* Assignment */}
        <div className="mt-3">
          {leader.assignedTo ? (
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-400">
                ✓ Assigned to {leader.assignedTo.replace(/_/g, ' ')}
              </span>
              <Button variant="ghost" size="sm" onClick={() => handleAssign(null)}>
                Unassign
              </Button>
            </div>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => setShowAssign(!showAssign)}
            >
              Assign Leader
            </Button>
          )}

          {showAssign && (
            <div className="mt-2 space-y-1.5 bg-slate-800/80 rounded-xl p-2.5">
              <div className="text-xs text-slate-400 mb-2 font-medium">Assign to:</div>
              {buildings.map((b) => {
                const isOccupied = useGameStore
                  .getState()
                  .leaders.some((l) => l.assignedTo === b.defId && l.id !== leader.id);
                return (
                  <button
                    key={b.defId}
                    className={clsx(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-colors',
                      'bg-slate-700/50 hover:bg-slate-700 active:bg-slate-600',
                      isOccupied && 'opacity-50'
                    )}
                    onClick={() => handleAssign(b.defId)}
                  >
                    <span>{b.defId.replace(/_/g, ' ')}</span>
                    {isOccupied && <span className="ml-auto text-amber-400">occupied</span>}
                  </button>
                );
              })}
              <button
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs bg-slate-700/50 hover:bg-slate-700"
                onClick={() => handleAssign('defense')}
              >
                🛡 Defense
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
