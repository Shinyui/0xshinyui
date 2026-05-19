type AdSlotProps = {
  label?: string;
  placement?: string;
  className?: string;
  compact?: boolean;
};

export default function AdSlot({
  label = 'Advertisement',
  placement = 'Reserved placement',
  className = '',
  compact = false,
}: AdSlotProps) {
  return (
    <aside
      className={`relative overflow-hidden rounded-lg border ${compact ? 'px-4 py-5' : 'px-5 py-8'} ${className}`}
      style={{
        background:
          'linear-gradient(135deg, rgba(0, 240, 255, 0.075), rgba(168, 255, 79, 0.035))',
        borderColor: 'var(--border-color)',
        color: 'var(--text-muted)',
      }}
      aria-label={label}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)',
        }}
      />
      <div className="flex min-h-24 flex-col items-center justify-center text-center">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.24em]"
          style={{ color: 'var(--accent-cyan)' }}
        >
          {label}
        </p>
        <p className="mt-2 text-sm">{placement}</p>
      </div>
    </aside>
  );
}
