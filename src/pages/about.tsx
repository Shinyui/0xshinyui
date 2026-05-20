import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';

export default function Profile() {
  return (
    <Layout
      title="關於我 - 0xShinyui"
      description="認識 0xShinyui - 產品經理、技術愛好者"
      canonical="/about"
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
            About
          </p>
          <h1
            className="text-2xl font-bold sm:text-4xl"
            style={{ color: 'var(--text-primary)' }}
          >
            個人介紹
          </h1>
        </section>

        <Card padding="lg">
          <section
            className="space-y-4 leading-relaxed text-base sm:text-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            <p className="transition-colors duration-300 hover:text-white">
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>
                0xShinyui
              </span>
              ，一個喜歡把點子變成產品、也願意為使用者多走幾步的 PM
            </p>
            <p className="transition-colors duration-300 hover:text-white">
              這幾年，我從寫文案、投廣告、跑數據，一路走到協作工程與設計，把產品從
              0 拉到 1，還順手學了{' '}
              <span style={{ color: 'var(--accent-cyan)' }}>React</span> 和{' '}
              <span style={{ color: 'var(--accent-cyan)' }}>Express</span>
              ，把自己搞成半個工程師。
              做過線上課程平台、私域會員系統、金流模塊，也踩過不少坑。
            </p>
            <p className="transition-colors duration-300 hover:text-white">
              我相信「
              <span style={{ color: 'var(--accent-cyan)' }}>
                產品不是寫完就好
              </span>
              」，而是能不能真的解決用戶的問題。
              很多時候，一個轉化率的提升、一個功能的拿掉，比推出一堆新東西更有價值。
              所以我喜歡觀察、紀錄、測試，再推翻自己。
            </p>
            <p className="transition-colors duration-300 hover:text-white">
              這個部落格會分享我的技術實驗、成長過程、還有那些搞砸又學到的經驗。
              偶爾也會聊聊行銷漏斗、產品策略、數據分析，甚至創業與踩雷日誌。
            </p>
            <p className="transition-colors duration-300 hover:text-white">
              如果你對這些主題有共鳴，或剛好也在思考類似的事，歡迎留言或來信交流！
            </p>
          </section>
        </Card>
      </div>
    </Layout>
  );
}
