import { useState } from 'react';
import { Product, TELEGRAM_URL } from '@/lib/shopConfig';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { title, description, price, icon, color, features } = product;

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-lg border transition-all duration-300"
      style={{
        background:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent), var(--card-background)',
        borderColor: isHovered ? color : 'var(--border-color)',
        boxShadow: isHovered
          ? `0 22px 50px -18px ${color}80`
          : '0 14px 38px var(--shadow-color)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative flex h-36 items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${color}25, ${color}08)`,
        }}
      >
        <span
          className="text-6xl transition-transform duration-500 group-hover:scale-110"
          role="img"
        >
          {icon}
        </span>
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              ${color} 10px,
              ${color} 11px
            )`,
          }}
        />
      </div>

      <div className="flex flex-col flex-grow p-5">
        <h3
          className="text-lg font-bold mb-2 line-clamp-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h3>

        <p
          className="text-sm leading-relaxed mb-4 line-clamp-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          {description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {features.map((feature, index) => (
            <span
              key={index}
              className="rounded px-2.5 py-1 text-xs font-medium"
              style={{
                backgroundColor: `${color}12`,
                color: color,
                border: `1px solid ${color}25`,
              }}
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="flex-grow" />

        <div
          className="my-3 h-px"
          style={{ backgroundColor: 'var(--border-color)' }}
        />

        <div className="flex items-center justify-between">
          <span
            className="text-lg font-bold"
            style={{ color }}
          >
            {price}
          </span>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-90 inline-flex items-center gap-1.5"
            style={{
              backgroundColor: 'var(--accent-cyan)',
              color: '#0b0e11',
            }}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            聯繫購買
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
