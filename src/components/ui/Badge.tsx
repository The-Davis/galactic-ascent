import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'military' | 'science' | 'economic' | 'subterfuge' | 'common' | 'rare' | 'legendary';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-700 text-slate-300',
  success: 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50',
  warning: 'bg-amber-900/60 text-amber-300 border border-amber-700/50',
  danger: 'bg-red-900/60 text-red-300 border border-red-700/50',
  info: 'bg-blue-900/60 text-blue-300 border border-blue-700/50',
  military: 'bg-red-900/60 text-red-300 border border-red-700/50',
  science: 'bg-cyan-900/60 text-cyan-300 border border-cyan-700/50',
  economic: 'bg-yellow-900/60 text-yellow-300 border border-yellow-700/50',
  subterfuge: 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50',
  common: 'bg-slate-700/80 text-slate-300 border border-slate-600/50',
  rare: 'bg-blue-900/60 text-blue-300 border border-blue-600/60',
  legendary: 'bg-amber-900/60 text-amber-300 border border-amber-600/60',
};

export function Badge({ variant = 'default', children, className, size = 'sm' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export const SPEC_EMOJI: Record<string, string> = {
  military: '⚔️',
  science: '🔬',
  economic: '💰',
  subterfuge: '🕵️',
};
