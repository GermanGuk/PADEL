"use client";

import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [progress, setProgress] = useState(1);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }

    const duration = 1600;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 2);
      setProgress(Math.min(1 + Math.round(eased * 98), 99));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const finish = () => {
      cancelAnimationFrame(raf);
      setProgress(100);
      setFading(true);
      setTimeout(() => setVisible(false), 500);
    };

    let finishTimer: ReturnType<typeof setTimeout>;
    if (document.readyState === "complete") {
      finishTimer = setTimeout(finish, duration);
    } else {
      window.addEventListener("load", () => {
        finishTimer = setTimeout(finish, 200);
      });
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(finishTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-ink transition-opacity duration-500 ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <p className="text-2xl font-bold tabular-nums text-white">{progress}%</p>
      <div className="h-1 w-40 overflow-hidden rounded-full bg-white/15">
        <div className="h-full rounded-full bg-lime-bright" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
