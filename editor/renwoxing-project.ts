import type { SiteElement, SitePage, SiteProject } from "./model";
import { defaultMemberCarouselData } from "./member-config";
import { sections } from "@/site/scene-data";
import {
  makeHomeExtraElements,
  makeNavElements,
} from "./renwoxing-page-elements";
import {
  makeContactElements,
  makeEventElements,
} from "./renwoxing-section-elements";

const heroBackground = "/assets/renwoxing/hero-surface.jpg";
const bookBackground = "/assets/renwoxing/album-spread.webp";

const layout = (
  x: number,
  y: number,
  width: number,
  height: number,
  zIndex = 3,
) => ({ x, y, width, height, rotation: 0, zIndex, visible: true });

function sharedInnerElements(): SiteElement[] {
  return [
    {
      id: "book-background",
      type: "image",
      name: "書頁底圖",
      content: bookBackground,
      desktop: layout(520, 0, 1080, 900, 1),
      mobile: layout(0, 310, 390, 534, 1),
      style: { objectFit: "cover" },
    },
    {
      id: "side-vinyl",
      type: "component",
      name: "左側黑膠",
      content: "vinyl-compact",
      desktop: layout(-110, 165, 620, 620, 2),
      mobile: layout(-115, 70, 300, 300, 2),
      action: { type: "navigate", targetPageId: "home" },
    },
    {
      id: "back-home",
      type: "button",
      name: "回到唱片",
      content: "← 回到唱片",
      desktop: layout(1410, 830, 150, 40, 6),
      mobile: layout(220, 790, 145, 38, 6),
      action: { type: "navigate", targetPageId: "home" },
      style: { color: "#5e4a32", borderColor: "transparent" },
    },
  ];
}

function sectionVisuals(index: number): SiteElement[] {
  const id = sections[index].id;

  if (id === "events") {
    return makeEventElements(layout);
  }

  if (id === "contact") {
    return makeContactElements(layout);
  }

  if (id === "members") {
    return [{
      id: "section-visual",
      type: "component",
      name: "人物輪播",
      content: "members",
      desktop: layout(850, 600, 700, 250, 5),
      mobile: layout(20, 635, 350, 180, 5),
      settings: {
        desktop: { speed: 42 },
        mobile: { speed: 120 },
      },
      componentData: {
        memberCarousel: defaultMemberCarouselData(),
      },
    }];
  }

  const content = id === "about"
    ? "任"
    : id === "booking"
      ? "LIVE"
      : id === "video"
        ? "▶"
        : "01 演出邀約\n02 活動合作\n03 社團交流";

  return [{
    id: "section-visual",
    type: id === "video" ? "button" : "text",
    name: "章節視覺",
    content,
    desktop: layout(1100, 560, 360, 250, 4),
    mobile: layout(70, 650, 260, 150, 4),
    style: {
      color: id === "about" ? "rgba(145,103,49,.14)" : "#986626",
      fontSize: id === "about" ? 210 : 54,
      lineHeight: 1.2,
      fontWeight: 500,
    },
  }];
}

function makeInnerPage(index: number): SitePage {
  const section = sections[index];
  return {
    id: section.id,
    name: section.label,
    viewport: {
      desktop: { width: 1600, height: 900 },
      mobile: { width: 390, height: 844 },
    },
    overflow: "hidden",
    background: "#080706",
    elements: [
      ...sharedInnerElements(),
      ...makeNavElements(layout),
      {
        id: "eyebrow",
        type: "text",
        name: "英文小標",
        content: section.eyebrow,
        desktop: layout(650, 205, 260, 32, 5),
        mobile: layout(24, 420, 180, 26, 5),
        style: { color: "#9f6922", fontSize: 13, letterSpacing: 4, fontWeight: 700 },
      },
      {
        id: "title",
        type: "text",
        name: "主標題",
        content: section.title,
        desktop: layout(650, 250, 690, 250, 5),
        mobile: layout(24, 455, 340, 150, 5),
        style: { color: "#17110c", fontSize: 70, lineHeight: 1.08, fontWeight: 500 },
      },
      {
        id: "body",
        type: "text",
        name: "內文",
        content: section.body,
        desktop: layout(650, 530, 560, 100, 5),
        mobile: layout(24, 595, 340, 72, 5),
        style: { color: "#5f5140", fontSize: 17, lineHeight: 1.8 },
      },
      {
        id: "page-index",
        type: "text",
        name: "頁碼",
        content: "0" + (index + 1),
        desktop: layout(1240, 220, 210, 120, 4),
        mobile: layout(270, 410, 90, 70, 4),
        style: { color: "rgba(132,91,37,.13)", fontSize: 100 },
      },
      ...sectionVisuals(index),
    ],
  };
}

const home: SitePage = {
  id: "home",
  name: "首頁",
  viewport: {
    desktop: { width: 1600, height: 900 },
    mobile: { width: 390, height: 844 },
  },
  overflow: "hidden",
  background: "#070706",
  elements: [
    ...makeHomeExtraElements(layout),
    {
      id: "hero-background",
      type: "image",
      name: "黑金首頁底圖",
      content: heroBackground,
      desktop: layout(0, 0, 1600, 900, 1),
      mobile: layout(0, 0, 390, 844, 1),
      animation: {
        preset: "fade",
        duration: 0.8,
        delay: 0,
        easing: "easeOut",
        trigger: "page-enter",
      },
      style: { objectFit: "cover" },
    },
    {
      id: "vertical-title",
      type: "text",
      name: "直式任我行",
      content: "任\n我\n行",
      desktop: layout(235, 250, 120, 340, 5),
      mobile: layout(28, 105, 78, 260, 5),
      animation: {
        preset: "slide-right",
        duration: 0.8,
        delay: 0.55,
        easing: "easeOut",
        trigger: "page-enter",
      },
      style: { color: "#f1eadc", fontSize: 82, lineHeight: .92, fontWeight: 700 },
    },
    {
      id: "hero-vinyl",
      type: "component",
      name: "首頁黑膠",
      content: "vinyl",
      desktop: layout(420, 80, 720, 720, 3),
      mobile: layout(35, 210, 330, 330, 3),
      action: { type: "navigate", targetPageId: "about" },
      animation: {
        preset: "scale",
        duration: 0.9,
        delay: 0.7,
        easing: "easeOut",
        trigger: "page-enter",
      },
    },
    {
      id: "hero-tagline",
      type: "text",
      name: "首頁標語",
      content: "把每一段旋律\n刻進值得被記住的時光。",
      desktop: layout(245, 720, 360, 100, 5),
      mobile: layout(24, 730, 220, 80, 5),
      animation: {
        preset: "fade-up",
        duration: 0.75,
        delay: 1.0,
        easing: "easeOut",
        trigger: "page-enter",
      },
      style: { color: "#efe5d4", fontSize: 18, lineHeight: 1.5, fontWeight: 600 },
    },
  ],
};

export const renwoxingProject: SiteProject = {
  id: "renwoxing",
  name: "任我行薩克斯風社",
  pages: [home, ...sections.map((_, index) => makeInnerPage(index))],
};
