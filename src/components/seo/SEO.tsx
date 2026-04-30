import Head from 'next/head';
import { siteConfig } from '@/lib/siteConfig';

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    tags?: string[];
  };
}

export default function SEO({
  title,
  description = siteConfig.defaultDescription,
  canonical,
  ogImage,
  article,
}: SEOProps) {
  const pageTitle = title
    ? `${title} - ${siteConfig.siteName}`
    : siteConfig.siteName;
  const fullUrl = canonical
    ? `${siteConfig.siteUrl}${canonical}`
    : siteConfig.siteUrl;
  const imageUrl = ogImage
    ? ogImage
    : `${siteConfig.siteUrl}${siteConfig.defaultOgImage}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="theme-color" content="#0b0e11" />
      <link rel="canonical" href={fullUrl} />
      <link rel="alternate" type="application/atom+xml" title={siteConfig.siteName} href={`${siteConfig.siteUrl}/feed.xml`} />
      <link rel="manifest" href="/manifest.json" />

      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content={siteConfig.locale} />
      <meta property="og:site_name" content={siteConfig.siteName} />
      <meta
        property="og:type"
        content={article ? 'article' : 'website'}
      />

      {/* Article specific Open Graph tags */}
      {article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {article?.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}
      {article?.authors?.map((author) => (
        <meta key={author} property="article:author" content={author} />
      ))}
      {article?.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {siteConfig.twitterHandle && (
        <meta name="twitter:site" content={siteConfig.twitterHandle} />
      )}
    </Head>
  );
}
