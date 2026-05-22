import Link from 'next/link';
import { getPostBySlug, getSlugs, getAllPosts } from '@/lib/posts';
import Layout from '@/components/layout/Layout';
import TableOfContents from '@/components/post/TableOfContents';
import AdSlot from '@/components/ads/AdSlot';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { siteConfig } from '@/lib/siteConfig';
import { getMDXComponents } from '@/components/mdx';
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import toc from 'markdown-toc';
import Image from 'next/image';
import { bunnyOptimize } from '@/lib/bunny';
import { getCategoryDisplayName } from '@/utils/category';
import type { GetStaticPaths, GetStaticProps } from 'next';

type TocItem = { slug: string; content: string; lvl: number };

type SidebarPost = {
  title: string;
  slug: string;
  date: string;
  contentType: string;
};

type PostProps = {
  post: {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    contentType: string;
    mdxSource: MDXRemoteSerializeResult;
    toc: TocItem[];
    coverImage: string | null;
  };
  latestPosts: SidebarPost[];
  sidebarCategories: string[];
};

const mdxComponents = getMDXComponents();

export default function Post({
  post,
  latestPosts,
  sidebarCategories,
}: PostProps) {
  const postUrl = `${siteConfig.siteUrl}/posts/${post.slug}`;

  return (
    <Layout
      title={post.title}
      description={post.excerpt}
      canonical={`/posts/${post.slug}`}
      ogImage={post.coverImage || undefined}
      article={{
        publishedTime: post.date,
        modifiedTime: post.date,
        authors: ['0xShinyui'],
      }}
      latestPosts={latestPosts}
      sidebarCategories={sidebarCategories}
      activeCategory={post.contentType}
    >
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        url={postUrl}
        datePublished={post.date}
        dateModified={post.date}
        author="0xShinyui"
        image={post.coverImage || undefined}
        articleSection={getCategoryDisplayName(post.contentType)}
        keywords={[getCategoryDisplayName(post.contentType)]}
        inLanguage={siteConfig.locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: '首頁', url: siteConfig.siteUrl },
          {
            name: getCategoryDisplayName(post.contentType),
            url: `${siteConfig.siteUrl}/category/${encodeURIComponent(post.contentType)}`,
          },
          { name: post.title, url: postUrl },
        ]}
      />

      {/* 視覺化麵包屑（對應 BreadcrumbJsonLd） */}
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex items-center gap-2 text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        <Link
          href="/"
          className="transition-colors hover:text-[var(--accent-mint)]"
        >
          首頁
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={`/category/${encodeURIComponent(post.contentType)}`}
          className="transition-colors hover:text-[var(--accent-mint)]"
        >
          {getCategoryDisplayName(post.contentType)}
        </Link>
        <span aria-hidden="true">/</span>
        <span
          aria-current="page"
          className="truncate"
          style={{ color: 'var(--text-secondary)' }}
        >
          {post.title}
        </span>
      </nav>

      {/* 封面 + 基本資料 */}
      <div className="mx-auto mb-10">
        {post.coverImage && (
          <div
            className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-lg border"
            style={{
              borderColor: 'var(--border-color)',
              boxShadow: '0 18px 48px var(--shadow-color)',
            }}
          >
            <Image
              src={bunnyOptimize(post.coverImage, { width: 1200, quality: 80 })}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              unoptimized
              priority
            />
          </div>
        )}
        <p
          className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em]"
          style={{ color: 'var(--accent-mint)' }}
        >
          <span className="status-dot" />
          Field Note · {post.contentType.toUpperCase()}/0x
        </p>
        <h1
          className="mb-3 text-3xl font-bold leading-tight sm:text-5xl"
          style={{ color: 'var(--text-primary)' }}
        >
          {post.title}
        </h1>
        <p
          className="font-mono text-sm tabular-nums mb-4"
          style={{ color: 'var(--text-muted)' }}
        >
          {post.date}
        </p>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          {post.excerpt}
        </p>
      </div>

      {/* 排版主體區塊：手機單欄，桌機兩欄 */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden md:block min-w-0 sticky top-24 self-start">
          <TableOfContents items={post.toc} variant="desktop" />
        </aside>

        <div className="min-w-0">
          <TableOfContents items={post.toc} variant="mobile" />

          <article
            className="
              prose max-w-none overflow-hidden rounded-lg border p-5 sm:p-8
              [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4
              [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3
              [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2
              [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:mt-4 [&_h4]:mb-1
              [&_h5]:text-lg [&_h5]:font-medium [&_h5]:mt-4 [&_h5]:mb-1
              [&_h6]:text-base [&_h6]:font-medium [&_h6]:mt-3 [&_h6]:mb-1

              [&_h1]:text-[var(--text-primary)]
              [&_h2]:text-[var(--text-primary)]
              [&_h3]:text-[var(--text-primary)]
              [&_h4]:text-[var(--text-primary)]
              [&_h5]:text-[var(--text-primary)]
              [&_h6]:text-[var(--text-primary)]

              [&_p]:text-base [&_p]:mb-4 [&_p]:leading-relaxed
              [&_a]:transition-colors [&_a]:duration-300
              [&_a]:text-[var(--accent-mint)]
              [&_a:hover]:text-[var(--accent-mint-dark)]
              [&_strong]:font-semibold [&_strong]:text-[var(--text-primary)]
              [&_em]:italic
              [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:py-2
              [&_blockquote]:italic [&_blockquote]:my-6
              [&_blockquote]:border-[var(--accent-mint)]
              [&_blockquote]:bg-[var(--hover-background)]
              [&_blockquote_p]:mb-0
              [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4
              [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4
              [&_li]:mb-1
              [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
              [&_code]:font-mono [&_code]:text-[var(--accent-mint)]
              [&_pre]:rounded [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-6
              [&_pre]:bg-[#0F1318] [&_pre]:text-[var(--text-primary)]
              [&_pre]:border [&_pre]:border-[var(--border-color)]
              [&_table]:table-auto [&_table]:border [&_table]:text-sm [&_table]:my-6
              [&_table]:border-[var(--border-color)]
              [&_thead]:font-semibold [&_thead]:bg-[var(--hover-background)]
              [&_th]:border [&_th]:px-3 [&_th]:py-2
              [&_th]:border-[var(--border-color)]
              [&_th]:text-[var(--text-primary)]
              [&_td]:border [&_td]:px-3 [&_td]:py-2
              [&_td]:border-[var(--border-color)]
              [&_hr]:my-10 [&_hr]:border-t [&_hr]:border-[var(--border-color)]

              [id]:target:before:content-[''] [id]:target:before:block
              [id]:target:before:h-20 [id]:target:before:-mt-20
            "
            style={{
              background:
                'linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent), var(--card-background)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
              boxShadow: '0 14px 38px var(--shadow-color)',
            }}
          >
            <MDXRemote {...post.mdxSource} components={mdxComponents} />
          </article>

          <AdSlot
            className="mt-8"
            size="large-banner"
            placement="Post-read banner"
          />

          <div className="mt-8 flex items-center justify-between gap-4">
            <Link
              href={`/category/${encodeURIComponent(post.contentType)}`}
              className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-all"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-mint)';
                e.currentTarget.style.color = 'var(--accent-mint)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              ← 返回 {getCategoryDisplayName(post.contentType)}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-all"
              style={{
                backgroundColor: 'var(--accent-mint-soft)',
                color: 'var(--accent-mint)',
                border: '1px solid rgba(84, 255, 213, 0.28)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-mint)';
                e.currentTarget.style.color = 'var(--background)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-mint-soft)';
                e.currentTarget.style.color = 'var(--accent-mint)';
              }}
            >
              更多文章 →
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getSlugs();
  const paths = slugs.map((slug) => ({ params: { slug } }));

  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params!.slug as string;
    const postData = getPostBySlug(slug);

    const mdxSource = await serialize(postData.content, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
      },
      parseFrontmatter: false,
    });

    const tocData = toc(postData.content).json as TocItem[];

    const allPosts = await getAllPosts();
    const latestPosts = allPosts
      .filter((p) => p.slug !== slug)
      .slice(0, 5)
      .map((p) => ({
        title: p.title,
        slug: p.slug,
        date: p.date,
        contentType: p.contentType,
      }));

    const sidebarCategories = Array.from(
      new Set(allPosts.map((p) => p.contentType))
    );

    return {
      props: {
        post: {
          slug,
          title: postData.title,
          date: postData.date,
          excerpt: postData.excerpt,
          contentType: postData.contentType,
          mdxSource,
          coverImage: postData.coverImage,
          toc: tocData,
        },
        latestPosts,
        sidebarCategories,
      },
      revalidate: 60,
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
