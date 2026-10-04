import type { SiteElement, SitePage, SiteProject } from "./model";

export type EditorClipboard = {
  elements: SiteElement[];
  mode: "copy" | "cut";
};

export function cloneElements(elements: SiteElement[]) {
  return JSON.parse(JSON.stringify(elements)) as SiteElement[];
}

export function makePastedElements(clipboard: EditorClipboard) {
  const stamp = Date.now();
  const offset = clipboard.mode === "copy" ? 20 : 0;
  return cloneElements(clipboard.elements).map((element, index) => ({
    ...element,
    id: element.id + "-copy-" + stamp + "-" + index,
    desktop: {
      ...element.desktop,
      x: element.desktop.x + offset,
      y: element.desktop.y + offset,
    },
    mobile: {
      ...element.mobile,
      x: element.mobile.x + offset,
      y: element.mobile.y + offset,
    },
  }));
}

export function makeBlankPage(source: SitePage, name: string): SitePage {
  return {
    id: "page-" + Date.now(),
    name,
    viewport: JSON.parse(JSON.stringify(source.viewport)),
    overflow: source.overflow,
    background: source.background,
    elements: [],
  };
}

export function removePageAndLinks(
  project: SiteProject,
  pageId: string,
): SiteProject {
  return {
    ...project,
    pages: project.pages
      .filter((page) => page.id !== pageId)
      .map((page) => ({
        ...page,
        elements: page.elements.map((element) =>
          element.action?.type === "navigate" &&
          element.action.targetPageId === pageId
            ? { ...element, action: undefined }
            : element,
        ),
      })),
  };
}
