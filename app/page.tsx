import Link from "next/link";

export default function HomePage() {
  return (
    <main className="landing">
      <div className="landing-card">
        <p className="eyebrow">RENWOXING SITE EDITOR</p>
        <h1>通用視覺網站編輯器</h1>
        <p>目前載入第一個專案：任我行薩克斯風社。</p>
        <div className="landing-actions">
          <Link href="/editor">開啟編輯器</Link>
          <Link href="/preview" className="secondary-link">查看前台 Renderer</Link>
        </div>
      </div>
    </main>
  );
}
