import type {
  ElementLayout,
  ElementType,
  SiteElement,
  SitePage,
  ViewportMode,
} from "./model";

export type AddableElementType = Exclude<ElementType, "component">;

const placeholderImage =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"><rect width="100%" height="100%" fill="#e7e2d8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#777" font-family="Arial" font-size="34">IMAGE</text></svg>',
  );

const defaults: Record<
  AddableElementType,
  { name: string; content: string; width: number; height: number }
> = {
  text: { name: "文字", content: "輸入文字", width: 360, height: 96 },
  image: { name: "圖片", content: placeholderImage, width: 420, height: 280 },
  youtube: { name: "YouTube", content: "", width: 480, height: 270 },
  button: { name: "按鈕", content: "按鈕文字", width: 180, height: 52 },
  line: { name: "線條", content: "", width: 260, height: 2 },
  shape: { name: "形狀", content: "", width: 220, height: 160 },
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
  const highest = Math.max(0, ...page.elements.map((item) => item[viewport].zIndex));

  return {
    x: Math.round((size.width - safeWidth) / 2),
    y: Math.round((size.height - safeHeight) / 2),
    width: safeWidth,
    height: safeHeight,
    rotation: 0,
    zIndex: highest + 1,
    visible: true,
  };
}

export function createElement(
  type: AddableElementType,
  page: SitePage,
): SiteElement {
  const config = defaults[type];
  const base: SiteElement = {
    id: type + "-" + Date.now(),
    type,
    name: config.name,
    content: config.content,
    desktop: centeredLayout(page, "desktop", config.width, config.height),
    mobile: centeredLayout(
      page,
      "mobile",
      Math.min(config.width, 300),
      Math.min(config.height, 180),
    ),
  };

  if (type === "text") {
    base.style = { color: "#171717", fontSize: 44, lineHeight: 1.2, fontWeight: 500 };
  }
  if (type === "image") {
    base.style = { objectFit: "cover", borderRadius: 0 };
  }
  if (type === "button") {
    base.style = {
      color: "#ffffff",
      background: "#171717",
      borderColor: "#171717",
      borderRadius: 8,
    };
  }
  if (type === "line") base.style = { background: "#171717" };
  if (type === "shape") {
    base.style = {
      background: "#d9d4c8",
      borderColor: "#b9b2a4",
      borderWidth: 1,
      borderStyle: "solid",
      borderRadius: 12,
    };
  }

  return base;
}
