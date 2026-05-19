import { useState } from 'react';
import Link from 'next/link';

interface FeatureCardProps {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: string;
  color: string;
  features: string[];
  buttonText?: string;
  type?: 'tool' | 'game';
  external?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  path,
  icon,
  color,
  features,
  buttonText = '立即使用',
  type = 'tool',
  external = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const card = (
      <div
        className="group relative h-full cursor-pointer overflow-hidden rounded-lg border transition-all duration-300"
        style={{
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent), var(--card-background)",
          borderColor: isHovered ? color : "var(--border-color)",
          boxShadow: isHovered
            ? `0 22px 50px -18px ${color}80`
            : "0 14px 38px var(--shadow-color)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="absolute inset-x-0 top-0 h-px opacity-70 transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`
          }}
        />
        
        <div className="relative p-6">
          <div className="mb-6 flex items-center">
            <div 
              className="mr-4 flex h-14 w-14 items-center justify-center rounded-md text-2xl transition-transform duration-300 group-hover:scale-105"
              style={{
                backgroundColor: `${color}18`,
                border: `1px solid ${color}30`,
              }}
            >
              {icon}
            </div>
            <div>
              <h3 
                className="mb-1 text-xl font-bold transition-all duration-300"
                style={{ color: "var(--text-primary)" }}
              >
                {title}
              </h3>
              <div 
                className="w-0 h-0.5 group-hover:w-full transition-all duration-500"
                style={{ backgroundColor: color }}
              />
            </div>
          </div>

          <p 
            className="mb-6 text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {description}
          </p>

          <div className="mb-6">
            <h4 
              className="mb-3 text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--text-muted)" }}
            >
              {type === 'game' ? '遊戲特色' : '主要功能'}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center text-sm py-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  <div 
                    className="w-1.5 h-1.5 rounded-full mr-2"
                    style={{ backgroundColor: color }}
                  />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div 
              className="rounded-md px-5 py-2.5 text-sm font-semibold transition-all duration-300"
              style={{
                backgroundColor: isHovered ? color : `${color}15`,
                color: isHovered ? "var(--background)" : color,
              }}
            >
              {buttonText} →
            </div>
            
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: isHovered ? color : 'var(--border-color)',
                    transform: isHovered ? `translateY(-${i * 2}px)` : 'translateY(0)',
                    transitionDelay: `${i * 100}ms`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}30, transparent)`,
            backgroundSize: '200% 100%',
            animation: isHovered ? 'shimmer 2s infinite' : 'none'
          }}
        />
      </div>
    );

  if (external) {
    return (
      <a href={path} target="_blank" rel="noopener noreferrer">
        {card}
      </a>
    );
  }

  return <Link href={path}>{card}</Link>;
};

export default FeatureCard;
