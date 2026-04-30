import { GetServerSideProps } from 'next';
import { getAllPosts } from '@/lib/posts';
import { siteConfig } from '@/lib/siteConfig';

type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
};

function generateSiteMap(entries: SitemapEntry[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map((entry) => {
    return `
  <url>
    <loc>${entry.loc}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ''}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
  </url>`;
  })
  .join('')}
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

  // Get unique categories
  const categories = Array.from(new Set(posts.map((post) => post.contentType)));
  const categoryPages: SitemapEntry[] = categories.map((category) => ({
    loc: `${siteConfig.siteUrl}/category/${encodeURIComponent(category)}`,
    changefreq: 'weekly',
    priority: 0.7,
  }));

  // Post pages
  const postPages: SitemapEntry[] = posts.map((post) => ({
    loc: `${siteConfig.siteUrl}/posts/${post.slug}`,
    lastmod: new Date(post.date).toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8,
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
