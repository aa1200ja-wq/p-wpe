"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { createPortal } from "react-dom";
import {
  memberModalFor,
  resolveMemberCarouselData,
} from "./member-config";
import type {
  ComponentData,
  MemberItem,
  MemberModalConfig,
  ViewportMode,
} from "./model";
import "./special-elements.css";

const vinylAssets = {
  vinyl: "/assets/renwoxing/vinyl-disc.webp",
  label: "/assets/renwoxing/label-gold.webp",
  sax: "/assets/renwoxing/saxophone.webp",
};

type Props = {
  name: string;
  viewport: ViewportMode;
  settings?: Record<string, string | number | boolean>;
  componentData?: ComponentData;
};

export function SpecialElement({
  name,
  viewport,
  settings,
  componentData,
}: Props) {
  if (name === "vinyl" || name === "vinyl-compact") {
    return <EditorVinyl />;
  }

  if (name === "members") {
    const fallback = viewport === "mobile" ? 120 : 42;
    const data = resolveMemberCarouselData(
      componentData?.memberCarousel,
    );
    return (
      <EditorMemberCarousel
        speedSeconds={Number(settings?.speed ?? fallback)}
        members={data.members}
        modal={memberModalFor(componentData?.memberCarousel, viewport)}
      />
    );
  }

  if (name === "activities") {
    return <div className="editor-special-placeholder">活動照片</div>;
  }

  if (name === "tap-cue") {
    return <div className="editor-special-placeholder">點擊提示</div>;
  }

  return <div>{name}</div>;
}

function EditorVinyl() {
  return (
    <div className="editor-vinyl">
      <motion.div
        className="editor-vinyl-spin"
        animate={{ rotate: 360 }}
        transition={{
          duration: 24,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <img src={vinylAssets.vinyl} alt="" />
        <img src={vinylAssets.label} alt="" />
        <img src={vinylAssets.sax} alt="" />
      </motion.div>
    </div>
  );
}

function EditorMemberCarousel({
  speedSeconds,
  members,
  modal,
}: {
  speedSeconds: number;
  members: MemberItem[];
  modal: MemberModalConfig;
}) {
  const [selected, setSelected] = useState<MemberItem | null>(null);
  const loopMembers = [...members, ...members];

  if (!members.length) {
    return <div className="editor-special-placeholder">尚無人物</div>;
  }

  return (
    <>
      <div className="editor-member-carousel">
        <div
          className="editor-member-track"
          style={{
            animationDuration: speedSeconds + "s",
            animationPlayState: selected ? "paused" : "running",
          }}
        >
          {loopMembers.map((member, index) => (
            <button
              type="button"
              className="editor-member-card"
              key={member.id + "-" + index}
              onClick={(event) => {
                event.stopPropagation();
                setSelected(member);
              }}
            >
              <img src={member.cover} alt={member.name} />
              <strong>{member.name}</strong>
            </button>
          ))}
        </div>
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {selected && (
              <motion.div
                className="editor-member-modal-backdrop"
                role="dialog"
                aria-modal="true"
                aria-label={selected.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelected(null)}
              >
                <motion.article
                  className="editor-member-modal"
                  style={{
                    width:
                      "min(calc(100vw - 32px), " +
                      (modal.width + 36) +
                      "px)",
                  }}
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 10 }}
                  transition={{ duration: 0.28 }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    className="editor-member-modal-close"
                    onClick={() => setSelected(null)}
                    aria-label="關閉人物照片"
                  >
                    ×
                  </button>
                  <img
                    className="editor-member-detail-photo"
                    src={selected.detail}
                    alt={selected.name}
                    style={{
                      height:
                        "min(" + modal.height + "px, 72vh)",
                      objectFit: modal.fit,
                    }}
                  />
                  <p>{selected.role}</p>
                  <h3>{selected.name}</h3>
                </motion.article>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
