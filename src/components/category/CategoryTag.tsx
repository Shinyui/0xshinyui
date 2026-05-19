import Link from 'next/link';
import { getCategoryDisplayName } from '@/utils/category';

interface CategoryTagProps {
  category: string;
  isActive?: boolean;
  onClick?: () => void;
  href?: string;
}

export default function CategoryTag({
  category,
  isActive = false,
  onClick,
  href,
}: CategoryTagProps) {
  const displayName = getCategoryDisplayName(category);

  const className =
    'inline-block rounded-md border px-3 py-2 text-sm font-medium transition-all duration-200';

  const style = {
    backgroundColor: isActive ? 'var(--accent-cyan)' : 'transparent',
    borderColor: isActive ? 'var(--accent-cyan)' : 'transparent',
    color: isActive ? 'var(--background)' : 'var(--text-secondary)',
    boxShadow: isActive ? '0 0 18px var(--glow-cyan)' : 'none',
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (!isActive) {
      e.currentTarget.style.backgroundColor = 'var(--hover-background)';
      e.currentTarget.style.borderColor = 'var(--border-strong)';
      e.currentTarget.style.color = 'var(--text-primary)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (!isActive) {
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.borderColor = 'transparent';
      e.currentTarget.style.color = 'var(--text-secondary)';
    }
  };

  // 如果提供了 onClick，渲染為 button
  if (onClick) {
    return (
      <button
        className={className}
        style={style}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {displayName}
      </button>
    );
  }

  // 否則渲染為 Link
  const linkHref = href || `/category/${encodeURIComponent(category)}`;

  return (
    <Link
      href={linkHref}
      className={className}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayName}
    </Link>
  );
}
