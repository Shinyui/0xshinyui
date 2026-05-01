# Telegram Livestream Platform

基於 Telegram 的直播打賞與結算平台，整合 MTProto 自動化頻道管理、多機器人協作、即時互動與完整的金流系統。

## 系統架構

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Telegram Livestream Platform                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐                 │
│  │   Admin      │     │    Main      │     │  Streamer    │                 │
│  │   Panel      │     │    Bot       │     │    Bot       │                 │
│  │  (Port 5173) │     │ (Port 3001)  │     │ (Port 3003)  │                 │
│  └──────┬───────┘     └──────┬───────┘     └──────┬───────┘                 │
│         │                    │                    │                         │
│         │              ┌─────┴─────┐              │                         │
│         │              │           │              │                         │
│         │        ┌─────┴─────┐     │        ┌─────┴─────┐                   │
│         │        │  Room Bot │     │        │           │                   │
│         │        │(Port 3002)│     │        │           │                   │
│         │        └─────┬─────┘     │        │           │                   │
│         │              │           │        │           │                   │
│         ▼              ▼           ▼        ▼           ▼                   │
│  ┌─────────────────────────────────────────────────────────────┐            │
│  │                      Backend API                             │            │
│  │                     (Port 8000)                              │            │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │            │
│  │   │   /api/     │  │   /api/     │  │   /api/     │        │            │
│  │   │   admin     │  │   stream    │  │  streamer   │        │            │
│  │   └─────────────┘  └─────────────┘  └─────────────┘        │            │
│  └──────────────────────────┬──────────────────────────────────┘            │
│                             │                                                │
│                             ▼                                                │
│  ┌─────────────────────────────────────────────────────────────┐            │
│  │                   PostgreSQL + Prisma                        │            │
│  └─────────────────────────────────────────────────────────────┘            │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────┐            │
│  │              Telegram MTProto Integration                    │            │
│  │         (Channel Creation / Deletion / User Invitation)      │            │
│  └─────────────────────────────────────────────────────────────┘            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 服務概覽

| 服務 | 目錄 | 技術棧 | 埠口 | 用途 |
|------|------|--------|------|------|
| Backend | `telegram-livestream-backend` | Node.js + Express 5 + Prisma + PostgreSQL | 8000 | 核心 API 伺服器 |
| Admin Panel | `telegram-livestream-admin-panel` | React 19 + Vite 7 + Ant Design 6 | 5173 | 管理後台介面 |
| Main Bot | `telegram-livestream-bot` | Node.js + Grammy | 3001 | 用戶入口機器人 |
| Streamer Bot | `telegram-livestream-streamer-bot` | Node.js + Grammy | 3003 | 主播專用機器人 |
| Room Bot | `telegram-livestream-room-bot` | Node.js + Grammy | 3002 | 直播間互動機器人 |

## 功能清單

### 用戶管理
- Telegram 用戶註冊與綁定
- 用戶資料查詢與管理
- 用戶停權 / 恢復

### 主播管理
- 主播資格申請
- 申請審核流程
- 主播狀態管理（啟用 / 停用）
- 分潤比例設定

### 直播管理
- 自動建立 Telegram 頻道
- 直播狀態切換（準備中 / 直播中）
- 自動邀請 Bot 進入頻道
- 主播權限授予
- 直播結束與頻道清理

### 互動功能
- 禮物贈送系統
- 禮物清單管理
- 互動紀錄查詢
- 互動反轉（退回）

### 金流系統
- 錢包餘額管理
- 儲值訂單處理
- 手動調帳功能
- 結算審核（approve / reject / reverse）

### Telegram 整合
- MTProto 頻道自動化
- 多帳號輪詢管理
- SOCKS5 Proxy 支援
- Session 加密儲存

## 快速開始

### 環境需求
- Node.js 18+
- PostgreSQL 14+
- npm 或 yarn

### 安裝步驟

1. **克隆專案**
```bash
git clone <repository-url>
cd telegram-livestream
```

2. **安裝各服務依賴**
```bash
# Backend
cd telegram-livestream-backend
npm install

# Admin Panel
cd ../telegram-livestream-admin-panel
npm install

# Main Bot
cd ../telegram-livestream-bot
npm install

# Streamer Bot
cd ../telegram-livestream-streamer-bot
npm install

# Room Bot
cd ../telegram-livestream-room-bot
npm install
```

3. **設定環境變數**

Backend (`telegram-livestream-backend/.env`):
```bash
PORT=8000
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRATION=1d
JWT_REFRESH_EXPIRATION=7d
ENCRYPT_KEY=32_bytes_hex_key
TG_API_ID=123456
TG_API_HASH=xxxxxxxxxxxxxxxx
TG_BOT_USERNAME=your_bot_name
```

Main Bot (`telegram-livestream-bot/.env`):
```bash
BOT_TOKEN=your_main_bot_token
BACKEND_URL=http://localhost:8000
PORT=3001
```

Streamer Bot (`telegram-livestream-streamer-bot/.env`):
```bash
BOT_TOKEN=your_streamer_bot_token
BACKEND_URL=http://localhost:8000
PORT=3003
```

Room Bot (`telegram-livestream-room-bot/.env`):
```bash
BOT_TOKEN=your_room_bot_token
API_BASE_URL=http://localhost:8000/api
PORT=3002
```

4. **資料庫遷移**
```bash
cd telegram-livestream-backend
npx prisma migrate deploy
```

