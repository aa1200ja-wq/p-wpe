import type { SiteProject } from "@/editor/model";
import {
  getDraftProject,
  publishProject,
  saveDraft,
} from "@/lib/supabase-site-store";

const PROJECT_ID = "renwoxing";

function tokenFrom(request: Request) {
  return request.headers.get("x-editor-token")?.trim() ?? "";
}

export async function GET(request: Request) {
  const token = tokenFrom(request);
  if (!token) {
    return Response.json({ error: "missing editor token" }, { status: 401 });
  }

  try {
    const project = await getDraftProject(PROJECT_ID, token);
    return Response.json({ project });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "load failed" },
      { status: 403 },
    );
  }
}

export async function POST(request: Request) {
  const token = tokenFrom(request);
  if (!token) {
    return Response.json({ error: "missing editor token" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      action?: "save" | "publish";
      project?: SiteProject;
    };
    if (!body.project || body.project.id !== PROJECT_ID) {
      return Response.json({ error: "invalid project" }, { status: 400 });
    }

    if (body.action === "publish") {
      await publishProject(body.project, token);
    } else {
      await saveDraft(body.project, token);
    }

    return Response.json({ ok: true, action: body.action ?? "save" });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "save failed" },
      { status: 403 },
    );
  }
}
