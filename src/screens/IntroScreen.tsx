import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { Button } from '../components/ui/Button';
import { hasSave } from '../utils/storage';

export function IntroScreen() {
  const [playerName, setPlayerName] = useState('');
  const loadSavedGame = useGameStore((s) => s.loadSavedGame);
  const navigate = useGameStore((s) => s.navigate);

  const hasSavedGame = hasSave();

  const handleNew = () => {
    if (!playerName.trim()) return;
    navigate('faction_select');
    // Store name temporarily; actual start happens after faction select
    useGameStore.setState({ playerName: playerName.trim() });
  };

  const handleLoad = () => {
    const loaded = loadSavedGame();
    if (!loaded) {
      alert('No saved game found.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10">
      {/* Logo / title */}
      <div className="text-center mb-12 space-y-3">
        {/* Planet illustration */}
        <div className="relative mx-auto w-40 h-40 mb-6">
          <div className="absolute inset-0 rounded-full animate-spin-slow"
            style={{
              background: 'conic-gradient(from 0deg, #0a0f2e, #1e3a8a, #0a0f2e)',
              opacity: 0.4,
            }}
          />
          <div className="absolute inset-4 rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #1d4ed8, #0c1445)',
              boxShadow: '0 0 60px #1d4ed860, inset -20px -20px 40px rgba(0,0,0,0.5)',
            }}
          />
          {/* Orbital ring */}
          <div className="absolute inset-1 rounded-full border border-blue-500/20"
            style={{ transform: 'rotateX(75deg)', borderStyle: 'dashed' }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-5xl">
            🌌
          </div>
        </div>

        <h1 className="text-5xl font-orbitron font-black tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
          GALACTIC
        </h1>
        <h1 className="text-5xl font-orbitron font-black tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent -mt-2">
          ASCENT
        </h1>
        <p className="text-slate-500 text-sm tracking-widest uppercase mt-2">
          Forge your empire among the stars
        </p>
      </div>

      {/* New game form */}
      <div className="w-full max-w-sm space-y-4">
        <div>
          <label className="block text-xs text-slate-400 uppercase tracking-widest mb-2">
            Commander Name
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNew()}
            placeholder="Enter your name…"
            maxLength={24}
            className="w-full bg-slate-900/80 border border-white/15 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500/60 focus:bg-slate-800/80 transition-all"
          />
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!playerName.trim()}
          onClick={handleNew}
          glowing
        >
          🚀 Begin New Campaign
        </Button>

        {hasSavedGame && (
          <Button variant="secondary" size="lg" fullWidth onClick={handleLoad}>
            📂 Continue Saved Game
          </Button>
        )}
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 text-xs text-slate-700">
        A strategy game of galactic conquest
      </p>
    </div>
  );
}
