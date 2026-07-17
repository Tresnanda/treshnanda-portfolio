"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

import useReducedMotionPreference from "@/hooks/useReducedMotionPreference";
import { ease } from "@/lib/motion";

/**
 * Zero-padded integer that counts up once when scrolled into view.
 * SSR renders the final value so there is no hydration flicker.
 */
export default function CountUp({
  value,
  pad = 2,
  duration = 1,
  className = "",
}: {
  value: number;
  pad?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotionPreference();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const format = (v: number) => String(Math.round(v)).padStart(pad, "0");

    if (reduce || !inView) {
      el.textContent = format(inView || reduce ? value : 0);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: ease.out,
      onUpdate: (v) => {
        el.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [inView, value, pad, duration, reduce]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {String(value).padStart(pad, "0")}
    </span>
  );
}
