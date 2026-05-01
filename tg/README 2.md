# Telegram Live Stream - Admin Panel

React + Vite + Ant Design 打造的直播平台「管理後台」，對接 backend 專案的 `/api/admin` 等管理 API，提供使用者、主播、直播、金流、互動紀錄與 Telegram 帳號等操作介面。

- 使用 `React 19` + `react-router-dom` 建構 SPA 後台
- UI 採用 `Ant Design 6` 深色主題，搭配少量 `tailwindcss` 工具類別
- 透過自訂的 `apiFetch` 封裝 fetch，統一處理 JWT 與 refresh token
- 開發環境透過 Vite dev server proxy 轉發 `/api` 到 backend

## 專案結構

主要目錄說明（以 admin-panel 專案根目錄 `/` 為基準）：

- `/src/main.jsx`：React 入口，掛載 `App` 到 DOM
- `/src/App.jsx`：全域路由與 Ant Design `ConfigProvider` 設定
- `/src/layouts/MainLayout.jsx`：主框架與側邊選單、Header、修改密碼與登出邏輯
- `/src/pages`：各功能頁面
- `Dashboard.jsx`：儀表板，後續可擴充統計資訊
- `Login.jsx`：管理員登入畫面，取得 JWT 後寫入 `localStorage`
-     `Users/`：一般使用者管理
- `index.jsx`：用戶列表、搜尋、停用 / 恢復、跳轉詳情
- `UserDetail.jsx`：單一使用者詳細資料與錢包資訊
- `Admins/`：管理員帳號列表
- `Streamers/`：主播與直播相關
- `index.jsx`：主播列表
- `Applications.jsx`：主播申請審核列表
- `StreamerDetail.jsx`：主播詳細資料與分潤比例
- `StreamList.jsx`：直播房間列表
- `StreamDetail.jsx`：單一直播詳細資訊
- `Transactions/`：金流相關
- `Wallet.jsx`：錢包交易明細
- `Orders.jsx`：儲值訂單
- `index.jsx`：手動調帳管理
- `Settlements/`：結算清單與狀態
- `Interactions/`：互動紀錄（送禮等）列表
- `Gifts/`：禮物設定與狀態調整
- `TelegramAccounts.jsx`：Telegram 帳號清單（用於建立 / 關閉頻道的 MTProto 帳號）
- `/src/utils/api.js`：`apiFetch` 封裝，處理 Authorization 與 refresh token
- `/src/index.css`：全域樣式，搭配 Ant Design 與自訂樣式
- `/public`：靜態資源
- `/dist`：build 產出（由 `npm run build` 生成）

## 技術棧

- 前端框架：`React 19`
- Router：`react-router-dom 7`
- UI：`Ant Design 6` + 部分 `tailwindcss` 工具類別
- 打包與開發伺服器：`Vite 7`
- 日期：`dayjs`
- 程式語言：JavaScript（ESM）

## 安裝與啟動

### 1. 安裝套件

```bash

cd  admin
npm  install

```

### 2. 開發環境設定

Admin Panel 預期 backend 服務已啟動在 `http://localhost:8000`，並且提供 `/api` 路徑。

`vite.config.js` 已設定開發代理：

- 所有 `/api` 請求會被 proxy 到 `http://localhost:8000`

因此在開發環境中，只要 backend 跑在 `8000` port，前端呼叫 `fetch("/api/...")` 就會正常轉發到 backend。

### 3. 開發模式啟動

```bash

npm  run  dev

```

Vite 會啟動開發伺服器（預設 `http://localhost:5173`），同時透過 proxy 將 `/api` 轉發到 backend。

### 4. 打包與預覽

```bash
npm  run  build
npm  run  preview
```

`npm run build` 會產生 `/dist` 目錄；`npm run preview` 則會啟動一個本機的預覽伺服器。

## 主要畫面與功能

### 認證與保護路由

- 登入：
  - `POST /api/admin/login`，成功後將 `accessToken` / `refreshToken` 存入 `localStorage`
- key 為 `admin.accessToken`、`admin.refreshToken`
- 路由保護：
  - `App.jsx` 裡的 `Protected` 元件會檢查 `localStorage` 中是否有 `admin.accessToken`
- 若未登入，會自動導向 `/login`

### 主框架 MainLayout

- 左側 Sider：
  - 用 `Menu` 組出「用戶管理 / 主播＆直播管理 / 金流管理 / 禮物管理 / Telegram 帳號」等分組
  - 點擊項目會透過 `react-router-dom` 的 `navigate` 切換路由
- Header：
  - 「修改密碼」按鈕會打 `PATCH /api/admin/change-password`，成功後強制登出並要求重新登入
  - 「登出」按鈕會清空 `localStorage` 的 access / refresh token 並導向 `/login`
- Content：
  - 透過 `<Outlet />` 渲染各個子頁面

### 各功能頁（與 backend API 對應）

以下僅列出部分對應關係，實際 API 可參考 backend 專案的 `admin.routes.js`：

- Users

  - 列表：`GET /api/admin/user`（支援 `page`、`pageSize`、`q`）
  - 停用用戶：`PATCH /api/admin/user/:userId/suspend`
  - 恢復用戶：`PATCH /api/admin/user/:userId/unsuspend`
  - 詳情：`GET /api/admin/user/:userId`

- Admins

  - 列表：`GET /api/admin?status=...`
  - 建立 / 停權 / 解鎖等操作對應 backend Admin API

- Streamers / Streams

  - 主播列表、申請審核、直播列表皆對應 `/api/admin/streamer` 與 `/api/admin/stream` 相關 API

- Transactions / Settlements / Interactions

  - 錢包交易：`GET /api/admin/wallet/transactions`
  - 儲值訂單：`GET /api/admin/topup`
  - 結算列表：`GET /api/admin/settlement`
  - 互動紀錄：`GET /api/admin/interaction`
  - 反轉互動、審核 / 反轉結算等操作對應相應的 `PATCH` 路由

- Gifts

  - 列表與建立 / 啟用 / 停用禮物對應 `/api/admin/gift` 相關路由

- TelegramAccounts
  -     `GET /api/admin/telegram-account`
  -     `POST /api/admin/telegram-account`
  - `PATCH /api/admin/telegram-account/:id`

## 與 Backend 的整合方式

- 所有 API 呼叫都透過 `apiFetch`：

  - 自動在 `headers` 加上 `Content-Type: application/json`
  - 若有 access token，會加上 `Authorization: Bearer <token>`
  - API 路徑會自動補上 `/api` 前綴，例如 `apiFetch("/admin/user")` 會實際呼叫 `/api/admin/user`

- Token 過期自動刷新：
  - 當任一請求得到 `401` 且仍有 refresh token 時，`apiFetch` 會向 `/api/admin/refresh` 發送請求
  - 若 refresh 成功，更新 access / refresh token 並重試原本的 API 呼叫
  - 若 refresh 失敗，就拋出錯誤，交由呼叫端處理（通常會導向登入頁）

## 開發小筆記

- UI 深色主題是在 `App.jsx` 內透過 Ant Design `ConfigProvider` 統一設定
- 側邊選單與路由的 path 綁在一起，修改路由時記得同步調整 `MainLayout` 的 menu 項目
- `apiFetch` 是所有 API 的入口，若未來要加上 loading 指示器、全域錯誤處理、或多語系錯誤訊息，可以在這裡統一擴充
- 建議搭配 backend README 一起看，可以快速理解每個頁面對應到的後端 API 與資料模型
