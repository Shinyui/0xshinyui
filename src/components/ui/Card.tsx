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
        ${hoverable ? 'transition-all duration-300 hover:shadow-xl' : ''}
        ${className}
      `}
      style={{
        backgroundColor: 'var(--card-background)',
        borderColor: 'var(--border-color)',
        boxShadow: '0 4px 6px var(--shadow-color)',
        ...style,
      }}
      onMouseEnter={
        hoverable
          ? (e) => {
              e.currentTarget.style.borderColor = 'var(--accent-gold)';
              e.currentTarget.style.boxShadow = '0 8px 25px var(--shadow-color)';
            }
          : undefined
      }
      onMouseLeave={
        hoverable
          ? (e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = '0 4px 6px var(--shadow-color)';
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
