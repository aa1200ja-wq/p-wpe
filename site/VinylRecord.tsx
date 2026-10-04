"use client";

import { motion } from "framer-motion";
import "./vinyl-record.css";

type Props = {
  variant: "hero" | "rail";
  onActivate?: () => void;
};

const assets = {
  disc: "/assets/renwoxing/vinyl-disc.webp",
  label: "/assets/renwoxing/label-gold.webp",
  sax: "/assets/renwoxing/saxophone.webp",
};

export function VinylRecord({
  variant,
  onActivate,
}: Props) {
  const entrance =
    variant === "hero"
      ? {
          initial: { opacity: 0, scale: 0.82, y: 18 },
          animate: { opacity: 1, scale: 1, y: 0 },
          transition: {
            duration: 1.05,
            delay: 0.22,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        }
      : {
          initial: { opacity: 0, x: -90, scale: 0.92 },
          animate: { opacity: 1, x: 0, scale: 1 },
          transition: {
            duration: 0.78,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    <motion.button
      type="button"
      className={"vinyl-record " + variant}
      onClick={onActivate}
      aria-label={
        variant === "hero"
          ? "進入任我行網站"
          : "回到任我行首頁"
      }
      initial={entrance.initial}
      animate={entrance.animate}
      transition={entrance.transition}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
    >
      <motion.span
        className="vinyl-record-spin"
        animate={{ rotate: 360 }}
        transition={{
          duration: 26,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <img
          className="vinyl-record-disc"
          src={assets.disc}
          alt=""
          draggable={false}
        />
        <img
          className="vinyl-record-label"
          src={assets.label}
          alt=""
          draggable={false}
        />
        <img
          className="vinyl-record-sax"
          src={assets.sax}
          alt=""
          draggable={false}
        />
      </motion.span>
    </motion.button>
  );
}
