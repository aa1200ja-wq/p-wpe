"use client";

import { InspectorDisclosure } from "./InspectorDisclosure";
import { InspectorLayoutControls } from "./InspectorLayoutControls";
import { InspectorTypography } from "./InspectorTypography";
import { MemberManager } from "./MemberManager";
import type {
  ComponentData,
  ElementLayout,
  SiteElement,
  ViewportMode,
} from "./model";
import { toYouTubeEmbedUrl } from "./youtube-url";
import "./inspector-ui.css";

type Props = {
  element: SiteElement | null;
  viewport: ViewportMode;
  onLayoutChange: (patch: Partial<ElementLayout>) => void;
  onContentChange: (content: string) => void;
  onStyleChange: (patch: Record<string, string | number>) => void;
  onSharedStyleChange: (patch: Record<string, string | number>) => void;
  onSettingChange: (
    patch: Record<string, string | number | boolean>,
  ) => void;
  onComponentDataChange: (data: ComponentData) => void;
  onDelete: () => void;
};

function contentLabel(element: SiteElement) {
  if (element.type === "image") return "圖片網址";
  if (element.type === "youtube") return "YouTube 網址";
  return "文字內容";
}

export function InspectorPanel(props: Props) {
  const { element, viewport } = props;
  if (!element) {
    return (
      <aside className="editor-inspector">
        <p className="panel-title">元素屬性</p>
        <p>尚未選取元素</p>
        <span className="muted">
          主要操作直接在畫布拖曳／縮放；需要精準數值時再展開右側工具。
        </span>
      </aside>
    );
  }

  const activeLayout = element[viewport];
  const editableContent = [
    "text",
    "button",
    "image",
    "youtube",
  ].includes(element.type);
  const editableTypography =
    element.type === "text" || element.type === "button";
  const isMemberCarousel =
    element.type === "component" && element.content === "members";
  const carouselSpeed = Number(
    element.settings?.[viewport]?.speed ??
      (viewport === "mobile" ? 120 : 42),
  );
  const youtubeValid =
    element.type !== "youtube" ||
    !element.content.trim() ||
    Boolean(toYouTubeEmbedUrl(element.content));

  return (
    <aside className="editor-inspector">
      <p className="panel-title">元素屬性</p>
      <strong>{element.name}</strong>
      <span className="muted">
        {viewport === "desktop" ? "桌機版" : "手機版"}
      </span>

      {editableContent && (
        <label className="content-field">
          <span>{contentLabel(element)}</span>
          <textarea
            value={element.content}
            onChange={(event) => props.onContentChange(event.target.value)}
            rows={element.type === "youtube" ? 3 : 4}
            placeholder={
              element.type === "youtube"
                ? "貼上 YouTube 分享網址"
                : undefined
            }
          />
          {element.type === "youtube" && (
            <span className="muted">
              {youtubeValid
                ? "直接貼一般 YouTube 網址即可。"
                : "這不是可辨識的 YouTube 影片網址。"}
            </span>
          )}
        </label>
      )}

      {editableTypography && (
        <InspectorTypography
          element={element}
          viewport={viewport}
          onViewportStyleChange={props.onStyleChange}
          onSharedStyleChange={props.onSharedStyleChange}
        />
      )}

      <InspectorLayoutControls
        layout={activeLayout}
        onChange={props.onLayoutChange}
      />

      <InspectorDisclosure title="顯示與進階">
        <label className="inspector-quick-toggle">
          <input
            type="checkbox"
            checked={activeLayout.visible}
            onChange={(event) =>
              props.onLayoutChange({ visible: event.target.checked })
            }
          />
          <span>顯示此元素</span>
        </label>

        {isMemberCarousel && (
          <label className="content-field">
            <span>
              輪播秒數（{viewport === "desktop" ? "桌機" : "手機"}）
            </span>
            <input
              type="number"
              min="10"
              max="240"
              value={carouselSpeed}
              onChange={(event) =>
                props.onSettingChange({
                  speed: Number(event.target.value),
                })
              }
            />
          </label>
        )}
      </InspectorDisclosure>

      {isMemberCarousel && (
        <InspectorDisclosure title="人物輪播管理">
          <MemberManager
            element={element}
            viewport={viewport}
            onChange={props.onComponentDataChange}
          />
        </InspectorDisclosure>
      )}

      <div className="inspector-danger-zone">
        <button
          type="button"
          className="delete-element"
          onClick={props.onDelete}
        >
          刪除元素
        </button>
        <span className="muted">
          尚未儲存前，重新整理頁面可還原。
        </span>
      </div>
    </aside>
  );
}
