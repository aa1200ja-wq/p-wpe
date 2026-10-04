import type { SiteProject } from "./model";

export function renameProjectPage(
  project: SiteProject,
  pageId: string,
  name: string,
): SiteProject {
  const nextName = name.trim();
  if (!nextName) return project;

  return {
    ...project,
    pages: project.pages.map((page) =>
      page.id === pageId ? { ...page, name: nextName } : page,
    ),
  };
}
