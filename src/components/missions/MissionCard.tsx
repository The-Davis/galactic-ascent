import { useState } from 'react';
import { clsx } from 'clsx';
import { useGameStore, selectMissionStatus } from '../../stores/gameStore';

import type { Mission } from '../../types/missions';
import { RESOURCE_ICONS, type ResourceType } from '../../types/resources';
import { formatNumber, formatDuration, countdown } from '../../utils/format';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge, SPEC_EMOJI } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Modal } from '../ui/Modal';
import { canAfford } from '../../types/resources';
import { getMissionSuccessChance } from '../../utils/gameEngine';

const RESOURCE_TYPES: ResourceType[] = ['credits', 'minerals', 'research', 'influence'];

interface MissionCardProps {
  mission: Mission;
}

export function MissionCard({ mission }: MissionCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedLeaderId, setSelectedLeaderId] = useState<string>('');
  const [selectedChoiceId, setSelectedChoiceId] = useState<string>('');

  const resources = useGameStore((s) => s.resources);
  const leaders = useGameStore((s) => s.leaders);
  const startMission = useGameStore((s) => s.startMission);
  const claimReward = useGameStore((s) => s.claimMissionReward);
  const missionStates = useGameStore((s) => s.missionStates);

  const status = useGameStore(selectMissionStatus(mission.id));
  const ms = missionStates.find((m) => m.missionId === mission.id);

  const affordable = canAfford(resources, mission.cost);
  const assignedLeader = leaders.find((l) => l.id === selectedLeaderId) ||
    (ms?.assignedLeaderId ? leaders.find((l) => l.id === ms.assignedLeaderId) : undefined);
  const successChance = getMissionSuccessChance(mission.recommendedSpec, assignedLeader);

  // Calculate progress
  const now = Date.now();
  const progressPct = ms && !ms.completedAt
    ? Math.min(100, ((now - ms.startedAt) / (mission.duration * 1000)) * 100)
    : ms?.completedAt ? 100 : 0;
  const remaining = ms && !ms.completedAt ? Math.max(0, (ms.startedAt + mission.duration * 1000 - now) / 1000) : 0;

  const statusColors: Record<string, string> = {
    locked: 'border-slate-700/50',
    available: 'border-blue-700/30',
    in_progress: 'border-cyan-600/50',
    completed: 'border-amber-600/50',
    claimed: 'border-slate-700/30',
  };

  return (
    <>
      <Card
        hover
        padding="none"
        className={clsx('overflow-hidden border', statusColors[status] ?? '')}
        onClick={() => status !== 'locked' && setShowDetail(true)}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className={clsx(
              'w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0',
              status === 'locked' && 'bg-slate-800 opacity-50',
              status === 'available' && 'bg-blue-900/40',
              status === 'in_progress' && 'bg-cyan-900/40',
              status === 'completed' && 'bg-amber-900/40',
              status === 'claimed' && 'bg-slate-800/40',
            )}>
              {status === 'locked' ? '🔒' : status === 'claimed' ? '✅' : status === 'in_progress' ? '⏳' : '📋'}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={clsx(
                  'font-semibold text-sm',
                  status === 'locked' ? 'text-slate-600' : 'text-slate-100'
                )}>
                  {mission.title}
                </span>
                {mission.recommendedSpec && (
                  <Badge variant={mission.recommendedSpec} size="sm">
                    {SPEC_EMOJI[mission.recommendedSpec]}
                  </Badge>
                )}
              </div>

              <p className={clsx(
                'text-xs mt-1 line-clamp-2 leading-relaxed',
                status === 'locked' ? 'text-slate-700' : 'text-slate-500'
              )}>
                {mission.description}
              </p>
            </div>
          </div>

          {/* Progress bar for in-progress missions */}
          {status === 'in_progress' && ms && (
            <div className="mt-3">
              <ProgressBar
                value={progressPct}
                max={100}
                color="bg-gradient-to-r from-cyan-500 to-blue-400"
                height="sm"
                animate={progressPct < 100}
              />
              <div className="flex justify-between mt-1 text-[10px] text-slate-500">
                <span>{progressPct.toFixed(0)}% complete</span>
                <span>{remaining > 0 ? countdown(ms.startedAt + mission.duration * 1000) : 'Ready!'}</span>
              </div>
            </div>
          )}

          {/* Status chip + claim */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {status === 'available' && (
                <span className="text-xs text-blue-400">
                  ⏱ {formatDuration(mission.duration)}
                </span>
              )}
              {status === 'completed' && (
                <span className="text-xs text-amber-400 animate-pulse">⭐ Reward ready!</span>
              )}
              {status === 'claimed' && (
                <span className="text-xs text-slate-600">Completed</span>
              )}
            </div>

            {status === 'completed' && (
              <Button
                size="sm"
                variant="faction"
                onClick={(e) => {
                  e.stopPropagation();
                  claimReward(mission.id);
                }}
              >
                Claim Reward
              </Button>
            )}

            {status === 'available' && (
              <Button
                size="sm"
                variant={affordable ? 'primary' : 'secondary'}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetail(true);
                }}
              >
                View
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Mission detail modal */}
      <Modal
        open={showDetail}
        onClose={() => setShowDetail(false)}
        title={mission.title}
      >
        <div className="space-y-4">
          {/* Flavor text */}
          <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5 italic text-xs text-slate-400 leading-relaxed">
            {mission.flavor}
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">{mission.description}</p>

          {/* Cost */}
          {status === 'available' && (
            <>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Mission Cost</div>
                <div className="flex flex-wrap gap-2">
                  {RESOURCE_TYPES.filter((r) => (mission.cost[r] ?? 0) > 0).map((r) => (
                    <div
                      key={r}
                      className={clsx(
                        'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium',
                        resources[r] >= (mission.cost[r] ?? 0)
                          ? 'bg-emerald-900/40 text-emerald-300'
                          : 'bg-red-900/40 text-red-300'
                      )}
                    >
                      {RESOURCE_ICONS[r]} {formatNumber(mission.cost[r] ?? 0)}
                    </div>
                  ))}
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-700/60 text-slate-400">
                    ⏱ {formatDuration(mission.duration)}
                  </div>
                </div>
              </div>

              {/* Rewards */}
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Rewards</div>
                <div className="flex flex-wrap gap-2">
                  {RESOURCE_TYPES.filter((r) => (mission.reward.resources[r] ?? 0) > 0).map((r) => (
                    <div key={r} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-800/60 text-slate-300">
                      {RESOURCE_ICONS[r]} {formatNumber(mission.reward.resources[r] ?? 0)}
                    </div>
                  ))}
                  {mission.reward.xp > 0 && (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-violet-900/40 text-violet-300">
                      ✨ {mission.reward.xp} XP
                    </div>
                  )}
                </div>
                {mission.reward.unlocksBuilding && (
                  <p className="text-xs text-amber-400 mt-2">🔓 Unlocks new building</p>
                )}
                {mission.reward.unlocksLeader && (
                  <p className="text-xs text-amber-400 mt-1">🔓 Unlocks new leader</p>
                )}
              </div>

              {/* Leader assignment */}
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                  Assign Leader{mission.recommendedSpec && ` (Recommended: ${mission.recommendedSpec})`}
                </div>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedLeaderId('')}
                    className={clsx(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors text-left',
                      !selectedLeaderId ? 'bg-blue-900/40 border border-blue-600/40 text-blue-300' : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700/60'
                    )}
                  >
                    No leader assigned
                  </button>
                  {leaders
                    .filter((l) => !l.assignedTo || l.assignedTo === mission.id)
                    .map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setSelectedLeaderId(l.id)}
                        className={clsx(
                          'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors text-left',
                          selectedLeaderId === l.id
                            ? 'bg-blue-900/40 border border-blue-600/40 text-blue-300'
                            : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700/60'
                        )}
                      >
                        <span>{l.portrait}</span>
                        <span>{l.name}</span>
                        {mission.recommendedSpec === l.specialization && (
                          <span className="ml-auto text-emerald-400">★ Recommended</span>
                        )}
                      </button>
                    ))}
                </div>

                {/* Success chance */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-slate-500">Mission success chance:</span>
                  <span className={clsx(
                    'text-xs font-bold',
                    successChance > 0.9 ? 'text-emerald-400' : successChance > 0.75 ? 'text-yellow-400' : 'text-red-400'
                  )}>
                    {Math.round(successChance * 100)}%
                  </span>
                </div>
              </div>

              {/* Choices */}
              {mission.choices && (
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Mission Approach</div>
                  <div className="space-y-2">
                    {mission.choices.map((choice) => (
                      <button
                        key={choice.id}
                        onClick={() => setSelectedChoiceId(choice.id)}
                        className={clsx(
                          'w-full p-3 rounded-xl text-left transition-colors border',
                          selectedChoiceId === choice.id
                            ? 'border-blue-600/60 bg-blue-900/30'
                            : 'border-white/10 bg-slate-800/40 hover:bg-slate-800/70'
                        )}
                      >
                        <div className="text-xs font-semibold text-slate-200">{choice.label}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{choice.description}</div>
                        {choice.bonusReward.resources && (
                          <div className="flex gap-1.5 mt-1.5">
                            {RESOURCE_TYPES.filter((r) => (choice.bonusReward.resources?.[r] ?? 0) > 0).map((r) => (
                              <span key={r} className="text-[10px] text-emerald-400">
                                +{RESOURCE_ICONS[r]}{formatNumber(choice.bonusReward.resources?.[r] ?? 0)}
                              </span>
                            ))}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Start button */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={!affordable}
                onClick={() => {
                  const ok = startMission(
                    mission.id,
                    selectedLeaderId || undefined,
                    selectedChoiceId || undefined
                  );
                  if (ok) setShowDetail(false);
                }}
              >
                {affordable ? '🚀 Launch Mission' : '⚠️ Insufficient Resources'}
              </Button>
            </>
          )}

          {status === 'in_progress' && ms && (
            <div className="space-y-3">
              <ProgressBar
                value={progressPct}
                max={100}
                color="bg-gradient-to-r from-cyan-500 to-blue-400"
                height="md"
                animate={progressPct < 100}
              />
              <div className="text-center text-sm text-slate-400">
                {remaining > 0
                  ? `${countdown(ms.startedAt + mission.duration * 1000)} remaining`
                  : '✅ Mission complete — return to claim reward'}
              </div>
            </div>
          )}

          {status === 'claimed' && (
            <div className="text-center py-4 text-emerald-400 text-sm">
              ✅ Reward collected
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
