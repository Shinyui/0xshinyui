import Link from 'next/link';
import PostCover from './PostCover';
import PostMeta from './PostMeta';

interface PostCardProps {
  post: {
    title: string;
    slug: string;
    date: string;
    excerpt: string;
    contentType: string;
    coverImage?: {
      url: string;
    } | null;
  };
  showCover?: boolean;
  showExcerpt?: boolean;
}

export default function PostCard({
  post,
  showCover = true,
  showExcerpt = true,
}: PostCardProps) {
  return (
    <div
      className="group flex h-full flex-col rounded-lg border p-4 transition-all duration-300"
      style={{
        background:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent), var(--card-background)',
        borderColor: 'var(--border-color)',
        boxShadow: '0 14px 38px var(--shadow-color)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-cyan)';
        e.currentTarget.style.boxShadow =
          '0 18px 48px var(--shadow-color), 0 0 24px var(--glow-cyan)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.boxShadow = '0 14px 38px var(--shadow-color)';
      }}
    >
      {showCover && post.coverImage?.url && (
        <Link href={`/posts/${post.slug}`} className="block">
          <PostCover
            src={post.coverImage.url}
            alt={post.title}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>
      )}

      <PostMeta date={post.date} category={post.contentType} />

      <Link href={`/posts/${post.slug}`} className="block">
        <h2
          className="mb-2 text-lg font-semibold leading-snug transition-colors duration-300"
          style={{ color: 'var(--text-primary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--accent-cyan)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
        >
          {post.title}
        </h2>
      </Link>

      {showExcerpt && (
        <p
          className="text-sm leading-relaxed line-clamp-3"
          style={{ color: 'var(--text-secondary)' }}
        >
          {post.excerpt}
        </p>
      )}
    </div>
  );
}
