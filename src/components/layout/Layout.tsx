import { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import Header from './Header';
import Footer from './Footer';
import SEO, { SEOProps } from '@/components/seo/SEO';
import { WebSiteJsonLd, OrganizationJsonLd } from '@/components/seo/JsonLd';

interface LayoutProps extends SEOProps {
  children: ReactNode;
}

export default function Layout({
  children,
  title,
  description,
  canonical,
  ogImage,
  article,
}: LayoutProps) {
  return (
    <>
      <SEO
        title={title}
        description={description}
        canonical={canonical}
        ogImage={ogImage}
        article={article}
      />
      <WebSiteJsonLd />
      <OrganizationJsonLd />

      <div
        className="min-h-screen flex flex-col"
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--text-primary)',
        }}
      >
        <Header />

        <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 flex-grow">
          {children}
          <Analytics />
        </main>

        <Footer />
      </div>
    </>
  );
}
