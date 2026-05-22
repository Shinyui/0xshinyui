import { GetServerSideProps } from 'next';
import { siteConfig } from '@/lib/siteConfig';

function generateRobotsTxt(): string {
  const aiBots = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-Web',
    'Google-Extended',
    'PerplexityBot',
    'Perplexity-User',
    'CCBot',
    'Applebot-Extended',
    'Bytespider',
    'Amazonbot',
    'Meta-ExternalAgent',
    'cohere-ai',
  ];

  const aiBotBlocks = aiBots
    .map(
      (bot) => `User-agent: ${bot}
Allow: /
Disallow: /api/`
    )
    .join('\n\n');

  return `# https://www.robotstxt.org/robotstxt.html

# Default policy
User-agent: *
Allow: /
Disallow: /api/

# AI search & training crawlers — explicitly allowed so that
# AI Overviews / answer engines can attribute and cite the site.
${aiBotBlocks}

# Sitemap
Sitemap: ${siteConfig.siteUrl}/sitemap.xml
`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const robotsTxt = generateRobotsTxt();

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=3600'
  );
  res.write(robotsTxt);
  res.end();

  return {
    props: {},
  };
};

export default function RobotsTxt() {
  return null;
}
