import { siteConfig } from '@/lib/siteConfig';

interface WebSiteJsonLdProps {
  name?: string;
  url?: string;
}

export function WebSiteJsonLd({
  name = siteConfig.siteName,
  url = siteConfig.siteUrl,
}: WebSiteJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    inLanguage: siteConfig.locale,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
  articleSection?: string;
  keywords?: string[];
  inLanguage?: string;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  author = siteConfig.author,
  image,
  articleSection,
  keywords,
  inLanguage = siteConfig.locale,
}: ArticleJsonLdProps) {
  const logoUrl = `${siteConfig.siteUrl}/logo.png`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    inLanguage,
    author: {
      '@type': 'Person',
      name: author,
      url: siteConfig.siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.siteName,
      url: siteConfig.siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: logoUrl,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(image && { image: [image] }),
    ...(articleSection && { articleSection }),
    ...(keywords && keywords.length > 0 && { keywords: keywords.join(', ') }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.siteName,
    url: siteConfig.siteUrl,
    logo: `${siteConfig.siteUrl}/logo.png`,
    sameAs: siteConfig.twitterHandle
      ? [`https://twitter.com/${siteConfig.twitterHandle.replace('@', '')}`]
      : [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
