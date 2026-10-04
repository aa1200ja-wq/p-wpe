import type { SiteElement } from "./model";
import { sections } from "@/site/scene-data";

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

const handUrl = "/assets/renwoxing/tap-hand.png";

export function makeNavElements(
  layout: LayoutFactory,
): SiteElement[] {
  return sections.map((section, index) => ({
    id: `nav-${section.id}`,
    type: "text",
    name: `導覽-${section.label}`,
    content: section.label,
    desktop: layout(650 + index * 112, 62, 102, 34, 6),
    mobile: layout(
      18 + (index % 3) * 118,
      338 + Math.floor(index / 3) * 30,
      108,
      24,
      6,
    ),
    action: {
      type: "navigate",
      targetPageId: section.id,
    },
    style: {
      color: "#3d3022",
      fontSize: 15,
      fontWeight: 700,
      whiteSpace: "nowrap",
      textAlign: "center",
      borderBottom: "1px solid rgba(110, 77, 39, .35)",
      paddingBottom: 5,
    },
  }));
}

export function makeHomeExtraElements(
  layout: LayoutFactory,
): SiteElement[] {
  return [
    {
      id: "hero-kicker",
      type: "text",
      name: "首頁英文小標",
      content: "SAXOPHONE ENSEMBLE",
      desktop: layout(235, 78, 230, 26, 6),
      mobile: layout(24, 42, 210, 24, 6),
      animation: {
        preset: "fade",
        duration: 0.8,
        delay: 1.05,
        easing: "easeOut",
        trigger: "page-enter",
      },
      style: {
        color: "#c68b2d",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 1.2,
      },
    },
    {
      id: "hero-video-link",
      type: "text",
      name: "活動影片欣賞",
      content: "▶ 活動影片欣賞",
      desktop: layout(1180, 350, 190, 40, 7),
      mobile: layout(230, 70, 140, 32, 7),
      action: {
        type: "navigate",
        targetPageId: "video",
      },
      animation: {
        preset: "slide-left",
        duration: 0.7,
        delay: 0.75,
        easing: "easeOut",
        trigger: "page-enter",
      },
      style: {
        color: "#d29a3d",
        fontSize: 16,
        fontWeight: 600,
      },
    },
    {
      id: "hero-status",
      type: "text",
      name: "旋律仍在前行",
      content: "旋律，仍在前行。",
      desktop: layout(1180, 465, 210, 32, 7),
      mobile: layout(220, 585, 150, 28, 7),
      animation: {
        preset: "fade-up",
        duration: 0.7,
        delay: 0.9,
        easing: "easeOut",
        trigger: "page-enter",
      },
      style: {
        color: "#e8ddc6",
        fontSize: 16,
        fontWeight: 500,
      },
    },
    {
      id: "hero-status-line",
      type: "line",
      name: "狀態金線",
      content: "",
      desktop: layout(1180, 505, 32, 2, 7),
      mobile: layout(220, 620, 28, 2, 7),
      animation: {
        preset: "fade",
        duration: 0.7,
        delay: 0.45,
        easing: "easeOut",
        trigger: "page-enter",
      },
      style: { background: "#b8832f" },
    },
    {
      id: "hero-meta",
      type: "text",
      name: "PEOPLE MUSIC FURTHER",
      content: "PEOPLE\nMUSIC\nFURTHER",
      desktop: layout(1180, 525, 110, 70, 7),
      mobile: layout(220, 635, 100, 60, 7),
      animation: {
        preset: "fade-up",
        duration: 0.7,
        delay: 1.15,
        easing: "easeOut",
        trigger: "page-enter",
      },
      style: {
        color: "#b88734",
        fontSize: 10,
        lineHeight: 1.45,
        fontWeight: 700,
      },
    },
    {
      id: "tap-hand",
      type: "image",
      name: "手指提示",
      content: handUrl,
      desktop: layout(1095, 670, 120, 150, 8),
      mobile: layout(248, 648, 78, 96, 8),
      action: {
        type: "navigate",
        targetPageId: "about",
      },
      animation: {
        preset: "hand-cycle",
        duration: 7,
        delay: 1.4,
        easing: "easeInOut",
        trigger: "loop",
      },
      style: { objectFit: "contain" },
    },
    {
      id: "tap-label",
      type: "text",
      name: "點一下",
      content: "點一下",
      desktop: layout(1115, 790, 100, 26, 9),
      mobile: layout(262, 732, 74, 22, 9),
      action: {
        type: "navigate",
        targetPageId: "about",
      },
      animation: {
        preset: "blink",
        duration: 3.8,
        delay: 0,
        easing: "easeInOut",
        trigger: "loop",
      },
      style: {
        color: "#efe5d4",
        fontSize: 13,
        fontWeight: 700,
        textAlign: "center",
      },
    },
    {
      id: "tap-play",
      type: "text",
      name: "TAP TO PLAY",
      content: "TAP TO PLAY",
      desktop: layout(1110, 824, 110, 20, 9),
      mobile: layout(252, 760, 94, 18, 9),
      action: {
        type: "navigate",
        targetPageId: "about",
      },
      animation: {
        preset: "blink",
        duration: 4.6,
        delay: 0.5,
        easing: "easeInOut",
        trigger: "loop",
      },
      style: {
        color: "#b9ad9a",
        fontSize: 9,
        fontWeight: 800,
        letterSpacing: 1,
        textAlign: "center",
      },
    },
  ];
}
