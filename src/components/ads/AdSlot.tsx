export type AdSize =
  | 'leaderboard'
  | 'large-leaderboard'
  | 'mobile-banner'
  | 'mid-rectangle'
  | 'half-page'
  | 'skyscraper'
  | 'in-feed'
  | 'sticky-bottom'
  | 'large-banner';

type AdSlotProps = {
  size: AdSize;
  placement: string;
  label?: string;
  className?: string;
};

type SizeSpec = {
  display: string;
  minHeight: string;
  maxWidth?: string;
  aspect?: string;
  responsiveHide?: string;
  padding: string;
  showAt?: string;
};

const SIZE_SPECS: Record<AdSize, SizeSpec> = {
  'leaderboard': {
    display: '728 × 90',
    minHeight: '90px',
    maxWidth: '728px',
    padding: 'px-5 py-3',
    responsiveHide: 'hidden sm:flex',
  },
  'large-leaderboard': {
    display: '970 × 90',
    minHeight: '90px',
    maxWidth: '970px',
    padding: 'px-6 py-3',
    responsiveHide: 'hidden lg:flex',
  },
  'mobile-banner': {
    display: '320 × 50',
    minHeight: '50px',
    maxWidth: '320px',
    padding: 'px-3 py-2',
    responsiveHide: 'flex sm:hidden',
  },
  'mid-rectangle': {
    display: '300 × 250',
    minHeight: '250px',
    maxWidth: '300px',
    padding: 'px-4 py-6',
  },
  'half-page': {
    display: '300 × 600',
    minHeight: '600px',
    maxWidth: '300px',
    padding: 'px-4 py-8',
    responsiveHide: 'hidden lg:flex',
  },
  'skyscraper': {
    display: '160 × 600',
    minHeight: '600px',
    maxWidth: '160px',
    padding: 'px-3 py-8',
    responsiveHide: 'hidden xl:flex',
  },
  'in-feed': {
    display: 'In-Feed',
    minHeight: '180px',
    padding: 'px-5 py-6',
  },
  'sticky-bottom': {
    display: '728 × 90',
    minHeight: '90px',
    padding: 'px-5 py-3',
  },
  'large-banner': {
    display: '970 × 250',
    minHeight: '250px',
    maxWidth: '970px',
    padding: 'px-6 py-8',
  },
};

export default function AdSlot({
  size,
  placement,
  label = 'Advertisement',
  className = '',
}: AdSlotProps) {
  const spec = SIZE_SPECS[size];

  const visibility = spec.responsiveHide ?? 'flex';

  return (
    <aside
      className={`relative overflow-hidden rounded-lg border ${spec.padding} ${visibility} mx-auto w-full flex-col items-center justify-center text-center ${className}`}
      style={{
        background:
          'linear-gradient(135deg, rgba(84, 255, 213, 0.08), rgba(2, 192, 118, 0.04))',
        borderColor: 'var(--border-color)',
        color: 'var(--text-muted)',
        minHeight: spec.minHeight,
        maxWidth: spec.maxWidth,
      }}
      aria-label={`${label} – ${placement}`}
      data-ad-size={size}
      data-ad-placement={placement}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--accent-mint), var(--accent-positive), transparent)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-40"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--accent-mint), transparent)',
        }}
      />
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.28em]"
        style={{ color: 'var(--accent-mint)' }}
      >
        {label} · {spec.display}
      </p>
      <p
        className="mt-1.5 text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        {placement}
      </p>
    </aside>
  );
}
