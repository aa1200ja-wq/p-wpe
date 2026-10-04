import { sections } from "@/site/scene-data";
import type { SiteElement, SiteProject } from "./model";

const innerPageIds = new Set(sections.map((section) => section.id));
const navIds = sections.map((section) => "nav-" + section.id);

const sharedTemplateIds = new Set([
  "book-background",
  "side-vinyl",
  "back-home",
  "eyebrow",
  "title",
  "body",
  "page-index",
  ...navIds,
]);

const sharedContentIds = new Set([
  "book-background",
  "back-home",
  ...navIds,
]);

export function isInnerPage(pageId: string) {
  return innerPageIds.has(pageId as (typeof sections)[number]["id"]);
}

export function canSyncInnerElement(
  pageId: string,
  elementId: string | null,
) {
  return Boolean(
    elementId &&
    isInnerPage(pageId) &&
    sharedTemplateIds.has(elementId),
  );
}

export function shouldSyncInnerContent(
  pageId: string,
  elementId: string | null,
) {
  return Boolean(
    elementId &&
    isInnerPage(pageId) &&
    sharedContentIds.has(elementId),
  );
}

function cloneTemplateProps(
  source: SiteElement,
  target: SiteElement,
): SiteElement {
  return {
    ...target,
    desktop: { ...source.desktop },
    mobile: { ...source.mobile },
    style: source.style ? { ...source.style } : undefined,
    desktopStyle: source.desktopStyle
      ? { ...source.desktopStyle }
      : undefined,
    mobileStyle: source.mobileStyle
      ? { ...source.mobileStyle }
      : undefined,
    settings: source.settings
      ? {
          desktop: source.settings.desktop
            ? { ...source.settings.desktop }
            : undefined,
          mobile: source.settings.mobile
            ? { ...source.settings.mobile }
            : undefined,
        }
      : undefined,
    animation: source.animation ? { ...source.animation } : undefined,
  };
}

export function applyInnerTemplate(
  project: SiteProject,
  sourcePageId: string,
) {
  if (!isInnerPage(sourcePageId)) return project;

  const source = project.pages.find((page) => page.id === sourcePageId);
  if (!source) return project;

  const sourceElements = new Map(
    source.elements
      .filter((element) => sharedTemplateIds.has(element.id))
      .map((element) => [element.id, element]),
  );

  return {
    ...project,
    pages: project.pages.map((page) => {
      if (!isInnerPage(page.id) || page.id === sourcePageId) return page;

      return {
        ...page,
        elements: page.elements.map((element) => {
          const sourceElement = sourceElements.get(element.id);
          if (!sourceElement) return element;
          return cloneTemplateProps(sourceElement, element);
        }),
      };
    }),
  };
}
