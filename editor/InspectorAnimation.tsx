"use client";

import type { AnimationSpec, SiteElement } from "./model";
import { InspectorDisclosure } from "./InspectorDisclosure";

type Props = {
  element: SiteElement;
  onChange: (animation: AnimationSpec) => void;
};

const defaultAnimation: AnimationSpec = {
  preset: "none",
  duration: 0.6,
  delay: 0,
  easing: "easeOut",
  trigger: "page-enter",
};

export function InspectorAnimation({ element, onChange }: Props) {
  const value = element.animation ?? defaultAnimation;
  const patch = (next: Partial<AnimationSpec>) => onChange({ ...value, ...next });

  return (
    <InspectorDisclosure title="動效">
      <label className="content-field">
        <span>動畫</span>
        <select
          value={value.preset}
          onChange={(event) =>
            patch({ preset: event.target.value as AnimationSpec["preset"] })
          }
        >
          <option value="none">無</option>
          <option value="fade">淡入</option>
          <option value="fade-up">向上淡入</option>
          <option value="slide-left">由右滑入</option>
          <option value="slide-right">由左滑入</option>
          <option value="scale">縮放進場</option>
          <option value="spin">旋轉</option>
          <option value="blink">閃爍</option>
          <option value="hover-scale">Hover 放大</option>
        </select>
      </label>

      <label className="content-field">
        <span>觸發</span>
        <select
          value={value.trigger}
          onChange={(event) =>
            patch({ trigger: event.target.value as AnimationSpec["trigger"] })
          }
        >
          <option value="page-enter">進入頁面</option>
          <option value="hover">滑鼠移入</option>
          <option value="loop">循環</option>
        </select>
      </label>

      <div className="inspector-grid compact-grid">
        <label>
          <span>秒數</span>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={value.duration}
            onChange={(event) => patch({ duration: Number(event.target.value) })}
          />
        </label>
        <label>
          <span>延遲</span>
          <input
            type="number"
            min="0"
            step="0.1"
            value={value.delay}
            onChange={(event) => patch({ delay: Number(event.target.value) })}
          />
        </label>
      </div>

      <label className="content-field">
        <span>速度曲線</span>
        <select
          value={value.easing}
          onChange={(event) => patch({ easing: event.target.value })}
        >
          <option value="easeOut">Ease Out</option>
          <option value="easeInOut">Ease In Out</option>
          <option value="easeIn">Ease In</option>
          <option value="linear">Linear</option>
        </select>
      </label>
    </InspectorDisclosure>
  );
}
