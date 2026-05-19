import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  style?: CSSProperties;
}

export default function Card({
  children,
  hoverable = false,
  padding = 'md',
  className = '',
  style = {},
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={`
        rounded-lg border
        ${paddingClasses[padding]}
        ${hoverable ? 'transition-all duration-300' : ''}
        ${className}
      `}
      style={{
        background:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent), var(--card-background)',
        borderColor: 'var(--border-color)',
        boxShadow: '0 14px 38px var(--shadow-color)',
        ...style,
      }}
      onMouseEnter={
        hoverable
          ? (e) => {
              e.currentTarget.style.borderColor = 'var(--accent-cyan)';
              e.currentTarget.style.boxShadow = '0 18px 48px var(--shadow-color), 0 0 24px var(--glow-cyan)';
            }
          : undefined
      }
      onMouseLeave={
        hoverable
          ? (e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = '0 14px 38px var(--shadow-color)';
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
