"use client";

import { useEffect, useRef, useState } from "react";

export function CursorDot() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const canHover = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reducedMotion) return;

    setEnabled(true);

    const move = (e: MouseEvent) => {
      if (wrapperRef.current) {
        wrapperRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setHovering(!!target.closest("a, button, [role='button'], input, select, textarea, label"));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div ref={wrapperRef} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100] -ml-[7px] -mt-[7px]">
      <div
        className={`size-3.5 rounded-full bg-ink transition-all duration-200 ease-out ${
          hovering ? "scale-[2.4] bg-ink/20" : "scale-100 bg-ink/45"
        }`}
      />
    </div>
  );
}
