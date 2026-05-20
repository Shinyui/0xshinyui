import { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import Header from './Header';
import Footer from './Footer';
import RightSidebar from './RightSidebar';
import TopBanner from './TopBanner';
import StickyBottomAd from './StickyBottomAd';
import SEO, { SEOProps } from '@/components/seo/SEO';
import { WebSiteJsonLd, OrganizationJsonLd } from '@/components/seo/JsonLd';

type SidebarPost = {
  title: string;
  slug: string;
  date: string;
  contentType: string;
};

interface LayoutProps extends SEOProps {
  children: ReactNode;
  hideSidebar?: boolean;
  hideTopBanner?: boolean;
  hideStickyBottom?: boolean;
  latestPosts?: SidebarPost[];
  sidebarCategories?: string[];
  activeCategory?: string;
}

export default function Layout({
  children,
  title,
  description,
  canonical,
  ogImage,
  article,
  hideSidebar = false,
  hideTopBanner = false,
  hideStickyBottom = false,
  latestPosts,
  sidebarCategories,
  activeCategory,
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
        className="site-shell min-h-screen flex flex-col"
        style={{
          color: 'var(--text-primary)',
        }}
      >
        <Header />

        {!hideTopBanner && <TopBanner />}

        <div className="w-full flex-grow px-4 sm:px-6 py-6 sm:py-8">
          <div
            className={`mx-auto max-w-[1280px] ${
              hideSidebar
                ? ''
                : 'lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8'
            }`}
          >
            <main className="min-w-0">
              {children}
              <Analytics />
            </main>

            {!hideSidebar && (
              <RightSidebar
                latestPosts={latestPosts}
                categories={sidebarCategories}
                activeCategory={activeCategory}
              />
            )}
          </div>
        </div>

        <Footer />

        {!hideStickyBottom && <StickyBottomAd />}
      </div>
    </>
  );
}
