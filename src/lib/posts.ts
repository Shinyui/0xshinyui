import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

export type PostFrontmatter = {
  title: string;
  date: string;
  excerpt: string;
  contentType: string;
  coverImage?: string;
  draft?: boolean;
  tags?: string[];
};

export type PostListItem = {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  contentType: string;
  coverImage: { url: string } | null;
};

export type PostData = {
  title: string;
  date: string;
  excerpt: string;
  contentType: string;
  coverImage: string | null;
  content: string;
};

function readFrontmatter(slug: string): PostFrontmatter {
  const filePath = path.join(POSTS_DIR, slug, 'index.mdx');
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(fileContents);
  return data as PostFrontmatter;
}

export function getSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const entries = fs.readdirSync(POSTS_DIR, { withFileTypes: true });
  const isProd = process.env.NODE_ENV === 'production';

  return entries
    .filter((entry) => {
      if (!entry.isDirectory()) return false;
      const mdxPath = path.join(POSTS_DIR, entry.name, 'index.mdx');
      if (!fs.existsSync(mdxPath)) return false;
      if (isProd) {
        const fm = readFrontmatter(entry.name);
        return !fm.draft;
      }
      return true;
    })
    .map((entry) => entry.name);
}

export function getAllPosts(): PostListItem[] {
  const slugs = getSlugs();
  const posts = slugs.map((slug) => {
    const fm = readFrontmatter(slug);
    return {
      title: fm.title,
      slug,
      date: fm.date,
      excerpt: fm.excerpt,
      contentType: fm.contentType,
      coverImage: fm.coverImage ? { url: fm.coverImage } : null,
    };
  });

  // Sort by date descending (same as Hygraph's orderBy: date_DESC)
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

export function getPostBySlug(slug: string): PostData {
  const filePath = path.join(POSTS_DIR, slug, 'index.mdx');
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContents);

  return {
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    contentType: data.contentType,
    coverImage: data.coverImage || null,
    content,
  };
}
