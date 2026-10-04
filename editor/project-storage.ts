import type { SiteProject } from "./model";

const TOKEN_KEY = "renwoxing-editor-token";

function storedToken() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(TOKEN_KEY) ?? "";
}

function requireToken() {
  const existing = storedToken();
  if (existing) return existing;

  const entered =
    window.prompt("請輸入任我行編輯器儲存金鑰")?.trim() ?? "";
  if (entered) window.localStorage.setItem(TOKEN_KEY, entered);
  return entered;
}

export function getEditorToken() {
  return requireToken();
}

export async function loadDraft() {
  const token = requireToken();
  if (!token) return null;

  const response = await fetch("/api/site-project", {
    headers: { "x-editor-token": token },
    cache: "no-store",
  });
  if (!response.ok) {
    window.localStorage.removeItem(TOKEN_KEY);
    return null;
  }

  const payload = (await response.json()) as {
    project?: SiteProject | null;
  };
  return payload.project ?? null;
}

export async function persistProject(
  project: SiteProject,
  action: "save" | "publish",
) {
  const token = requireToken();
  if (!token) return { ok: false, cancelled: true };

  const response = await fetch("/api/site-project", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-editor-token": token,
    },
    body: JSON.stringify({ action, project }),
  });

  if (!response.ok) {
    window.localStorage.removeItem(TOKEN_KEY);
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error ?? "儲存失敗");
  }

  return { ok: true, cancelled: false };
}
