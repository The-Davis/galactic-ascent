import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from './stores/gameStore';
import { StarField } from './components/layout/StarField';
import { ResourceBar } from './components/layout/ResourceBar';
import { BottomNav } from './components/layout/BottomNav';
import { IntroScreen } from './screens/IntroScreen';
import { FactionSelectScreen } from './screens/FactionSelectScreen';
import { BaseScreen } from './screens/BaseScreen';
import { MissionsScreen } from './screens/MissionsScreen';
import { LeadersScreen } from './screens/LeadersScreen';
import { ReincarnateScreen } from './screens/ReincarnateScreen';
import { clsx } from 'clsx';

const TICK_INTERVAL_MS = 1000;
const AUTO_SAVE_INTERVAL_MS = 30_000;

function NotificationToast() {
  const notification = useGameStore((s) => s.notification);
  const clearNotification = useGameStore((s) => s.clearNotification);

  if (!notification) return null;

  const colors = {
    success: 'bg-emerald-900/90 border-emerald-600/60 text-emerald-100',
    error: 'bg-red-900/90 border-red-600/60 text-red-100',
    info: 'bg-blue-900/90 border-blue-600/60 text-blue-100',
  };

  return (
    <div
      className={clsx(
        'fixed top-20 left-4 right-4 z-50 flex items-center gap-3',
        'px-4 py-3 rounded-2xl border backdrop-blur-md shadow-2xl',
        'animate-slide-down',
        colors[notification.type]
      )}
      onClick={clearNotification}
    >
      <span className="text-lg">
        {notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️'}
      </span>
      <span className="text-sm font-medium flex-1">{notification.message}</span>
    </div>
  );
}

function GameScreenRouter() {
  const currentScreen = useGameStore((s) => s.currentScreen);

  switch (currentScreen) {
    case 'intro':
      return <IntroScreen />;
    case 'faction_select':
      return <FactionSelectScreen />;
    case 'base':
      return <BaseScreen />;
    case 'missions':
      return <MissionsScreen />;
    case 'leaders':
      return <LeadersScreen />;
    case 'reincarnate':
      return <ReincarnateScreen />;
    default:
      return <IntroScreen />;
  }
}

export default function App() {
  const currentScreen = useGameStore((s) => s.currentScreen);
  const tickResources = useGameStore((s) => s.tickResources);
  const saveToLocal = useGameStore((s) => s.saveToLocal);

  const isInGame = !['intro', 'faction_select'].includes(currentScreen);

  // Game tick — updates resource accumulation every second
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const saveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(() => {
    tickResources(Date.now());
  }, [tickResources]);

  useEffect(() => {
    if (isInGame) {
      tickRef.current = setInterval(tick, TICK_INTERVAL_MS);
      saveRef.current = setInterval(saveToLocal, AUTO_SAVE_INTERVAL_MS);
    } else {
      if (tickRef.current) clearInterval(tickRef.current);
      if (saveRef.current) clearInterval(saveRef.current);
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (saveRef.current) clearInterval(saveRef.current);
    };
  }, [isInGame, tick, saveToLocal]);

  // Force re-render every second to update mission timers
  const reRenderRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (isInGame) {
      reRenderRef.current = setInterval(() => {
        // Trigger re-render without changing state (for countdown timers)
      }, 1000);
    }
    return () => {
      if (reRenderRef.current) clearInterval(reRenderRef.current);
    };
  }, [isInGame]);

  return (
    <div className="relative min-h-screen overflow-hidden font-rajdhani">
      <StarField />

      <div className="relative z-10 min-h-screen">
        {isInGame && (
          <>
            <ResourceBar />
            <BottomNav />
          </>
        )}

        <main className="relative">
          <GameScreenRouter />
        </main>

        <NotificationToast />
      </div>
    </div>
  );
}
