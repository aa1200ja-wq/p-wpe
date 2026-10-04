"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ContentScene } from "./ContentScene";
import { HomeScene } from "./HomeScene";
import type { SectionId } from "./scene-data";
import "./renwoxing.css";
import "./renwoxing-mobile.css";

export function RenwoxingExperience() {
  const [entered, setEntered] = useState(false);
  const [section, setSection] = useState<SectionId>("about");

  return (
    <main className="renwoxing-experience">
      <div className="surface-texture" aria-hidden="true" />
      <AnimatePresence mode="wait">
        {!entered ? (
          <HomeScene key="home" onEnter={() => setEntered(true)} />
        ) : (
          <ContentScene
            key="content"
            active={section}
            onChange={setSection}
            onHome={() => setEntered(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
