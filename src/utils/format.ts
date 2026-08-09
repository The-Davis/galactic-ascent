/** Format a number with K/M/B suffixes */
export function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return Math.floor(n).toString();
}

/** Format seconds into mm:ss or hh:mm:ss */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}m`;
  if (m > 0) return `${m}m ${s.toString().padStart(2, '0')}s`;
  return `${s}s`;
}

/** Format a rate (per second) as per-minute or per-hour */
export function formatRate(perSecond: number): string {
  if (perSecond <= 0) return '0/m';
  const perMin = perSecond * 60;
  if (perMin >= 1) return `${formatNumber(perMin)}/m`;
  const perHour = perSecond * 3600;
  return `${formatNumber(perHour)}/h`;
}

/** Get relative time string */
export function timeAgo(epochMs: number): string {
  const diff = Date.now() - epochMs;
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Get countdown string from a future epoch ms */
export function countdown(futureMs: number): string {
  const remaining = Math.max(0, futureMs - Date.now());
  return formatDuration(remaining / 1000);
}

/** Calculate percentage and clamp to [0, 100] */
export function percent(value: number, max: number): number {
  if (max <= 0) return 0;
  return clamp((value / max) * 100, 0, 100);
}

const RARITY_COLORS = {
  common: '#9ca3af',
  rare: '#60a5fa',
  legendary: '#f59e0b',
} as const;

export function rarityColor(rarity: 'common' | 'rare' | 'legendary'): string {
  return RARITY_COLORS[rarity];
}

export function rarityLabel(rarity: 'common' | 'rare' | 'legendary'): string {
  return rarity.charAt(0).toUpperCase() + rarity.slice(1);
}
