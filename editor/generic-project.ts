import type { SiteProject } from "./model";

export const genericProject: SiteProject = {
  id: "untitled-site",
  name: "未命名網站",
  homePageId: "home",
  layoutVersion: 1,
  pages: [
    {
      id: "home",
      name: "首頁",
      slug: "/",
      viewport: {
        desktop: { width: 1440, height: 900 },
        mobile: { width: 390, height: 844 },
      },
      overflow: "hidden",
      background: "#f7f4ee",
      elements: [],
    },
  ],
};
