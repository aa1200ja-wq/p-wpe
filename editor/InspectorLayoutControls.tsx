"use client";

import type { ElementLayout } from "./model";
import { InspectorDisclosure } from "./InspectorDisclosure";

type Props = {
  layout: ElementLayout;
  onChange: (patch: Partial<ElementLayout>) => void;
};

const fields: Array<{
  key: keyof Pick<
    ElementLayout,
    "x" | "y" | "width" | "height" | "rotation" | "zIndex"
  >;
  label: string;
}> = [
  { key: "x", label: "X" },
  { key: "y", label: "Y" },
  { key: "width", label: "寬" },
  { key: "height", label: "高" },
  { key: "rotation", label: "旋轉" },
  { key: "zIndex", label: "圖層" },
];

export function InspectorLayoutControls({ layout, onChange }: Props) {
  return (
    <InspectorDisclosure title="位置與尺寸">
      <div className="inspector-grid compact-grid">
        {fields.map(({ key, label }) => (
          <label key={key}>
            <span>{label}</span>
            <input
              type="number"
              value={layout[key]}
              onChange={(event) =>
                onChange({ [key]: Number(event.target.value) })
              }
            />
          </label>
        ))}
      </div>
    </InspectorDisclosure>
  );
}
