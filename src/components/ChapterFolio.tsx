"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import useReducedMotionPreference from "@/hooks/useReducedMotionPreference";

/**
 * Giant ghost folio numeral — the swiss-editorial page number. Outlined, no
 * fill, and drifting slowly against scroll (ambient layer). Decorative only.
 */
export default function ChapterFolio({ number, className = "" }: { number: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionPreference();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [48, -48]);

  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none hidden select-none md:block ${className}`}>
      <motion.span
        style={reduce ? undefined : { y }}
        className="folio-outline block text-[clamp(7rem,14vw,13rem)] font-black leading-none tracking-[-0.06em] tabular-nums"
      >
        {number}
      </motion.span>
    </div>
  );
}
