import { clsx } from 'clsx';
import { percent } from '../../utils/format';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  className?: string;
  label?: string;
  showPercent?: boolean;
  animate?: boolean;
  height?: 'xs' | 'sm' | 'md';
}

const heightClasses = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2.5',
};

export function ProgressBar({
  value,
  max,
  color = 'bg-gradient-to-r from-blue-500 to-cyan-400',
  className,
  label,
  showPercent = false,
  animate = false,
  height = 'sm',
}: ProgressBarProps) {
  const pct = percent(value, max);

  return (
    <div className={clsx('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-slate-400">{label}</span>}
          {showPercent && <span className="text-xs text-slate-500">{Math.floor(pct)}%</span>}
        </div>
      )}
      <div className={clsx('w-full bg-slate-800 rounded-full overflow-hidden', heightClasses[height])}>
        <div
          className={clsx(color, 'rounded-full transition-all duration-500', animate && 'animate-pulse')}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
