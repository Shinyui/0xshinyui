import { GetServerSideProps } from 'next';
import { getAllPosts } from '@/lib/posts';
import { siteConfig } from '@/lib/siteConfig';

function generateAtomFeed(posts: { title: string; slug: string; date: string; excerpt: string; contentType: string }[]): string {
  const now = new Date().toISOString();
  const entries = posts
    .map(
      (post) => `
  <entry>
    <title><![CDATA[${post.title}]]></title>
    <link href="${siteConfig.siteUrl}/posts/${post.slug}" rel="alternate" type="text/html"/>
    <id>${siteConfig.siteUrl}/posts/${post.slug}</id>
    <updated>${new Date(post.date).toISOString()}</updated>
    <summary><![CDATA[${post.excerpt}]]></summary>
    <author>
      <name>${siteConfig.author}</name>
    </author>
    <category term="${post.contentType}"/>
  </entry>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${siteConfig.siteName}</title>
  <link href="${siteConfig.siteUrl}" rel="alternate" type="text/html"/>
  <link href="${siteConfig.siteUrl}/feed.xml" rel="self" type="application/atom+xml"/>
  <id>${siteConfig.siteUrl}</id>
  <updated>${now}</updated>
  <author>
    <name>${siteConfig.author}</name>
  </author>
  ${entries}
</feed>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const posts = await getAllPosts();
  const feed = generateAtomFeed(posts);

  res.setHeader('Content-Type', 'application/atom+xml; charset=utf-8');
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=60'
  );
  res.write(feed);
  res.end();

  return {
    props: {},
  };
};

export default function Feed() {
  return null;
}
