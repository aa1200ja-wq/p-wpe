export default function MobilePreviewPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "28px",
        background: "#171717",
        color: "#eee7da",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div>
        <p style={{ margin: "0 0 12px", textAlign: "center" }}>
          任我行手機版預覽｜390 × 844
        </p>
        <iframe
          src="/site"
          title="任我行手機版"
          style={{
            display: "block",
            width: 390,
            height: 844,
            border: "1px solid #806236",
            background: "#070706",
          }}
        />
      </div>
    </main>
  );
}
