import {
  getDraftProject,
  SUPABASE_KEY,
  SUPABASE_URL,
} from "@/lib/supabase-site-store";

const PROJECT_ID = "renwoxing";
const MAX_SIZE = 10 * 1024 * 1024;
const allowed = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

function tokenFrom(request: Request) {
  return request.headers.get("x-editor-token")?.trim() ?? "";
}

export async function POST(request: Request) {
  const token = tokenFrom(request);
  if (!token) {
    return Response.json(
      { error: "缺少編輯器儲存金鑰" },
      { status: 401 },
    );
  }

  try {
    await getDraftProject(PROJECT_ID, token);

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return Response.json(
        { error: "沒有收到圖片檔案" },
        { status: 400 },
      );
    }

    const extension = allowed.get(file.type);
    if (!extension) {
      return Response.json(
        { error: "只支援 JPG、PNG、WEBP、GIF" },
        { status: 400 },
      );
    }
    if (file.size > MAX_SIZE) {
      return Response.json(
        { error: "圖片不可超過 10MB" },
        { status: 400 },
      );
    }

    const fileName =
      "renwoxing-" +
      Date.now() +
      "-" +
      crypto.randomUUID() +
      "." +
      extension;

    const upload = await fetch(
      SUPABASE_URL + "/storage/v1/object/member-images/" + fileName,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: "Bearer " + SUPABASE_KEY,
          "x-editor-token": token,
          "Content-Type": file.type,
          "x-upsert": "false",
        },
        body: await file.arrayBuffer(),
      },
    );

    if (!upload.ok) {
      throw new Error(
        "Storage upload failed: " + (await upload.text()),
      );
    }

    return Response.json({
      url:
        SUPABASE_URL +
        "/storage/v1/object/public/member-images/" +
        fileName,
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "圖片上傳失敗",
      },
      { status: 403 },
    );
  }
}