5. **啟動服務**
```bash
# 啟動 Backend
cd telegram-livestream-backend
npm run dev

# 啟動 Admin Panel（新終端）
cd telegram-livestream-admin-panel
npm run dev

# 啟動 Main Bot（新終端）
cd telegram-livestream-bot
npm run dev

# 啟動 Streamer Bot（新終端）
cd telegram-livestream-streamer-bot
npm run dev

# 啟動 Room Bot（新終端）
cd telegram-livestream-room-bot
npm run dev
```

## 服務詳細說明

### Backend

核心 API 伺服器，提供所有業務邏輯與資料存取。

**技術棧：**
- Express 5.2.1
- Prisma 7.1.0 + PostgreSQL
- Zod 4.1.13（驗證）
- JWT（jsonwebtoken 9.0.3）
- Telegram MTProto（telegram 2.26.22）

**主要 API 路由：**

| 路由 | 用途 |
|------|------|
| `/api/admin/*` | 管理後台 API |
| `/api/stream/*` | 直播間管理 |
| `/api/streamer/*` | 主播相關 |
| `/api/user/*` | 用戶註冊 |

**目錄結構：**
```
telegram-livestream-backend/
├── src/
│   ├── index.js              # 應用入口
│   ├── config/
│   │   └── database.js       # 資料庫連線
│   ├── routes/
│   │   ├── admin.routes.js   # 管理路由
│   │   ├── stream.routes.js  # 直播路由
│   │   ├── streamer.routes.js # 主播路由
│   │   └── user.routes.js    # 用戶路由
│   ├── controllers/          # 業務邏輯
│   ├── middlewares/
│   │   └── auth.js           # JWT 驗證
│   ├── service/
│   │   └── telegram/         # MTProto 整合
│   └── utils/                # 工具函式
└── prisma/
    ├── schema/               # 資料模型
    └── migrations/           # 遷移檔案
```

### Admin Panel

管理後台前端介面。

**技術棧：**
- React 19.2.0
- Vite 7.2.4
- Ant Design 6.1.0
- Tailwind CSS 4.1.17
- React Router DOM 7.10.1

**功能頁面：**
- 儀表板（Dashboard）
- 用戶管理
- 管理員管理
- 主播管理與審核
- 直播間列表
- 金流管理（錢包 / 儲值 / 結算）
- 禮物管理
- Telegram 帳號管理

### Main Bot (telegram-livestream-bot)

用戶入口機器人，處理一般用戶的註冊與查詢。

**功能：**
- `/start` - 歡迎訊息與主選單
- 註冊 - 呼叫後端註冊 API
- 查看公開 / 私密直播間（開發中）
- 我的錢包（開發中）
- 儲值鑽石（開發中）

### Streamer Bot (telegram-livestream-streamer-bot)

主播專用機器人，處理直播間的建立與管理。

**功能：**
- `/start` - 歡迎訊息
- 申請成為直播主
- 開始秀場直播
- 管理直播間
  - 切換狀態（準備中 / 直播中）
  - 取得主播權限
  - 結束直播
- 募資功能（開發中）

### Room Bot (telegram-livestream-room-bot)

直播間互動機器人，處理觀眾在直播間內的互動。

**功能：**
- `/start` - 歡迎訊息
- 刷禮物 - 顯示禮物清單並送禮
- 神秘輪盤（開發中）
- 比大小（開發中）
- 剪刀石頭布（開發中）
- 購買募資表演票（開發中）

## 技術細節

### 認證機制

- **Admin 認證**：採用 Stateless JWT，支援 Access Token + Refresh Token 雙 Token 設計
- **密碼加密**：使用 bcrypt 進行雜湊
- **Token 刷新**：Refresh Token 儲存於資料庫，支援單點登出

### 高併發處理

- **連線池**：使用 pg Pool 搭配 Prisma adapter
- **分頁查詢**：透過 prisma-extension-pagination 避免記憶體爆炸
- **Telegram 帳號管理**：`SELECT ... FOR UPDATE` 確保帳號互斥使用
- **金流一致性**：Settlement 與錢包變動包在 Prisma transaction 中
- **金額運算**：使用 Prisma.Decimal 避免浮點數誤差

### Bot 限流

所有 Bot 皆使用 `@grammyjs/ratelimiter` 進行使用者層級限流：
- 每位使用者 1 秒內只允許 1 次操作
- 超出頻率時回覆固定訊息

### Telegram MTProto 整合

1. Admin 建立多組 TelegramAccount，session 加密儲存
2. 建立直播時，以 round-robin 取得可用帳號
3. 建立 Channel、產生邀請連結、邀請 Bot 進入
4. 結束直播時，刪除 Channel 並釋放帳號

## 開發指南

### 各服務開發啟動

```bash
# Backend
cd telegram-livestream-backend && npm run dev

# Admin Panel
cd telegram-livestream-admin-panel && npm run dev

# Bots
cd telegram-livestream-bot && npm run dev
cd telegram-livestream-streamer-bot && npm run dev
cd telegram-livestream-room-bot && npm run dev
```

### 資料庫遷移

```bash
cd telegram-livestream-backend

# 開發環境
npx prisma migrate dev

# 生產環境
npx prisma migrate deploy
```

### Admin Panel 打包

```bash
cd telegram-livestream-admin-panel
npm run build
npm run preview
```

## 注意事項

- 請勿將 `.env` 檔案 commit 到版本控制
- Telegram Bot Token 需向 @BotFather 申請
- MTProto API ID/Hash 需向 my.telegram.org 申請
- 建議使用 PostgreSQL 14 以上版本

## License

ISC
