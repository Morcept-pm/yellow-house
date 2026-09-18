# Yellow House 官網 + Firebase 客戶後台

以既有的 Yellow House 網站（Vite + React + TypeScript SPA，三語 zh/en/jp）為基礎，整合 Firebase（Firestore／Storage／Authentication）作為內容後端，並新增一套客戶可自行操作的 `/admin` 後台。客戶只透過後台編輯內容，不需要 Firebase 帳號、不接觸 Firebase Console。

## 目前狀態（2026-09-03）

- ✅ Firebase 專案 `yellow-house-site` 已建立，Firestore 資料庫已建立並已部署 Security Rules／Indexes，已寫入預設設定＋既有消息/案例＋2 筆示範物件。
- ✅ GitHub repo：https://github.com/daviswang-source/yellow-house-site （private）
- ✅ Vercel 專案已建立並部署：https://yellow-house-site-black.vercel.app （team: davis18，已連接 GitHub 自動部署）
- ✅ 前台已在正式網址上驗證：首頁／最新消息／實績案例／在售物件皆正確從 Firestore 讀取內容；Security Rules 已用真實請求驗證（訪客可新增表單但無法列出他人表單、無法讀取草稿內容）。
- ⚠️ **尚需你本人手動點兩下 Firebase Console（無法透過 CLI/API 自動化，只有 Console 網頁上的「開始使用」按鈕能觸發）：**
  1. https://console.firebase.google.com/project/yellow-house-site/authentication/providers → 點 **開始使用 (Get started)** → 啟用「電子郵件/密碼」登入方式。
  2. https://console.firebase.google.com/project/yellow-house-site/storage → 點 **開始使用 (Get started)** → 選一個地區（建議 asia-northeast1，與 Firestore 一致）。
  3. 兩者都完成後，在本機執行 `npm run create-admin` 建立第一個後台帳號（帳密已產生在本機 `.env`，尚未使用，因為步驟 1 完成前無法建立）。
- ⬜ 正式網域尚未設定（客戶尚未提供）。
- ⬜ Firebase Emulator 自動化規則測試尚未建立測試檔（改以對正式專案的即時驗證取代，見上方「已驗證」項目；如需可重複執行的測試檔案，可再另外補上 emulator test）。

## 一、技術架構

- **前端**：Vite 6 + React 19 + TypeScript + Tailwind CSS v4 + wouter（路由，非 Next.js — 沿用既有專案框架，未更動）
- **後端**：Firebase Web SDK（客戶端直接讀寫 Firestore／Storage，搭配 Security Rules 做權限控制）
- **驗證**：Firebase Authentication（Email／密碼），僅用於 `/admin` 後台登入
- **部署**：Vercel（純靜態 SPA，`vercel.json` 已設定 SPA rewrite）

> 這是一個純前端 SPA（沒有伺服器端渲染／ISR），因此本專案**不使用** Firebase Admin SDK 在執行期做任何事——Admin SDK 只出現在 `scripts/`（本機執行的種子資料與建立管理員腳本），從未被打包進網站本身。內容更新是「後台儲存 → 寫入 Firestore → 前台下次讀取／整頁重新整理時顯示最新內容」，沒有 ISR 快取延遲，但也不是像 Firestore listener 那樣的即時通知；如需特定區塊即時更新，可額外加上 `onSnapshot`。

## 二、目錄結構重點

```
src/
  types/content.ts          所有 Firestore 文件的 TypeScript 型別
  lib/firebase.ts           Firebase client SDK 初始化
  lib/AuthContext.tsx        後台登入狀態 + admin_users 權限判斷
  lib/content/               各 collection 的 CRUD 函式（news / cases / properties / forms / media / siteSettings）
  pages/                     前台頁面（含新增的 Properties / PropertyDetail）
  pages/admin/                後台頁面（登入、儀表板、設定、消息／案例／物件 CRUD、表單收件匣）
  admin/AdminRoutes.tsx       後台路由（/admin/*，獨立於前台三語路由之外）
  components/admin/           後台共用元件（圖片上傳、確認對話框等）
scripts/
  seed.ts                    寫入預設網站設定 + 既有消息／案例資料 + 2 筆示範物件
  create-admin.ts            建立第一個後台管理員帳號
firestore.rules / storage.rules / firestore.indexes.json   安全規則與索引
```

