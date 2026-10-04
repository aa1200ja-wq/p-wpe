export default function MobilePreviewPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "28px",
        background: "#171717",
        color: "#f2ede4",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div>
        <p style={{ margin: "0 0 12px", textAlign: "center" }}>
          手機版預覽｜390 × 844
        </p>
        <iframe
          src="../"
          title="手機版預覽"
          style={{
            display: "block",
            width: 390,
            height: 844,
            border: "1px solid #777",
            background: "#fff",
          }}
        />
      </div>
    </main>
  );
}
