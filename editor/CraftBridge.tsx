"use client";

import { Editor } from "@craftjs/core";

export function CraftBridge({ children }: { children: React.ReactNode }) {
  return <Editor enabled resolver={{}}>{children}</Editor>;
}
