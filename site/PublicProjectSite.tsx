"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  SiteElement,
  SiteProject,
  ViewportMode,
} from "@/editor/model";
import { SiteRenderer } from "@/editor/SiteRenderer";
import { migrateInnerMobileLayout } from "@/editor/inner-mobile-layout";
import { PublicLightbox } from "./PublicLightbox";

export function PublicProjectSite({ project }: { project: SiteProject }) {
  const normalizedProject = useMemo(
    () => migrateInnerMobileLayout(project),
    [project],
  );
  const [pageId, setPageId] = useState(normalizedProject.pages[0].id);
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [scale, setScale] = useState(1);
  const [lightbox, setLightbox] = useState<SiteElement | null>(null);

  const page = useMemo(
    () =>
      normalizedProject.pages.find((item) => item.id === pageId) ??
      normalizedProject.pages[0],
    [pageId, normalizedProject.pages],
  );

  useEffect(() => {
    function syncViewport() {
      const next: ViewportMode =
        window.innerWidth <= 700 ? "mobile" : "desktop";
      const size = page.viewport[next];
      setViewport(next);
      setScale(
        Math.min(
          window.innerWidth / size.width,
          window.innerHeight / size.height,
        ),
      );
    }

    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, [page]);

  function handleAction(element: SiteElement) {
    if (element.action?.type === "navigate") {
      setLightbox(null);
      setPageId(element.action.targetPageId);
      return;
    }
    if (element.action?.type === "lightbox") setLightbox(element);
  }

  const size = page.viewport[viewport];

  return (
    <main className="public-site-shell">
      <div
        className="public-stage-frame"
        style={{ width: size.width * scale, height: size.height * scale }}
      >
        <SiteRenderer
          page={page}
          viewport={viewport}
          scale={scale}
          transformOrigin="top left"
          className="public-site-stage"
          onAction={handleAction}
        />
      </div>
      {lightbox && (
        <PublicLightbox
          element={lightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </main>
  );
}
