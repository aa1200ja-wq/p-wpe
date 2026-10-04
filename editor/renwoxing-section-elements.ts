import type { SiteElement } from "./model";

type LayoutFactory = (
  x: number,
  y: number,
  width: number,
  height: number,
  zIndex?: number,
) => {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  visible: boolean;
};

export function makeContactElements(
  layout: LayoutFactory,
): SiteElement[] {
  const items = ["01 演出邀約", "02 活動合作", "03 社團交流"];

  return items.map((content, index) => ({
    id: `contact-item-${index + 1}`,
    type: "text",
    name: `聯絡項目 ${index + 1}`,
    content,
    desktop: layout(1100, 560 + index * 72, 360, 62, 4),
    mobile: layout(70, 650 + index * 48, 250, 42, 4),
    style: {
      color: "#986626",
      fontSize: 54,
      lineHeight: 1.15,
      fontWeight: 500,
    },
  }));
}

export function makeEventElements(
  layout: LayoutFactory,
): SiteElement[] {
  return [1, 2, 3].map((number, index) => ({
    id: `activity-photo-${number}`,
    type: "image",
    name: `活動照片 ${number}`,
    content: `/assets/renwoxing/activity-0${number}.webp`,
    desktop: layout(860 + index * 205, 600, 190, 230, 5),
    mobile: layout(24 + index * 112, 655, 104, 140, 5),
    action: { type: "lightbox" },
    animation: {
      preset: "hover-scale",
      duration: 0.35,
      delay: 0,
      easing: "easeOut",
      trigger: "hover",
    },
    style: { objectFit: "cover" },
  }));
}
