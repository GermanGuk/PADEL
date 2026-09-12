"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

function letterOffset(i: number) {
  const x = (((i * 37) % 41) - 20) * 1.6;
  const y = (((i * 53) % 31) - 15) * 1.4;
  const rotate = ((i * 29) % 21) - 10;
  return { x, y, rotate };
}

export function AnimatedWatermark({ text, className }: { text: string; className?: string }) {
  const letters = text.split("");
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const fit = () => {
      const container = containerRef.current;
      const el = textRef.current;
      if (!container || !el) return;
      el.style.fontSize = "";
      const naturalSize = parseFloat(getComputedStyle(el).fontSize);
      const naturalWidth = el.scrollWidth;
      const containerWidth = container.clientWidth;
      if (naturalSize && naturalWidth > 0 && containerWidth > 0) {
        el.style.fontSize = `${(naturalSize * containerWidth) / naturalWidth}px`;
      }
    };

    fit();
    document.fonts?.ready.then(fit).catch(() => {});
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [text]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <motion.p
        ref={textRef}
        className={className}
        style={{ whiteSpace: "nowrap" }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0, margin: "0px 0px 200px 0px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}
      >
        {letters.map((ch, i) => {
          const { x, y, rotate } = letterOffset(i);
          return (
            <motion.span
              key={i}
              style={{ display: "inline-block" }}
              variants={{
                hidden: { opacity: 0, x, y, rotate, filter: "blur(6px)" },
                show: {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  rotate: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {ch === " " ? " " : ch}
            </motion.span>
          );
        })}
      </motion.p>
    </div>
  );
}
