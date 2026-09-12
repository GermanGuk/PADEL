"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Positive = image moves slower than scroll (classic parallax). In px of extra travel. */
  strength?: number;
};

export function Parallax({ children, className, strength = 40 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);

  // The wrapper only owns overflow-hidden; the caller supplies its own
  // position (relative/absolute) and sizing via `className`.
  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        style={{ y, position: "absolute", top: -strength, left: 0, right: 0, bottom: -strength }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
