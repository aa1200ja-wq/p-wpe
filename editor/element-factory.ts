import type {
  ElementLayout,
  ElementType,
  SiteElement,
  SitePage,
  ViewportMode,
} from "./model";

export type AddableElementType = Exclude<ElementType, "component">;

const defaults: Record<
  AddableElementType,
  { name: string; content: string; width: number; height: number }
> = {
  text: {
    name: "文字",
    content: "新文字",
    width: 320,
    height: 96,
  },
  image: {
    name: "圖片",
    content: "/assets/renwoxing/activity-01.webp",
    width: 360,
    height: 260,
  },
  youtube: {
    name: "YouTube",
    content: "",
    width: 480,
    height: 270,
  },
  button: {
    name: "按鈕",
    content: "新按鈕",
    width: 180,
    height: 52,
  },
  line: {
    name: "線條",
    content: "",
    width: 260,
    height: 2,
  },
};

function centeredLayout(
  page: SitePage,
  viewport: ViewportMode,
  width: number,
  height: number,
): ElementLayout {
  const size = page.viewport[viewport];
  const safeWidth = Math.min(width, size.width - 40);
  const safeHeight = Math.min(height, size.height - 40);

  return {
    x: Math.round((size.width - safeWidth) / 2),
    y: Math.round((size.height - safeHeight) / 2),
    width: safeWidth,
    height: safeHeight,
    rotation: 0,
    zIndex: 20,
    visible: true,
  };
}

export function createElement(
  type: AddableElementType,
  page: SitePage,
): SiteElement {
  const config = defaults[type];
  const base: SiteElement = {
    id: `${type}-${Date.now()}`,
    type,
    name: config.name,
    content: config.content,
    desktop: centeredLayout(
      page,
      "desktop",
      config.width,
      config.height,
    ),
    mobile: centeredLayout(
      page,
      "mobile",
      Math.min(config.width, 300),
      Math.min(config.height, 180),
    ),
  };

  if (type === "text") {
    base.style = {
      color: "#17110c",
      fontSize: 44,
      lineHeight: 1.2,
      fontWeight: 500,
    };
  }

  if (type === "image") {
    base.style = { objectFit: "cover" };
  }

  if (type === "button") {
    base.style = {
      color: "#8f642b",
      borderColor: "#8f642b",
    };
  }

  if (type === "line") {
    base.style = { background: "#8f642b" };
  }

  return base;
}
