import { clsx } from 'clsx';
import { useGameStore, selectCanReincarnate } from '../../stores/gameStore';
import type { ScreenId } from '../../types/game';

interface NavItem {
  id: ScreenId;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'base', label: 'Base', icon: '🌌' },
  { id: 'missions', label: 'Missions', icon: '📋' },
  { id: 'leaders', label: 'Leaders', icon: '👥' },
  { id: 'reincarnate', label: 'Ascend', icon: '♾️' },
];

export function BottomNav() {
  const currentScreen = useGameStore((s) => s.currentScreen);
  const navigate = useGameStore((s) => s.navigate);
  const canReincarnate = useGameStore(selectCanReincarnate);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-white/10 safe-area-pb">
      <div className="flex items-stretch h-16">
        {NAV_ITEMS.map((item) => {
          const active = currentScreen === item.id;
          const isAscend = item.id === 'reincarnate';

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={clsx(
                'flex-1 flex flex-col items-center justify-center gap-0.5 transition-all duration-200',
                'active:bg-white/5 select-none',
                active ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300',
                isAscend && canReincarnate && !active && 'text-amber-400 animate-pulse'
              )}
            >
              <span className={clsx('text-xl leading-none', active && 'drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]')}>
                {item.icon}
              </span>
              <span className={clsx('text-[10px] font-semibold tracking-wide uppercase', active && 'text-blue-300')}>
                {item.label}
              </span>
              {active && (
                <div className="absolute bottom-0 w-6 h-0.5 bg-blue-400 rounded-full" />
              )}
              {isAscend && canReincarnate && (
                <span className="absolute top-2 right-[calc(50%-16px)] w-2 h-2 bg-amber-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
