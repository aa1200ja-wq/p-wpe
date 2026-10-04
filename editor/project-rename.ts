import type { SiteProject } from "./model";

export function renameProjectPage(
  project: SiteProject,
  pageId: string,
  name: string,
): SiteProject {
  const nextName = name.trim();
  if (!nextName) return project;
  const navId = "nav-" + pageId;

  return {
    ...project,
    pages: project.pages.map((page) => ({
      ...page,
      name: page.id === pageId ? nextName : page.name,
      elements: page.elements.map((element) =>
        element.id === navId
          ? {
              ...element,
              name: "導覽-" + nextName,
              content: nextName,
            }
          : element,
      ),
    })),
  };
}
