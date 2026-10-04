import type { SiteProject } from "./model";

const DRAFT_KEY = "p-wpe-pages-preview-draft";
const PUBLISHED_KEY = "p-wpe-pages-preview-published";

function readProject(key: string) {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SiteProject;
  } catch {
    window.localStorage.removeItem(key);
    return null;
  }
}

export function getEditorToken() {
  return "github-pages-preview";
}

export async function loadDraft() {
  return readProject(DRAFT_KEY);
}

export async function persistProject(
  project: SiteProject,
  action: "save" | "publish",
) {
  if (typeof window === "undefined") {
    return { ok: false, cancelled: true };
  }

  const serialized = JSON.stringify(project);
  window.localStorage.setItem(DRAFT_KEY, serialized);

  if (action === "publish") {
    window.localStorage.setItem(PUBLISHED_KEY, serialized);
  }

  return { ok: true, cancelled: false };
}
