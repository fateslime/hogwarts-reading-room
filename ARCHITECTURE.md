# 專案架構與資料契約

維護基準：2026-10-18。這份文件描述目前實作；歷史版本見 VERIFICATION.md。給下一位維護者的入口是 AGENTS.md，具體更新步驟見 MAINTENANCE.md。

## 1. 產品範圍與設計

霍格華茲藏書室是七部哈利波特小說的非官方互動導覽，支援繁體中文與英文。主要內容為世界背景、七部小說、十二位人物、十二種神奇動物、十六題分院、三十題學生知識測驗、站長介紹與聯絡草稿。

風格是米色紙張、酒紅色、書籍式留白與鋼筆淡彩。使用者偏好簡潔的大標題，避免堆疊小圖示、副標、附註與裝飾標籤。分類帽圖示保留。英文版沿用同一版面，不複製另一套網站。

目前人物檔案使用十二張官方電影 WebP 照片，來源在 PHOTO-SOURCES.md；舊 SVG 插畫仍在資產目錄，但沒有被人物資料引用。城堡與動物使用 AI 輔助插畫。不能把歷史版本的 SVG 說明當成目前實作，也不要稱現有素材為真人手繪或免版權素材。

## 2. 技術邊界

- 原生 HTML、CSS、JavaScript；無前端框架、bundler 或編譯步驟。
- dist/ 同時是可編輯的網站來源與發布根目錄，並不是可丟棄的建置產物。
- 沒有應用程式後端、資料庫、登入系統、分析追蹤或跨裝置同步。
- Sites 的私人存取限制由託管平台管理，前端不持有登入憑證。
- Node.js 僅用於預覽、測試與打包；瀏覽網站不需要 Node。
- Google Fonts 是外部字型依賴；失敗時使用 CSS 的系統字型後備。
- 資料和文案皆隨網站下載；測驗是閱讀娛樂用途，答案可在原始碼查看。

## 3. 檔案地圖

~~~text
hogwarts-reading-room/
├─ AGENTS.md                    下一位 AI 的作業入口
├─ ARCHITECTURE.md              本文件：架構、狀態、契約
├─ MAINTENANCE.md               更新、測試、發布與故障處理
├─ README.md                    使用者快速導覽
├─ VERIFICATION.md              按日期保留的驗證紀錄
├─ TERMINOLOGY.md              台灣譯名與核對依據
├─ SOURCES.md                   設定來源、小說章節與題目索引
├─ PHOTO-SOURCES.md             現用人物照片來源
├─ ASSET-PROMPTS.md             插畫提示詞與歷史製作紀錄
├─ package.json                本機指令；沒有執行期套件依賴
├─ .gitignore                  排除 .local、node_modules、日誌與部署壓縮檔
├─ dist/
│  ├─ index.html               語意骨架、導覽、靜態內容、共用 dialog
│  ├─ styles.css               外部樣式、色彩變數、元件與響應式覆寫
│  ├─ data.js                  LibraryData：內容與關聯
│  ├─ quiz.js                  SortingQuiz：分院題庫與純計分函式
│  ├─ locales/en.js            EnglishCatalog：中英文字典
│  ├─ i18n.js                  I18n：顯示語言、DOM 翻譯與語言保存
│  ├─ app.js                   小說、人物、動物、分院、聯絡互動
│  ├─ exam-data.js             StudentExam：知識題庫、等第、資料驗證
│  ├─ exam.js                  學生測驗流程、保存、成績與解析
│  └─ assets/
│     ├─ castle.png            首頁城堡
│     ├─ creatures.png         前六種動物的合併插畫
│     ├─ creatures-expanded.png 後六種動物的合併插畫
│     ├─ favicon.svg
│     └─ portraits/            目前 WebP 照片與歷史 SVG 素材
├─ tools/preview.cjs           僅本機的靜態 HTTP 預覽
├─ tests/                      純函式測試與瀏覽器回歸
└─ .local/                     不追蹤的開發草稿、截圖與發布壓縮檔
~~~

.local/ 不是必要來源。翻譯字典已直接保存在 dist/locales/en.js，不能依賴 .local 中歷史生成腳本重建；重跑那些腳本可能覆蓋後續修改。

## 4. 啟動與資料流

index.html 的所有腳本使用 defer，依序執行：

~~~text
data.js → quiz.js → locales/en.js → i18n.js → app.js → exam-data.js → exam.js
~~~

