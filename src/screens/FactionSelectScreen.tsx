import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { FACTIONS } from '../data/factions';
import type { FactionId } from '../types/factions';
import { FactionCard } from '../components/factions/FactionCard';
import { Button } from '../components/ui/Button';

export function FactionSelectScreen() {
  const [selected, setSelected] = useState<FactionId | null>(null);
  const playerName = useGameStore((s) => s.playerName);
  const permanentBonuses = useGameStore((s) => s.permanentBonuses);
  const startNewGame = useGameStore((s) => s.startNewGame);
  const incarnation = useGameStore((s) => s.incarnation);

  const handleConfirm = () => {
    if (!selected || !playerName) return;
    startNewGame(playerName, selected);
  };

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Header */}
      <div className="px-5 pt-16 pb-4 border-b border-white/10 bg-slate-950/60 backdrop-blur-md sticky top-0 z-20">
        <h1 className="font-orbitron font-bold text-2xl text-slate-100">
          Choose Your Allegiance
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {incarnation > 1
            ? `Incarnation ${incarnation} — Your permanent bonuses carry forward`
            : `Commander ${playerName}, select your faction`}
        </p>
        {incarnation > 1 && (
          <div className="mt-2 p-2.5 rounded-xl bg-amber-900/20 border border-amber-700/30">
            <p className="text-xs text-amber-400">
              ♾️ You carry the wisdom of {incarnation - 1} past incarnation{incarnation > 2 ? 's' : ''}.
              Each faction you've aligned with grants permanent production bonuses.
            </p>
          </div>
        )}
      </div>

      {/* Faction list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-32">
        {FACTIONS.map((faction) => (
          <FactionCard
            key={faction.id}
            faction={faction}
            selected={selected === faction.id}
            stackCount={permanentBonuses[faction.id] ?? 0}
            onSelect={() => setSelected(faction.id)}
          />
        ))}
      </div>

      {/* Confirm bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/95 backdrop-blur-md border-t border-white/10 z-30">
        {selected ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400">Selected:</span>
              <span className="font-orbitron font-bold" style={{ color: FACTIONS.find(f => f.id === selected)?.color }}>
                {FACTIONS.find(f => f.id === selected)?.name}
              </span>
            </div>
            <Button variant="primary" size="lg" fullWidth glowing onClick={handleConfirm}>
              ⚡ Pledge Allegiance &amp; Begin
            </Button>
          </div>
        ) : (
          <Button variant="secondary" size="lg" fullWidth disabled>
            Select a faction to continue
          </Button>
        )}
      </div>
    </div>
  );
}
