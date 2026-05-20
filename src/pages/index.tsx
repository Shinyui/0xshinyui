import { Fragment } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import PostCard from '@/components/post/PostCard';
import CategoryFilter from '@/components/category/CategoryFilter';
import AdSlot from '@/components/ads/AdSlot';
import MarketOverview from '@/components/home/MarketOverview';
import { getAllPosts } from '@/lib/posts';
import { sortCategories } from '@/utils/category';

type Post = {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  contentType: string;
  coverImage: {
    url: string;
  } | null;
};

type CategoryStat = {
  category: string;
  count: number;
  recentCount: number;
  trend: number[];
};

type HomeProps = {
  posts: Post[];
  tags: string[];
  categoryStats: CategoryStat[];
};

export default function Home({ posts, tags, categoryStats }: HomeProps) {
  const latestPosts = posts.slice(0, 5).map((p) => ({
    title: p.title,
    slug: p.slug,
    date: p.date,
    contentType: p.contentType,
  }));

  return (
    <Layout
      title="首頁 - 0xShinyui"
      description="分享產品管理、技術開發、運營經驗"
      canonical="/"
      latestPosts={latestPosts}
      sidebarCategories={tags}
    >
      <section
        className="mb-8 overflow-hidden rounded-lg border"
        style={{
          background:
            'linear-gradient(135deg, rgba(84, 255, 213, 0.10), rgba(2, 192, 118, 0.04)), var(--surface)',
          borderColor: 'var(--border-color)',
          boxShadow: '0 18px 48px var(--shadow-color)',
        }}
      >
        <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
          <div className="p-6 sm:p-8">
            <p
              className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: 'var(--accent-mint)' }}
            >
              <span className="status-dot" />
              Intelligence Feed · Live
            </p>
            <h1
              className="max-w-2xl text-3xl font-bold leading-tight sm:text-5xl"
              style={{ color: 'var(--text-primary)' }}
            >
              產品、技術與運營的實戰筆記
            </h1>
            <p
              className="mt-4 max-w-2xl text-base leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              從產品決策、工程實作到增長運營，整理可反覆驗證的經驗與拆解。
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="#feed"
                className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-all"
                style={{
                  backgroundColor: 'var(--accent-mint)',
                  color: 'var(--background)',
                  boxShadow: '0 0 22px var(--glow-mint)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-mint-dark)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-mint)';
                }}
              >
                探索文章 →
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm font-semibold transition-all"
                style={{
                  borderColor: 'var(--border-strong)',
                  color: 'var(--text-primary)',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-mint)';
                  e.currentTarget.style.color = 'var(--accent-mint)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                工具總覽
              </Link>
            </div>

            <div
              className="mt-6 grid grid-cols-3 gap-3 border-t pt-5"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Total
                </p>
                <p
                  className="mt-1 font-mono text-xl font-bold tabular-nums"
                  style={{ color: 'var(--accent-mint)' }}
                >
                  {posts.length}
                </p>
              </div>
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Markets
                </p>
                <p
                  className="mt-1 font-mono text-xl font-bold tabular-nums"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {tags.length}
                </p>
              </div>
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Status
                </p>
                <p
                  className="mt-1 font-mono text-xl font-bold tabular-nums"
                  style={{ color: 'var(--accent-positive)' }}
                >
                  ▲ LIVE
                </p>
              </div>
            </div>
          </div>

          <div
            className="border-t lg:border-l lg:border-t-0"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <MarketOverview stats={categoryStats} />
          </div>
        </div>
      </section>

      <AdSlot
        className="mb-8"
        size="leaderboard"
        placement="Homepage post-hero leaderboard"
      />

      <div id="feed">
        <CategoryFilter categories={tags} showAllButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <Fragment key={post.slug}>
            {(index === 2 || index === 8) && (
              <AdSlot
                size="in-feed"
                className="sm:col-span-2 xl:col-span-3"
                placement={`Homepage in-feed ${index === 2 ? 'A' : 'B'}`}
              />
            )}
            <PostCard post={post} />
          </Fragment>
        ))}
      </div>

      <AdSlot
        size="large-banner"
        className="mt-10"
        placement="Homepage pre-footer banner"
      />
    </Layout>
  );
}

function computeCategoryStats(posts: Post[]): CategoryStat[] {
  const now = Date.now();
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  const map = new Map<string, { count: number; recentCount: number; weekBuckets: number[] }>();

  for (const post of posts) {
    const cat = post.contentType;
    const entry = map.get(cat) ?? {
      count: 0,
      recentCount: 0,
      weekBuckets: [0, 0, 0, 0, 0, 0, 0, 0],
    };
    entry.count += 1;

    const ts = new Date(post.date).getTime();
    const age = now - ts;
    const weeksAgo = Math.floor(age / SEVEN_DAYS_MS);
    if (weeksAgo < 8) {
      const idx = 7 - weeksAgo;
      entry.weekBuckets[idx] = (entry.weekBuckets[idx] ?? 0) + 1;
    }
    if (age <= SEVEN_DAYS_MS) {
      entry.recentCount += 1;
    }
    map.set(cat, entry);
  }

  return Array.from(map.entries())
    .map(([category, v]) => ({
      category,
      count: v.count,
      recentCount: v.recentCount,
      trend: v.weekBuckets,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

export async function getStaticProps() {
  const posts = await getAllPosts();
  const allTags = Array.from(new Set(posts.map((post) => post.contentType)));
  const tags = sortCategories(allTags);
  const categoryStats = computeCategoryStats(posts);

  return {
    props: { posts, tags, categoryStats },
    revalidate: 60,
  };
}
