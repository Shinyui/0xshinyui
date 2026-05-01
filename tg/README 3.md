# Telegram Live Stream - Backend

Node.js / Express + PostgreSQL + Prisma 打造的直播打賞與結算後端，並且與 Telegram 深度整合（自動開台、邀請 Bot / Streamer、關台後結算分潤）

- 使用 `Express 5` 提供 REST API
- 使用 `Prisma` 連線 PostgreSQL，並加上 `prisma-extension-pagination` 做分頁
- 使用 `jsonwebtoken` + 自訂 middleware 實作 Admin JWT 驗證
- 透過 `telegram` 套件與 Telegram MTProto 溝通，自動建立 / 關閉頻道
- 使用 `zod` 做 payload 驗證

## 專案結構

主要目錄說明（以 backend 專案根目錄 `/` 為基準）：

- `/src/index.js`：Express 入口，掛載路由與啟動 Server `/src/index.js`
- `/src/config/database.js`：Prisma + PostgreSQL 連線設定 `/src/config/database.js`
- `/src/routes`：所有 Express 路由
- `admin.routes.js`：後台管理路由（登入、使用者、錢包、結算…）`/src/routes/admin.routes.js`
- `stream.routes.js`：直播相關 API（開台、結束、送禮、授權 streamer）`/src/routes/stream.routes.js`
- `streamer.routes.js`：主播申請、查詢直播中清單 `/src/routes/streamer.routes.js`
- `user.routes.js`：外部系統註冊一般使用者 `/src/routes/user.routes.js`
- `/src/controllers`：實際的業務邏輯
- `controllers/admin`：後台管理功能（Admin、Gift、Topup、Settlement、Streamer、Wallet、Telegram 帳號…）
- `controllers/stream`：直播間建立 / 關閉 / 送禮 / 授權 streamer `/src/controllers/stream/stream/createStream.js`
- `controllers/streamer`：使用者送出主播申請 `/src/controllers/streamer/createApplication.js`
- `controllers/user`：使用者註冊 `/src/controllers/user/registerUser.js`
- `/src/middlewares/auth.js`：Admin JWT 驗證 middleware `/src/middlewares/auth.js`
- `/src/service/telegram`：Telegram 相關 client 與帳號管理
- `service/telegram/accounts`：多組 TelegramAccount 的 session 管理（round-robin 取用 / 釋放）`/src/service/telegram/accounts/clientManager.js`
- `service/telegram/client`：對 Telegram 做 createChannel / deleteChannel / inviteUser / grantAdmin… 等操作 `/src/service/telegram/client/index.js`
- `/src/service/vpn/checkAlive.js`：檢查 socks5 proxy 是否可用 `/src/service/vpn/checkAlive.js`
- `/src/utils`：共用工具（回傳格式、加解密、JWT 期限解析、亂數碼產生…）
- `/prisma/schema`：Prisma schema 拆分檔案
- `/prisma/migrations`：Prisma migration SQL

## 技術棧

- Runtime：Node.js (CommonJS)
- Web Framework：Express 5
- ORM：Prisma + `@prisma/adapter-pg` + PostgreSQL
- Validation：`zod`
- Auth
  - JWT (`jsonwebtoken`) + Admin token middleware `/src/middlewares/auth.js`
    - `bcrypt` 雜湊 Admin 密碼 `/src/controllers/admin/admin/login.js`
    - Telegram：`telegram` 套件（MTProto）
  - 其他
    - `prisma-extension-pagination`：統一分頁 API
    - `async-retry`、`axios`：外部呼叫與重試（目前使用量有限）

## 安裝與啟動

### 1. 安裝套件

```bash
cd  backend
npm  install
```

### 2. 設定環境變數

在 `backend/.env` 中至少需要：

```bash

PORT=3000
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# JWT
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRATION=1d  # optional, 預設 1d `/src/controllers/admin/admin/login.js`
JWT_REFRESH_EXPIRATION=7d  # optional, 預設 7d `/src/controllers/admin/admin/login.js`

# 加解密 key，32 bytes，以 hex 表示
ENCRYPT_KEY=32_bytes_hex_key  # 用於加解密 Telegram session `/src/utils/crypto.js`

# Telegram Bot / Client
TG_API_ID=123456  # 產生 Telegram session 用 `/src/login.js`
TG_API_HASH=xxxxxxxxxxxxxxxx  # 同上 `/src/login.js`
TG_BOT_USERNAME=your_bot_name  # 被邀請進頻道並設為 admin `/src/controllers/stream/stream/createStream.js`

```

> 注意：請勿將真實的金鑰、token、密碼 commit 到版本控制。

