# 插畫素材

使用內建 image_gen，以通過確認的 B × C 概念稿作為風格參考。城堡儲存在 dist/assets/castle.png；六種生物圖集儲存在 dist/assets/creatures.png，由 CSS 顯示個別圖格。

## castle

Create a standalone website hero ILLUSTRATION asset based on the pen-and-wash castle illustration in the reference. Output only art, NO website, NO text, NO buttons or frames. Wide landscape 3:2. Hogwarts castle with pointed towers, a stone arched bridge, rocky slopes, sparse trees and a tiny flying owl carrying an envelope. Restrained brown-black dip-pen sketch, natural slightly irregular fine lines and cross-hatching, pale muted blue and ochre watercolor accents. A lovely interior illustration from a literary fantasy book, not cinematic digital painting, no photorealism or glossy 3D. Cluster castle in center and right, edges softly unfinished into a completely flat warm ivory background #f7f3e9. Keep 8 percent clear ivory margin all around, especially upper left; airy negative space. Match the reference's hand-drawn book illustration STYLE precisely, not its UI. No people, no lettering, no stars, no harsh border.

## creatures

Create a clean ILLUSTRATION SPRITE SHEET with EXACTLY 6 separate original magical animal pen-and-wash drawings arranged on an invisible equal-sized 3-COLUMN by 2-ROW grid. Landscape 3:2 canvas, flat solid warm ivory #f7f3e9 background, NO grid lines, NO text, NO labels, NO framing or UI. Reference is STYLE ONLY: delicate brown-black pen cross-hatching, imperfect linework, very restrained translucent watercolor, naturalist's field notebook illustrations, no photorealism or polished CGI. Each drawing centered in its own cell, entire creature inside its cell with at least 15 percent blank padding on every side, no overlap between cells. TOP LEFT: a majestic hippogriff, eagle head and feathered wings, equine rear body and hindlegs. TOP MIDDLE: a phoenix with flowing red-gold feathers. TOP RIGHT: a white unicorn with single long spiral horn. BOTTOM LEFT: a black skeletal winged thestral horse, bat-like wings, elegant and calm. BOTTOM MIDDLE: a bronze-black dragon with horns and wings. BOTTOM RIGHT: a large coiled emerald basilisk serpent. Keep drawings all same naturalist sketch style and similar visual size. This is a functional sprite atlas to display individual animals through CSS background-position.


## 2026-10-11 新增奇獸圖集

工具：內建 image_gen。檔案：dist/assets/creatures-expanded.png。包含玻璃獸、木精、八眼巨蛛、人馬、人魚、滾帶落，以 CSS 裁取圖格。

完整提示詞：

Use case: illustration-story. ONE production-ready ILLUSTRATION SPRITE ATLAS for a Harry Potter naturalist book website. Exactly SIX creatures, invisible equal 3-COLUMN by 2-ROW grid on a landscape 3:2 canvas. Each cell is square. Flat uniform warm ivory #f7f3e9 background. Each entire creature centered inside its cell with generous 15% blank margin on all sides. No cell overlap, no text, no labels, no borders, no grid lines. Precise fine brown-black dip-pen linework and soft crosshatching, very restrained translucent muted watercolor, slightly imperfect antique illustrated field-guide sketches; not glossy, cinematic, 3D or cartoon. EXACT ORDER: top left NIFFLER, small fluffy black mole-like creature with long ducklike snout and little clawed paws holding one gold coin; top middle BOWTRUCKLE, tiny thin woody twig-like green-brown tree guardian with two leaf sprouts on its head and long delicate fingers, standing on one simple twig; top right ACROMANTULA, large hairy black spider, anatomically clear eight legs and many small eyes, elegant natural-history drawing rather than horror. Bottom left CENTAUR, dignified adult male human head arms and clothed upper torso seamlessly joined to four-legged chestnut horse body, long brown hair, small bow lowered at side, entire hooves and tail visible; bottom middle MERPERSON from Hogwarts lake, greyish-green skin, long dark-green hair, rugged intelligent face, modest upper body covered by simple woven kelp vest, single long silver-scaled fish tail, small trident, entire figure gracefully posed; bottom right GRINDYLOW, small pale green water demon with two tiny horns, long thin fingers and an octopus-like lower body, expressive creature with no gore. All subjects solitary; no scenery except subtle sparse ground marks, identical artistic medium and soft faded edges. Creatures must fit each own grid cell for CSS background cropping.



