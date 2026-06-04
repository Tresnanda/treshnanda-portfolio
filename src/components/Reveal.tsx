"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { ease } from "@/lib/motion";

/**
 * Scroll-triggered reveal. Rise + blur-in once, a touch before the element is
 * centered. Reduced motion → opacity-only (meaning kept, movement dropped).
 *
 * `as` lets callers preserve semantics (h2, p, section…) while still animating.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "h2" | "h3" | "p" | "span";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as any;

  return (
    <MotionTag
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, filter: "blur(8px)" }}
      whileInView={
        reduce
          ? { opacity: 1 }
          : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: ease.out, delay }}
    >
      {children}
    </MotionTag>
  );
}
