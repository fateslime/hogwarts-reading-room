# AI 維護與更新手冊

更新日期：2026-10-16。先讀 AGENTS.md 與 ARCHITECTURE.md，再依本文件操作。使用者當次明確要求優先於這份專案指引；有差異時記錄原因，不要擅自復原已核准的新版本。

## 一、接手時的最小檢查

1. 確認工作目錄是 hogwarts-reading-room，查看 Git 狀態，保留既有未提交修改。
2. 閱讀 README、ARCHITECTURE、VERIFICATION 最上方的最新紀錄。
3. 確認目前是 GitHub 清理副本與 dist 目錄；原私人託管設定不在此副本中，不要猜測目標網站。
4. 釐清本次是內容、樣式、邏輯還是發布設定，先找對檔案。
5. 確認實際引用的素材。dist/data.js 的 portrait 才是現用圖片，不能憑歷史文件判斷。
6. 修改前記下要驗證的既有行為，例如答案位置、收藏 key、私人受眾。

此專案沒有必須安裝的執行期套件，也沒有 build 指令。不要為了啟動而擅自遷移至 React、Vue、Next.js 或新增服務。

## 二、本機開啟與指令

在專案根目錄執行：

~~~sh
node tools/preview.cjs
~~~

瀏覽 http://127.0.0.1:8765/。預覽只監聽本機，不是公開網址。可直接開啟 dist/index.html，但網域隔離、字型與剪貼簿行為可能與 HTTPS 網站不同。瀏覽器驗證以本機 HTTP 為準。

~~~sh
npm run check
npm test
~~~

瀏覽器測試需要先啟動預覽，並備妥 Playwright 與 Edge：

~~~sh
node tests/browser.cjs
node tests/expansion.cjs
node tests/exam-browser.cjs
node tests/i18n-browser.cjs
~~~

瀏覽器測試使用 Playwright，屬選用開發工具。先安裝：

~~~sh
npm install --no-save playwright
npx playwright install chromium
~~~

tests/browser-runtime.cjs 預設使用 Playwright 的 Chromium，也可用 BROWSER_EXECUTABLE_PATH 環境變數指定本機瀏覽器路徑。路徑只存在執行環境，不要寫入原始碼或提交 .env。

Node 內建測試不需要額外套件；網站本身也不使用 Playwright。測試會自動建立 .local 作為不追蹤的截圖輸出目錄。

## 三、常見更新配方

### 修改小說或世界背景

1. 小說改 dist/data.js 的 books 對應項；世界背景改 dist/index.html。
2. 更新 dist/locales/en.js 中完整中文 key 與英文 value。中文有標點、空白變更也要同步。
3. 重大劇情留在 spoiler，不要放進原本不劇透的 intro。
4. books 陣列仍維持第一至第七部，核對相關人物／生物連結。
5. 開啟中英文各看一次展開與收起、劇透保護、鍵盤切換。

### 新增或修改人物

1. 編輯 characters：穩定 id、姓名、學院、role、三項 facts、intro/story、來源與關聯。
2. 新增人物一般加在尾端；不要改舊 id，也不要排序既有陣列。
3. 每個 books、related、creatures 索引都需在集合範圍內，點開核對內容。
4. 若加圖，存到 dist/assets/portraits，填 portrait 與 portraitSource；來源記入 PHOTO-SOURCES.md。
5. 目前照片比例為 1200 × 832。更換圖片類型／比例時同步修改 app.js 的 width、height、alt 與來源文字，不能把插畫標為電影照片。
6. 對姓名、學院、介紹、facts、story、spoiler 補英譯。英文本名欄位不是整份內容的翻譯。
7. 驗證搜尋、收藏、相關導覽、手機 dialog、圖片解碼及出處連結。

不要從網路任意抓圖片或擅自改變素材方向；先依使用者當次要求及目前實作處理。所有素材來源如實標註。

### 新增神奇動物