data.js 建立 window.LibraryData。quiz.js 和 exam-data.js 同時支援瀏覽器全域與 Node CommonJS，讓計分可不依賴 DOM 測試。app.js 與 exam.js 各在 IIFE 內保存狀態，不互相覆寫。i18n.js 在 DOMContentLoaded 進行首次翻譯，後續監看新文字。

~~~mermaid
flowchart TD
  HTML[index.html 語意版面] --> APP[app.js 閱讀與分院]
  DATA[data.js LibraryData] --> APP
  QUIZ[quiz.js SortingQuiz] --> APP
  DATA --> EXAM[exam.js 學生測驗]
  ED[exam-data.js StudentExam] --> EXAM
  APP --> DOM[畫面與原生表單]
  EXAM --> DOM
  EN[locales/en.js] --> I18N[i18n.js 顯示層]
  DOM --> I18N
  I18N --> DOM
  APP <--> LS[瀏覽器 localStorage]
  EXAM <--> LS
  I18N <--> LS
~~~

沒有網路 API 讀取內容。內容更新要修改檔案並重新發布。原生事件委派依 data-* 屬性與固定 ID 判斷操作，不依賴中英文按鈕文字。

## 5. 內容資料模型

### LibraryData

| 集合／欄位 | 契約與用途 |
| --- | --- |
| owner | name、email；email 目前是空字串，不可捏造聯絡資訊 |
| books | 固定依第一至第七部排序，所有跨區連結使用 0–6 索引 |
| characters | 十二位人物；id 是收藏識別，slug 可供內容識別 |
| creatures | 十二種生物；id 是收藏識別 |
| sources | 二元素陣列 [顯示名稱, 官方網址] |

小說欄位：title（繁中短名）、english（英文完整書名）、year、intro、detail、spoiler、note、tags、icon。note、tags、icon 是保留內容，不代表目前都有畫面元件。介紹與重大劇情分開，避免把結局直接放入 intro。

人物欄位：

- id、slug、name、english、house；role 只用 student、teacher、other。
- intro、story、tags；facts 是 [欄名, 文字] 的陣列，目前每人三項。
- books：小說索引；related：人物索引；可選 creatures：生物索引。
- source：設定來源；portrait：站內圖片相對路徑；portraitSource：照片出處。
- 可選 spoiler；relatedSpoiler 為 true 時，關聯人物也受劇透保護。

生物欄位：

- id、name、english；type 限 flying、land、water。
- intro、detail、habitat、ability、care、extra、source。
- books、related 的索引語意同上。
- art 是 assets 下的檔名；x、y 是 CSS 背景定位百分比。
- 原始六隻是 3 × 2 分格；擴充圖上排高度 448、下排 576。artHeight 參與背景縮放和容器比例，不能直接當作獨立圖片的高度。

**不可任意更動陣列排序。** 收藏使用穩定 id，但相關人物、生物、小說連結仍使用數字索引。插入或重排項目會使其他記錄指向錯誤內容；一般擴充請加在尾端並核對所有關聯。

## 6. 互動模組

### app.js

- renderRoute / renderBook：小說分頁、展開、進度、劇透與書中檔案。
- renderCharacters / openCharacter：搜尋、身分類別、收藏篩選、人物視窗。
- renderCreatures / openCreature：分類、搜尋、初始六筆、顯示更多、動物視窗。
- renderQuiz / completeQuiz：分院畫面與結果。
- openDialog：共用原生 dialog，記錄開啟者、管理捲動、關閉後還原焦點。
- document 的事件委派處理 data-character、data-creature、data-favorite、data-read-book。
- copyText：優先使用剪貼簿；拒絕時顯示可選取的文字。
- 聯絡表單只建立本機草稿。email 空白時複製；設定 email 後開啟 mailto，由使用者在郵件程式寄出。

人物搜尋包含中文姓名、英文姓名、學院、標籤、facts，以及學院／facts 的英譯。動物搜尋包含中英文名、棲地、能力與對應英譯。輸入值不隨語言切換改寫，兩種語言皆可搜尋。

### 四院介紹

index.html 的 #houses 提供四個語意 article，位於 #sorting 之前。導覽「學院與分院」連至 #houses；學院文字及創辦人、動物、小說色彩同步收進英文目錄。沒有新增裝飾圖示。

### 十六題分院

狀態流：welcome → question → result，最高分同分時先進入 tie。
第 3 版每題四個選項，各有 text、house；沒有 secondary。所選學院 +1，十六題共 16 分。每題四院各一個選項，整份題庫中每院在四個位置各出現四次。最高分同分必須由使用者從同分學院中選擇。百分比是作答分布，不能宣稱心理診斷或能力評分。

