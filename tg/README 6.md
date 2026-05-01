# Telegram Live Stream - Streamer Bot

`streamer-bot` 是面向直播主（主播）的 Telegram Bot，主要負責：

- 協助主播從 Telegram 端創建 / 管理直播間
- 處理直播狀態變更（準備中、直播中、結束）
- 讓主播查詢與管理募資（私場募資）、申請直播主資格

這個 bot 會直接呼叫後端的直播 / 募資相關 API，並在 Telegram 中以文字與按鈕互動呈現結果。

## 專案結構

程式碼主要位於 `/src`：

- `/src/index.js`

  - 使用 `express` 建立 HTTP Server
  - 於 `app.listen` 時呼叫 `bot.start()`，啟動 Telegram Bot

- `/src/bot/index.js`

  - 建立 `grammy` 的 `Bot` 實例
  - 讀取 `/src/config/env.js` 的環境變數
  - 註冊所有與直播相關的指令與互動：
    - `/start`
    - 「開始秀場直播」
    - 「我的錢包」
    - 「建立私場募資」
    - 「查看募資進度」
    - 「變更募資狀態」
    - 「管理直播間」
    - 「申請成為直播主」
    - 「幫助」
  - 將多個 callback query pattern（`room_...`、`es:...`、`cs:...`、`gr:...`）對應到管理直播間的各種操作
  - 使用 `@grammyjs/ratelimiter` 限制單一使用者的操作頻率

- `/src/config/env.js`

  - 載入 `.env`
  - 提供 `BOT_TOKEN` 等設定

- `/src/bot/command/apply.js`

  - 處理「申請成為直播主」的流程
  - 呼叫 `${BACKEND_URL}/api/streamer/application`，將 `ctx.from` 傳到後端作為申請人資訊

- `/src/bot/command/room.js`

  - 集中處理直播間的主要操作：
    - `startStream`：建立直播間
    - `getActiveRooms`：取得當前主播所有進行中的直播間並讓他選擇
    - `changeRoomStatus`：變更直播間狀態（準備中 / 直播中）
    - `getStreamerRole`：將使用者設為某直播間的主播
    - `endStream`：結束直播

- `/src/bot/command/fundraising.js`

  - 募資相關指令，目前皆為「還在開發」的佔位：
    - `startFundraising`
    - `checkFundraising`
    - `decideFundraising`

- `/src/bot/command/wallet.js`

  - 「我的錢包」入口，現階段僅回覆「還在開發」

- `/src/bot/command/start.js` / `/src/bot/command/help.js`

  - `/start` 與「幫助」指令對應

- `/src/utils/errorMessage.js`
  - 定義與後端共用的錯誤碼字串，如 `room_not_found`、`no_permission`、`tg_api_error` 等

## 技術棧說明

- Runtime / 語言

  - Node.js（CommonJS）

- 主要套件
  - `grammy`：Telegram Bot framework
  - `@grammyjs/ratelimiter`：根據使用者 ID 進行速率限制。
  - `express`：提供 webhook / 健康檢查等 HTTP 能力（目前主要用作啟動入口）。
  - `axios`：呼叫後端直播 / 募資 / 角色管理 API
  - `dotenv`：載入 `.env`。
  - `amqplib`：目前尚未實際使用，預留給未來與訊息佇列整合

## 安裝與啟動

1. 安裝依賴

   ```bash
   cd streamer-bot
   npm install
   ```

2. 建立 `.env`

   在 `/` 底下建立 `.env` 檔案，例如：

   ```bash
   BOT_TOKEN=你的_Telegram_Bot_Token
   BACKEND_URL=http://localhost:8000
   PORT=3003
   ```

   - `BOT_TOKEN`：由 BotFather 取得的 bot token
   - `BACKEND_URL`：對應 backend 專案的對外 URL
   - `PORT`：此服務啟動後監聽的 HTTP port

3. 使用開發模式啟動

   ```bash
   npm run dev
   ```

   啟動後：

   - `express` 會監聽 `PORT`
   - `bot.start()` 會開始接收主播在 Telegram 中的操作

---

## 主要指令與流程

### `/start`

- 對應檔案：`/src/bot/command/start.js`
- 註冊位置：`bot.command("start", start())`
- 一般用於顯示歡迎與功能入口。

### 「申請成為直播主」

- 對應檔案：`/src/bot/command/apply.js`
- 註冊位置：`bot.hears("申請成為直播主", applyStreamerRole())`
- 流程：
  1. 呼叫 `${BACKEND_URL}/api/streamer/application`，將 `ctx.from` 當作申請人資訊傳給後端。
  2. 若成功，回覆「已送出申請，待管理員審核」。
  3. 若後端回傳錯誤碼：
     - `user_not_found` → 提示「請先註冊」。
     - `invalid_payload` → 提示「必要參數錯誤/缺失」。
     - `already_streamer` → 提示「你已經是直播主了」。
     - `application_already_pending` → 提示「已有待審核申請」。
     - 其它錯誤 → 回覆「其他錯誤發生」。

