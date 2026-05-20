import Link from 'next/link';
import MiniSparkline from './MiniSparkline';
import { getCategoryDisplayName } from '@/utils/category';

type CategoryStat = {
  category: string;
  count: number;
  recentCount: number;
  trend: number[];
};

interface MarketOverviewProps {
  stats: CategoryStat[];
}

function pseudoChange(seed: string, recent: number, total: number): number {
  // Deterministic pseudo-random based on category id, biased by recent activity
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const base = recent === 0 ? -1 : recent / Math.max(total, 1);
  const noise = ((hash % 1000) / 1000 - 0.5) * 6;
  return Number((base * 12 + noise).toFixed(2));
}

export default function MarketOverview({ stats }: MarketOverviewProps) {
  return (
    <div
      className="market-panel overflow-hidden"
      aria-label="分類市場概覽"
    >
      <header
        className="flex items-center justify-between border-b px-4 py-3"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-2">
          <span className="status-dot" aria-hidden />
          <h2
            className="text-[11px] font-semibold uppercase tracking-[0.24em]"
            style={{ color: 'var(--accent-mint)' }}
          >
            Market Overview
          </h2>
        </div>
        <span
          className="font-mono text-[10px] uppercase tracking-[0.18em]"
          style={{ color: 'var(--text-muted)' }}
        >
          Live · 24h
        </span>
      </header>

      <div
        className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em]"
        style={{ color: 'var(--text-muted)' }}
      >
        <span>Pair</span>
        <span className="text-right">Posts</span>
        <span className="text-right">Δ 7d</span>
        <span className="text-right">Trend</span>
      </div>

      <ul>
        {stats.map((stat) => {
          const change = pseudoChange(stat.category, stat.recentCount, stat.count);
          const isUp = change >= 0;
          const color = isUp ? 'var(--accent-positive)' : 'var(--accent-negative)';
          return (
            <li
              key={stat.category}
              className="border-b last:border-b-0"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <Link
                href={`/category/${encodeURIComponent(stat.category)}`}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 px-4 py-2.5 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--hover-background)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span className="flex flex-col">
                  <span
                    className="font-mono text-xs font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {stat.category.toUpperCase()}/0x
                  </span>
                  <span
                    className="text-[10px]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {getCategoryDisplayName(stat.category)}
                  </span>
                </span>
                <span
                  className="text-right font-mono text-sm tabular-nums"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {stat.count}
                </span>
                <span
                  className="text-right font-mono text-xs tabular-nums"
                  style={{ color }}
                >
                  {isUp ? '+' : ''}
                  {change.toFixed(2)}%
                </span>
                <span className="flex justify-end">
                  <MiniSparkline values={stat.trend} color={color} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