## 2026-10-12 人物重繪（未產出成品）

模式：內建 image_gen。沒有使用 CLI/API 後備模式。一次連線失敗後，以下兩個人物請求分別於 output 階段回覆 moderation_blocked，原因類別僅為 other；不能推定是版權因素。未產出新人物圖片。下載的電影照片已從 dist 移除，當時網站人物檔案暫採文字版。不得將以下提示詞視為完成資產。

### Harry Potter

Use case: illustration-story. A single original book illustration portrait of Harry Potter as described in the novels, for a literary character encyclopedia. Messy black hair, round wire spectacles, green eyes, a small lightning scar, fully clothed in dark school robes and burgundy knit scarf. Waist-up, centered, gentle thoughtful expression. Delicate irregular brown-black dip-pen outlines, fine crosshatching and restrained translucent watercolor, muted ochre, burgundy and moss. Like a traditional naturalist's illustrated field guide on warm ivory paper #f7f3e9, same tactile ink-and-watercolor handling as a magical creature bestiary. Visible hand-drawn line work, understated small washes, ample blank paper all around, no setting, no border, no text, no logos, no glow, no cinematic rendering, no photorealism. Original imagined face, not an actor likeness. Square composition.

請求 ID：744b7449-285b-407b-8ff9-00ba043df456。

### Albus Dumbledore

Use case: illustration-story. Original book portrait of Albus Dumbledore for a Harry Potter character encyclopedia. Elderly wizard with long silver hair and beard, a crooked nose and half-moon spectacles, wearing an understated plum-coloured robe and soft cap. Waist-up on warm ivory paper. Traditional dip-pen line drawing with fine crosshatching, muted translucent watercolor washes in burgundy, ochre and moss, like an antique naturalist field guide. Thoughtful friendly face, hand-drawn irregular lines, plenty of blank paper margins, square composition. No lettering, border, logos, glow or photographic texture.

請求 ID：dfbd2c28-573d-4206-8469-9784d3cc5e4a。



## 先前版本：十二位 Q 版向量人物

使用者於 2026-10-12 明確接受 Q 版 SVG 向量插畫。這組素材直接以 SVG 路徑、圖形及配色繪製，沒有使用 image_gen 成品，也沒有下載或修改電影照片。先前哈利、鄧不利多及後續 Q 版哈利的圖片生成嘗試均未產出圖片，與本組向量素材是不同製作方式。

設計規格：米色背景、深棕細線、低飽和酒紅／森林綠／藍灰配色，大頭小身的 Q 版比例，以髮型、眼鏡、服裝與道具辨識角色。十二張均保存在 dist/assets/portraits/，檔名對應人物的英文 id，副檔名 .svg。

代表物包括哈利圓眼鏡與閃電疤痕、妙麗書本、榮恩棋子、露娜蘿蔔耳環、奈威盆栽、跩哥魔杖、鄧不利多半月眼鏡、石內卜魔藥瓶、麥教授尖帽、海格粉紅傘、天狼星鬍鬚與多比襪子。這是簡潔的向量插畫，並非真人手繪或細緻水彩作品。


## 2026-10-13 目前採用：官方電影照片

內建 image_gen 的人物點陣插畫再次於輸出審查遭拒，未產出圖片。使用者隨後允許改採網路照片；目前十二位人物改用 HarryPotter.com 官方人物百科照片。已核對每張素材屬於對應人物來源頁，使用 1200 × 832 WebP，保持原色和原構圖。人物檔案附來源連結，完整清單見 PHOTO-SOURCES.md。照片不是 AI 重繪，也不是向量轉存。