### 3. 建立資料庫與 Prisma Migration

確認 `DATABASE_URL` 正確後執行：

```bash
npx  prisma  migrate  deploy
```

或在開發時：

```bash
npx  prisma  migrate  dev
```

Prisma 設定在 `prisma.config.ts` `/prisma.config.ts`。

### 4. 開發模式啟動

```bash
npm  run  dev
```

預設會啟動在 `PORT` 指定的 port，並在啟動時：

- 連線資料庫 `/src/config/database.js`
- 確保存在一個測試用 admin 帳號（`admin` / `password`）`/src/index.js`

## 主要功能概觀

### Admin 後台 `/api/admin`

路由定義：`/src/routes/admin.routes.js` `/src/routes/admin.routes.js`

- Admin 登入 / Token
- `POST /api/admin/login`：登入取得 `accessToken` / `refreshToken` `/src/controllers/admin/admin/login.js`
- `POST /api/admin/refresh`：用 refresh token 換新的 access token `/src/controllers/admin/admin/refresh.js`
- `PATCH /api/admin/change-password`：變更密碼（需登入）
- Admin 管理
  建立 Admin、查詢 Admin 列表、停權 / 解鎖等
- User 管理
  查詢使用者列表、查單一使用者、停權 / 解鎖 `/src/controllers/admin/user/getUsers.js`

- Gift / Interaction

  - 管理禮物種類
  - 查詢送禮紀錄、反轉特定互動（退回）

- Topup / Wallet

  - 建立人工儲值、完成 / 退款
  - 查詢錢包交易紀錄 `/src/controllers/admin/wallet/getTransactions.js`

- Stream / Settlement
  查詢所有直播房間 `/src/controllers/admin/stream/getStreams.js`

- Settlement 審核（approve / reject / reverse），並同步更新使用者錢包 `/src/controllers/admin/settlement/approveSettlement.js`

- Streamer / Streamer Application
  管理主播狀態（suspend / unsuspend）、調整分潤比例

- 審核新主播申請 `/src/controllers/admin/streamer-application/getApplications.js`

- Telegram Account
  建立 / 更新 Telegram 帳號（session / apiId / apiHash）並加密儲存 `/src/controllers/admin/telegram/createTelegramAccount.js`

所有需要 Admin 權限的路由都會經過 `authenticateAdmin` middleware `/src/middlewares/auth.js`

### Stream 相關 `/api/stream`

路由定義：`/src/routes/stream.routes.js` `/src/routes/stream.routes.js`

- `POST /api/stream`：建立直播間
- 會檢查使用者是否為啟用中的主播
- 透過 Telegram 建立頻道、產生邀請連結，並建立 `Stream` 紀錄 `/src/controllers/stream/stream/createStream.js`
- `GET /api/stream`：查詢直播列表（提供給前台用戶端）
- `POST /api/stream/:roomId/end`：結束直播
- 關閉 / 刪除 Telegram channel `/src/controllers/stream/stream/endStream.js`
- 聚合送禮金額，產生一筆 `Settlement`（PENDING）`/src/controllers/stream/stream/endStream.js`
- `PATCH /api/stream/:roomId/update`：更新直播狀態（例如 STREAMING ⇄ PREPARING）
- `POST /api/stream/:roomId/interaction/gift`：送禮互動
- `GET /api/stream/interaction/gifts`：取得可用禮物清單
- `POST /api/stream/:roomId/grant-streamer`：將指定 Telegram 使用者升級為該頻道的 streamer
- 會檢查該使用者是否已存在於頻道、是否已是 streamer
- 使用 `grantAdmin` 讓使用者在頻道內擁有特定權限 `/src/controllers/stream/streamer/getStreamerRole.js`

### Streamer 相關 `/api/streamer`

- `POST /api/streamer/application`：使用者送出成為主播的申請 `/src/controllers/streamer/createApplication.js`

- `GET /api/streamer/streams`：取得目前使用者可以看的 / 相關的直播清單 `/src/controllers/streamer/getActiveStreams.js`

### User 相關 `/api/user`

- `POST /api/user/register`：使用 Telegram user payload 註冊使用者 `/src/controllers/user/registerUser.js`

> 具體參數與回傳格式可直接參考各 controller 檔案內的 `zod` schema 與 `success / error` 回傳格式。

## Telegram 整合流程簡述

1. 後台 Admin 先建立多組 `TelegramAccount`，填入 session / apiId / apiHash，系統會用 `ENCRYPT_KEY` 加密後存入 DB `/src/controllers/admin/telegram/createTelegramAccount.js`

2. 建立直播時：

