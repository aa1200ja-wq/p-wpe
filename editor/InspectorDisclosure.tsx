"use client";

import type { ReactNode } from "react";

export function InspectorDisclosure({
  title,
  children,
  open = false,
}: {
  title: string;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <details className="inspector-disclosure" open={open}>
      <summary>{title}</summary>
      <div className="inspector-disclosure-body">{children}</div>
    </details>
  );
}