1. 依 creatures 欄位契約新增穩定 id、分類、習性、棲地、能力、接近提醒、相關小說與官方來源。
2. 若沿用合併插畫，核對 art/x/y/artHeight。若改獨立圖，需同時調整 creatureArt 與樣式。
3. 補中英對照，驗證中文／英文名稱、棲地、能力都能搜尋。
4. 初始六筆、顯示更多、分類後數量、收藏與空結果應仍正常。
5. 新增數量後同步檢查首頁靜態數字、README 與測試中的固定預期數量。

### 調整分院題目

文字潤飾可保留答案位置與 house/secondary；改變選項次序、題數、權重則會影響已保存答案。

1. 修改 dist/quiz.js；每個選項主要／次要學院必須是四個合法 key。
2. 不改選項含義或順序時，原保存可沿用。
3. 若改含義、順序或題數，先設計版本與遷移，不要悄悄重新解讀舊答案。
4. 若改權重，同步結果比例、說明與測試。
5. 補譯問題、選項、學院描述；測試唯一最高分、同分選擇、續答與分享。
6. 現有八題到十六題遷移必須保留，除非明確規劃替代方案。

### 調整學生測驗與 O.W.L.s 等第

1. 問題、選項、正解、解析在 dist/exam-data.js。
2. 先依原著核對 book/chapter，更新 SOURCES.md；注意小說與電影差異。
3. 不重排既有題目或選項。owl-XX 是按陣列位置產生，不能用它假定存檔已可遷移。
4. 若改答案含義，提升保存 version 並實作遷移或明確的本次答卷重設；保護 best 的語意。
5. 若擴充題數，需修改資料驗證、index 上限、難度分段、總分、結果、分享、UI 中的 30、題庫測試與兩種語言。
6. 改等第門檻需同時更新 grades、README、ARCHITECTURE、英譯說明與 0–30 邊界測試。
7. 驗證交卷前檢查、退回修改、暫停續答、錯題／全部解析、重新作答取消、最佳紀錄。

### 新增雙語文案

最小案例：

~~~js
// 中文來源保持在 index.html / data.js / app.js / 題庫。
window.EnglishCatalog = {
  "新增收藏": "Add to favourites"
};
~~~

實際操作是把鍵值加進既有字典，不是覆寫整個物件。

1. 固定句子用完整中文原文作 key，先避免拆成零碎片段。
2. 同一 key 在全站只對應一個譯文；共用「鳳凰」等名稱保持一致。
3. 有數字、題號、使用者可見變量的句子，在 i18n.js 的 rules 加完整匹配規則，並保留變量。
4. 匹配片段是後備機制。出現中英混合時補完整 key／規則，不要直接用英文改寫中文來源。
5. 新增畫面、錯誤狀態、空結果、aria-label、placeholder、alt 都要翻譯。
6. clipboard／匯出等非 DOM 輸出需呼叫 I18n.t；使用者自由輸入不可翻譯。
7. data-no-i18n 只用於本來就需要雙語或原樣呈現的內容，不可拿來掩蓋漏譯。
8. 測試中英往返、重整記憶、答案／草稿保留、長英文手機排版。

### 修改站長與聯絡方式

owner.name/email 在 dist/data.js，自我介紹在 dist/index.html。信箱留空時沒有收件人，也沒有寄送功能；不要寫「已寄出」。若使用者提供公開信箱，可填入 email，現有表單會開啟郵件程式。更新中英簡介與相關說明，保留不自動寄送的行為。

## 四、驗證矩陣

| 變更 | 必做驗證 |
| --- | --- |
| 純介紹文字 | 中英文內容、來源、受影響畫面和手機換行 |
| 人物／動物／素材 | expansion.cjs、圖片載入、關聯、搜尋收藏、dialog |
| 分院題庫／計分 | quiz.test.cjs、browser.cjs、雙語題目及分享 |
| 學生測驗 | exam.test.cjs、exam-browser.cjs、雙語答案與成績 |
| i18n／共用導覽／dialog | 四套瀏覽器回歸、雙語保存與手機尺寸 |
| localStorage 格式 | 損壞／停用／舊版資料、完整續答、最佳紀錄與收藏 |
| 發布設定 | manifest、既有 Site ID、存取受眾、確切版本與原生部署結果 |

