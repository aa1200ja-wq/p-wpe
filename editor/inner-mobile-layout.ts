import { sections } from "@/site/scene-data";
import type {
  ElementLayout,
  SiteElement,
  SiteProject,
} from "./model";

const MOBILE_LAYOUT_VERSION = 2;
const innerIds = new Set(sections.map((section) => section.id));
const navIds = sections.map((section) => "nav-" + section.id);

function patchElement(
  element: SiteElement,
  mobile: Partial<ElementLayout>,
  mobileStyle?: Record<string, string | number>,
) {
  return {
    ...element,
    mobile: { ...element.mobile, ...mobile },
    mobileStyle: mobileStyle
      ? { ...element.mobileStyle, ...mobileStyle }
      : element.mobileStyle,
  };
}

function sharedMobile(element: SiteElement) {
  if (element.id === "book-background") {
    return patchElement(element, {
      x: 0,
      y: 193,
      width: 390,
      height: 651,
    });
  }

  if (element.id === "side-vinyl") {
    return patchElement(element, {
      x: 30,
      y: -80,
      width: 330,
      height: 330,
    });
  }

  if (element.id === "back-home") {
    return patchElement(element, {
      x: 220,
      y: 790,
      width: 145,
      height: 38,
    }, {
      fontSize: 14,
    });
  }

  const navIndex = navIds.indexOf(element.id);
  if (navIndex >= 0) {
    return patchElement(element, {
      x: 14,
      y: 225 + navIndex * 51,
      width: 108,
      height: 36,
    }, {
      fontSize: 14,
      lineHeight: 1.2,
      textAlign: "center",
      paddingBottom: 8,
    });
  }

  if (element.id === "eyebrow") {
    return patchElement(element, {
      x: 150,
      y: 222,
      width: 215,
      height: 24,
    }, {
      fontSize: 12,
      letterSpacing: 3,
    });
  }

  if (element.id === "title") {
    return patchElement(element, {
      x: 150,
      y: 252,
      width: 215,
      height: 98,
    }, {
      fontSize: 24,
      lineHeight: 1.32,
    });
  }

  if (element.id === "page-index") {
    return patchElement(element, {
      x: 24,
      y: 758,
      width: 90,
      height: 58,
    }, {
      fontSize: 40,
      lineHeight: 1,
    });
  }

  return element;
}

function bodyY(pageId: string) {
  if (pageId === "members") return 605;
  if (pageId === "contact") return 535;
  if (pageId === "about") return 525;
  return 500;
}

function visualMobile(element: SiteElement, pageId: string) {
  if (element.id === "body") {
    return patchElement(element, {
      x: 150,
      y: bodyY(pageId),
      width: 215,
      height: 105,
    }, {
      fontSize: 14,
      lineHeight: 1.7,
    });
  }

  if (pageId === "events" && element.id.startsWith("activity-photo-")) {
    const index = Number(element.id.replace("activity-photo-", ""));
    const layouts: Record<number, Partial<ElementLayout>> = {
      1: { x: 150, y: 355, width: 215, height: 135 },
      2: { x: 142, y: 590, width: 108, height: 125 },
      3: { x: 258, y: 590, width: 108, height: 125 },
    };
    return patchElement(element, layouts[index] ?? {});
  }

  if (pageId === "members" && element.id === "section-visual") {
    return patchElement(element, {
      x: 145,
      y: 360,
      width: 225,
      height: 225,
    });
  }

  if (pageId === "about" && element.id === "section-visual") {
    return patchElement(element, {
      x: 155,
      y: 350,
      width: 205,
      height: 165,
    }, {
      fontSize: 125,
      lineHeight: 1,
      textAlign: "center",
    });
  }

  if (pageId === "booking" && element.id === "section-visual") {
    return patchElement(element, {
      x: 150,
      y: 365,
      width: 215,
      height: 110,
    }, {
      fontSize: 44,
      lineHeight: 1.1,
    });
  }

  if (pageId === "video" && element.id === "section-visual") {
    return patchElement(element, {
      x: 150,
      y: 365,
      width: 180,
      height: 92,
    }, {
      fontSize: 46,
    });
  }

  if (pageId === "contact" && element.id.startsWith("contact-item-")) {
    const index = Number(element.id.replace("contact-item-", "")) - 1;
    return patchElement(element, {
      x: 150,
      y: 365 + index * 54,
      width: 215,
      height: 42,
    }, {
      fontSize: 18,
      lineHeight: 1.2,
    });
  }

  return element;
}

function applyPageMobileLayout(page: SiteProject["pages"][number]) {
  if (!innerIds.has(page.id as (typeof sections)[number]["id"])) {
    return page;
  }

  return {
    ...page,
    elements: page.elements.map((element) =>
      visualMobile(sharedMobile(element), page.id),
    ),
  };
}

export function migrateInnerMobileLayout(project: SiteProject): SiteProject {
  if ((project.layoutVersion ?? 0) >= MOBILE_LAYOUT_VERSION) {
    return project;
  }

  return {
    ...project,
    layoutVersion: MOBILE_LAYOUT_VERSION,
    pages: project.pages.map(applyPageMobileLayout),
  };
}
