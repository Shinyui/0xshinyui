import { Fragment } from 'react';
import Layout from '@/components/layout/Layout';
import PostCard from '@/components/post/PostCard';
import CategoryFilter from '@/components/category/CategoryFilter';
import AdSlot from '@/components/ads/AdSlot';
import { getAllPosts } from '@/lib/posts';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { siteConfig } from '@/lib/siteConfig';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getCategoryDisplayName, sortCategories } from '@/utils/category';

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

type SidebarPost = {
  title: string;
  slug: string;
  date: string;
  contentType: string;
};

type CategoryPageProps = {
  posts: Post[];
  category: string;
  allCategories: string[];
  latestPosts: SidebarPost[];
  lastUpdated: string | null;
};

export default function CategoryPage({
  posts,
  category,
  allCategories,
  latestPosts,
  lastUpdated,
}: CategoryPageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p style={{ color: 'var(--text-primary)' }}>載入中...</p>
        </div>
      </Layout>
    );
  }

  const categoryName = getCategoryDisplayName(category);

  return (
    <Layout
      title={`${categoryName} - 0xShinyui`}
      description={`瀏覽 ${categoryName} 分類下的文章`}
      canonical={`/category/${category}`}
      latestPosts={latestPosts}
      sidebarCategories={allCategories}
      activeCategory={category}
    >
      <BreadcrumbJsonLd
        items={[
          { name: '首頁', url: siteConfig.siteUrl },
          {
            name: categoryName,
            url: `${siteConfig.siteUrl}/category/${encodeURIComponent(category)}`,
          },
        ]}
      />
      <section
        className="mb-8 grid gap-0 overflow-hidden rounded-lg border lg:grid-cols-[1fr_280px]"
        style={{
          background:
            'linear-gradient(135deg, rgba(84, 255, 213, 0.09), rgba(2, 192, 118, 0.03)), var(--surface)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="p-6 sm:p-8">
          <p
            className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em]"
            style={{ color: 'var(--accent-mint)' }}
          >
            <span className="status-dot" />
            Category · {category.toUpperCase()}/0x
          </p>
          <h1
            className="text-2xl font-bold sm:text-4xl"
            style={{ color: 'var(--text-primary)' }}
          >
            {categoryName}
          </h1>
          <p
            className="mt-3 text-base"
            style={{ color: 'var(--text-secondary)' }}
          >
            此分類匯整關於「{categoryName}」的實戰記錄與思考。
          </p>
        </div>

        <div
          className="border-t p-6 lg:border-l lg:border-t-0"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.24em]"
            style={{ color: 'var(--text-muted)' }}
          >
            Stats
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p
                className="font-mono text-2xl font-bold tabular-nums"
                style={{ color: 'var(--accent-mint)' }}
              >
                {posts.length}
              </p>
              <p
                className="text-[10px] uppercase tracking-[0.18em]"
                style={{ color: 'var(--text-muted)' }}
              >
                Posts
              </p>
            </div>
            <div>
              <p
                className="font-mono text-sm tabular-nums"
                style={{ color: 'var(--text-primary)' }}
              >
                {lastUpdated ?? '—'}
              </p>
              <p
                className="text-[10px] uppercase tracking-[0.18em]"
                style={{ color: 'var(--text-muted)' }}
              >
                Last Update
              </p>
            </div>
          </div>
        </div>
      </section>

      <CategoryFilter
        categories={allCategories}
        activeCategory={category}
        showAllButton
      />

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p style={{ color: 'var(--text-secondary)' }}>此類別暫無文章</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <Fragment key={post.slug}>
                {(index === 2 || index === 8) && (
                  <AdSlot
                    size="in-feed"
                    className="sm:col-span-2 xl:col-span-3"
                    placement={`${categoryName} category in-feed ${index === 2 ? 'A' : 'B'}`}
                  />
                )}
                <PostCard post={post} />
              </Fragment>
            ))}
          </div>
          <AdSlot
            size="large-banner"
            className="mt-10"
            placement={`${categoryName} category banner`}
          />
        </>
      )}
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts();
  const categories = Array.from(new Set(posts.map((post) => post.contentType)));

  const paths = categories.map((category) => ({
    params: { category: encodeURIComponent(category) },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const category = params?.category as string;
  const decodedCategory = decodeURIComponent(category);

  const allPosts = await getAllPosts();
  const posts = allPosts.filter((post) => post.contentType === decodedCategory);
  const allCategoriesUnsorted = Array.from(
    new Set(allPosts.map((post) => post.contentType))
  );
  const allCategories = sortCategories(allCategoriesUnsorted);

  const latestPosts = allPosts.slice(0, 5).map((p) => ({
    title: p.title,
    slug: p.slug,
    date: p.date,
    contentType: p.contentType,
  }));

  const lastUpdated = posts.length > 0 ? posts[0].date : null;

  return {
    props: {
      posts,
      category: decodedCategory,
      allCategories,
      latestPosts,
      lastUpdated,
    },
    revalidate: 60,
  };
};
