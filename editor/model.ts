export type ViewportMode = "desktop" | "mobile";
export type ElementType =
  | "text"
  | "image"
  | "youtube"
  | "button"
  | "line"
  | "component";

export type ViewportSize = {
  width: number;
  height: number;
};

export type ElementLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  visible: boolean;
};

export type AnimationTrigger = "page-enter" | "hover" | "loop";
export type AnimationPreset =
  | "none"
  | "fade"
  | "fade-up"
  | "slide-left"
  | "slide-right"
  | "scale"
  | "spin"
  | "blink"
  | "hand-cycle"
  | "hover-scale";

export type AnimationSpec = {
  preset: AnimationPreset;
  duration: number;
  delay: number;
  easing: string;
  trigger: AnimationTrigger;
};

export type SiteAction =
  | { type: "navigate"; targetPageId: string }
  | { type: "lightbox" };

export type MemberItem = {
  id: string;
  name: string;
  role: string;
  cover: string;
  detail: string;
};

export type MemberModalConfig = {
  width: number;
  height: number;
  fit: "contain" | "cover";
};

export type MemberCarouselData = {
  members?: MemberItem[];
  modal?: Partial<Record<ViewportMode, MemberModalConfig>>;
};

export type ComponentData = {
  memberCarousel?: MemberCarouselData;
};

export type SiteElement = {
  id: string;
  type: ElementType;
  name: string;
  content: string;
  desktop: ElementLayout;
  mobile: ElementLayout;
  style?: Record<string, string | number>;
  desktopStyle?: Record<string, string | number>;
  mobileStyle?: Record<string, string | number>;
  settings?: Partial<
    Record<
      ViewportMode,
      Record<string, string | number | boolean>
    >
  >;
  componentData?: ComponentData;
  animation?: AnimationSpec;
  action?: SiteAction;
};

export type SitePage = {
  id: string;
  name: string;
  viewport: Record<ViewportMode, ViewportSize>;
  overflow: "hidden" | "visible";
  background: string;
  elements: SiteElement[];
};

export type SiteProject = {
  id: string;
  name: string;
  layoutVersion?: number;
  pages: SitePage[];
};
