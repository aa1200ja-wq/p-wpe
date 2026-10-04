"use client";

import type { SiteElement } from "@/editor/model";
import "./public-lightbox.css";

export function PublicLightbox({
  element,
  onClose,
}: {
  element: SiteElement;
  onClose: () => void;
}) {
  return (
    <div
      className="public-lightbox-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={element.name}
      onClick={onClose}
    >
      <div
        className="public-lightbox"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="public-lightbox-close"
          aria-label="關閉照片"
          onClick={onClose}
        >
          ×
        </button>
        <img src={element.content} alt={element.name} />
      </div>
    </div>
  );
}
