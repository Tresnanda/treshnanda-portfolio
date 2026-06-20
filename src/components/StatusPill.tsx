"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/motion";
import SlotText from "@/components/SlotText";

/**
 * Live "system operational" indicator: a lime core with expanding ping rings.
 * Ambient motion (the slow ring) is the third motion layer — present but never
 * demanding attention. Under reduced motion the rings hold still.
 *
 * Pass `cycle` to slot-roll the label through several statuses; otherwise it's
 * a static `label`.
 */
export default function StatusPill({
  label = "System Operational",
  cycle,
}: {
  label?: string;
  cycle?: string[];
}) {
  const reduce = useReducedMotion();

  return (
    <span className="inline-flex items-center gap-2.5 mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        {!reduce && (
          <>
            <motion.span
              className="absolute inset-0 rounded-full bg-system-lime"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 2.6, opacity: 0 }}
              transition={{ duration: 2, ease: ease.out, repeat: Infinity }}
            />
            <motion.span
              className="absolute inset-0 rounded-full bg-system-lime"
              initial={{ scale: 1, opacity: 0.4 }}
              animate={{ scale: 2.6, opacity: 0 }}
              transition={{ duration: 2, ease: ease.out, repeat: Infinity, delay: 1 }}
            />
          </>
        )}
        <span className="relative h-2 w-2 rounded-full bg-system-lime shadow-[0_0_8px_2px_rgba(204,255,0,0.6)]" />
      </span>
      {cycle && cycle.length > 1 ? <SlotText cycle={cycle} cycleMs={3200} options={{ skipUnchanged: false }} /> : label}
    </span>
  );
}
