export async function uploadMemberImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("請選擇圖片檔案");
  }

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("圖片讀取失敗"));
    reader.readAsDataURL(file);
  });
}
