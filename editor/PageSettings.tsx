"use client";

import type { SitePage } from "./model";

type Props = {
  page: SitePage;
  onChange: (patch: Partial<SitePage>) => void;
};

export function PageSettings({ page, onChange }: Props) {
  function patchViewport(
    mode: "desktop" | "mobile",
    key: "width" | "height",
    value: number,
  ) {
    onChange({
      viewport: {
        ...page.viewport,
        [mode]: { ...page.viewport[mode], [key]: value },
      },
    });
  }

  return (
    <div className="page-settings">
      <p className="panel-title">頁面設定</p>
      <strong>{page.name}</strong>

      <label className="content-field">
        <span>背景色</span>
        <div className="color-control">
          <input
            type="color"
            value={page.background.startsWith("#") ? page.background : "#ffffff"}
            onChange={(event) => onChange({ background: event.target.value })}
          />
          <input
            value={page.background}
            onChange={(event) => onChange({ background: event.target.value })}
          />
        </div>
      </label>

      <label className="content-field">
        <span>網址 Slug（預留給正式發布）</span>
        <input
          value={page.slug ?? ""}
          placeholder="/about"
          onChange={(event) => onChange({ slug: event.target.value })}
        />
      </label>

      <label className="content-field">
        <span>超出畫布</span>
        <select
          value={page.overflow}
          onChange={(event) =>
            onChange({ overflow: event.target.value as SitePage["overflow"] })
          }
        >
          <option value="hidden">隱藏</option>
          <option value="visible">顯示</option>
        </select>
      </label>

      <div className="inspector-grid compact-grid">
        <label>
          <span>桌機寬</span>
          <input
            type="number"
            value={page.viewport.desktop.width}
            onChange={(event) =>
              patchViewport("desktop", "width", Number(event.target.value))
            }
          />
        </label>
        <label>
          <span>桌機高</span>
          <input
            type="number"
            value={page.viewport.desktop.height}
            onChange={(event) =>
              patchViewport("desktop", "height", Number(event.target.value))
            }
          />
        </label>
        <label>
          <span>手機寬</span>
          <input
            type="number"
            value={page.viewport.mobile.width}
            onChange={(event) =>
              patchViewport("mobile", "width", Number(event.target.value))
            }
          />
        </label>
        <label>
          <span>手機高</span>
          <input
            type="number"
            value={page.viewport.mobile.height}
            onChange={(event) =>
              patchViewport("mobile", "height", Number(event.target.value))
            }
          />
        </label>
      </div>
      <span className="muted">未選取元素時，右側顯示目前分頁設定。</span>
    </div>
  );
}
