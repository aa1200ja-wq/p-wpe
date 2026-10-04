"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import "./activity-gallery.css";

type Activity = {
  label: string;
  image: string;
};

const activities: Activity[] = [
  { label: "LIVE", image: "/assets/renwoxing/activity-01.webp" },
  { label: "SESSION", image: "/assets/renwoxing/activity-02.webp" },
  { label: "MEMORY", image: "/assets/renwoxing/activity-03.webp" },
];

export function ActivityGallery() {
  const [selected, setSelected] = useState<Activity | null>(null);

  return (
    <>
      <div className="event-grid">
        {activities.map((activity, index) => (
          <motion.button
            type="button"
            className="event-tile activity-button"
            key={activity.label}
            whileHover={{ y: -8, scale: 1.025 }}
            whileTap={{ scale: 0.985 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelected(activity)}
          >
            <img src={activity.image} alt="任我行活動紀錄" />
            <span>0{index + 1}</span>
            <div className="event-copy">
              <strong>{activity.label}</strong>
              <small>點擊觀看</small>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="activity-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label="活動照片放大檢視"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.article
              className="activity-modal"
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.3 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="activity-close"
                aria-label="關閉活動照片"
                onClick={() => setSelected(null)}
              >
                ×
              </button>
              <img src={selected.image} alt="任我行活動紀錄放大照片" />
              <p>{selected.label}</p>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
