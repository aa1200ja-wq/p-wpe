"use client";

import { useState } from "react";
import "./page-delete-dialog.css";

type Props = {
  pageName: string;
  onCancel: () => void;
  onConfirm: (dontAskAgain: boolean) => void;
};

export function PageDeleteDialog({
  pageName,
  onCancel,
  onConfirm,
}: Props) {
  const [dontAskAgain, setDontAskAgain] = useState(false);

  return (
    <div className="page-delete-backdrop">
      <div className="page-delete-dialog" role="dialog" aria-modal="true">
        <strong>確定刪除「{pageName}」？</strong>
        <p>此頁面的元素也會一起刪除。</p>
        <label>
          <input
            type="checkbox"
            checked={dontAskAgain}
            onChange={(event) => setDontAskAgain(event.target.checked)}
          />
          不再提醒
        </label>
        <div>
          <button type="button" onClick={onCancel}>取消</button>
          <button
            type="button"
            className="danger"
            onClick={() => onConfirm(dontAskAgain)}
          >
            刪除
          </button>
        </div>
      </div>
    </div>
  );
}
