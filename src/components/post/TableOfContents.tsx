interface TocItem {
  slug: string;
  content: string;
  lvl: number;
}

interface TableOfContentsProps {
  items: TocItem[];
  variant?: 'desktop' | 'mobile';
}

export default function TableOfContents({
  items,
  variant = 'desktop',
}: TableOfContentsProps) {
  if (items.length === 0) return null;

  const isMobile = variant === 'mobile';
  const headingClassName = isMobile
    ? 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em]'
    : 'mb-4 block text-[11px] font-semibold uppercase tracking-[0.24em]';

  return (
    <nav
      className={`
        ${isMobile ? 'block md:hidden mb-6' : 'hidden md:block'}
        rounded-lg border p-4 text-sm
      `}
      style={{
        borderColor: 'var(--border-color)',
        background:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent), var(--card-background)',
        boxShadow: '0 14px 38px var(--shadow-color)',
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <strong className={headingClassName} style={{ color: 'var(--accent-mint)' }}>
          Index · 目錄
        </strong>
        <span className="status-dot" aria-hidden />
      </div>
      <ul className="space-y-1">
        {items.map((item, idx) => (
          <li key={item.slug}>
            <a
              href={`#${item.slug}`}
              className={`
                ${isMobile ? '' : 'text-sm'}
                flex items-baseline gap-2 rounded px-2 py-1 transition-colors duration-200
                ${item.lvl === 3 ? 'pl-4' : ''}
                ${item.lvl === 4 ? 'pl-6' : ''}
                ${item.lvl === 5 ? 'pl-8' : ''}
                ${item.lvl === 6 ? 'pl-10' : ''}
              `}
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-mint)';
                e.currentTarget.style.backgroundColor = 'var(--hover-background)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span
                className="font-mono text-[10px] tabular-nums"
                style={{ color: 'var(--text-muted)' }}
              >
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 flex-1 truncate">{item.content}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
