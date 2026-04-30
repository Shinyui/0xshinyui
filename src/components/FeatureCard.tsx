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
  id,
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
        className="group relative overflow-hidden rounded-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer"
        style={{
          backgroundColor: "var(--card-background)",
          boxShadow: isHovered 
            ? `0 25px 50px -12px ${color}40` 
            : "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 背景漸變效果 */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${color}20, ${color}05)`
          }}
        />
        
        {/* 卡片內容 */}
        <div className="relative p-8">
          {/* 圖標和標題 */}
          <div className="flex items-center mb-6">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl mr-4 transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: `${color}15` }}
            >
              {icon}
            </div>
            <div>
              <h3 
                className="text-2xl font-bold mb-1 group-hover:text-opacity-80 transition-all duration-300"
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

          {/* 描述 */}
          <p 
            className="text-base leading-relaxed mb-6"
            style={{ color: "var(--text-muted)" }}
          >
            {description}
          </p>

          {/* 功能特色 */}
          <div className="mb-6">
            <h4 
              className="text-sm font-semibold mb-3 opacity-70"
              style={{ color: "var(--text-primary)" }}
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

          {/* 按鈕和裝飾 */}
          <div className="flex items-center justify-between">
            <div 
              className="px-6 py-3 rounded-xl font-medium transition-all duration-300 group-hover:shadow-lg"
              style={{
                backgroundColor: `${color}15`,
                color: color,
              }}
            >
              {buttonText} →
            </div>
            
            {/* 裝飾性元素 */}
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

        {/* 邊框光效 */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
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