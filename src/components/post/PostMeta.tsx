import { getCategoryDisplayName } from '@/utils/category';

interface PostMetaProps {
  date: string;
  category: string;
  dateVariant?: 'default' | 'muted';
}

export default function PostMeta({
  date,
  category,
  dateVariant = 'muted',
}: PostMetaProps) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <span
        className="inline-flex items-center gap-1 rounded px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em]"
        style={{
          backgroundColor: 'var(--accent-mint-soft)',
          border: '1px solid rgba(84, 255, 213, 0.28)',
          color: 'var(--accent-mint)',
        }}
      >
        <span>{category.toUpperCase()}</span>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        <span style={{ color: 'var(--accent-mint-dark)' }}>0x</span>
      </span>
      <span
        className="inline-flex items-center gap-1.5 font-mono text-[11px] tabular-nums"
        style={{
          color:
            dateVariant === 'muted'
              ? 'var(--text-muted)'
              : 'var(--text-secondary)',
        }}
      >
        <span className="status-dot" aria-hidden />
        {date}
      </span>
      <span
        className="sr-only"
      >
        {getCategoryDisplayName(category)}
      </span>
    </div>
  );
}
