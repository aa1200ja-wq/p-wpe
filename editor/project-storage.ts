import type { SiteProject } from "./model";

const DRAFT_KEY = "p-wpe-universal-v1-draft";

function readProject() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(DRAFT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SiteProject;
  } catch {
    window.localStorage.removeItem(DRAFT_KEY);
    return null;
  }
}

export async function loadDraft() {
  return readProject();
}

export async function persistProject(project: SiteProject) {
  if (typeof window === "undefined") {
    return { ok: false, cancelled: true };
  }

  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(project));
  return { ok: true, cancelled: false };
}
