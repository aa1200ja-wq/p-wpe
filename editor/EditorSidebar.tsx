"use client";

import type { AddableElementType } from "./element-factory";
import type { SitePage, SiteProject, ViewportMode } from "./model";
import { PageNameButton } from "./PageNameButton";
import "./editor-sidebar-extra.css";

type LayerMove = "up" | "down" | "front" | "back";

type Props = {
  project: SiteProject;
  page: SitePage;
  viewport: ViewportMode;
  selectedIds: string[];
  onPageChange: (pageId: string) => void;
  onPageRename: (pageId: string, name: string) => void;
  onElementSelect: (elementId: string) => void;
  onAddElement: (type: AddableElementType) => void;
  onAddPage: () => void;
  onDuplicatePage: () => void;
  onDeletePage: () => void;
  onMovePage: (direction: -1 | 1) => void;
  onSetHomePage: () => void;
  onMoveLayer: (mode: LayerMove) => void;
};

const addButtons: Array<{ type: AddableElementType; label: string }> = [
  { type: "text", label: "＋ 文字" },
  { type: "image", label: "＋ 圖片" },
  { type: "button", label: "＋ 按鈕" },
  { type: "shape", label: "＋ 形狀" },
  { type: "youtube", label: "＋ YouTube" },
  { type: "line", label: "＋ 線條" },
];

export function EditorSidebar(props: Props) {
  const pageIndex = props.project.pages.findIndex((item) => item.id === props.page.id);
  const elements = [...props.page.elements].sort(
    (a, b) => b[props.viewport].zIndex - a[props.viewport].zIndex,
  );

  return (
    <aside className="editor-sidebar">
      <p className="panel-title">頁面</p>
      <div className="sidebar-section">
        {props.project.pages.map((item) => (
          <div className="page-row" key={item.id}>
            <PageNameButton
              name={
                item.id === props.project.homePageId
                  ? "★ " + item.name
                  : item.name
              }
              active={item.id === props.page.id}
              onSelect={() => props.onPageChange(item.id)}
              onRename={(name) => props.onPageRename(item.id, name.replace(/^★\s*/, ""))}
            />
          </div>
        ))}
      </div>

      <div className="page-actions">
        <button type="button" onClick={props.onAddPage}>＋ 分頁</button>
        <button type="button" onClick={props.onDuplicatePage}>複製</button>
        <button
          type="button"
          onClick={() => props.onMovePage(-1)}
          disabled={pageIndex <= 0}
        >
          ↑ 上移
        </button>
        <button
          type="button"
          onClick={() => props.onMovePage(1)}
          disabled={pageIndex >= props.project.pages.length - 1}
        >
          ↓ 下移
        </button>
        <button type="button" onClick={props.onSetHomePage}>
          設為首頁
        </button>
        <button
          type="button"
          className="danger"
          onClick={props.onDeletePage}
          disabled={props.project.pages.length <= 1}
        >
          刪除
        </button>
      </div>

      <p className="panel-title">圖層</p>
      <div className="element-list">
        {elements.map((element) => (
          <button
            key={element.id}
            className={props.selectedIds.includes(element.id) ? "active" : ""}
            onClick={() => props.onElementSelect(element.id)}
            title={element.name}
          >
            <span className="element-order">{element[props.viewport].zIndex}</span>
            <span className="element-name">{element.name}</span>
            <small>{element.type}</small>
          </button>
        ))}
      </div>

      <div className="layer-actions">
        <button disabled={!props.selectedIds.length} onClick={() => props.onMoveLayer("front")}>
          置頂
        </button>
        <button disabled={!props.selectedIds.length} onClick={() => props.onMoveLayer("up")}>
          上一層
        </button>
        <button disabled={!props.selectedIds.length} onClick={() => props.onMoveLayer("down")}>
          下一層
        </button>
        <button disabled={!props.selectedIds.length} onClick={() => props.onMoveLayer("back")}>
          置底
        </button>
      </div>

      <p className="panel-title">新增元素</p>
      <div className="add-element-grid">
        {addButtons.map((item) => (
          <button
            key={item.type}
            type="button"
            onClick={() => props.onAddElement(item.type)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
