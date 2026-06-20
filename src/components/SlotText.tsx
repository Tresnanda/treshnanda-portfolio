"use client";

import { useEffect, useRef, useState } from "react";
import { SlotText as LibSlotText } from "slot-text/react";
import type { SlotOptions } from "slot-text";
import { useInView, useReducedMotion } from "framer-motion";
import "slot-text/style.css";

/**
 * Thin wrapper over the `slot-text` library's React component, which rolls
 * whenever its `text` prop changes. Adds two ergonomic triggers on top:
 *
 * - `cycle` : rotate through a list on `cycleMs` (rolls between each).
 * - `from`  : show this placeholder until scrolled into view, then roll to `text`.
 *
 * Reduced motion: no auto-cycle, and `from` resolves straight to the final text.
 */
export default function SlotText({
  text = "",
  cycle,
  cycleMs = 2600,
  from,
  delayMs = 0,
  options,
  className,
}: {
  text?: string;
  cycle?: string[];
  cycleMs?: number;
  from?: string;
  delayMs?: number;
  options?: SlotOptions;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [idx, setIdx] = useState(0);
  const [rolled, setRolled] = useState(false);

  useEffect(() => {
    if (!cycle || cycle.length < 2 || reduce) return;
    const id = setInterval(() => setIdx((i) => i + 1), cycleMs);
    return () => clearInterval(id);
  }, [cycle, cycleMs, reduce]);

  // `from` placeholder rolls to `text` once in view, after `delayMs` (stagger).
  useEffect(() => {
    if (from === undefined || reduce || !inView) return;
    const t = setTimeout(() => setRolled(true), delayMs);
    return () => clearTimeout(t);
  }, [from, reduce, inView, delayMs]);

  let current: string;
  if (cycle && cycle.length) current = cycle[idx % cycle.length];
  else if (from !== undefined) current = reduce || rolled ? text : from;
  else current = text;

  return <LibSlotText ref={ref} text={current} options={options} className={className} />;
}
