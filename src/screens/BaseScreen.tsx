import { useGameStore } from '../stores/gameStore';
import { FACTION_MAP } from '../data/factions';
import { BuildingGrid } from '../components/buildings/BuildingGrid';

export function BaseScreen() {
  const factionId = useGameStore((s) => s.factionId);
  const playerName = useGameStore((s) => s.playerName);
  const incarnation = useGameStore((s) => s.incarnation);

  const faction = factionId ? FACTION_MAP[factionId] : null;

  return (
    <div className="min-h-screen relative z-10">
      {/* Star system hero */}
      <div className="relative overflow-hidden" style={{ paddingTop: '85px' }}>
        <div
          className="relative h-48 flex items-center justify-center"
          style={{
            background: faction
              ? `radial-gradient(ellipse at 50% 80%, ${faction.color}18 0%, transparent 70%)`
              : 'transparent',
          }}
        >
          {/* Orbital system visual */}
          <div className="relative w-36 h-36">
            {/* Sun */}
            <div
              className="absolute inset-8 rounded-full"
              style={{
                background: faction
                  ? `radial-gradient(circle at 40% 35%, ${faction.color}, ${faction.color}60)`
                  : 'radial-gradient(circle at 40% 35%, #fde68a, #d97706)',
                boxShadow: faction
                  ? `0 0 40px ${faction.color}50, 0 0 80px ${faction.color}20`
                  : '0 0 40px #d9770650',
                animation: 'pulse 3s ease-in-out infinite',
              }}
            />

            {/* Orbit rings */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute rounded-full border border-white/10"
                style={{
                  inset: `${i * 8}px`,
                  borderStyle: 'dashed',
                  animation: `spin ${8 + i * 4}s linear infinite ${i % 2 ? 'reverse' : ''}`,
                }}
              >
                {/* Planet on orbit */}
                <div
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    top: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: ['#60a5fa', '#34d399', '#f472b6'][i],
                    boxShadow: `0 0 8px ${'#60a5fa,#34d399,#f472b6'.split(',')[i]}80`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* System info overlay */}
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <div className="text-lg font-orbitron font-bold text-slate-200">
              {playerName}'s System
            </div>
            {faction && (
              <div className="text-xs mt-0.5" style={{ color: faction.color }}>
                {faction.icon} {faction.name} · Incarnation {incarnation}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Building grid */}
      <div className="px-4 pb-24 space-y-4">
        <BuildingGrid />
      </div>
    </div>
  );
}
