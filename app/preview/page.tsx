"use client";

import { useState } from "react";
import { SiteRenderer } from "@/editor/SiteRenderer";
import { sampleProject } from "@/editor/sample-project";
import type { ViewportMode } from "@/editor/model";

export default function PreviewPage() {
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const page = sampleProject.pages[0];
  return (
    <main className="preview-shell">
      <div className="preview-toolbar">
        <strong>前台 Renderer</strong>
        <div>
          <button onClick={() => setViewport("desktop")}>桌機</button>
          <button onClick={() => setViewport("mobile")}>手機</button>
        </div>
      </div>
      <div className="preview-stage"><SiteRenderer page={page} viewport={viewport} /></div>
    </main>
  );
}
