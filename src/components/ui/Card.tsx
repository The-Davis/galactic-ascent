import { clsx } from 'clsx';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  glowColor?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
};

export function Card({
  glow = false,
  glowColor = 'rgba(59,130,246,0.15)',
  hover = false,
  padding = 'md',
  className,
  children,
  style,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      style={{
        boxShadow: glow ? `0 0 20px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.06)` : undefined,
        ...style,
      }}
      className={clsx(
        'rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-sm',
        hover && 'transition-all duration-200 hover:border-white/20 hover:bg-slate-800/90 cursor-pointer',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
