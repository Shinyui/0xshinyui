# Peek - 區塊鏈內容創作者平台

[![NestJS](https://img.shields.io/badge/Backend-NestJS-11.1.12-red)](https://nestjs.com/)
[![React](https://img.shields.io/badge/Frontend-React-19.2.0-61dafb)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-7.3.0-336791)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Queue-Redis%20%2B%20BullMQ-5.67.2-dc382d)](https://redis.io/)
[![TRON](https://img.shields.io/badge/Blockchain-TRON-TRC20-ff0013)](https://tron.network/)

**Peek** 是一個全端內容創作者平台，整合 TRON 區塊鏈認證、PPV（付費觀看）內容、訂閱制服務以及積分經濟系統。平台採用現代化微服務架構，支援高併發與水平擴展。

## ✨ 核心特性

- **區塊鏈認證** - TRON (TRC20) 錢包地址驗證，無需傳統帳號密碼
- **PPV 付費內容** - 彈性的內容解鎖機制（免費、付費、訂閱）
- **訂閱等級系統** - 創作者可自訂多種訂閱方案
- **積分經濟** - 儲值、消費、收益、提現完整金流
- **媒體處理** - 自動影片轉碼（HLS 多畫質）、圖片處理（多尺寸 WebP）
- **管理後台** - 創作者申請審核、用戶管理、結算管理

---

## 系統架構

```mermaid
graph TB
    subgraph "前端層 Frontend Layer"
        Web[peek-web<br/>React 19 + Vite]
        Admin[peek-admin<br/>React 19 + Ant Design]
    end

    subgraph "API 層 API Layer"
        API[peek-api-nestjs<br/>NestJS + Fastify]
    end

    subgraph "媒體處理層 Media Processing"
        Processor[peek-media-processor<br/>BullMQ Workers]
    end

    subgraph "儲存層 Storage Layer"
        PostgreSQL[(PostgreSQL<br/>Prisma 7)]
        Redis[(Redis<br/>Cache + Queue)]
        S3[AWS S3<br/>Media Storage]
    end

    subgraph "外部服務 External Services"
        TRON[TRON Blockchain<br/>Tatum API]
    end

    Web -->|REST API| API
    Admin -->|REST API| API
    API --> PostgreSQL
    API --> Redis
    API --> S3
    API -->|地址驗證| TRON
    API -->|Job Queue| Redis
    Processor -->|Consume Jobs| Redis
    Processor --> S3
    Processor -->|Progress/Status| API
```

---

## 技術棧總覽

| 套件 | 描述 | 核心技術 |
|------|------|----------|
| **peek-api-nestjs** | 後端 API 伺服器 | NestJS 11, Prisma 7, PostgreSQL, Redis, BullMQ, AWS S3 |
| **peek-web** | 前端主應用 | React 19, Vite 7, Tailwind CSS v4, React Query, Normy |
| **peek-admin** | 管理後台 | React 19, Ant Design 6, Tailwind CSS v4 |
| **peek-media-processor** | 媒體處理服務 | Node.js, BullMQ v5, FFmpeg, Sharp |
| **packages/watermark** | 浮水印組件 | React, Canvas, Shadow DOM |

---

## 專案結構

```
peek/
├── peek-api-nestjs/      # 後端 API 服務
│   ├── src/
│   │   ├── modules/      # 控制器、DTOs、Repositories
│   │   ├── services/     # 業務邏輯層
│   │   ├── common/       # 共用工具（Guards, Interceptors, Decorators）
│   │   └── config/       # 環境配置
│   └── prisma/           # 資料庫 Schema
│
├── peek-web/             # 前端主應用
│   ├── src/
│   │   ├── components/   # UI 組件
│   │   ├── pages/        # 頁面組件
│   │   ├── hooks/        # React Hooks
│   │   ├── contexts/     # React Context
│   │   └── lib/          # 工具函式
│   └── public/
│
├── peek-admin/           # 管理後台
│   └── src/
│       ├── components/   # 佈局組件
│       ├── pages/        # 管理頁面
│       ├── contexts/     # Auth Context
│       └── lib/          # HTTP Client
│
├── peek-media-processor/ # 媒體處理服務
│   └── src/
│       ├── workers/      # BullMQ Workers
│       ├── modules/      # 處理模組（影片/圖片）
│       └── services/     # S3, API 服務
│
└── packages/
    └── watermark/        # 浮水印 React 組件
```

---

## 功能模組

### 後端 API (peek-api-nestjs)

#### 認證系統
- **用戶認證**：TRON 錢包地址 + 密碼，JWT Token (`type: 'user'`)
- **管理員認證**：使用者名稱 + 密碼，JWT Token (`type: 'admin'`)
- **角色權限**：`@Roles()` 裝飾器、`@Superadmin()` 超級管理員檢查

#### 內容管理
- 貼文發布（草稿、排程、立即發布）
- 媒體上傳（分片上傳、STS 憑證）
- 多種解鎖方式（免費、PPV、訂閱）
- 互動功能（按讚、留言、收藏）

#### 變現系統
- **PPV 貼文**：設定單篇購買價格
- **訂閱等級**：創作者自訂價格與期間
- **積分系統**：儲值、購買、訂閱、退款、收益、提現

#### TRON 區塊鏈整合
- Tatum API 地址驗證
- 創作者 TRC20 收款地址管理

#### API 文件
- Swagger UI：`/api/docs`
- 回應格式統一包裝：
  ```json
  {
    "success": true,
    "code": 200,
    "message": "Operation successful",
    "data": { ... },
    "errors": [],
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
  ```

### 前端應用 (peek-web)

#### 頁面路由
| 路由 | 描述 | 權限 |
|------|------|------|
| `/login`, `/register` | 認證頁面 | 公開 |
| `/posts` | 內容動態牆 | 需登入 |
| `/posts/:postId` | 貼文詳情 | 需登入 |
| `/profile/:walletAddress` | 創作者檔案 | 需登入 |
| `/activity` | 用戶活動紀錄 | 需登入 |
| `/creators/*` | 創作者中心 | 需創者身份 |

#### 狀態管理
- **Server State**：React Query + Normy 自動同步
- **Client State**：React Context（State/Actions 分離）

#### 媒體處理
- HLS.js 影片播放（自適應畫質）
- Plyr 播放器整合
- Lightbox 圖片檢視
- Uppy 上傳整合（AWS S3 分片上傳）

#### 國際化
- 支援語言：`zh-TW`（預設）、`zh-CN`、`en`
- i18next + localStorage 語言偵測

### 管理後台 (peek-admin)

- **創作者申請審核**：審核/拒絕申請、備註說明
- **管理員帳號管理**：新增、停用/啟用、重置密碼（超管專屬）
- **密碼變更**：管理員自助修改密碼

### 媒體處理服務 (peek-media-processor)

#### 影片處理
- 多畫質轉碼：360p, 480p, 720p, 1080p, 原始畫質
- HLS 切片與 Master Playlist 生成
- 海報圖與縮圖生成
- FFmpeg 硬體加速支援

#### 圖片處理
- 多尺寸輸出：original, large, medium, small, thumbnail
- 格式轉換：JPEG, WebP
- 模糊預覽圖生成

#### 處理模式
- **Pipeline 模式**（預設）：漸進式處理與上傳，低畫質優先可用
- **Batch 模式**：批次處理後一次上傳

#### 進度追蹤
- 步驟權重：下載 → 處理 → 上傳
- 即時進度推送至 API

---

## 快速開始

### 環境需求

- Node.js >= 18
- PostgreSQL >= 14
- Redis >= 6
- FFmpeg（媒體處理）

### 安裝步驟

```bash
# 1. 安裝所有套件依賴
npm install

# 2. 設定後端環境變數
cd peek-api-nestjs
cp .env.example .env
# 編輯 .env 填入實際值

# 3. 初始化資料庫
npm run prisma:generate
npm run prisma:push

# 4. 設定前端環境變數
cd ../peek-web
cp .env.example .env

# 5. 設定媒體處理服務
cd ../peek-media-processor
cp .env.example .env
```

### 啟動服務

```bash
# 終端機 1：啟動後端 API
cd peek-api-nestjs
npm run start:dev

# 終端機 2：啟動前端應用
cd peek-web
npm run dev

# 終端機 3：啟動媒體處理服務
cd peek-media-processor
npm run dev

# 終端機 4：啟動管理後台（可選）
cd peek-admin
npm run dev
```

### 服務端口

| 服務 | 開發環境端口 |
|------|-------------|
| peek-api-nestjs | 3000 |
| peek-web | 5173 |
| peek-admin | 5174 |
| peek-media-processor | -（背景 Worker） |

---

## 環境變數配置

### peek-api-nestjs

```bash
# 資料庫
DATABASE_URL=postgresql://user:password@localhost:5432/peek

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-min-32-characters
JWT_EXPIRES_IN=7d

# AWS S3
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# CORS（逗號分隔多個來源）
CORS_ORIGIN=http://localhost:5173,http://localhost:5174

# TRON 區塊鏈（Tatum API）
TATUM_API_KEY=your-tatum-api-key

# 超級管理員
SUPERADMIN_USERNAME=admin
SUPERADMIN_PASSWORD=secure-password

# 選用
BUNNY_CDN_ENABLED=false
CLUSTER_WORKERS=4
```

### peek-web

```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_AWS_S3_REGION=ap-southeast-1
VITE_AWS_S3_BUCKET=your-bucket-name
```

### peek-media-processor

```bash
NODE_ENV=development
REDIS_URL=redis://localhost:6379
API_BASE_URL=http://localhost:3000
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
TEMP_DIR=/tmp/peek-processing
CONCURRENT_WORKERS=2
PROCESSING_MODE=pipeline
```

---

## 開發指令

### peek-api-nestjs

```bash
npm run start:dev        # 開發模式（Watch）
npm run start:debug      # 除錯模式
npm run build            # 建置生產版本
npm run start:prod       # 執行生產版本（Cluster 模式）

# 程式碼品質
npm run lint             # ESLint 檢查與自動修復
npm run format           # Prettier 格式化

# 測試
npm run test             # 單元測試
npm run test:cov         # 測試覆蓋率
npm run test:e2e         # E2E 測試

# 資料庫
npm run prisma:generate  # 生成 Prisma Client
npm run prisma:push      # 推送 Schema 到資料庫
npm run prisma:migrate   # 執行 Migration
npm run prisma:studio    # 開啟 Prisma Studio

# 負載測試
npm run load-test:smoke
npm run load-test:posts
npm run load-test:full-flow
```

### peek-web

```bash
npm run dev      # 啟動開發伺服器
npm run build    # 建置生產版本
npm run preview  # 預覽生產版本
npm run lint     # ESLint 檢查
```

### peek-admin

```bash
npm run dev      # 啟動開發伺服器
npm run build    # 建置生產版本
npm run preview  # 預覽生產版本
npm run lint     # ESLint 檢查
```

### peek-media-processor

```bash
npm run dev              # 啟動（Watch 模式）
npm start                # 啟動（一般模式）
npm test                 # 執行所有測試
npm run test:unit        # 單元測試
npm run test:integration # 整合測試
npm run test:coverage    # 測試覆蓋率
```

---

## 架構設計細節

### 後端分層架構

```mermaid
graph LR
    A[Controller] --> B[Service]
    B --> C[Repository Interface]
    C --> D[Repository Implementation]
    D --> E[Prisma]
    E --> F[(PostgreSQL)]
```

- **Controller**：處理 HTTP 請求、參數驗證
- **Service**：業務邏輯、跨模組協調
- **Repository**：資料存取抽象層，依賴反轉

### 前端狀態管理

```mermaid
graph TB
    subgraph "Server State"
        A[React Query] --> B[Normy Normalization]
        B --> C[Auto Sync by ID]
    end

    subgraph "Client State"
        D[Auth Context] --> E[State + Actions]
        F[UI Context] --> G[Modal + Theme]
    end

    C --> H[UI Components]
    E --> H
    G --> H
```

### 媒體上傳流程

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant S3
    participant Queue
    participant Processor

    User->>Frontend: 選擇檔案
    Frontend->>API: 請求上傳 Session
    API->>Frontend: Presigned URLs
    Frontend->>S3: 直接上傳（分片）
    Frontend->>API: 完成上傳通知
    API->>Queue: 加入處理任務
    Processor->>Queue: 取得任務
    Processor->>S3: 下載原始檔
    Processor->>Processor: 轉碼/處理
    Processor->>S3: 上傳處理結果
    Processor->>API: 更新狀態
    API->>Frontend: WebSocket 推送進度
```

---

## 授權

MIT License

---

## 貢獻

歡迎提交 Issue 與 Pull Request。
