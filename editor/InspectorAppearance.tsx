"use client";

import type { SiteElement } from "./model";
import { InspectorDisclosure } from "./InspectorDisclosure";

type Props = {
  element: SiteElement;
  onContentChange: (content: string) => void;
  onStyleChange: (patch: Record<string, string | number>) => void;
};

function colorValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.startsWith("#") ? value : fallback;
}

export function InspectorAppearance({
  element,
  onContentChange,
  onStyleChange,
}: Props) {
  const style = element.style ?? {};

  return (
    <InspectorDisclosure title="外觀">
      {element.type === "image" && (
        <>
          <label className="content-field">
            <span>上傳圖片（開發版暫存於瀏覽器）</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                if (file.size > 1.5 * 1024 * 1024) {
                  window.alert("目前驗收版單張圖片請控制在 1.5MB 內。");
                  event.currentTarget.value = "";
                  return;
                }
                const reader = new FileReader();
                reader.onload = () => onContentChange(String(reader.result ?? ""));
                reader.readAsDataURL(file);
              }}
            />
          </label>
          <label className="content-field">
            <span>圖片填滿方式</span>
            <select
              value={String(style.objectFit ?? "cover")}
              onChange={(event) => onStyleChange({ objectFit: event.target.value })}
            >
              <option value="cover">裁切填滿</option>
              <option value="contain">完整顯示</option>
              <option value="fill">拉伸</option>
            </select>
          </label>
        </>
      )}

      {(element.type === "button" || element.type === "shape") && (
        <label className="color-control">
          <input
            type="color"
            value={colorValue(style.background, "#171717")}
            onChange={(event) => onStyleChange({ background: event.target.value })}
          />
          <input
            type="text"
            value={String(style.background ?? "#171717")}
            onChange={(event) => onStyleChange({ background: event.target.value })}
          />
        </label>
      )}

      {element.type === "line" && (
        <label className="color-control">
          <input
            type="color"
            value={colorValue(style.background, "#171717")}
            onChange={(event) => onStyleChange({ background: event.target.value })}
          />
          <input
            type="text"
            value={String(style.background ?? "#171717")}
            onChange={(event) => onStyleChange({ background: event.target.value })}
          />
        </label>
      )}

      {["image", "button", "shape"].includes(element.type) && (
        <label className="content-field">
          <span>圓角</span>
          <input
            type="number"
            min="0"
            value={Number(style.borderRadius ?? 0)}
            onChange={(event) =>
              onStyleChange({ borderRadius: Number(event.target.value) })
            }
          />
        </label>
      )}
    </InspectorDisclosure>
  );
}
