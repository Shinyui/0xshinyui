import Link from 'next/link';
import AdSlot from '@/components/ads/AdSlot';
import CategoryTag from '@/components/category/CategoryTag';
import { sortCategories } from '@/utils/category';

type SidebarPost = {
  title: string;
  slug: string;
  date: string;
  contentType: string;
};

interface RightSidebarProps {
  latestPosts?: SidebarPost[];
  categories?: string[];
  activeCategory?: string;
}

export default function RightSidebar({
  latestPosts = [],
  categories = [],
  activeCategory,
}: RightSidebarProps) {
  const sortedCategories = sortCategories(categories);
  const topPosts = latestPosts.slice(0, 5);

  return (
    <aside className="hidden lg:flex lg:flex-col lg:gap-6 lg:sticky lg:top-24 lg:self-start">
      {sortedCategories.length > 0 && (
        <section
          className="market-panel p-4"
          aria-label="分類"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2
              className="text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: 'var(--accent-mint)' }}
            >
              Markets
            </h2>
            <span
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ color: 'var(--text-muted)' }}
            >
              {sortedCategories.length} pairs
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sortedCategories.map((cat) => (
              <CategoryTag
                key={cat}
                category={cat}
                isActive={cat === activeCategory}
              />
            ))}
          </div>
        </section>
      )}

      <AdSlot
        size="mid-rectangle"
        placement="Sidebar mid-rectangle"
      />

      {topPosts.length > 0 && (
        <section
          className="market-panel p-4"
          aria-label="最新文章"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2
              className="text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: 'var(--accent-mint)' }}
            >
              Latest Feed
            </h2>
            <span className="status-dot" aria-hidden />
          </div>
          <ul className="flex flex-col">
            {topPosts.map((post, idx) => (
              <li
                key={post.slug}
                className="border-b last:border-b-0 py-2"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <Link
                  href={`/posts/${post.slug}`}
                  className="block group"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-[10px] tabular-nums"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3
                      className="line-clamp-2 text-sm font-medium leading-snug transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--accent-mint)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                    >
                      {post.title}
                    </h3>
                  </div>
                  <div
                    className="mt-1 ml-6 flex items-center gap-2 font-mono text-[10px] tabular-nums"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <span>{post.date}</span>
                    <span>·</span>
                    <span style={{ color: 'var(--accent-mint-dark)' }}>
                      {post.contentType.toUpperCase()}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <AdSlot
        size="half-page"
        placement="Sidebar half-page"
      />
    </aside>
  );
}
