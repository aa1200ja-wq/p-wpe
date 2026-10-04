"use client";

export function MemberImageDrop({
  title,
  src,
  busy,
  onFile,
}: {
  title: string;
  src: string;
  busy: boolean;
  onFile: (file: File) => void;
}) {
  function accept(file?: File) {
    if (!file || !file.type.startsWith("image/")) return;
    onFile(file);
  }

  return (
    <label
      className="member-image-drop"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        accept(event.dataTransfer.files[0]);
      }}
    >
      <span>{title}</span>
      <img src={src} alt="" />
      <strong>
        {busy ? "上傳中…" : "拖曳圖片到這裡，或點擊更換"}
      </strong>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        disabled={busy}
        onChange={(event) => accept(event.target.files?.[0])}
      />
    </label>
  );
}
