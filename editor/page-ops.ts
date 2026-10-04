import type { SitePage, SiteProject } from "./model";

function uid(prefix: string) {
  return prefix + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function makeBlankPage(source: SitePage, name: string): SitePage {
  return {
    id: uid("page"),
    name,
    slug: undefined,
    viewport: clone(source.viewport),
    overflow: source.overflow,
    background: source.background,
    elements: [],
  };
}

export function duplicatePage(source: SitePage): SitePage {
  const page = clone(source);
  const stamp = Date.now();
  return {
    ...page,
    id: uid("page"),
    name: source.name + " 複製",
    slug: undefined,
    elements: page.elements.map((element, index) => ({
      ...element,
      id: element.id + "-copy-" + stamp + "-" + index,
    })),
  };
}

export function removePageAndLinks(
  project: SiteProject,
  pageId: string,
): SiteProject {
  const pages = project.pages
    .filter((page) => page.id !== pageId)
    .map((page) => ({
      ...page,
      elements: page.elements.map((element) =>
        element.action?.type === "navigate" &&
        element.action.targetPageId === pageId
          ? { ...element, action: undefined }
          : element,
      ),
    }));

  return {
    ...project,
    pages,
    homePageId:
      project.homePageId === pageId ? pages[0]?.id : project.homePageId,
  };
}

export function movePage(
  project: SiteProject,
  pageId: string,
  direction: -1 | 1,
): SiteProject {
  const index = project.pages.findIndex((page) => page.id === pageId);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= project.pages.length) return project;
  const pages = [...project.pages];
  [pages[index], pages[target]] = [pages[target], pages[index]];
  return { ...project, pages };
}
