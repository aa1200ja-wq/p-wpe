import type { SiteProject } from "./model";

export const sampleProject: SiteProject = {
  id: "renwoxing",
  name: "任我行薩克斯風社",
  pages: [{
    id: "home",
    name: "首頁",
    viewport: {
      desktop: { width: 1440, height: 900 },
      mobile: { width: 390, height: 844 },
    },
    overflow: "hidden",
    background: "#090806",
    elements: [
      {
        id: "vertical-title",
        type: "text",
        name: "直式標題",
        content: "任\n我\n行",
        desktop: { x: 82, y: 180, width: 120, height: 420, rotation: 0, zIndex: 4, visible: true },
        mobile: { x: 24, y: 80, width: 64, height: 260, rotation: 0, zIndex: 4, visible: true },
        style: { color: "#d8b56a", fontSize: 72, lineHeight: 1.15, fontWeight: 700 },
        animation: { preset: "fade-up", duration: 0.8, delay: 0.1, easing: "easeOut", trigger: "page-enter" },
      },
      {
        id: "vinyl",
        type: "image",
        name: "大型黑膠",
        content: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=1200&q=80",
        desktop: { x: 340, y: 70, width: 760, height: 760, rotation: 0, zIndex: 2, visible: true },
        mobile: { x: 38, y: 190, width: 330, height: 330, rotation: 0, zIndex: 2, visible: true },
        style: { borderRadius: "50%", objectFit: "cover" },
        animation: { preset: "spin", duration: 18, delay: 0, easing: "linear", trigger: "loop" },
      },
      {
        id: "cta",
        type: "button",
        name: "播放提示",
        content: "TAP TO PLAY",
        desktop: { x: 1120, y: 420, width: 190, height: 52, rotation: 0, zIndex: 5, visible: true },
        mobile: { x: 105, y: 650, width: 180, height: 50, rotation: 0, zIndex: 5, visible: true },
        style: { color: "#f3ead8", borderColor: "#d8b56a" },
        animation: { preset: "fade", duration: 1, delay: 0.5, easing: "easeOut", trigger: "page-enter" },
      },
      {
        id: "gold-line",
        type: "line",
        name: "金色線條",
        content: "",
        desktop: { x: 1085, y: 490, width: 240, height: 2, rotation: 0, zIndex: 3, visible: true },
        mobile: { x: 85, y: 720, width: 220, height: 2, rotation: 0, zIndex: 3, visible: true },
        style: { background: "#d8b56a" },
      }
    ]
  }]
};
