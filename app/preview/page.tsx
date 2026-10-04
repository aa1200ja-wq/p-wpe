"use client";

import { useEffect, useState } from "react";
import { genericProject } from "@/editor/generic-project";
import type { SiteProject } from "@/editor/model";
import { loadDraft } from "@/editor/project-storage";
import { PublicProjectSite } from "@/site/PublicProjectSite";

export default function PreviewPage() {
  const [project, setProject] = useState<SiteProject>(genericProject);

  useEffect(() => {
    loadDraft().then((draft) => {
      if (draft?.pages?.length) setProject(draft);
    });
  }, []);

  return <PublicProjectSite project={project} />;
}
