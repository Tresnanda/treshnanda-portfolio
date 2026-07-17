"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import useReducedMotionPreference from "@/hooks/useReducedMotionPreference";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*/";

/**
 * Decode/scramble effect: characters churn then resolve to the target, once
 * when scrolled into view and again on hover. On-brand "system" feel. Under
 * reduced motion it just shows the text. Initial render = final text, so SSR
 * matches and there's no hydration flicker.
 */
export default function ScrambleText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotionPreference();
  const [display, setDisplay] = useState(text);
  const raf = useRef(0);

  const run = () => {
    if (reduce) return;
    cancelAnimationFrame(raf.current);
    let i = 0;
    const tick = () => {
      setDisplay(
        text
          .split("")
          .map((ch, idx) => (ch === " " ? " " : idx < i ? text[idx] : CHARS[Math.floor(Math.random() * CHARS.length)]))
          .join("")
      );
      i += 1 / 2;
      if (i < text.length) raf.current = requestAnimationFrame(tick);
      else setDisplay(text);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (inView) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <span ref={ref} onMouseEnter={run} className={className}>
      {display}
    </span>
  );
}
