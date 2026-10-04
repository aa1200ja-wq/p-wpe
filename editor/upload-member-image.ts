import { getEditorToken } from "./project-storage";

export async function uploadMemberImage(file: File) {
  const token = getEditorToken();
  if (!token) throw new Error("缺少編輯器儲存金鑰");

  const form = new FormData();
  form.set("file", file);

  const response = await fetch("/api/member-image", {
    method: "POST",
    headers: { "x-editor-token": token },
    body: form,
  });

  const payload = (await response.json().catch(() => null)) as
    | { url?: string; error?: string }
    | null;

  if (!response.ok || !payload?.url) {
    throw new Error(payload?.error ?? "圖片上傳失敗");
  }

  return payload.url;
}
