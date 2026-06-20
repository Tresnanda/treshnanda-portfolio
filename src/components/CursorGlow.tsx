"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useMotionTemplate, useReducedMotion } from "framer-motion";

/**
 * A soft radial glow that tracks the cursor across this block. Pure motion
 * values (no React state) so it never re-renders on move. Fine-pointer only;
 * under reduced motion / touch it renders nothing extra.
 */
export default function CursorGlow({
  children,
  className,
  color = "rgba(204,255,0,0.13)",
  size = 520,
}: {
  children: ReactNode;
  className?: string;
  color?: string;
  size?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const bg = useMotionTemplate`radial-gradient(${size}px circle at ${mx}px ${my}px, ${color}, transparent 72%)`;

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      onMouseLeave={() => {
        mx.set(-1000);
        my.set(-1000);
      }}
      className={`relative ${className ?? ""}`}
    >
      {!reduce && (
        <motion.div aria-hidden style={{ background: bg }} className="pointer-events-none absolute -inset-8 z-0" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
