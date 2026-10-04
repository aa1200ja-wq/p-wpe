"use client";

import type { SiteElement } from "@/editor/model";
import "./mobile-activity-strip.css";

type Props = {
  elements: SiteElement[];
  pageWidth: number;
  onAction?: (element: SiteElement) => void;
};

export function MobileActivityStrip({
  elements,
  pageWidth,
  onAction,
}: Props) {
  if (!elements.length) return null;
  const left = Math.min(...elements.map((item) => item.mobile.x));
  const top = Math.min(...elements.map((item) => item.mobile.y));
  const height = Math.max(...elements.map((item) => item.mobile.height));
  const width = Math.max(180, pageWidth - left - 24);

  return (
    <div
      className="mobile-activity-strip"
      style={{ left, top, width, height }}
      aria-label="活動照片，可左右滑動"
    >
      {elements.map((element, index) => (
        <button
          key={element.id}
          type="button"
          onClick={() => onAction?.(element)}
          aria-label={"放大活動照片 " + (index + 1)}
        >
          <img src={element.content} alt={element.name} />
          <span>{String(index + 1).padStart(2, "0")}</span>
        </button>
      ))}
    </div>
  );
}
