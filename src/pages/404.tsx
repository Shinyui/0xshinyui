import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { getAllPosts } from '@/lib/posts';

type Post = {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  contentType: string;
  coverImage: { url: string } | null;
};

type NotFoundProps = {
  posts: Post[];
};

export default function NotFound({ posts }: NotFoundProps) {
  const recentPosts = posts.slice(0, 5);

  return (
    <Layout title="404 - 找不到頁面" description="你尋找的頁面不存在">
      <div className="flex flex-col items-center justify-center py-20">
        <h1
          className="text-8xl font-bold mb-4"
          style={{ color: 'var(--accent-gold)' }}
        >
          404
        </h1>
        <p
          className="text-xl mb-8"
          style={{ color: 'var(--text-secondary)' }}
        >
          這個頁面不存在或是已經被移除了
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-lg font-medium transition-colors duration-300"
          style={{
            backgroundColor: 'var(--accent-gold)',
            color: '#0b0e11',
          }}
        >
          回到首頁
        </Link>
      </div>

      {recentPosts.length > 0 && (
        <div className="mt-8">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            最新文章
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="p-4 rounded-lg border transition-colors duration-300"
                style={{
                  backgroundColor: 'var(--card-background)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <h3
                  className="font-semibold mb-2 line-clamp-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {post.title}
                </h3>
                <p
                  className="text-sm line-clamp-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = await getAllPosts();
  return {
    props: { posts },
    revalidate: 60,
  };
}
