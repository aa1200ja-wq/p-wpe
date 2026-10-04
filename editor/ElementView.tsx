"use client";

import { motion } from "framer-motion";
import type { SiteElement, ViewportMode } from "./model";
import { motionProps } from "./animation";
import { SpecialElement } from "./SpecialElement";
import { toYouTubeEmbedUrl } from "./youtube-url";

type Props = {
  element: SiteElement;
  viewport: ViewportMode;
  editable?: boolean;
  selected?: boolean;
  onSelect?: (id: string, additive: boolean) => void;
  onAction?: (element: SiteElement) => void;
};

export function ElementView({
  element,
  viewport,
  editable = false,
  selected = false,
  onSelect,
  onAction,
}: Props) {
  const layout = element[viewport];
  if (!layout.visible) return null;

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: layout.x,
    top: layout.y,
    width: layout.width,
    height: layout.height,
    zIndex: layout.zIndex,
    transform: "rotate(" + layout.rotation + "deg)",
    boxSizing: "border-box",
    cursor: !editable && element.action ? "pointer" : undefined,
    ...element.style,
    ...(viewport === "desktop" ? element.desktopStyle : element.mobileStyle),
  };

  return (
    <motion.div
      data-editor-element={editable ? "true" : undefined}
      data-editor-id={editable ? element.id : undefined}
      style={baseStyle}
      className={selected ? "site-element selected" : "site-element"}
      onMouseDown={(event) => {
        if (!editable) return;
        event.stopPropagation();
        onSelect?.(element.id, event.ctrlKey || event.metaKey);
      }}
      onClick={() => {
        if (editable || !element.action) return;
        onAction?.(element);
      }}
      {...motionProps(element.animation)}
    >
      <ElementContent element={element} viewport={viewport} editable={editable} />
    </motion.div>
  );
}

function ElementContent({
  element,
  viewport,
  editable,
}: {
  element: SiteElement;
  viewport: ViewportMode;
  editable: boolean;
}) {
  if (element.type === "image") {
    return <img src={element.content} alt={element.name} draggable={false} />;
  }

  if (element.type === "youtube") {
    const embedUrl = toYouTubeEmbedUrl(element.content);
    if (!embedUrl) {
      return editable ? (
        <div className="media-placeholder">請在右側貼上 YouTube 網址</div>
      ) : null;
    }
    return (
      <iframe
        src={embedUrl}
        title={element.name}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ pointerEvents: editable ? "none" : "auto" }}
      />
    );
  }

  if (element.type === "button") {
    return <button type="button">{element.content}</button>;
  }

  if (element.type === "line") return <span className="line-element" />;
  if (element.type === "shape") return <span className="shape-element" />;

  if (element.type === "component") {
    return (
      <SpecialElement
        name={element.content}
        viewport={viewport}
        settings={element.settings?.[viewport]}
        componentData={element.componentData}
      />
    );
  }

  return <div className="text-element">{element.content}</div>;
}
