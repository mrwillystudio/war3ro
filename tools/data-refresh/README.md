# 7.0c08 資料重建與獨立審核

這裡的檢查針對已重建的網站資料，重新比對原始物件欄位、JASS 行號、關聯與 UI 價格行為。檢查程式不修改來源地圖，也不負責發佈網站。更新規則仍以根目錄的 [SITE_UPDATE_RULES.md](../../SITE_UPDATE_RULES.md) 為準。

## 環境

- 獨立資料審核使用 Python 3 標準函式庫；重建圖示與模型另需 Pillow／NumPy，版本見 `preview/requirements.txt`。
- 價格與標籤測試使用 Node.js 內建模組；DOM 操作測試使用本目錄鎖定的 jsdom 26。
- 地圖解包及資料重建的工作目錄；原始 W3X、MDX、BLP 不應提交到網站儲存庫。


## 完整重建順序

這個發行建置器綁定[本版審核報告](../../docs/data-audit-70c08.md)記錄的 7.0c08-v48 地圖 SHA；其他版本必須重新核對來源及手工摘要，不應直接套用。工作目錄置於儲存庫外；以下 `../work` 及地圖路徑可替換。

```bash
node tools/data-refresh/export_baseline.cjs . ../work/current_rodb.json
python tools/data-refresh/extract/extract_map.py '../upload/Ro-Online 7.0c08-v48.w3x' ../work/map_extract
python tools/data-refresh/extract/fetch_native_defaults.py ../work/map_extract
python tools/data-refresh/extract/fetch_native_icons.py ../work/map_extract/native_assets
python tools/data-refresh/refresh_items.py --work ../work --output ../work/items_patch.json
python tools/data-refresh/nonitem/nonitem_refresh.py --work ../work
python tools/data-refresh/assemble_refresh.py --work ../work --repo . --map '../upload/Ro-Online 7.0c08-v48.w3x'
python tools/data-refresh/write_bundle.py --work ../work --repo .
```

`export_baseline.cjs` 依網站實際載入順序，執行本版覆寫層之前的所有舊資料與地理校正層；輸出必須仍是已鎖定的 7.0b07 基準。`assemble_refresh.py` 合併已核對的當版數值、來源摘要與模型預覽記錄。模型來源未改動時仍需遵守當版構圖規範；本次最後發行使用全部當版圖像。

已提交的 WebP 與來源記錄可直接用於資料重建；若要從原始模型重新產生圖像，使用 [preview/README.md](preview/README.md) 的雜湊驗證渲染流程。圖片來源資訊由 `preview/preview-records-70c08.json` 提供。工作目錄若存在這次製作時的模型 manifest，則優先使用它們。機制摘要與召喚指南分別綁定來源 map／JASS SHA，保留人工核對的當版行號與原文。

## DOM 操作驗證

```bash
npm ci --prefix tools/data-refresh --ignore-scripts
node tools/data-refresh/test_dom.cjs . ../work/dom-verification.json
```

測試直接執行正式 HTML 的載入腳本及事件處理，涵蓋價格、搜尋、收藏重載、配方計畫、魔物詳情、地圖工作台新增／去重／編輯／還原，以及 390px 手機互動分支。jsdom 不執行真正的 CSS 排版；`visualLayoutTested: false` 保留這項限制。

## 1. 準備輸入

`--work` 指定的目錄需包含下列資料。JSON 應由同一份地圖產生，`current_rodb.json` 則是更新前網站載入所有資料覆寫後的基準資料。

| 相對於工作目錄的路徑 | 內容 |
| --- | --- |
| `current_rodb.json` | 更新前的完整 RODB，用於人工分區及點位保留檢查 |
| `final_rodb.json` | 重建後的完整 RODB；可用 `--dataset` 指定其他檔案 |
| `map_extract/objects_w3t.json` | 物品物件；包含 `id`、`base_id`、`fields` |
| `map_extract/objects_w3u.json` | 單位物件；包含 `id`、`base_id`、`fields` |
| `map_extract/native_item_127.json` | 固定版本、未套用地圖覆寫的原生物品模板 |
| `map_extract/native_unit_127.json` | 固定版本、未套用地圖覆寫的原生單位模板 |
| `map_extract/extracted/war3map.j` | 本版完整 JASS；行號須與重建資料相同 |

