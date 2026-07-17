"use client";

import { motion } from "framer-motion";

import useReducedMotionPreference from "@/hooks/useReducedMotionPreference";
import { ease, inView } from "@/lib/motion";

/** Hairline that draws itself left to right when it enters the viewport. */
export default function Rule({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  const reduce = useReducedMotionPreference();

  return (
    <motion.span
      aria-hidden="true"
      initial={{ scaleX: reduce ? 1 : 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={inView}
      transition={{ duration: 0.9, delay, ease: ease.drawer }}
      className={`block h-px w-full origin-left bg-white/20 ${className}`}
    />
  );
}
