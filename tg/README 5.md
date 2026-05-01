# Telegram Live Stream - Room Bot

`room-bot` 是面向直播間內觀眾的 Telegram Bot，主要負責：

- 在直播間群組裡提供互動功能（送禮物、輪盤、小遊戲、購票等）
- 透過後端 API 取得禮物清單、回報送禮等互動事件
- 將互動結果同步顯示在直播間（訊息通知、感謝詞）

目前已完成與後端的「禮物清單取得」與「送禮回報」流程，其餘遊戲與購票功能仍在開發中

## 專案結構

與其它 bot 專案一致，程式碼主要放在 `/src` 底下：

- `/src/index.js`

  - 使用 `express` 啟動 HTTP Server
  - 在 `app.listen` 時呼叫 `bot.start()` 啟動 Telegram Bot

- `/src/bot/index.js`

  - 建立 `grammy` 的 `Bot` 實例
  - 載入 `/src/config/env.js` 中的設定
  - 註冊所有文本指令與 callback query
    - `/start`
    - 「刷禮物」
    - 「神秘輪盤」
    - 「比大小」
    - 「剪刀石頭布」
    - 「購買募資表演票」
    - 「幫助」
  - 使用 `@grammyjs/ratelimiter` 對使用者操作做簡單的限流
  - 對 `bot` 的錯誤做統一 `bot.catch` 紀錄（避免未捕捉錯誤讓 bot 直接掛掉）

- `/src/config/env.js`

  - 載入 `.env` 檔
  - 提供：
    - `BOT_TOKEN`：Telegram Bot Token
    - `API_BASE_URL`：後端 API Base URL（例如 `http://localhost:8000/api`）

- `/src/routes/live.routes.js`

  - 提供 HTTP API `/gift`，給後端或其它服務呼叫，用於在直播間推送送禮訊息
  - 會將 `mtprotoId` 轉成實際的頻道 ID，使用 `bot.api.sendMessage` 在對應的直播間廣播「贈送禮物」訊息

- `/src/bot/command/*.js`

  - `gift.js`：禮物相關互動（顯示禮物清單、送禮）。
  - `dice.js`：比大小（目前尚在開發中）。
  - `rps.js`：剪刀石頭布（目前尚在開發中）。
  - `wheel.js`：神秘輪盤（目前尚在開發中）。
  - `ticket.js`：購買募資表演票（目前尚在開發中）。
  - `start.js`：處理 `/start` 指令。
  - `help.js`：顯示幫助資訊（目前為簡單佔位訊息）。

- `/src/utils/errorMessage.js`
  - 定義一組與後端共用的錯誤碼字串，方便依照 `message` 判斷錯誤類型

## 技術棧說明

- Runtime / 語言

  - Node.js（CommonJS）

- 主要套件
  - `grammy`：Telegram Bot framework。
  - `@grammyjs/ratelimiter`：依使用者 ID 進行簡單的操作頻率限制。
  - `express`：提供 HTTP Server 與 `/gift` 路由。
  - `axios`：呼叫後端 API（取得禮物清單、送禮等）。
  - `dotenv`：載入 `.env` 環境變數。

## 安裝與啟動

1. 安裝依賴

   ```bash
   cd room-bot
   npm install
   ```

2. 建立 `.env`

   在 `/` 底下建立 `.env` 檔案，至少需要：

   ```bash
   BOT_TOKEN=你的_Telegram_Bot_Token
   API_BASE_URL=http://localhost:8000/api
   PORT=3002
   ```

   - `BOT_TOKEN`：由 BotFather 取得的 token。
   - `API_BASE_URL`：後端 API 根路徑（與 backend 專案的對外 API URL 對應）。
   - `PORT`：此服務啟動的 HTTP port。

3. 開發啟動

   ```bash
   npm run dev
   ```

   啟動後：

   - `express` 會監聽在 `PORT` 指定的 port
   - Telegram Bot 會開始處理來自直播間群組的訊息與按鈕互動

