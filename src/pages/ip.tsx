import React from 'react';
import Layout from '@/components/layout/Layout';
import InfoCard from '@/components/tool/InfoCard';
import Card from '@/components/ui/Card';
import { GetServerSideProps } from 'next';
import { formatTaiwanDate } from '@/utils/date';

type IpPageProps = {
  ip: string;
  userAgent: string;
  timestamp: string;
};

export default function IpPage({ ip, userAgent, timestamp }: IpPageProps) {
  return (
    <Layout
      title="IP 地址查詢 - 0xShinyui"
      description="查詢您的公網 IP 地址和瀏覽器資訊"
      canonical="/ip"
      hideSidebar
      hideTopBanner
      hideStickyBottom
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <section
          className="mb-6 rounded-lg border p-6"
          style={{
            background:
              'linear-gradient(135deg, rgba(84, 255, 213, 0.10), rgba(2, 192, 118, 0.04)), var(--surface)',
            borderColor: 'var(--border-color)',
          }}
        >
          <p
            className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em]"
            style={{ color: 'var(--accent-mint)' }}
          >
            <span className="status-dot" />
            Network
          </p>
          <h1
            className="text-2xl font-bold sm:text-4xl"
            style={{ color: 'var(--text-primary)' }}
          >
            訪問者資訊
          </h1>
        </section>

        <div className="space-y-6">
          <InfoCard
            title="您的 IP 地址"
            content={
              <p
                className="text-2xl font-mono font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                {ip}
              </p>
            }
          />

          <InfoCard
            title="瀏覽器資訊"
            content={<p className="text-sm break-all">{userAgent}</p>}
          />

          <InfoCard
            title="訪問時間"
            content={
              <p className="text-lg" style={{ color: 'var(--text-primary)' }}>
                {timestamp}
              </p>
            }
          />

          <Card padding="md">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              💡
              這個頁面會顯示您連接到此網站時的 IP 地址和相關資訊。每次重新整理頁面都會更新時間戳記。
            </p>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;

  const forwarded = req.headers["x-forwarded-for"] as string;
  const realIp = req.headers["x-real-ip"] as string;
  const ip = forwarded
    ? forwarded.split(",")[0].trim()
    : realIp || req.socket.remoteAddress || "未知";

  const userAgent = req.headers['user-agent'] || '未知瀏覽器';
  const timestamp = formatTaiwanDate(new Date(), 'full');

  return {
    props: {
      ip,
      userAgent,
      timestamp,
    },
  };
};
