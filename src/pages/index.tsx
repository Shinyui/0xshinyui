import Layout from '@/components/layout/Layout';
import PostCard from '@/components/post/PostCard';
import CategoryFilter from '@/components/category/CategoryFilter';
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
      <h1
        className="text-2xl sm:text-3xl font-bold mb-8"
        style={{ color: 'var(--text-primary)' }}
      >
        最新文章
      </h1>

      <CategoryFilter categories={tags} showAllButton />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
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
