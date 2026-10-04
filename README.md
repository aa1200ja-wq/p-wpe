# renwoxing-site-editor

通用 Canva 式網站編輯器測試專案。第一個實際專案是「任我行薩克斯風社」。

## 核心
- 編輯器與正式網站共用 SiteRenderer。
- 桌機與手機共用內容，但版面資料獨立。
- Moveable：拖曳、縮放、旋轉、吸附。
- Selecto：框選與選取。
- Craft.js：編輯器引擎宿主，後續接節點與序列化。
- Framer Motion：元素動效與頁面轉場。
- Supabase：資料、素材、版本與登入。
- Vercel：測試站與後續發布。

## 工程規範
自行維護程式檔案控制在 250 行內；遵守 DRY、單一職責、最小修改範圍，不做無關重構。
