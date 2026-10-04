import type { SiteProject } from "@/editor/model";

export const SUPABASE_URL =
  "https://fgjhpwoyybmruvtlnbbh.supabase.co";
export const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnamhwd295eWJtcnV2dGxuYmJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2OTUwNzgsImV4cCI6MjEwNjI3MTA3OH0._9qQcT3Oi8_ebUJwJuA8c-yumIulT0aDJEIsCZxYMbA";

type StoredRow = { data: SiteProject };

function headers(token?: string) {
  const value: Record<string, string> = {
    apikey: SUPABASE_KEY,
    Authorization: "Bearer " + SUPABASE_KEY,
    "Content-Type": "application/json",
  };
  if (token) value["x-editor-token"] = token;
  return value;
}

async function readProject(
  table: "site_drafts" | "site_published",
  id: string,
  token?: string,
) {
  const url =
    SUPABASE_URL +
    "/rest/v1/" +
    table +
    "?id=eq." +
    encodeURIComponent(id) +
    "&select=data&limit=1";
  const response = await fetch(url, {
    headers: headers(token),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Supabase read failed: " + (await response.text()));
  }
  const rows = (await response.json()) as StoredRow[];
  return rows[0]?.data ?? null;
}

async function upsertProject(
  table: "site_drafts" | "site_published",
  project: SiteProject,
  token: string,
) {
  const response = await fetch(
    SUPABASE_URL + "/rest/v1/" + table + "?on_conflict=id",
    {
      method: "POST",
      headers: {
        ...headers(token),
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({
        id: project.id,
        data: project,
        updated_at: new Date().toISOString(),
      }),
      cache: "no-store",
    },
  );
  if (!response.ok) {
    throw new Error("Supabase write failed: " + (await response.text()));
  }
}

export function getDraftProject(id: string, token: string) {
  return readProject("site_drafts", id, token);
}

export function getPublishedProject(id: string) {
  return readProject("site_published", id);
}

export function saveDraft(project: SiteProject, token: string) {
  return upsertProject("site_drafts", project, token);
}

export async function publishProject(project: SiteProject, token: string) {
  await upsertProject("site_drafts", project, token);
  await upsertProject("site_published", project, token);
}
