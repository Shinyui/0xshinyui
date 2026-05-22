import { GetServerSideProps } from 'next';
import { getAllPosts } from '@/lib/posts';
import { siteConfig } from '@/lib/siteConfig';

type SitemapImage = {
  loc: string;
  title?: string;
};

type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
  images?: SitemapImage[];
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function renderEntry(entry: SitemapEntry): string {
  const parts = [`    <loc>${escapeXml(entry.loc)}</loc>`];
  if (entry.lastmod) parts.push(`    <lastmod>${entry.lastmod}</lastmod>`);
  if (entry.changefreq) parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
  if (entry.priority !== undefined) parts.push(`    <priority>${entry.priority}</priority>`);
  if (entry.images) {
    for (const img of entry.images) {
      parts.push('    <image:image>');
      parts.push(`      <image:loc>${escapeXml(img.loc)}</image:loc>`);
      if (img.title) parts.push(`      <image:title>${escapeXml(img.title)}</image:title>`);
      parts.push('    </image:image>');
    }
  }
  return `  <url>\n${parts.join('\n')}\n  </url>`;
}

function generateSiteMap(entries: SitemapEntry[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.map(renderEntry).join('\n')}
</urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const posts = await getAllPosts();

  const staticPages: SitemapEntry[] = [
    {
      loc: siteConfig.siteUrl,
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: `${siteConfig.siteUrl}/about`,
      changefreq: 'monthly',
      priority: 0.5,
    },
    {
      loc: `${siteConfig.siteUrl}/tools`,
      changefreq: 'monthly',
      priority: 0.6,
    },
    {
      loc: `${siteConfig.siteUrl}/2fa`,
      changefreq: 'monthly',
      priority: 0.4,
    },
    {
      loc: `${siteConfig.siteUrl}/ip`,
      changefreq: 'monthly',
      priority: 0.4,
    },
  ];

  const categories = Array.from(new Set(posts.map((post) => post.contentType)));
  const categoryPages: SitemapEntry[] = categories.map((category) => ({
    loc: `${siteConfig.siteUrl}/category/${encodeURIComponent(category)}`,
    changefreq: 'weekly',
    priority: 0.7,
  }));

  const postPages: SitemapEntry[] = posts.map((post) => ({
    loc: `${siteConfig.siteUrl}/posts/${post.slug}`,
    lastmod: new Date(post.date).toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8,
    images: post.coverImage
      ? [{ loc: post.coverImage.url, title: post.title }]
      : undefined,
  }));

  const allEntries = [...staticPages, ...categoryPages, ...postPages];
  const sitemap = generateSiteMap(allEntries);

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=60'
  );
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default function Sitemap() {
  return null;
}
