import { MISSIONS } from '../../data/missions';
import { MissionCard } from './MissionCard';

export function MissionLog() {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-orbitron text-slate-300 uppercase tracking-widest">
        Story Missions
      </h2>
      {MISSIONS.map((mission) => (
        <MissionCard key={mission.id} mission={mission} />
      ))}
    </div>
  );
}
