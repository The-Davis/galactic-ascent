import { useState } from 'react';
import { useGameStore, selectCanReincarnate } from '../stores/gameStore';
import { FACTIONS } from '../data/factions';
import { RESOURCE_ICONS, type ResourceType } from '../types/resources';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const RESOURCE_TYPES: ResourceType[] = ['credits', 'minerals', 'research', 'influence'];

export function ReincarnateScreen() {
  const [confirmed, setConfirmed] = useState(false);
  const canReincarnate = useGameStore(selectCanReincarnate);
  const reincarnate = useGameStore((s) => s.reincarnate);
  const permanentBonuses = useGameStore((s) => s.permanentBonuses);
  const factionId = useGameStore((s) => s.factionId);
  const incarnation = useGameStore((s) => s.incarnation);
  const resources = useGameStore((s) => s.resources);

  const currentFaction = factionId ? FACTIONS.find((f) => f.id === factionId) : null;
  const newBonusCount = factionId ? (permanentBonuses[factionId] ?? 0) + 1 : 0;

  return (
    <div className="min-h-screen relative z-10" style={{ paddingTop: '85px' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5">
        <h1 className="font-orbitron font-bold text-xl text-slate-100">Galactic Ascent</h1>
        <p className="text-xs text-slate-500 mt-0.5">Reincarnate to accumulate permanent faction power</p>
      </div>

      <div className="px-4 py-4 pb-24 space-y-4">
        {/* Current status */}
        <Card padding="md">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">Current Incarnation</div>
          <div className="flex items-center gap-3 mb-3">
            {currentFaction && (
              <>
                <span className="text-3xl">{currentFaction.icon}</span>
                <div>
                  <div className="font-orbitron font-bold text-slate-100" style={{ color: currentFaction.color }}>
                    {currentFaction.name}
                  </div>
                  <div className="text-xs text-slate-500">Incarnation {incarnation}</div>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {RESOURCE_TYPES.map((r) => (
              <div key={r} className="flex items-center gap-2 text-xs text-slate-400">
                <span>{RESOURCE_ICONS[r]}</span>
                <span className="capitalize">{r}:</span>
                <span className="ml-auto text-slate-200 font-medium">{Math.floor(resources[r])}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Permanent bonuses */}
        <Card padding="md">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">Permanent Bonuses (Carried Forward)</div>
          {Object.keys(permanentBonuses).length === 0 ? (
            <p className="text-xs text-slate-600">No permanent bonuses yet. Complete the final mission to earn your first.</p>
          ) : (
            <div className="space-y-2">
              {FACTIONS.filter((f) => (permanentBonuses[f.id] ?? 0) > 0).map((faction) => {
                const stacks = permanentBonuses[faction.id] ?? 0;
                return (
                  <div key={faction.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/60">
                    <span className="text-xl">{faction.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-slate-200">{faction.name}</div>
                      <div className="text-xs text-emerald-400">+{stacks * 5}% production · ×{stacks} stacks</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* What you'll gain */}
        {canReincarnate && currentFaction && (
          <Card padding="md" glow glowColor={`${currentFaction.color}20`}>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">On Reincarnation</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">⚠️</span>
                <span className="text-slate-400">All current resources, buildings, and leaders will be reset</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <div>
                  <span className="text-slate-300">{currentFaction.name} permanent bonus: </span>
                  <span className="text-emerald-400 font-medium">×{newBonusCount} stack(s) → +{newBonusCount * 5}% production</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span className="text-slate-300">Choose a new (or same) faction</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span className="text-slate-300">All previous faction bonuses remain</span>
              </div>
            </div>
          </Card>
        )}

        {/* Reincarnate CTA */}
        {canReincarnate ? (
          !confirmed ? (
            <Button
              variant="danger"
              size="lg"
              fullWidth
              onClick={() => setConfirmed(true)}
            >
              ♾️ Begin Reincarnation
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl border border-red-700/50 bg-red-950/30 text-center">
                <div className="text-red-300 font-bold mb-1">⚠️ This is irreversible</div>
                <div className="text-xs text-slate-500">All progress will be reset. Your faction bonus will be permanently added.</div>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" size="lg" fullWidth onClick={() => setConfirmed(false)}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="lg"
                  fullWidth
                  onClick={reincarnate}
                >
                  Confirm Ascent
                </Button>
              </div>
            </div>
          )
        ) : (
          <div className="p-4 rounded-2xl border border-slate-700/50 bg-slate-900/60 text-center space-y-2">
            <div className="text-slate-400 text-sm font-medium">🔒 Reincarnation Locked</div>
            <div className="text-xs text-slate-600">
              Complete the final mission "Galactic Ascent" and claim its reward to unlock reincarnation.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
