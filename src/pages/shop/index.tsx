import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/shop/ProductCard';
import AdSlot from '@/components/ads/AdSlot';
import { shopCategories, TELEGRAM_HANDLE } from '@/lib/shopConfig';

const ShopPage = () => {
  const [activeTab, setActiveTab] = useState(shopCategories[0].id);
  const activeCategory = shopCategories.find((c) => c.id === activeTab)!;

  return (
    <Layout
      title="商店 - 0xShinyui"
      description="Web3 空投腳本與空投基建資源，透過 Telegram 聯繫購買"
      canonical="/shop"
      hideSidebar
    >
      <div className="py-6 sm:py-10">
        <div className="max-w-6xl mx-auto">
          <div
            className="mb-10 rounded-lg border p-6 text-center sm:p-8"
            style={{
              background:
                'linear-gradient(135deg, rgba(84, 255, 213, 0.10), rgba(2, 192, 118, 0.04)), var(--surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            <p
              className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: 'var(--accent-mint)' }}
            >
              <span className="status-dot" />
              Shop
            </p>
            <h1
              className="text-3xl font-bold sm:text-5xl"
              style={{ color: 'var(--text-primary)' }}
            >
              商店
            </h1>
            <p
              className="mx-auto mt-4 max-w-2xl text-base leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Web3 空投腳本與基建資源，所有商品透過 Telegram 聯繫購買
            </p>
          </div>

          <div
            className="mb-10 inline-flex flex-wrap gap-1 rounded-lg border p-1"
            style={{
              backgroundColor: 'var(--card-background)',
              borderColor: 'var(--border-color)',
            }}
          >
            {shopCategories.map((category) => {
              const isActive = category.id === activeTab;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className="rounded-md px-6 py-2.5 text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: isActive
                      ? 'var(--accent-mint)'
                      : 'transparent',
                    color: isActive ? 'var(--background)' : 'var(--text-secondary)',
                    boxShadow: isActive ? '0 0 18px var(--glow-mint)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.backgroundColor =
                        'var(--hover-background)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {category.title}
                </button>
              );
            })}
          </div>

          <p
            className="mb-8 text-base"
            style={{ color: 'var(--text-muted)' }}
          >
            {activeCategory.subtitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCategory.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <div
              className="inline-block max-w-2xl rounded-lg border border-dashed p-6"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--card-background)',
              }}
            >
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                交易須知
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                所有交易透過 Telegram 私訊完成，確認付款後交付商品。
                有任何問題歡迎直接聯繫 {TELEGRAM_HANDLE}
              </p>
            </div>
          </div>
          <AdSlot
            size="large-banner"
            className="mt-10"
            placement="Shop page footer banner"
          />
        </div>
      </div>
    </Layout>
  );
};

export default ShopPage;