不得將地圖修改過的原生 rawcode 當作另一個自訂物件的原生模板；這正是本次錯誤 MVP 價格的來源。

## 2. 執行資料審核

以下範例在儲存庫根目錄執行，假設解包工作目錄是同層的 `work`，來源地圖放在同層的 `upload`。這些位置可以自行替換。

```bash
python tools/data-refresh/check_final_data.py \
  --work ../work \
  --map '../upload/Ro-Online 7.0c08-v48.w3x' \
  --report ../work/final-data-review.json
```

使用其他重建檔案時加上 `--dataset path/to/dataset.json`。`--map` 會驗證來源 W3X 的 SHA-256 與資料內 `meta.sha256` 完全一致，正式更新應提供此參數。`--report` 為選用；無論是否指定，都會把 JSON 結果輸出到標準輸出。

檢查涵蓋：

- 各資料類型 ID 不重複；全部物品成本等於「未修改原生模板 + 本物件覆寫」。
- 商店的出售 rawcode 確實列於該 NPC `usei`；購買選單與實體物品對應行號正確；每筆售價取自實際出售物件。
- 物品與商店的雙向關聯一致；統一 `buyPrice` 只在所有已列商店成本一致時成立。
- 掉落、MVP 池、配方、套裝及點位的引用均可解析；來源行確實包含對應物件。
- MVP 候選機率之和等於池啟動機率；`minDeath` 與每次執行次數不在轉換時遺失。
- `Rhpm` 需求與狂暴模式標記一致。
- 機制及召喚說明的來源行號有效；保留的證據原文與本版 JASS 逐行一致。
- 人工分區內容、既有魔物點位的人工區域對應完整保留。

`issues: []` 且結束碼為 `0` 代表這些檢查通過；任何不一致會列入 `issues` 並回傳 `1`。這個結果不能取代 JASS 觸發前置條件的人工閱讀、模型外觀檢查，或遊戲內實測。

## 3. 執行價格 UI 回歸

```bash
node tools/data-refresh/test_prices.cjs
```

也可以傳入另一個網站根目錄作為第一個參數。測試直接從該網站 `index.html` 取得正式價格函式，驗證 12 個已知錯誤與邊界情境，並編譯所有行內 script：

- 斗篷不再讀取過期的換算總價。
- 實際出售選單的售價優先於物件內部定價。
- 未確認商店來源、缺少成本、零值與不同 NPC 售價有明確區別。
- MVP 換算由目前金幣與 MVP 分量重新計算。
- 不同幣別但相同換算總值仍保留「依 NPC 而異」。
- 排序採目前已知價格，未知值不會被當作零元。
- 非法負數、非有限數值不會產生價格。

測試成功會列出 `passed: 12`。這是 JavaScript 行為與語法檢查，不是瀏覽器畫面排版測試。

## 4. 既有目錄標籤回歸

在儲存庫根目錄執行：

```bash
node tools/catalog/test_catalog_tags.cjs
```

保留物品標籤、法球效果、屬性、職業限制及跳脫字元的既有驗收規則。每次更新最後應再核對實際載入資料、主要互動、靜態圖片與公開站點回應，並在 [本版審核報告](../../docs/data-audit-70c08.md) 記錄已完成與尚未執行的驗證。

## 發布後驗收

根目錄 `.assetsignore` 只允許 `index.html`、`atlas-data/` 與 `atlas-models/` 成為公開資產。`assets.directory` 指向儲存庫根目錄時，Workers 不會自動排除 `.git`；本次曾因 Git pack 超過 25 MiB 而建置失敗。新增網站資產目錄時，須同步更新此清單；不要將 Git 內部資料、稽核工具或依賴上傳為網站資產。

確認 Cloudflare `Workers Builds: war3ro` 對應本次提交成功後，再核對正式站回傳內容：

```bash
python tools/data-refresh/verify_deployment.py --repo . --catalog ../work/final_rodb.json --output ../work/production-verification.json
```

此檢查從正式網址讀取首頁、HTML 實際引用的所有資料腳本與全部模型圖片，逐檔比較 HTTP 狀態與完整內容 SHA-256，避免 SPA 以首頁回應不存在圖片時被誤判為成功。它不啟動瀏覽器、不開啟遊戲、不修改遠端資料。
