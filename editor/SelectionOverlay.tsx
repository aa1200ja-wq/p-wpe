"use client";

import { useEffect, useState } from "react";
import Moveable from "react-moveable";
import Selecto from "react-selecto";
import type { ElementLayout } from "./model";

type LayoutChanges = Record<string, Partial<ElementLayout>>;

type Props = {
  selectedIds: string[];
  onSelectIds: (ids: string[]) => void;
  onLayoutsChange: (changes: LayoutChanges) => void;
};

export function SelectionOverlay({
  selectedIds,
  onSelectIds,
  onLayoutsChange,
}: Props) {
  const [targets, setTargets] = useState<HTMLElement[]>([]);
  const [guidelines, setGuidelines] = useState<HTMLElement[]>([]);
  const [canvasCenter, setCanvasCenter] = useState({ x: 0, y: 0 });
  const [modifierHeld, setModifierHeld] = useState(false);

  useEffect(() => {
    const syncModifier = (event: KeyboardEvent) => {
      setModifierHeld(event.ctrlKey || event.metaKey);
    };
    const clearModifier = () => setModifierHeld(false);

    window.addEventListener("keydown", syncModifier);
    window.addEventListener("keyup", syncModifier);
    window.addEventListener("blur", clearModifier);
    return () => {
      window.removeEventListener("keydown", syncModifier);
      window.removeEventListener("keyup", syncModifier);
      window.removeEventListener("blur", clearModifier);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "editor-multi-picking",
      modifierHeld,
    );
    return () => {
      document.documentElement.classList.remove("editor-multi-picking");
    };
  }, [modifierHeld]);

  useEffect(() => {
    const all = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-editor-element='true']",
      ),
    );
    const nextTargets = all.filter((element) =>
      selectedIds.includes(element.dataset.editorId ?? ""),
    );
    const stage = all[0]?.closest<HTMLElement>(".site-stage");
    setTargets(nextTargets);
    setGuidelines(all.filter((element) => !nextTargets.includes(element)));
    setCanvasCenter({
      x: stage ? stage.clientWidth / 2 : 0,
      y: stage ? stage.clientHeight / 2 : 0,
    });
  }, [selectedIds]);

  const target = targets.length <= 1 ? targets[0] ?? null : targets;

  return (
    <>
      <Moveable
        target={target}
        draggable={!modifierHeld}
        resizable={!modifierHeld && targets.length === 1}
        rotatable={!modifierHeld && targets.length === 1}
        snappable={!modifierHeld}
        origin={false}
        snapThreshold={6}
        snapGap
        snapCenter
        isDisplaySnapDigit={false}
        elementGuidelines={guidelines}
        verticalGuidelines={canvasCenter.x ? [canvasCenter.x] : []}
        horizontalGuidelines={canvasCenter.y ? [canvasCenter.y] : []}
        onDrag={({ target, left, top }) => {
          target.style.left = left + "px";
          target.style.top = top + "px";
        }}
        onDragEnd={({ lastEvent }) => {
          if (!lastEvent || selectedIds.length !== 1) return;
          onLayoutsChange({
            [selectedIds[0]]: { x: lastEvent.left, y: lastEvent.top },
          });
        }}
        onDragGroup={({ events }) => {
          events.forEach(({ target, left, top }) => {
            target.style.left = left + "px";
            target.style.top = top + "px";
          });
        }}
        onDragGroupEnd={({ events }) => {
          const changes: LayoutChanges = {};
          events.forEach((event) => {
            const id = event.target.getAttribute("data-editor-id");
            if (!id || !event.lastEvent) return;
            changes[id] = {
              x: event.lastEvent.left,
              y: event.lastEvent.top,
            };
          });
          if (Object.keys(changes).length) onLayoutsChange(changes);
        }}
        onResize={({ target, width, height, drag }) => {
          target.style.width = width + "px";
          target.style.height = height + "px";
          target.style.left = drag.left + "px";
          target.style.top = drag.top + "px";
        }}
        onResizeEnd={({ lastEvent }) => {
          if (!lastEvent || selectedIds.length !== 1) return;
          onLayoutsChange({
            [selectedIds[0]]: {
              width: lastEvent.width,
              height: lastEvent.height,
              x: lastEvent.drag.left,
              y: lastEvent.drag.top,
            },
          });
        }}
        onRotate={({ target, rotation }) => {
          target.style.transform = "rotate(" + rotation + "deg)";
        }}
        onRotateEnd={({ lastEvent }) => {
          if (!lastEvent || selectedIds.length !== 1) return;
          onLayoutsChange({
            [selectedIds[0]]: { rotation: lastEvent.rotation },
          });
        }}
      />

      <Selecto
        dragContainer=".editor-canvas"
        selectableTargets={["[data-editor-element='true']"]}
        hitRate={20}
        selectByClick={false}
        selectFromInside={false}
        continueSelect={false}
        onSelectEnd={({ selected }) => {
          const ids = selected
            .map((element) => element.getAttribute("data-editor-id"))
            .filter((id): id is string => Boolean(id));
          if (ids.length) onSelectIds(ids);
        }}
      />
    </>
  );
}
