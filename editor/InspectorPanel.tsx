"use client";

import { InspectorAction } from "./InspectorAction";
import { InspectorAnimation } from "./InspectorAnimation";
import { InspectorAppearance } from "./InspectorAppearance";
import { InspectorDisclosure } from "./InspectorDisclosure";
import { InspectorLayoutControls } from "./InspectorLayoutControls";
import { InspectorTypography } from "./InspectorTypography";
import { PageSettings } from "./PageSettings";
import type {
  AnimationSpec,
  ComponentData,
  ElementLayout,
  SiteAction,
  SiteElement,
  SitePage,
  ViewportMode,
} from "./model";
import { toYouTubeEmbedUrl } from "./youtube-url";
import "./inspector-ui.css";

type Props = {
  element: SiteElement | null;
  page: SitePage;
  pages: SitePage[];
  viewport: ViewportMode;
  onPageChange: (patch: Partial<SitePage>) => void;
  onNameChange: (name: string) => void;
  onLayoutChange: (patch: Partial<ElementLayout>) => void;
  onContentChange: (content: string) => void;
  onStyleChange: (patch: Record<string, string | number>) => void;
  onViewportStyleChange: (patch: Record<string, string | number>) => void;
  onSettingChange: (patch: Record<string, string | number | boolean>) => void;
  onComponentDataChange: (data: ComponentData) => void;
  onActionChange: (action: SiteAction | undefined) => void;
  onAnimationChange: (animation: AnimationSpec) => void;
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
        <PageSettings page={props.page} onChange={props.onPageChange} />
      </aside>
    );
  }

  const activeLayout = element[viewport];
  const editableContent = ["text", "button", "image", "youtube"].includes(element.type);
  const editableTypography = element.type === "text" || element.type === "button";
  const youtubeValid =
    element.type !== "youtube" ||
    !element.content.trim() ||
    Boolean(toYouTubeEmbedUrl(element.content));
  const supportsAction = ["text", "image", "button", "shape"].includes(element.type);

  return (
    <aside className="editor-inspector">
      <p className="panel-title">元素屬性</p>

      <label className="content-field">
        <span>圖層名稱</span>
        <input
          value={element.name}
          onChange={(event) => props.onNameChange(event.target.value)}
        />
      </label>

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
              element.type === "youtube" ? "貼上 YouTube 分享網址" : undefined
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

      <InspectorAppearance
        element={element}
        onContentChange={props.onContentChange}
        onStyleChange={props.onStyleChange}
      />

      {editableTypography && (
        <InspectorTypography
          element={element}
          viewport={viewport}
          onViewportStyleChange={props.onViewportStyleChange}
          onSharedStyleChange={props.onStyleChange}
        />
      )}

      <InspectorLayoutControls
        layout={activeLayout}
        onChange={props.onLayoutChange}
      />

      {supportsAction && (
        <InspectorAction
          element={element}
          pages={props.pages}
          onChange={props.onActionChange}
        />
      )}

      <InspectorAnimation
        element={element}
        onChange={props.onAnimationChange}
      />

      <InspectorDisclosure title="顯示">
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
      </InspectorDisclosure>

      <div className="inspector-danger-zone">
        <button type="button" className="delete-element" onClick={props.onDelete}>
          刪除元素
        </button>
        <span className="muted">
          草稿尚未儲存時，重新整理可回到上次儲存狀態。
        </span>
      </div>
    </aside>
  );
}
