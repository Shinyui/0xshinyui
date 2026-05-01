export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: string;
  color: string;
  features: string[];
}

export interface ProductCategory {
  id: string;
  title: string;
  subtitle: string;
  products: Product[];
}

export const TELEGRAM_URL = 'https://t.me/fuckboy666';
export const TELEGRAM_HANDLE = '@fuckboy666';

export const shopCategories: ProductCategory[] = [
  {
    id: 'web3-scripts',
    title: 'Web3 空投腳本',
    subtitle: '自動化空投交互腳本，批量執行每日任務與一次性操作',
    products: [
      {
        id: 'robinhood-testnet',
        title: 'Robinhood Testnet Scripts',
        description:
          'Robinhood 測試網自動化互動腳本，支援多錢包批量執行每日任務（GM 打卡、合約部署）與一次性任務（域名註冊、Badge 鑄造）。基於 EVM HD 錢包推導，目標鏈為 Robinhood Testnet。',
        price: '聯絡報價',
        icon: '🏹',
        color: '#22c55e',
        features: [
          '多錢包批量執行',
          'GM 每日打卡',
          '合約自動部署',
          '域名註冊 & Badge 鑄造',
        ],
      },
      {
        id: 'xstocks-gm',
        title: 'xStocks GM Bot',
        description:
          '自動批次執行 xStocks 註冊與每日 GM 簽到的 Node.js 腳本。支援多帳號、HTTP 代理、瀏覽器指紋偽裝，基於 Solana keypair 推導。',
        price: '聯絡報價',
        icon: '📈',
        color: '#3b82f6',
        features: [
          '多帳號批量執行',
          '自動註冊 & GM',
          'HTTP 代理支援',
          '瀏覽器指紋偽裝',
        ],
      },
      {
        id: 'quip-network',
        title: 'Quip Network Auto Quest',
        description:
          '自動化 Quip Network 每日任務，包含 X 登入、AI 生成推文（gpt-4o-mini）、自動發布、提交推文 URL 與每日簽到。支援 SOCKS5 代理與瀏覽器指紋。',
        price: '聯絡報價',
        icon: '🐦',
        color: '#8b5cf6',
        features: [
          'AI 推文生成',
          '自動發布 & 提交',
          '每日簽到自動化',
          'SOCKS5 代理支援',
        ],
      },
      {
        id: 'karpak-sbt',
        title: 'Karpak SBT Minting',
        description:
          'BSC 鏈上 Soulbound Token 鑄造腳本，透過 Twitter 使用者名稱驗證取得 API 簽名後提交鏈上 mint 交易。支援 HTTPS 代理。',
        price: '聯絡報價',
        icon: '🏷️',
        color: '#f59e0b',
        features: [
          'Twitter 驗證簽名',
          'BSC 鏈上鑄造',
          'HTTPS 代理支援',
          '單檔案輕量部署',
        ],
      },
      {
        id: 'kiichain-contracts',
        title: 'Kiichain Contract Playground',
        description:
          '自動生成並部署 50 個 Solidity 合約至 Kiichain 測試網（10 種合約類型 × 5 個變體），包含 NFT、Token、Lottery、Auction、Voting 等模板。基於 Hardhat 編譯與部署。',
        price: '聯絡報價',
        icon: '⚡',
        color: '#ef4444',
        features: [
          '50 合約批量部署',
          '10 種合約模板',
          'Hardhat 自動化',
          '多錢包輪替部署',
        ],
      },
      {
        id: 'arc-testnet',
        title: 'ARC Testnet Bot',
        description:
          'ARC 測試網自動化機器人，支援多錢包批量執行。自動完成領水、GM 簽到、合約部署、借貸池操作（存入/借出/歸還）、AMM 流動性與兌換、NFT 鑿造等任務，自動檢查前置條件與冷卻時間。',
        price: '聯絡報價',
        icon: '🤖',
        color: '#10b981',
        features: [
          '多錢包批量執行',
          '領水 & GM 簽到',
          '借貸池 & AMM 操作',
          '合約部署 & NFT 鑿造',
        ],
      },
    ],
  },
  {
    id: 'airdrop-infra',
    title: '空投基建',
    subtitle: '空投必備基礎設施與帳號資源',
    products: [
      {
        id: 'proxy-ip',
        title: '機房 / 住宅 IP',
        description:
          '提供穩定的機房 IP 與高品質住宅 IP，支援 HTTP/SOCKS5 協議，適合空投多帳號操作與防關聯場景。',
        price: '聯絡報價',
        icon: '🌐',
        color: '#06b6d4',
        features: [
          '機房 IP / 住宅 IP',
          'HTTP & SOCKS5',
          '高匿性低延遲',
          '按需購買',
        ],
      },
      {
        id: 'exchange-kyc',
        title: '交易所 KYC',
        description:
          '提供已完成 KYC 驗證的交易所帳號，支援主流交易所，可直接用於交易與提幣操作。',
        price: '聯絡報價',
        icon: '🏦',
        color: '#f97316',
        features: [
          '主流交易所',
          'KYC 已驗證',
          '可正常交易',
          '即買即用',
        ],
      },
      {
        id: 'x-account',
        title: 'X 帳號',
        description:
          '提供已註冊的 X（Twitter）帳號，可用於空投社交任務、Follow/Like/RT 等互動操作。',
        price: '聯絡報價',
        icon: '✖️',
        color: '#1d9bf0',
        features: [
          '已註冊帳號',
          '可正常互動',
          '支援批量購買',
          '多規格可選',
        ],
      },
      {
        id: 'dc-account',
        title: 'DC 帳號',
        description:
          '提供已註冊的 Discord 帳號，適合空投 Discord 社群任務、身分組驗證與聊天互動。',
        price: '聯絡報價',
        icon: '💬',
        color: '#5865f2',
        features: [
          '已註冊帳號',
          '可加入伺服器',
          '身分組驗證',
          '批量購買優惠',
        ],
      },
      {
        id: 'telegram-account',
        title: 'Telegram 帳號',
        description:
          '提供已註冊的 Telegram 帳號，適合空投 Telegram Bot 交互、社群任務與領取獎勵。',
        price: '聯絡報價',
        icon: '📱',
        color: '#2aabee',
        features: [
          '已註冊帳號',
          'Bot 交互可用',
          '社群任務適配',
          '批量購買優惠',
        ],
      },
    ],
  },
];
