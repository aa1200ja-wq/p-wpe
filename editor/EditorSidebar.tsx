"use client";

import type { AddableElementType } from "./element-factory";
import type { SitePage, SiteProject } from "./model";
import { PageNameButton } from "./PageNameButton";
import "./inner-page-sync.css";
import "./editor-sidebar-extra.css";

type Props = {
  project: SiteProject;
  page: SitePage;
  selectedIds: string[];
  onPageChange: (pageId: string) => void;
  onPageRename: (pageId: string, name: string) => void;
  onElementSelect: (elementId: string) => void;
  onAddElement: (type: AddableElementType) => void;
  onAddPage: () => void;
  onDeletePage: () => void;
  innerSyncAvailable: boolean;
  syncInnerPages: boolean;
  onSyncInnerPagesChange: (enabled: boolean) => void;
  onApplyInnerTemplate: () => void;
};

const addButtons: Array<{
  type: AddableElementType;
  label: string;
}> = [
  { type: "text", label: "＋ 文字" },
  { type: "image", label: "＋ 圖片" },
  { type: "youtube", label: "＋ YouTube" },
  { type: "button", label: "＋ 按鈕" },
  { type: "line", label: "＋ 線條" },
];

export function EditorSidebar(props: Props) {
  return (
    <aside className="editor-sidebar">
      <p className="panel-title">頁面</p>
      <div className="sidebar-section">
        {props.project.pages.map((item) => (
          <PageNameButton
            key={item.id}
            name={item.name}
            active={item.id === props.page.id}
            onSelect={() => props.onPageChange(item.id)}
            onRename={(name) => props.onPageRename(item.id, name)}
          />
        ))}
      </div>

      <div className="page-actions">
        <button type="button" onClick={props.onAddPage}>＋ 新增分頁</button>
        <button
          type="button"
          className="danger"
          onClick={props.onDeletePage}
          disabled={props.project.pages.length <= 1}
        >
          刪除分頁
        </button>
      </div>

      {props.innerSyncAvailable && (
        <div className="inner-sync-box">
          <label>
            <input
              type="checkbox"
              checked={props.syncInnerPages}
              onChange={(event) =>
                props.onSyncInnerPagesChange(event.target.checked)
              }
            />
            <strong>六個內頁連動</strong>
          </label>
          <small>
            共用版型的位置、尺寸、字級與顯示狀態會同步；各頁文字內容保留。
          </small>
          <button type="button" onClick={props.onApplyInnerTemplate}>
            套用本頁共用版型到其他五頁
          </button>
        </div>
      )}

      <p className="panel-title">所有元素</p>
      <div className="element-list">
        {props.page.elements.map((element, index) => (
          <button
            key={element.id}
            className={
              props.selectedIds.includes(element.id) ? "active" : ""
            }
            onClick={() => props.onElementSelect(element.id)}
            title={element.name}
          >
            <span className="element-order">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="element-name">{element.name}</span>
            <small>{element.type}</small>
          </button>
        ))}
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
