"use client";

import { motion } from "framer-motion";

const vinylUrl = "/assets/renwoxing/vinyl-disc.webp";
const labelUrl = "/assets/renwoxing/label-gold.webp";
const saxUrl = "/assets/renwoxing/saxophone.webp";

type Props = {
  compact: boolean;
  onActivate?: () => void;
};

export function VinylStage({ compact, onActivate }: Props) {
  return (
    <motion.button
      type="button"
      className={compact ? "vinyl-stage compact" : "vinyl-stage"}
      onClick={onActivate}
      layout
      aria-label="開啟任我行內容"
      transition={{ type: "spring", stiffness: 85, damping: 20 }}
    >
      <motion.div
        className="vinyl-spin"
        animate={{ rotate: 360 }}
        transition={{ duration: 24, ease: "linear", repeat: Infinity }}
      >
        <img className="vinyl-disc" src={vinylUrl} alt="" />
        <img className="vinyl-label" src={labelUrl} alt="" />
        <img className="vinyl-sax" src={saxUrl} alt="" />
      </motion.div>
    </motion.button>
  );
}
