import { MissionLog } from '../components/missions/MissionLog';

export function MissionsScreen() {
  return (
    <div className="min-h-screen relative z-10" style={{ paddingTop: '85px' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 mb-1">
        <h1 className="font-orbitron font-bold text-xl text-slate-100">Mission Log</h1>
        <p className="text-xs text-slate-500 mt-0.5">Complete missions to unlock buildings, leaders, and story progress</p>
      </div>

      <div className="px-4 py-3 pb-24">
        <MissionLog />
      </div>
    </div>
  );
}