### 「開始秀場直播」

- 對應檔案：`/src/bot/command/room.js` 中的 `startStream`
- 註冊位置：`bot.hears("開始秀場直播", startStream())`
- 流程摘要：
  1. 先在聊天中送出「創建直播間中... 請稍候」的 loading 訊息。
  2. 呼叫 `${BACKEND_URL}/api/stream`，把 `ctx.from` 傳給後端。
  3. 成功時，將 loading 訊息改為「創建成功，直播間連結：...」。
  4. 異常時依照錯誤碼回應（例如 `no_permission`、`room_already_exists`、`tg_api_error`、`invalid_payload` 等）。

### 「管理直播間」與 callback 按鈕

- 對應檔案：`/src/bot/command/room.js` 中的 `getActiveRooms` / `changeRoomStatus` / `getStreamerRole` / `endStream`
- 註冊與互動：
  - 文本指令 `bot.hears("管理直播間", getActiveRooms())`
  - callback 按鈕 pattern：
    - `room_<roomId>`：點選欲管理的直播間。
    - `cs:<roomId>:P` / `cs:<roomId>:S`：切換為「準備中」或「直播中」。
    - `gr:<roomId>`：取得該直播間的主播權限。
    - `es:<roomId>`：結束該直播間。

#### `getActiveRooms`

- 向 `${BACKEND_URL}/api/streamer/streams` 發出 GET 請求，附上 `userId`。
- 若沒有直播間 → 提示「目前沒有進行中的直播間」。
- 若有直播間 → 產生一組 inline keyboard，每一列一個房間，顯示「房間名稱後 5 碼 + 狀態」，讓使用者選擇要管理哪一個房間。

#### `changeRoomStatus`

- 當使用者在「管理直播間」選單中按下「狀態設為準備中」或「狀態設為直播中」時觸發。
- 會呼叫 `${BACKEND_URL}/api/stream/${roomId}/update`，附上 `user` 與 `toStatus`。
- 成功時回覆「成功將直播間 xxx 設為 準備中/直播中」。
- 若後端回傳錯誤碼（例如 `invalid_payload`、`no_permission`、`room_not_found`），會有對應的提示文案。

#### `getStreamerRole`

- 對應 callback pattern：`gr:<roomId>`。
- 呼叫 `${BACKEND_URL}/api/stream/${roomId}/grant-streamer`，將當前 Telegram 使用者設為該房間主播。
- 依錯誤碼（`room_not_found`、`user_not_found`、`already_streamer`、`tg_api_error`、`no_permission`）回覆不同訊息。

#### `endStream`

- 對應 callback pattern：`es:<roomId>`。
- 呼叫 `${BACKEND_URL}/api/stream/${roomId}/end` 結束直播，並附上 `userId`。
- 成功時提示「直播間已關閉」，錯誤時依錯誤碼（`room_not_found`、`no_permission`、`tg_api_error` 等）回應。

### 募資相關指令

- 對應檔案：`/src/bot/command/fundraising.js`
- 註冊位置：
  - `bot.hears("建立私場募資", startFundraising())`
  - `bot.hears("查看募資進度", checkFundraising())`
  - `bot.hears("變更募資狀態", decideFundraising())`
- 目前皆為「功能還在開發」，尚未串接實際 API，未來可比照直播間的設計呼叫後端。

### 「我的錢包」與「幫助」

- `wallet.js`：目前僅回覆「我的錢包功能還在開發」。
- `help.js`：目前僅回覆「幫助功能還在開發」。

---

## 與後端的整合關係

- 後端專案負責：

  - 直播間的建立、狀態管理與關閉
  - 主播角色授權與權限驗證
  - 募資資料、金流與業務規則

- `streamer-bot` 負責：
  - 提供主播在 Telegram 內的操作入口
  - 將操作轉為對後端的 API 呼叫
  - 依據錯誤碼進行使用者友善的訊息回饋

---

## 高併發與防濫用處理

`streamer-bot` 在入口層做了以下保護與控管：

- 使用 `@grammyjs/ratelimiter`

  - 以 `ctx.from.id` 作為 key
  - `timeFrame: 1000`, `limit: 1` → 單一主播 1 秒內只允許 1 次操作
  - 超出頻率時，bot 會回覆固定訊息，避免同一主播短時間頻繁切換狀態或狂按按鈕

- 針對每個直播操作的錯誤處理：
  - 將後端錯誤碼與人類可讀訊息對應（房間不存在、沒有權限、Telegram API 錯誤等）
  - 若是 payload 錯誤或其它未知錯誤，則顯示通用訊息，避免把內部錯誤細節暴露給使用者

真正的高併發控制（例如多主播同時操作同一房間、直播狀態一致性、資源鎖定等）由後端在資料庫與服務層處理，`streamer-bot` 則專注於提供乾淨的操作介面與良好的錯誤回饋