- 從 available 的 TelegramAccount 以 round-robin 方式取出一組並標記為 `IN_USE` `/src/service/telegram/accounts/clientManager.js`
- 建立 Telegram channel、產生邀請連結、邀請 Bot 進入並設為 admin `/src/controllers/stream/stream/createStream.js`

3. 結束直播時：

- 刪除 Telegram channel `/src/controllers/stream/stream/endStream.js`
- 聚合直播期間互動金額，產生 Settlement（平台抽成 + 主播分潤）

4. 無論成功或失敗，都會釋放 Telegram client，並把該 TelegramAccount 狀態改回 `IDLE` `/src/service/telegram/accounts/clientManager.js`

## 開發小筆記

- 所有 API 回傳格式統一使用 `utils/response.js` 的 `success` / `error` 包一層 `/src/utils/response.js`
- 多處使用 BigInt（例如 userId），`src/index.js` 有把 `BigInt.prototype.toJSON` 改寫成自動轉 string，避免 JSON 序列化錯誤 `/src/index.js`
- 分頁邏輯都使用 Prisma 的 `.paginate().withPages()`，並且用 `zod` 對 `page` / `pageSize` 做 parsing 與限制
- 套件的 script 目前只有：

```jsonc
"scripts": {
"dev": "nodemon src/index.js",
"test": "echo \"Error: no test specified\" && exit 1"
}
```

專案目前沒有自動化測試，你可以依照需要補上 Jest / Vitest 等測試框架。

## 高併發處理邏輯

> 這一節描述的是「現在這個專案實際已經實作」的內容

- 連線與查詢層

  - 使用 `pg` 的 `Pool` 搭配 Prisma adapter，所有請求共用連線池，避免為每支 API 各自開 / 關連線 `/src/config/database.js`
  - 讀取大量列表（User、Topup、Wallet、Settlement、Stream…）都透過 `prisma-extension-pagination` 做分頁查詢，避免一次抓爆記憶體 `/src/controllers/admin/stream/getStreams.js`
  - 查詢條件都盡量走 where / orderBy，實務上會搭配 DB index 來支撐高併發讀取
  - Telegram 帳號與 MTProto client 管理
  - 多組 `TelegramAccount` 透過 `status` 欄位（`IDLE` / `IN_USE` / `DISABLED`）管理使用狀態
  - 取用帳號時會在交易中執行 `SELECT ... FOR UPDATE`，確保同一時間只有一台應用程式實例把某個帳號標記為 `IN_USE` `/src/service/telegram/accounts/clientManager.js`
  - 成功創建 client 後，才會正式回傳給上層使用；如果 session 無效就把該帳號標記成 `DISABLED`，避免在高併發下重複踩爆同一組壞掉的 session `/src/service/telegram/accounts/clientManager.js`
  - 使用完畢一定會呼叫 `releaseClient`，關閉 MTProto 連線並把帳號狀態改回 `IDLE`、更新 `lastUsedAt`，以 round-robin 方式平均分散負載 `/src/service/telegram/accounts/clientManager.js`

- 金流與結算的一致性

  - Settlement 審核（approve / reject / reverse）與錢包餘額變動都包在 Prisma transaction 裡，確保在高併發下「錢只會被加一次或減一次」，不會部分成功 `/src/controllers/admin/settlement/approveSettlement.js`
  - 使用 `Prisma.Decimal` 來處理金額運算，避免在多次加總下出現浮點數誤差 `/src/controllers/admin/settlement/reverseSettlement.js`
  - 結束直播時會先 aggregate 出互動金額，再建立對應的 `Settlement` 記錄；若該 stream 已經有 Settlement，就不會重複建立 `/src/controllers/stream/stream/endStream.js`

- Admin 認證與請求隔離
  - Admin API 採 Stateless JWT，後端僅驗證 token，不維護 server-side session，方便橫向擴充、多實例分流 `/src/middlewares/auth.js`
- `accessToken` + `refreshToken` 雙 token 設計，refresh token 寫入資料庫，可在高併發環境下做黑名單或單點登出 `/src/controllers/admin/admin/login.js`

- 目前尚未實作的部分
  - HTTP 層沒有 rate limiting / IP 限流（可以未來加在 API Gateway 或 middleware）
  - 沒有使用 message queue（如 RabbitMQ / Kafka）做非同步排程，所有流程都是同步請求 / 回應模式
  - 如果部署成多實例，TelegramAccount 的 `SELECT ... FOR UPDATE` 仍然依賴同一個 PostgreSQL，理論上可以跨實例維持互斥，但需要注意連線池設定與 DB 壓力
