import { useEffect, useState } from 'react';
import AdSlot from '@/components/ads/AdSlot';

const STORAGE_KEY = '0xshinyui:sticky-bottom-ad-dismissed';

export default function StickyBottomAd() {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY) === '1') {
        setDismissed(true);
      }
    } catch {
      // ignore localStorage failures (private mode etc.)
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
  };

  if (!mounted || dismissed) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 px-3 pb-3 pt-2"
      style={{
        background:
          'linear-gradient(180deg, transparent, rgba(11, 14, 17, 0.92) 30%, rgba(11, 14, 17, 0.96))',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div className="relative mx-auto max-w-[1280px]">
        <div className="hidden sm:block">
          <AdSlot
            size="sticky-bottom"
            placement="Site sticky-bottom (desktop)"
          />
        </div>
        <div className="sm:hidden">
          <AdSlot
            size="mobile-banner"
            placement="Site sticky-bottom (mobile)"
          />
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="關閉廣告"
          className="absolute -top-2 right-1 grid h-7 w-7 place-items-center rounded-full border text-xs transition-colors"
          style={{
            backgroundColor: 'var(--surface-raised)',
            borderColor: 'var(--border-strong)',
            color: 'var(--text-secondary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--accent-mint)';
            e.currentTarget.style.borderColor = 'var(--accent-mint)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'var(--border-strong)';
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
