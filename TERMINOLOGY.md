# 台灣繁體中文譯名與編輯規範

核對日期：2026-10-17。本站以七部小說為主；中文採台灣皇冠版用語，英文保留原著名稱。不能只把其他地區用語轉成繁體字。中文標點統一使用「・」不代表更改人名譯法。

## 已核對的修正

| 英文／用途 | 本站採用 | 舊版問題 | 依據 |
| --- | --- | --- | --- |
| Regulus Black | 獅子阿爾發・布萊克 | 雷古勒斯・布萊克 | 《死神的聖物》第 10 章；下列讀者版本辨析交叉核對 |
| Minerva McGonagall | 麥教授 | 改以皇冠人物頁的常用稱呼展示 | 皇冠人物介紹 |
| Deluminator | 熄燈器 | 消光器 | 皇冠詞彙表、預言家快報第 136 期 |
| Bezoar | 毛糞石 | 糞石 | 皇冠詞彙表 |
| Ravenclaw’s diadem | 雷文克勞的王冕 | 雷文克勞的冠冕 | 《死神的聖物》第 31 章；下列讀者版本辨析交叉核對 |
| Herbology | 藥草學 | 草藥學 | 皇冠詞彙表 |
| Keeper | 守門手 | 看守手 | 皇冠詞彙表 |
| Parseltongue | 爬說語 | 泛稱蛇語 | 皇冠詞彙表 |
| O.W.L.s | 普等巫測 | 原頁面只有英文縮寫 | 皇冠詞彙表 |
| O / E / A / P / D / T | 傑出／超乎期待／合格／不佳／糟糕／山怪 | A、P、D、T 曾使用自訂評語代替等第名 | 皇冠預言家快報第 183 期 |

保留已核對的台灣用語，包括葛來分多、赫夫帕夫、雷文克勞、史萊哲林、妙麗、榮恩、奈威、跩哥、石內卜、魯霸・海格、天狼星、咿啦貓頭鷹商場、火閃電、時光器、儲思盆、福來福喜、滾帶落，以及「叱叱，荒唐」「溫咖癲啦唯啊薩」。不因用字少見而改成自行音譯。

## 可追溯來源

優先採用出版社資料；沒有在出版社網頁找到的個別條目另列交叉資料，不宣稱已查閱整套紙本原著。

- [皇冠人物介紹](https://www.crown.com.tw/harrypotter/harrypotter2000/people.htm)：主要人物與麥教授的常用稱呼。
- [皇冠魔法世界詞彙](https://www.crown.com.tw/harrypotter/375331_page05.html)：道具、課程、職位、奇獸、咒語、四院及普等巫測用語。定義不直接照搬，故事細節仍依小說章節與原文官方資料核對。
- [皇冠預言家快報第 136 期](https://epaper.crown.com.tw/np/news136.htm)：Deluminator 的台灣譯名。
- [皇冠預言家快報第 183 期](https://epaper.crown.com.tw/np/news183.htm)：六種中文等第、四位學院創辦人。
- [皇冠預言家快報第 138 期](https://epaper.crown.com.tw/np/news138.htm)：Felix Felicis 的台灣譯名。
- [哈利波特仙境：布萊克家族譯名辨析](https://www.hpfl.net/forum/thread/27966)：讀者指出皇冠版使用「獅子阿爾發・布萊克」；屬輔助交叉資料。
- [PTT：雷文克勞與台版「王冕」用語](https://www.ptt.cc/bbs/HarryPotter/M.1351229913.A.46B.html)：讀者討論版本用字；只採用譯名辨析，不引用其中的歷史推測。
- [HarryPotter.com：學院介紹](https://www.harrypotter.com/features/hogwarts-house-meanings)、[動物與顏色](https://www.harrypotter.com/features/what-your-hogwarts-house-animal-and-colours-could-mean)：四院特質及小說的鷹／青銅色設定，介紹文字為本站重新撰寫。

## 更新時必須同步

1. 人物、道具出現於資料、題目、選項、解析、圖片替代文字時，都要一致。
2. 中文完整字串是 `dist/locales/en.js` 的查找 key，中文修改後同步更新 key；不要把英文角色名稱替換成中文字。
3. 同一角色或物品的譯名修正不改 `id`、關聯索引或學生測驗答案位置；因此既有收藏、30 題答卷與最佳成績仍適用。
4. `tests/terminology.test.cjs` 保護已確認的修正；新增名稱時補來源及必要檢查。測試只能防止回歸，不能取代來源查核。
5. 普等巫測數字門檻與鼓勵評語仍是本站設計；中文等第名稱不再自行改寫。
