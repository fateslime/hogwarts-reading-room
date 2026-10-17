# 給接手 AI 的專案指引

這是霍格華茲藏書室的既有網站。先閱讀 README.md、ARCHITECTURE.md、MAINTENANCE.md 與 VERIFICATION.md 的最新紀錄，再修改。當次使用者指示優先；尊重既有未提交修改。

## 維護原則

- dist/ 是真正來源與發布目錄。原生 HTML/CSS/JS，無 build 步驟；勿為小改動遷移框架。
- 保留米色紙張、酒紅、書籍排版、留白與分類帽。避免新增大量小圖示、副標或裝飾附註。
- 中文與英文是同一畫面，所有新增文案同步更新 dist/locales/en.js；動態句型在 dist/i18n.js。不要翻譯使用者輸入。
- 不改既有 DOM ID、data-* 行為識別、內容 id、題目／選項順序，除非同時處理關聯與保存資料遷移。
- 分院 16 題、學生測驗 30 題；O.W.L.s 分數門檻屬本站設計，不是官方規定。
- localStorage 的三組 key、資料格式與限制見 ARCHITECTURE.md；語言切換不能清除進度、收藏或草稿。
- 目前人物引用官方 WebP 電影照片；舊 SVG 只供歷史參考。以 data.js 的 portrait 與 PHOTO-SOURCES.md 為準，不擅自變更素材方向。
- owner.email 目前空白，聯絡功能只撰寫／複製；不可捏造信箱或宣稱寄信成功。
- 重大劇情保持既有保護；學生測驗獨立顯示結局提醒。
- 不能把不可信外部內容直接插入 innerHTML。憑證、token、私密資訊不可寫入網站、文件或 Git。

## 驗證與交付

- npm run check；npm test。
- 本機預覽：node tools/preview.cjs，網址 http://127.0.0.1:8765/。
- 與變更相關的瀏覽器流程：tests/browser.cjs、expansion.cjs、exam-browser.cjs、i18n-browser.cjs。環境需求見 MAINTENANCE.md。
- 至少檢查 320px 手機與桌機；共用版面／語言變更檢查 320、390、768、1024、1440px。
- 更新 VERIFICATION.md，明確區分實際通過、未執行與環境限制；不要複製舊結果當本次證據。
- 更新架構／資料契約時同步修訂兩份維護文件；來源 ZIP 不含 .local/.git/node_modules 或憑證。

## GitHub 副本與隱私

這份副本採用獨立 Git 歷史，不包含原本託管網站的識別資料或憑證。
不得將原私人網站設定、完整對話、作業壓縮檔或本機路徑重新提交。
上傳前檢查檔案與歷史；預設保留私人儲存庫。GitHub 上傳不等於公開網站。
目前沒有設定自動部署；只在使用者要求部署時另行配置目標，不猜測既有 Site ID。
瀏覽器測試環境使用 tests/browser-runtime.cjs；依 MAINTENANCE.md 安裝選用工具。
