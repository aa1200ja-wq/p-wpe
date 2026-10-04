"use client";

import type { SiteElement, SitePage, ViewportMode } from "./model";
import { ElementView } from "./ElementView";

type Props = {
  page: SitePage;
  viewport: ViewportMode;
  editable?: boolean;
  selectedIds?: string[];
  onSelect?: (id: string, additive: boolean) => void;
  onClearSelection?: () => void;
  onAction?: (element: SiteElement) => void;
  scale?: number;
  transformOrigin?: string;
  className?: string;
};

export function SiteRenderer({
  page,
  viewport,
  editable = false,
  selectedIds = [],
  onSelect,
  onClearSelection,
  onAction,
  scale,
  transformOrigin = "center center",
  className = "",
}: Props) {
  const size = page.viewport[viewport];
  const resolvedScale = scale ?? (viewport === "mobile" ? 0.84 : 0.72);

  return (
    <div
      className={"site-stage " + className}
      style={{
        width: size.width,
        height: size.height,
        background: page.background,
        overflow: page.overflow,
        transform: "scale(" + resolvedScale + ")",
        transformOrigin,
      }}
      onMouseDown={(event) => {
        if (editable && event.target === event.currentTarget) onClearSelection?.();
      }}
    >
      {page.elements.map((element) => (
        <ElementView
          key={element.id}
          element={element}
          viewport={viewport}
          editable={editable}
          selected={selectedIds.includes(element.id)}
          onSelect={onSelect}
          onAction={onAction}
        />
      ))}
    </div>
  );
}
