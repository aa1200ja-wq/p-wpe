"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { SectionId } from "./scene-data";
import { sections } from "./scene-data";
import { VinylRecord } from "./VinylRecord";
import { SectionContent } from "./SectionContent";

type Props = {
  active: SectionId;
  onChange: (id: SectionId) => void;
  onHome: () => void;
};

export function ContentScene({ active, onChange, onHome }: Props) {
  const section = sections.find((item) => item.id === active) ?? sections[0];

  return (
    <section className="content-scene">
      <div className="record-rail">
        <button className="brand-mark" onClick={onHome} type="button">
          任我行
        </button>
        <VinylRecord variant="rail" onActivate={onHome} />
        <p>旋律仍在前行</p>
      </div>

      <motion.div
        className="cream-panel"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="section-nav" aria-label="網站章節">
          {sections.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === active ? "active" : ""}
              onClick={() => onChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          <motion.article
            key={section.id}
            className="section-copy"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.42 }}
          >
            <p className="section-eyebrow">{section.eyebrow}</p>
            <h2>{section.title}</h2>
            <p className="section-body">{section.body}</p>
            <span className="section-index">
              0{sections.findIndex((item) => item.id === active) + 1}
            </span>
          </motion.article>
        </AnimatePresence>

        <SectionContent section={active} />\n\n        <button type="button" className="back-home" onClick={onHome}>
          ← 回到唱片
        </button>
      </motion.div>
    </section>
  );
}
