# 金甌女中課表查詢網站

依據 littleyi22/timetable-demo 的 CSV 欄位與 JSON 格式建立；前端為針對高中職班級重新實作的靜態網頁。

## 部署 GitHub Pages
1. 建立新的 GitHub Repository，建議先設為 Private 並確認公開課表的授權範圍。
2. 將本資料夾所有檔案上傳至 Repository 根目錄。
3. Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save。
4. 等待 Pages 顯示網站網址，測試班級、教師、列印。

注意：GitHub Pages 網站及 CSV 可被公開讀取；本網站未實作帳號驗證。若資料不適合公開，請使用有真正身分驗證的內部平台。

## 資料限制
- 未填授課教師的課程不會寫入教師導向 CSV，詳見 data_quality_report.json。
- 同教師同時段多班或不同科目資料以斜線合併，請人工核對。
- 原始課表包含第九節，網站已顯示。

## 直接在 Windows 開啟（新版）
1. 右鍵 ZIP → 全部解壓縮（不要在 ZIP 預覽視窗內直接開啟）。
2. 保留所有檔案在同一資料夾，雙擊 `index.html`。
3. `data.js` 是離線備援資料，因此不需要安裝 Python 或架設伺服器。
4. 若部署 GitHub Pages，仍優先載入 `timetable_jinou.csv` 與 `homerooms_jinou.json`，失敗時使用備援資料。
5. 更新 CSV/JSON 時，也必須重新產生 `data.js`，避免離線內容過期。
