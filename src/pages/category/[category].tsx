import Layout from '@/components/layout/Layout';
import PostCard from '@/components/post/PostCard';
import CategoryFilter from '@/components/category/CategoryFilter';
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

type CategoryPageProps = {
  posts: Post[];
  category: string;
  allCategories: string[];
};

export default function CategoryPage({
  posts,
  category,
  allCategories,
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
    >
      <BreadcrumbJsonLd
        items={[
          { name: '首頁', url: siteConfig.siteUrl },
          { name: categoryName, url: `${siteConfig.siteUrl}/category/${encodeURIComponent(category)}` },
        ]}
      />
      <h1
        className="text-2xl sm:text-3xl font-bold mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        {categoryName} 文章
      </h1>

      <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
        共 {posts.length} 篇文章
      </p>

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
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

  return {
    props: {
      posts,
      category: decodedCategory,
      allCategories,
    },
    revalidate: 60,
  };
};
