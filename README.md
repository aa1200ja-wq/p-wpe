# p-wpe

Private Web Page Editor 的開發基底。

目前階段先保留任我行編輯器的視覺編輯能力，逐步抽離成通用型網站編輯器。

## 目前保留
- SiteRenderer 共用渲染核心。
- 桌機與手機獨立版面資料。
- Moveable：拖曳、縮放、旋轉、吸附。
- Selecto：框選與選取。
- Craft.js：編輯器引擎宿主。
- Framer Motion：元素動效與頁面轉場。
- 瀏覽器 localStorage：開發階段草稿暫存。
- GitHub Pages：僅作線上驗收。

## 目前不啟用
- Vercel 部署。
- 正式網站發布。
- Supabase 雙向同步。
- 編輯器直接更新正式網站。

## 工程規範
自行維護程式檔案控制在 280 行內；遵守 DRY、單一職責、最小修改範圍，不做無關重構。
