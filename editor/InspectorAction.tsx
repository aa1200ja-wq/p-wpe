"use client";

import type { SiteAction, SiteElement, SitePage } from "./model";
import { InspectorDisclosure } from "./InspectorDisclosure";

type Props = {
  element: SiteElement;
  pages: SitePage[];
  onChange: (action: SiteAction | undefined) => void;
};

export function InspectorAction({ element, pages, onChange }: Props) {
  const action = element.action;
  const mode = action?.type === "navigate" || action?.type === "url"
    ? action.type
    : "none";

  return (
    <InspectorDisclosure title="點擊行為">
      <label className="content-field">
        <span>動作</span>
        <select
          value={mode}
          onChange={(event) => {
            const value = event.target.value;
            if (value === "navigate") {
              onChange({ type: "navigate", targetPageId: pages[0]?.id ?? "" });
            } else if (value === "url") {
              onChange({ type: "url", href: "https://", newTab: true });
            } else {
              onChange(undefined);
            }
          }}
        >
          <option value="none">無</option>
          <option value="navigate">前往分頁</option>
          <option value="url">開啟網址</option>
        </select>
      </label>

      {action?.type === "navigate" && (
        <label className="content-field">
          <span>目標分頁</span>
          <select
            value={action.targetPageId}
            onChange={(event) =>
              onChange({ type: "navigate", targetPageId: event.target.value })
            }
          >
            {pages.map((page) => (
              <option key={page.id} value={page.id}>{page.name}</option>
            ))}
          </select>
        </label>
      )}

      {action?.type === "url" && (
        <>
          <label className="content-field">
            <span>網址</span>
            <input
              value={action.href}
              onChange={(event) =>
                onChange({ ...action, href: event.target.value })
              }
              placeholder="https://example.com"
            />
          </label>
          <label className="inspector-quick-toggle">
            <input
              type="checkbox"
              checked={Boolean(action.newTab)}
              onChange={(event) =>
                onChange({ ...action, newTab: event.target.checked })
              }
            />
            <span>另開新分頁</span>
          </label>
        </>
      )}
    </InspectorDisclosure>
  );
}
