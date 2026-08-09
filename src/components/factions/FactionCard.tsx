import { clsx } from 'clsx';
import type { Faction } from '../../types/factions';

interface FactionCardProps {
  faction: Faction;
  selected: boolean;
  stackCount: number;
  onSelect: () => void;
}

export function FactionCard({ faction, selected, stackCount, onSelect }: FactionCardProps) {
  return (
    <button
      onClick={onSelect}
      className={clsx(
        'w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden',
        'active:scale-98 select-none',
        selected
          ? 'border-opacity-100 shadow-2xl scale-[1.02]'
          : 'border-white/10 hover:border-white/25 bg-slate-900/60 hover:bg-slate-800/60'
      )}
      style={selected ? {
        borderColor: faction.color,
        background: `linear-gradient(135deg, ${faction.color}15 0%, rgba(2,4,8,0.95) 60%)`,
        boxShadow: `0 0 30px ${faction.color}30, 0 4px 20px rgba(0,0,0,0.6)`,
      } : {}}
    >
      {/* Background shimmer when selected */}
      {selected && (
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 30% 50%, ${faction.color} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start gap-3">
          <div
            className="w-14 h-14 flex items-center justify-center rounded-2xl text-3xl shrink-0"
            style={{
              background: selected ? `${faction.color}25` : 'rgba(255,255,255,0.05)',
              border: `1px solid ${selected ? faction.color + '60' : 'rgba(255,255,255,0.1)'}`,
            }}
          >
            {faction.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="font-orbitron font-bold text-base"
                style={{ color: selected ? faction.color : '#e2e8f0' }}
              >
                {faction.name}
              </span>
              {stackCount > 0 && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{ background: `${faction.color}25`, color: faction.color }}
                >
                  ×{stackCount}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 italic mt-0.5">{faction.tagline}</p>
          </div>

          {selected && (
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-sm shrink-0"
              style={{ background: faction.color }}
            >
              ✓
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">{faction.description}</p>

        {/* Bonuses */}
        <div className="mt-3 p-2.5 rounded-xl bg-black/30 border border-white/5">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Faction Bonuses</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Exclusive Building:</span>
              <span className="font-medium" style={{ color: faction.color }}>
                {faction.bonus.bonusBuildingName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Leader Affinity:</span>
              <span className="font-medium text-slate-300 capitalize">{faction.bonus.leaderAffinity}</span>
            </div>
            {stackCount > 0 && (
              <div className="text-xs text-emerald-400 mt-1">
                ✓ +{stackCount * 5}% permanent production bonus active
              </div>
            )}
          </div>
        </div>

        {/* Lore snippet */}
        <p className="text-[10px] text-slate-600 italic mt-2.5 leading-relaxed line-clamp-2">
          {faction.lore}
        </p>
      </div>
    </button>
  );
}
