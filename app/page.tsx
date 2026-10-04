import Link from "next/link";

export default function HomePage() {
  return (
    <main className="landing">
      <div className="landing-card">
        <p className="eyebrow">PRIVATE WEB PAGE EDITOR</p>
        <h1>通用視覺網站編輯器</h1>
        <p>建立分頁、加入元件、設定桌機與手機版，再逐步組成完整網站。</p>
        <div className="landing-actions">
          <Link href="/editor">開啟編輯器</Link>
          <Link href="/preview" className="secondary-link">查看 Renderer</Link>
        </div>
      </div>
    </main>
  );
}
