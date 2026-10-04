"use client";

import type { SiteElement, ViewportMode } from "./model";
import { InspectorDisclosure } from "./InspectorDisclosure";

type Props = {
  element: SiteElement;
  viewport: ViewportMode;
  onViewportStyleChange: (patch: Record<string, string | number>) => void;
  onSharedStyleChange: (patch: Record<string, string | number>) => void;
};

function colorInputValue(value: unknown) {
  const text = String(value ?? "");
  return /^#[0-9a-f]{6}$/i.test(text) ? text : "#17130d";
}

export function InspectorTypography({
  element,
  viewport,
  onViewportStyleChange,
  onSharedStyleChange,
}: Props) {
  const viewportStyle =
    viewport === "desktop" ? element.desktopStyle : element.mobileStyle;
  const fontSize = Number(
    viewportStyle?.fontSize ?? element.style?.fontSize ?? 16,
  );
  const textAlign = String(
    viewportStyle?.textAlign ?? element.style?.textAlign ?? "left",
  );
  const fontWeight = Number(
    viewportStyle?.fontWeight ?? element.style?.fontWeight ?? 400,
  );
  const color = String(
    viewportStyle?.color ?? element.style?.color ?? "#17130d",
  );

  return (
    <>
      <InspectorDisclosure title="文字工具" open>
        <div className="font-size-control">
          <span>A</span>
          <input
            type="range"
            min="6"
            max="160"
            value={Math.min(fontSize, 160)}
            onChange={(event) =>
              onViewportStyleChange({ fontSize: Number(event.target.value) })
            }
          />
          <input
            className="mini-number"
            type="number"
            min="6"
            max="300"
            value={fontSize}
            onChange={(event) =>
              onViewportStyleChange({ fontSize: Number(event.target.value) })
            }
          />
        </div>

        <div className="visual-button-row">
          <button
            type="button"
            className={fontWeight >= 700 ? "active" : ""}
            onClick={() =>
              onViewportStyleChange({
                fontWeight: fontWeight >= 700 ? 400 : 700,
              })
            }
            title="粗體"
          >
            <strong>B</strong>
          </button>
          {(["left", "center", "right"] as const).map((align) => (
            <button
              key={align}
              type="button"
              className={textAlign === align ? "active" : ""}
              onClick={() => onViewportStyleChange({ textAlign: align })}
              title={
                align === "left"
                  ? "靠左"
                  : align === "center"
                    ? "置中"
                    : "靠右"
              }
            >
              {align === "left" ? "左" : align === "center" ? "中" : "右"}
            </button>
          ))}
        </div>
      </InspectorDisclosure>

      <InspectorDisclosure title="文字顏色">
        <div className="color-control">
          <input
            type="color"
            value={colorInputValue(color)}
            onChange={(event) =>
              onSharedStyleChange({ color: event.target.value })
            }
            aria-label="選擇文字顏色"
          />
          <input
            type="text"
            value={color}
            onChange={(event) =>
              onSharedStyleChange({ color: event.target.value })
            }
            placeholder="#17130d"
          />
        </div>
      </InspectorDisclosure>
    </>
  );
}
