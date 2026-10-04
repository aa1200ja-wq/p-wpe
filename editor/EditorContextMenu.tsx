"use client";

import "./editor-context-menu.css";

type Props = {
  x: number;
  y: number;
  hasSelection: boolean;
  canPaste: boolean;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onClose: () => void;
};

export function EditorContextMenu(props: Props) {
  function run(action: () => void) {
    action();
    props.onClose();
  }

  return (
    <div
      className="editor-context-menu"
      style={{ left: props.x, top: props.y }}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <button disabled={!props.hasSelection} onClick={() => run(props.onCopy)}>
        複製
      </button>
      <button disabled={!props.hasSelection} onClick={() => run(props.onCut)}>
        剪下
      </button>
      <button disabled={!props.canPaste} onClick={() => run(props.onPaste)}>
        貼上
      </button>
      <hr />
      <button
        className="danger"
        disabled={!props.hasSelection}
        onClick={() => run(props.onDelete)}
      >
        刪除
      </button>
    </div>
  );
}