新增測試應驗證使用者行為與重要不變量，不要只重複實作。測試失敗時先查是否真的破壞既有功能，不能直接放寬斷言。

i18n-browser.cjs 掃描英文可見畫面與無障礙屬性的殘留中文字。中文按鈕、使用者輸入與刻意保留區域有明確排除。測試不是翻譯文學品質保證，仍要抽查英文句子是否自然、符合故事。

## 五、GitHub 更新與網站部署

此副本只提供原始碼，未附原站網址、託管識別資料或存取憑證。

1. 修改程式並完成對應檢查；網站發布根目錄為 dist。
2. 查看待提交檔案，排除對話、壓縮檔、憑證、本機路徑與 .local。
3. 檢查新舊 Git 歷史，確認敏感資料沒有被加入；僅新增 .gitignore 不會移除已追蹤的資訊。
4. 使用 GitHub noreply 郵件作為提交信箱，避免提交個人信箱。
5. 提交並推送至使用者指定的儲存庫，保留現有私人可見性，核對遠端 commit。
6. 推送 GitHub 不會自動更新原託管網站；本副本沒有自動部署設定。
7. 如另有網站部署需求，先確認擁有者指定的目標與受眾，再依相應工具發布；不要從其他對話或歷史快照猜測網站識別資料。

## 六、來源交付與回復

來源 ZIP 應包含 dist、tests、tools、package.json，以及 README、AGENTS、ARCHITECTURE、MAINTENANCE、VERIFICATION、SOURCES、PHOTO-SOURCES、ASSET-PROMPTS。本 GitHub 副本已排除原私人託管設定；不要從其他本機專案補回。

不得包含 .git、.local、node_modules、憑證、私人日誌或部署 token。ZIP 是維護交付，不是 Sites source helper 所產生的正式部署 archive，兩者不能混用。

發生回歸時先保留目前修改與錯誤證據，從 Git 找到最後通過的版本，比較並回復受影響檔案，再走正常發布流程。不要使用未確認範圍的 hard reset 或整個資料夾刪除。新版本上線後，VERIFICATION 最上方加入日期、變更、實際通過項目及限制；不要改寫歷史結果冒充本次測試。

## 七、常見故障

| 症狀 | 先檢查 |
| --- | --- |
| 英文畫面混入中文 | 完整字典 key、動態 rules、HTML 拆成多個文字節點 |
| 切回中文仍顯示英文 | 是否繞過 I18n 直接把英文當來源、是否重建了該節點 |
| 點語言卻關閉 dialog | controls 的位置與點擊區域是否重疊，測試鍵盤及滑鼠 |
| 新畫面未翻譯 | 腳本載入順序、MutationObserver 是否啟動、主控台錯誤 |
| 作答後下一題仍停用 | radio 的 name/value、事件委派、答案索引驗證 |
| 舊成績改變 | 是否重排題目／選項、變更門檻卻未處理版本 |
| 收藏指到別人 | 是否改動 id 或人物／生物陣列順序 |
| 剪貼簿拒絕 | 使用現有選取文字後備，不要宣稱已複製 |
| 刷新後失去進度 | 儲存被封鎖、不同瀏覽器／網域、損壞資料；勿先清空所有資料 |
| 人物照片失敗 | portrait 相對路徑、檔案存在、解碼、發布 archive 是否包含資產 |
| 英文手機溢出 | 長姓名、nowrap、按鈕、header 總寬與 dialog scrollWidth |
| 別人無法開網站 | 原私人網站未授權其他訪客；可先使用下載後的本機版本 |
