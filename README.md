# Typing Survival（英文打字生存戰）

以 React、TypeScript 與 Vite 製作的繁體中文英文打字遊戲。遊戲完全在瀏覽器端執行，不需後端、資料庫或 API Key；最高分會保存在目前瀏覽器的 `localStorage`。

## 環境需求

- Node.js 18 或更新版本
- npm

## 安裝與執行

```bash
npm install
npm run dev
```

開啟終端機顯示的本機網址（通常是 `http://localhost:5173`）。在開始畫面選擇難度並開始遊戲，輸入落下中的英文單字即可消除；遊戲進行時可暫停或重新開始。

## 建置與預覽

```bash
npm run build
npm run preview
```

Vite 會將正式版輸出到 `dist/`。

## 部署到 Vercel

將專案推送至 GitHub、GitLab 或 Bitbucket，於 Vercel 匯入該儲存庫。專案已包含 `vercel.json`，建置命令為 `npm run build`，輸出目錄為 `dist`；不需要設定環境變數。

## 遊戲內容

- 簡單、中等、困難三種單字難度，內建超過 100 個英文單字。
- 初始 3 條生命；單字抵達底線時扣除生命。
- 生存時間越久，單字移動速度與出現頻率越高。
- 支援暫停、繼續、重新開始，並保存瀏覽器最高分。
- 支援桌面與手機畫面。
