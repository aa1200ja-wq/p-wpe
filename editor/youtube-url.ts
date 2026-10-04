export function toYouTubeEmbedUrl(input: string) {
  const value = input.trim();
  if (!value || value === "about:blank") return null;

  const normalized =
    value.startsWith("http://") || value.startsWith("https://")
      ? value
      : "https://" + value;

  try {
    const url = new URL(normalized);
    const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");
    let videoId = "";

    if (host === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (
      host === "youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v") ?? "";
      } else {
        const parts = url.pathname.split("/").filter(Boolean);
        if (["embed", "shorts", "live"].includes(parts[0] ?? "")) {
          videoId = parts[1] ?? "";
        }
      }
    }

    if (!/^[A-Za-z0-9_-]{6,}$/.test(videoId)) return null;
    return "https://www.youtube.com/embed/" + videoId;
  } catch {
    return null;
  }
}