## Bot 指令與互動流程

### `/start`

- 對應檔案：`/src/bot/command/start.js`
- 註冊位置：`bot.command("start", start())`
- 用途：一般用來顯示歡迎訊息、功能說明或主選單。

### 「刷禮物」

- 對應檔案：`/src/bot/command/gift.js`
- 註冊位置：`bot.hears("刷禮物", showGift())`
- 互動流程：
  1. 呼叫 `fetchGifts()`，透過 `axios.get` 向 `${API_BASE_URL}/stream/interaction/gifts` 取得可用禮物清單。
  2. 取得後將禮物資訊存入 `GIFTS_CACHE`，並使用 `InlineKeyboard` 產生一組按鈕，每個禮物一個按鈕。
  3. 使用者點選禮物按鈕後，觸發 `callback_query`：`gift:<giftId>`。
  4. 在 `sendGift(bot)` 中：
     - 從 `GIFTS_CACHE` 取得對應禮物資訊
     - 將直播間的 `chat.id` 轉為 `mtprotoId`
     - 呼叫 `${API_BASE_URL}/stream/${mtprotoId}/interaction/gift`，附上使用者資訊與禮物 ID
     - 依後端回傳錯誤碼（如 `insufficient_balance`、`room_not_found`、`no_permission`）回覆不同提示
     - 成功時，透過 `bot.api.sendMessage` 在當前直播間發出「感謝 @xxx 贈送某某禮物」的訊息。

### 「神秘輪盤」 / 「比大小」 / 「剪刀石頭布」 / 「購買募資表演票」

- 對應檔案：
  - `神秘輪盤` → `/src/bot/command/wheel.js`
  - `比大小` → `/src/bot/command/dice.js`
  - `剪刀石頭布` → `/src/bot/command/rps.js`
  - `購買募資表演票` → `/src/bot/command/ticket.js`
- 目前實作：皆僅回覆「功能還在開發」，未實際呼叫後端。
- 未來可以仿照 `gift.js` 的模式，將遊戲結果與購票行為透過 API 回報後端。

### 「幫助」

- 對應檔案：`/src/bot/command/help.js`
- 註冊位置：`bot.hears("幫助", help())`
- 目前為簡單佔位說明，之後可補充完整指令與範例。

## 與後端與其它服務的整合

- 後端專案負責：

  - 維護禮物清單、價格、背後的錢包/鑽石扣款邏輯
  - 判斷使用者是否有權在該直播間送禮
  - 記錄送禮事件、更新統計資料

- `room-bot` 負責：
  - 在直播間內提供互動入口（文字指令 / inline keyboard）
  - 將使用者操作轉為 API 呼叫，並依照後端回應給出即時回饋
  - 在 `live.routes.js` 中暴露 `/gift` 路由，讓後端或其它服務能主動推送送禮訊息

## 高併發與防濫用處理

### 使用者層級限流

- 在 `/src/bot/index.js` 中透過 `@grammyjs/ratelimiter`：
  - 以 `ctx.from.id` 當作 key
  - `timeFrame: 1000`, `limit: 1` → 每位使用者 1 秒內只允許 1 次操作
  - 超出時回覆固定文案，避免個別使用者短時間狂刷指令

### 禮物操作的錯誤處理

- 在 `sendGift` 中，對常見錯誤進行分類：
  - `insufficient_balance` → 提示餘額不足
  - `room_not_found` → 直播間不存在或未開播
  - `no_permission` → 使用者沒有權限（例如不是該房間成員）
  - 其它錯誤 → 回覆「操作失敗」

這些邏輯讓「高頻送禮」、「狀態異常」的情況可以快速被攔截或明確告知原因，同時把真正的併發控制（餘額扣款、贈禮順序、直播間狀態一致性）交給後端處理，`room-bot` 則專注在入口層與基本風險控管