純函式 API：

- validAnswers(answers, complete=false)：驗證長度、null 與 0–3 整數。
- score(answers)：只接受完整答案，回傳 scores、tied、total。
- version：目前為 3。
- restoreDraft(raw)：只還原 quizVersion:3 的有效十六題資料，回傳 answers、index、updated。舊八題、第 2 版或未知版本不能套用新題意，回傳空分院答案；有舊作答時 updated:true，由 app.js 顯示重新作答原因。閱讀與收藏由 app.js 獨立還原，不清除整組 localStorage。

### 三十題學生測驗

狀態流：welcome → question → overview → result → review。
question 可 pause 回 welcome；result 可要求 restart，確認後保留 best、清除本次答案。取消重新作答回到原畫面。

題目有 question、options[4]、answer（0–3）、book（0–6）、chapter、explanation。
載入時按位置產生 owl-01 至 owl-30 的 id 與難度：前十題基礎、中十題進階、後十題挑戰。**目前保存依答案位置，id 並未用作答案遷移，因此仍不能重排題目或選項。**

每題一分，不倒扣。等第英文字母及名稱沿用故事，數字門檻是本站設計：

| 等第 | 名稱 | 答對題數 | 及格 |
| --- | --- | --- | --- |
| O | Outstanding | 27–30 | 是 |
| E | Exceeds Expectations | 23–26 | 是 |
| A | Acceptable | 18–22 | 是 |
| P | Poor | 12–17 | 否 |
| D | Dreadful | 6–11 | 否 |
| T | Troll | 0–5 | 否 |

StudentExam API：validAnswers、gradeFor、score、restore。score 回傳 correct、total、percent、grade、checks、levels。成績另依錯題統計推薦最多三本重讀小說。全對時直接顯示全部解析。

小說劇透開關不控制學生測驗。測驗開始頁已提醒涵蓋結局。

## 7. 狀態與保存

| localStorage key | 保存資料 | 隔離目的 |
| --- | --- | --- |
| hogwarts-reading-room-v1 | visited、currentBook、answers、quizIndex、resultHouse、favorites、quizVersion:3 | 閱讀／收藏／分院 |
| hogwarts-student-exam-v1 | version:1、answers[30]、index、completed、best | 學生測驗 |
| hogwarts-language-v1 | zh-Hant 或 en 字串 | 顯示語言 |

favorites 是 character:穩定id 或 creature:穩定id 字串陣列。讀取時排除不存在的項目。visited 是 0–6 索引的去重陣列。

不保存的狀態：小說展開／劇透開關、搜尋詞、當前篩選、對話框、顯示更多狀態、聯絡草稿、未完成測驗的畫面階段。語言切換不重新載入，所以它們在當次切換時保留；重新整理時可能重設。未交卷的測驗重新整理後從 welcome 續答，完成的則顯示結果。

所有讀寫都有例外處理。localStorage 不可用時可完成當次互動，不能保證下次保留。瀏覽器、網域、無痕模式各自隔離；file:// 的保存行為由瀏覽器決定。清除網站資料就會刪除進度，沒有伺服器備份。

資料版本變動必須有遷移方案。不要為修復顯示錯誤直接清空使用者全部 localStorage。

## 8. 雙語架構

預設繁體中文。只有明確選擇 English 才切換，保存至獨立的語言 key。首頁「中文 / English」與 dialog 內的切換按鈕提供相同功能。document.documentElement.lang 同步為 zh-Hant 或 en。

公開介面：

~~~js
window.I18n.language
window.I18n.setLanguage('en')
window.I18n.t('七部小說')       // 按目前語言回傳
window.I18n.english('七部小說') // 無論目前語言，回傳英譯供搜尋使用
~~~

setLanguage 後發出 document 的 languagechange 事件，detail.language 為語言代碼。

EnglishCatalog 以完整中文原文作 key、英文作 value。翻譯順序：

1. 精確匹配完整字串。
2. 動態格式規則，例如「已探索 N / 7 部」、題號、答對率、複製結果。
3. 按長字串優先匹配字典片段，處理組合文案。
4. 無匹配時保留原文。因此新文案必須補字典並跑漏譯檢查，不能把未翻譯視作完成。

DOM 顯示層使用 WeakMap 記錄每個文字節點／屬性的原文和上次輸出，切回中文可還原，不會把已翻譯字串當成新來源。MutationObserver 接續翻譯 app.js / exam.js 動態產生的文字。套用翻譯時暫停 observer，避免自我觸發迴圈。

