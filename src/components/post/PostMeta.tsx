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
    <>
      <p
        className="mb-2 inline-block rounded px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
        style={{
          backgroundColor: 'rgba(0, 240, 255, 0.12)',
          border: '1px solid rgba(0, 240, 255, 0.22)',
          color: 'var(--accent-cyan)',
        }}
      >
        {getCategoryDisplayName(category)}
      </p>
      <p
        className="mb-3 text-xs"
        style={{
          color: dateVariant === 'muted' ? 'var(--text-muted)' : 'var(--text-secondary)',
        }}
      >
        {date}
      </p>
    </>
  );
}
