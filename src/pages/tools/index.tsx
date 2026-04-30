import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import FeatureCard from '@/components/FeatureCard';

const ToolsPage = () => {
  const tools = [
    {
      id: 'ip',
      title: 'IP 地址查詢',
      description: '快速查看您的公網 IP 地址、瀏覽器資訊和訪問時間，幫助您了解網路連接狀態。',
      path: '/ip',
      icon: '🌐',
      color: '#3b82f6',
      features: ['即時 IP 顯示', '瀏覽器檢測', '時間戳記', '代理檢測']
    },
    {
      id: '2fa',
      title: '2FA 驗證碼生成器',
      description: '安全的雙因素驗證碼生成工具，支援 TOTP 標準，完全在本地運行保護您的隱私。',
      path: '/2fa',
      icon: '🔐',
      color: '#10b981',
      features: ['TOTP 標準', '本地運算', '即時更新', '安全可靠']
    },
    {
      id: 'kol',
      title: 'KOL 嚴選',
      description: '精心挑選的 KOL 名單與分析平台，幫助你快速找到適合合作的網紅創作者。',
      path: 'https://kol.0xshinyui.xyz',
      icon: '⭐',
      color: '#8b5cf6',
      features: ['KOL 名單', '數據分析', '分類篩選', '外部網站'],
      external: true
    }
  ];

  return (
    <Layout
      title="工具總覽 - 0xShinyui"
      description="實用工具集合，包含 IP 查詢和 2FA 驗證碼生成器等便民工具"
      canonical="/tools"
    >

      <div className="min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* 頁面標題 */}
          <div className="text-center mb-16">
            <h1 
              className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
            >
              🛠️ 工具總覽
            </h1>
            <p 
              className="text-xl max-w-2xl mx-auto leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              歡迎使用我們的實用工具集合！這裡提供各種便民工具，
              幫助您更高效地處理日常網路需求。
            </p>
          </div>

          {/* 工具卡片網格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <FeatureCard
                key={tool.id}
                id={tool.id}
                title={tool.title}
                description={tool.description}
                path={tool.path}
                icon={tool.icon}
                color={tool.color}
                features={tool.features}
                buttonText="立即使用"
                type="tool"
              />
            ))}
          </div>

          {/* 底部說明 */}
          <div className="mt-16 text-center">
            <div 
              className="inline-block p-6 rounded-2xl border-2 border-dashed max-w-2xl"
              style={{ 
                borderColor: "var(--border-color)",
                backgroundColor: "var(--card-background)"
              }}
            >
              <div className="text-3xl mb-3">🚀</div>
              <h3 
                className="text-lg font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                更多工具即將推出
              </h3>
              <p 
                className="text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                我們正在開發更多實用工具，敬請期待！如果您有任何建議或需求，歡迎與我們聯繫。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS 動畫 */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </Layout>
  );
};

export default ToolsPage;