翻譯涵蓋文字、aria-label、placeholder、alt、title、description metadata。不變更 innerHTML、事件處理器、radio value、ID、class、URL、資料庫 key、題庫或作答陣列。script/style/noscript 與 data-no-i18n 區域不翻譯；textarea 的內容不翻譯，但 placeholder 可以翻譯。使用者輸入、姓名、信件不交給翻譯器。

分院與考試的分享文字在複製時呼叫 I18n.t，因為 clipboard 內容不屬於 DOM。聯絡信件保留使用者原文。

限制：這是現有中文 DOM 的顯示層，並非按語言提供獨立 URL 的 SEO 系統。任意新增中文句子可能產生片段混譯，測試會攔截殘留中文字。若未來擴充大量語言，應考慮穩定訊息 key 與顯式渲染，並先保留目前存檔契約。

## 9. 版面、無障礙與樣式

index.html 保留 header/nav/main/section/article/aside/footer，主要區塊由 aria-labelledby 對應標題。小說使用 tablist/tab/tabpanel、左右鍵與 Home/End。測驗使用 fieldset/legend/radio；未選答案不可往下一題。dialog 可 Escape 關閉並還原焦點。更新訊息使用 role=status。

styles.css 有根層色票與字型變數、class 選擇器、padding/margin/border 的 Box Model、黏附導覽和絕對定位控制項。舊樣式較緊湊，新功能在後段追加。更動時注意 cascade，勿不斷追加同名互相矛盾的覆寫。

語言控制與英文排版位於檔案末段。800px 以下使用手機選單；英文長標題在小尺寸允許換行。驗證尺寸至少 320、390、768、1024、1440px，同時檢查整頁與 dialog 的水平溢出。

## 10. 安全與資產界線

內容資料是開發者控制的本機檔案，有些 render 使用 innerHTML，並不適合直接接收任意外部 HTML。若新增上傳、CMS 或 API，必須重新處理資料驗證與轉義，不能直接插入未信任字串。

外連使用 noopener noreferrer。照片與插畫從本站 assets 載入；不依賴圖片熱連。圖鑑背景圖有 role=img 與可翻譯說明。聯絡草稿僅在目前頁面，不自動寄送。測驗沒有防作弊保證。

憑證不得寫入 dist、文件、日誌或壓縮檔。Sites 身分與 token 只能由原生工具取得；本文件只記錄非秘密的 project_id。

## 11. GitHub 副本與待擴充邊界

此儲存庫從可執行的網站來源建立獨立快照，沒有匯入舊版 Git 歷史。
私人託管網址、專案識別資料、憑證與完整對話不隨此副本提供。
本機開啟 dist/index.html 不需要託管帳號。若需要部署，靜態發布目錄為 dist，設定目標應由擁有者另行提供。
未實作的功能包括跨裝置帳號、後端寄信、上傳照片編輯器、後台 CMS、多語獨立網址。文件中的擴充建議不能被描述成已上線能力。

### 2026-10-18 最終視覺契約

- 人物區、神奇動物區與兩類 profile 保留本次美化前版型。沒有 artwork-plate；creature-art 仍直接承載雪碧圖背景與比例。app.js 與基準版本一致。
- 保留手機規則使用 :not(:where(...)) 排除 .characters-section、.creatures-section、dialog[data-kind=profile] 內的元件，勿為了全域樣式意外改回使用者已拒絕的排版。
- --type-small 為 14px、--touch-target 為 44px，僅套用保留改善範圍，不代表全站小字與控制項全部使用它們。
- exam-review-list 上限 --reading-width:38rem；exam-answer-group 群組答案、exam-explanation 標示解析，保留原有雙語文字與 data-*。
- .quiz-panel 與 .exam-sheet 共用同一規則：var(--line) 細框、--plate-paper:#fbf8f0、無陰影、直角，--assessment-inset 桌機 32px／600px 以下 20px。不要分別再新增不同面板框線。
- tests/reading-layout.cjs 比較兩種測驗樣式、中英文五種寬度、保留範圍觸控目標及關閉按鈕；人物／動物範圍不宣稱 44px。

保留原樣的已知限制：英文 320px 鷹馬檔案內部有 4px 橫向溢出，reading-layout 會明確回報 completed_with_known_issue，未宣稱完全通過。不可擴大這個例外或忽略新尺寸的失敗。
