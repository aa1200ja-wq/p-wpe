"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  name: string;
  active: boolean;
  onSelect: () => void;
  onRename: (name: string) => void;
};

export function PageNameButton({
  name,
  active,
  onSelect,
  onRename,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setDraft(name), [name]);
  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  function commit() {
    const next = draft.trim();
    if (next && next !== name) onRename(next);
    else setDraft(name);
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        className="page-name-input"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") commit();
          if (event.key === "Escape") {
            setDraft(name);
            setEditing(false);
          }
        }}
      />
    );
  }

  return (
    <button
      type="button"
      className={active ? "active page-name-button" : "page-name-button"}
      onClick={onSelect}
      onDoubleClick={(event) => {
        event.preventDefault();
        setEditing(true);
      }}
      title="雙擊重新命名分頁"
    >
      <span>{name}</span>
      <small>雙擊改名</small>
    </button>
  );
}
