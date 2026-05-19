import { Fragment } from 'react';
import Layout from '@/components/layout/Layout';
import PostCard from '@/components/post/PostCard';
import CategoryFilter from '@/components/category/CategoryFilter';
import AdSlot from '@/components/ads/AdSlot';
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

type HomeProps = {
  posts: Post[];
  tags: string[];
};

export default function Home({ posts, tags }: HomeProps) {
  return (
    <Layout
      title="首頁 - 0xShinyui"
      description="分享產品管理、技術開發、運營經驗"
      canonical="/"
    >
      <section
        className="mb-8 rounded-lg border p-6 sm:p-8"
        style={{
          background:
            'linear-gradient(135deg, rgba(0, 240, 255, 0.12), rgba(168, 255, 79, 0.04)), var(--surface)',
          borderColor: 'var(--border-color)',
          boxShadow: '0 18px 48px var(--shadow-color)',
        }}
      >
        <p
          className="mb-3 text-xs font-semibold uppercase tracking-[0.24em]"
          style={{ color: 'var(--accent-cyan)' }}
        >
          0xShinyui Intelligence Feed
        </p>
        <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-end">
          <div>
            <h1
              className="max-w-3xl text-3xl font-bold leading-tight sm:text-5xl"
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
          </div>
          <div
            className="rounded-lg border p-4"
            style={{
              backgroundColor: 'rgba(5, 8, 8, 0.45)',
              borderColor: 'var(--border-color)',
            }}
          >
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Latest posts
            </p>
            <p
              className="mt-2 text-3xl font-bold"
              style={{ color: 'var(--accent-cyan)' }}
            >
              {posts.length}
            </p>
          </div>
        </div>
      </section>

      <CategoryFilter categories={tags} showAllButton />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <Fragment key={post.slug}>
            {index === 3 && (
              <AdSlot
                key="home-ad"
                className="sm:col-span-2 lg:col-span-3"
                placement="Homepage native banner"
              />
            )}
            <PostCard post={post} />
          </Fragment>
        ))}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = await getAllPosts();
  const allTags = Array.from(new Set(posts.map((post) => post.contentType)));
  const tags = sortCategories(allTags);

  return {
    props: { posts, tags },
    revalidate: 60, // ISR：每 60 秒更新
  };
}
