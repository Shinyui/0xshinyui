# Telegram Live Stream - Livestream Bot

`live-stream-bot` 是整個系統的 Telegram Bot 入口，主要負責：

- 接收使用者在 Telegram 中的指令與按鈕互動
- 透過 HTTP 呼叫後端 API 完成註冊等動作
- 在聊天室回覆對應訊息或提示（例如註冊成功、功能開發中等）
  目前專案已串接後端的「使用者註冊」功能，其餘直播間、錢包與儲值相關功能仍在開發中

## 專案結構

專案根目錄（`/`）下與此 bot 相關的主要程式碼結構如下：

- `/src/index.js`
  使用 `express` 啟動一個簡單的 HTTP Server，並在啟動時呼叫 `bot.start()` 啟動 Telegram Bot。
- `/src/bot/index.js`
- 建立 `grammy` 的 `Bot` 實例
- 載入環境變數設定 `/src/config/env.js`
- 註冊各種指令 / 文本處理器（`/start`、註冊、查看直播間、錢包、儲值、幫助）
- 使用 `@grammyjs/ratelimiter` 對使用者操作做簡單的限流
- `/src/config/env.js`
- 載入 `.env`
- 封裝 `BOT_TOKEN` 等 bot 相關設定
- `/src/bot/command/*.js`
- `start.js`：處理 `/start` 指令，通常用來顯示歡迎訊息與主選單（實作位於此檔案中，對應 `bot.command("start", start())`）。
- `register.js`：呼叫後端 `/api/user/register` 完成使用者註冊。
- `room.js`：`getPublicStream` / `getPrivateStream`，目前僅回覆「還在開發」。
- `wallet.js`：錢包查詢入口，現在僅回覆「還在開發」
- `topup.js`：儲值入口，現在僅回覆「還在開發」
- `help.js`：幫助訊息入口，現在僅回覆「還在開發」
- `/src/utils/errorMessage.js`
- 定義一組後端錯誤碼字串（`user_not_found`、`room_already_exists`…），方便未來與後端錯誤回應做對應。

## 技術棧說明

- Runtime / 語言
- Node.js（CommonJS 模組）
- 主要套件
- `grammy`：Telegram Bot Framework，用來處理指令、訊息、按鈕互動等。
- `@grammyjs/ratelimiter`：基於使用者 ID 的簡單限流，避免同一使用者短時間內大量操作。
- `express`：啟動一個 HTTP Server，作為 bot 的執行入口（主要讓服務可綁定在特定 port 上，方便部署）。
- `axios`：在 `register` 指令中呼叫後端 REST API。
- `dotenv`：載入 `.env` 中的敏感設定（例如 `BOT_TOKEN`、`BACKEND_URL`）
- `amqplib`：目前專案中尚未使用，預期未來可與 RabbitMQ 等訊息佇列整合

## 安裝與啟動

1. 於專案根目錄安裝依賴

```bash

cd live-stream-bot
npm install
```

2. 設定環境變數 `.env`
   在 `/` 底下建立 `.env` 檔案，至少需要包含：

```bash
BOT_TOKEN=你的_Telegram_Bot_Token
BACKEND_URL=http://localhost:8000
PORT=3001
```

- `BOT_TOKEN`：向 BotFather 申請到的 Telegram Bot Token
- `BACKEND_URL`：指向後端服務（對應後端專案的對外網址或內網位址）
- `PORT`：本服務啟動的 HTTP Port，可依部署環境調整

3. 開發模式啟動

```bash
npm run dev
```

這會啟動：

- 一個 `express` Server，監聽在 `PORT` 指定的 port
- Telegram Bot（`bot.start()`），開始處理使用者在 Telegram 中對 bot 發出的訊息

## Bot 指令與功能流程

### `/start`

- 對應檔案：`/src/bot/command/start.js`
- 註冊位置：`/src/bot/index.js` 中的 `bot.command("start", start())`
- 用途：一般做為進入點，顯示歡迎訊息與操作選單（例如「註冊」、「查看公開直播間」等）。

### 「註冊」

- 對應檔案：`/src/bot/command/register.js`
- 註冊位置：`bot.hears("註冊", register())`
- 行為流程：

1. 使用 `axios.post` 呼叫 `${BACKEND_URL}/api/user/register`
2. 將 `ctx.from`（Telegram 使用者資訊）傳給後端
3. 成功時回覆「你已經成功註冊」
4. 後端若回傳特定錯誤碼（例如 `already_registered`、`invalid_payload`），會對應到不同的提示文案

### 「查看公開直播間」 / 「查看私密直播間」

- 對應檔案：`/src/bot/command/room.js`
- 註冊位置：
- `bot.hears("查看公開直播間", getPublicStream())`
- `bot.hears("查看私密直播間", getPrivateStream())`
- 目前實作：單純回覆「公開/私密直播間列表還在開發」，後續可延伸為呼叫後端取得直播間清單，並以文字或 inline keyboard 呈現

### 「我的錢包」

- 對應檔案：`/src/bot/command/wallet.js`
- 註冊位置：`bot.hears("我的錢包", wallet())`
- 目前實作：回覆「我的錢包功能還在開發」，預期後續會串接後端的錢包餘額查詢。

### 「儲值鑽石」

- 對應檔案：`/src/bot/command/topup.js`
- 註冊位置：`bot.hears("儲值鑽石", topup())`
- 目前實作：回覆「儲值功能還在開發」，未來可導向金流或兌換流程。

### 「幫助」

- 對應檔案：`/src/bot/command/help.js`
- 註冊位置：`bot.hears("幫助", help())`
- 目前實作：回覆「幫助功能還在開發」，後續可提供文字說明或常見問題。

## 與後端的整合關係

- 後端專案負責：
  - 使用者資料管理（註冊、登入、權限管理等）
  - 直播間、錢包、儲值相關商業邏輯與資料存取
  - Telegram 帳號/直播資源的高併發處理（例如 DB transaction、排程與鎖定）
- `live-stream-bot` 負責：
  - 將 Telegram 使用者的操作轉譯成後端的 API 呼叫
  - 將後端回傳的結果整理成適合在 Telegram 中呈現的文字或按鈕
  - 在第一線限制單一使用者的操作頻率（rate limit）

目前實作中，`register` 指令是完整打通後端的範例，其餘功能可以仿照這個模式擴充

## 高併發與防濫用處理

在目前的程式中，`live-stream-bot` 主要透過下列方式做基本的防濫用：

- 在 `/src/bot/index.js` 中使用 `@grammyjs/ratelimiter`：
- 每位使用者在 1 秒內僅允許 1 次請求（`timeFrame: 1000`, `limit: 1`）
- 超過頻率時會回覆固定訊息，避免同一使用者短時間內大量觸發指令

這樣的限流屬於「第一層保護」，可以：

- 保護後端 API 不被同一個使用者瘋狂洗頻
- 避免 bot 因為同一人過快輸入而產生過多重複請求

更進一步的高併發控制（例如多帳號切換、直播資源鎖定等）則會在後端專案內處理，`live-stream-bot` 則專注在使用者互動的入口與簡單限速