## 三、本機開發

```bash
npm install
cp .env.example .env   # 填入下方「四、Firebase 專案設定」取得的值
npm run dev
```

開發伺服器預設在 `http://localhost:3000`。

- 前台：`/zh`、`/en`、`/jp`（bare path 會自動導向）
- 後台：`/admin/login`

## 四、Firebase 專案設定步驟

1. 前往 [Firebase Console](https://console.firebase.google.com/) 建立新專案（建議每位客戶各建一個獨立專案）。
2. **Authentication** → Sign-in method → 啟用「電子郵件/密碼」。
3. **Firestore Database** → 建立資料庫（正式環境模式，不要用測試模式）。
4. **Storage** → 啟用預設 bucket。
5. **Project Settings → 一般** → 新增一個 Web App，複製 SDK 設定值填入 `.env` 的 `VITE_FIREBASE_*` 六個欄位。
6. **Project Settings → 服務帳戶** → 產生新的私密金鑰（下載 JSON），把裡面的 `project_id` / `client_email` / `private_key` 填入 `.env` 的 `FIREBASE_ADMIN_*` 三個欄位（`private_key` 需保留 `\n` 換行，整段用雙引號包起來）。**這個 JSON 檔絕對不要提交到 Git、也不要放進網站程式碼。**
7. 部署 Security Rules 與 Indexes：
   ```bash
   firebase login
   firebase use --add   # 選擇剛建立的專案
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```

## 五、建立首位管理員 + 匯入初始資料

```bash
# .env 內的 ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_DISPLAY_NAME 設定好之後：
npm run create-admin   # 建立 Firebase Auth 使用者 + admin_users 權限文件
npm run seed           # 寫入網站設定預設值 + 既有消息/案例 + 2 筆示範物件
```

`create-admin` 可重複執行（同一 email 會更新密碼並確保權限文件存在），適合日後要重設密碼或新增其他管理員時複製腳本使用。

`seed` 中的兩筆「示範物件」（標題含【示範資料】）務必在正式上線前於後台刪除或改成真實物件。

## 六、Vercel 部署

1. 於 Vercel 建立新專案，連結本 repo。
2. **Settings → Environment Variables** 加入 `.env` 中 `VITE_FIREBASE_*` 六個變數（Production／Preview／Development 都要有）。`FIREBASE_ADMIN_*`、`ADMIN_*` 只給本機腳本用，**不要**加到 Vercel（部署的網站本身不需要，也不應該有 Admin 私鑰）。
3. Build command：`npm run build`；Output directory：`dist`（Vite 預設，Vercel 會自動偵測）。
4. 部署完成後會拿到 `*.vercel.app` 測試網址。

### 自訂網域

1. Vercel → 該專案 → **Settings → Domains** → 輸入客戶的正式網域與 `www` 子網域。
2. 依 Vercel 提示，到網域註冊商後台新增指定的 A / CNAME / TXT 紀錄。
3. DNS 生效（可能需要數分鐘到 24 小時）且 Vercel 完成 SSL 憑證簽發後，才算正式上線；Vercel 專案頁面會顯示網域狀態為「Valid Configuration」。

程式碼中不會寫死正式網域，網域只在 Vercel 專案設定與網域商 DNS 設定中管理。

## 七、資料模型（Firestore）

```
site_settings/general   公司資訊、聯絡方式、社群/即時通訊連結（LINE/WhatsApp/IG/FB/LinkedIn/X）
site_settings/home      首頁主標題、說明文字、主視覺圖片、主要按鈕文字
site_settings/seo       網站預設 title / description / OG 圖片

news/{id}               最新消息（doc id 建議＝slug）
cases/{id}              實績案例（過去成交案例，非在售物件）
properties/{id}         在售物件（新增模組：住宅/商業/土地/住宿設施，可上傳封面＋圖集、價格、格局、坪數）
form_submissions/{id}   聯絡表單資料（訪客只能新增，無法讀取/列出他人資料）
admin_users/{uid}       後台管理員權限（僅能透過 scripts/create-admin.ts 建立/修改）
```

各 collection 皆有 `status: draft | published | archived`，前台只顯示 `published`。`sortOrder` 數字越小排序越前面。

## 八、聯絡表單防灌水機制

目前實作：
- **Honeypot**：表單內有一個一般訪客看不到的隱藏欄位，機器人爬蟲通常會自動填入所有欄位，一旦該欄位有值就視為垃圾訊息（但仍回覆「送出成功」避免讓機器人知道被擋下）。
- **前端節流**：同一瀏覽器 30 秒內只能送出一次，減少誤觸或簡易重複送出。
- **Security Rules 欄位驗證**：`form_submissions` 的 create 規則會檢查必填欄位型別、長度上限、`consent` 必須為 `true`。

若未來需要更強的防護（例如 Google reCAPTCHA / Firebase App Check），需要客戶或代管方在 Google Cloud / reCAPTCHA 後台申請站台金鑰後才能加上——這是外部憑證，目前尚未取得，故未實作，之後只需在 `src/lib/content/forms.ts` 加入 App Check token 驗證即可。

Email 通知：目前**未**設定寄信服務（如需通知業務有新表單，需要串接如 SendGrid／Resend／Firebase Extensions「Trigger Email」等寄信服務，這也是需要客戶提供的外部帳號/憑證，故本次先以後台「表單收件匣」頁面取代 Email 通知）。

## 九、Firebase Security Rules 測試

建議使用 Firebase Emulator Suite 驗證以下情境（`firebase emulators:start`）：

1. 未登入使用者可讀取 `status == published` 的 news/cases/properties。
2. 未登入使用者無法讀取 `status == draft` 的文件。
3. 未登入使用者可以 `create` 一筆 `form_submissions`，但無法 `list`／`get`／`update`／`delete`。
4. 未登入使用者無法寫入 news/cases/properties/site_settings。
5. 已登入但 `admin_users/{uid}.active != true` 的使用者，一樣無法寫入後台內容。
6. 已登入且 `admin_users/{uid}.active == true` 的使用者可以完整 CRUD news/cases/properties/site_settings，並可讀取/更新 form_submissions 狀態。

## 十、驗收清單（本次已驗證）

- [x] `npm run lint`（`tsc --noEmit`）通過
- [x] `npm run build`（production build）通過
- [x] 已對正式 Firebase 專案驗證：訪客可新增表單（create 成功）、無法列出表單（permission-denied）、可讀取已發布消息（published 查詢成功）、無法讀取草稿（permission-denied）
- [x] 正式網址（Vercel）已驗證首頁／最新消息／實績案例／在售物件皆正確顯示 Firestore 內容，瀏覽器 console 無錯誤
- [ ] 後台登入、CRUD、圖片上傳 —— 待你完成上方「目前狀態」列出的 2 個 Firebase Console 手動步驟後才能測試
- [ ] 手機版面手動檢查

## 十一、已知限制 / 未來可強化項目

- 本站為前端 SPA，沒有伺服器端渲染。這代表：(1) 社群分享預覽圖（Open Graph）仍以 `index.html` 內建的靜態 meta 為主，因為多數社群爬蟲不會執行 JavaScript 讀取 Firestore 內容；(2) 對搜尋引擎的 SEO 效果依賴各家爬蟲對 client-side rendering 的支援程度。若未來需要更嚴謹的 SEO／社群預覽，可考慮加入預渲染（prerender，例如 `vite-plugin-ssg`）或改用具備 SSR 能力的框架。
- SEO 後台目前僅提供「網站預設 title/description/OG 圖片」，尚未提供逐頁（每篇消息/案例/物件）的獨立 SEO 覆寫欄位——各內容項目本身的標題/摘要已經會被用作該頁 `document.title`，但沒有獨立的 meta description 覆寫欄位。
- 表單防灌水目前只有 honeypot + 前端節流；App Check／reCAPTCHA 需要客戶提供 Google Cloud 憑證後才能加上。
- Email 通知尚未串接寄信服務，以後台「表單收件匣」取代。
