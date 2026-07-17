"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "framer-motion";

import useReducedMotionPreference from "@/hooks/useReducedMotionPreference";
import ScrambleText from "@/components/ScrambleText";
import { ease, inView } from "@/lib/motion";

const STACK = [
  "Next.js",
  "TypeScript",
  "PostgreSQL",
  "AI systems",
  "Python",
  "React Native",
  "Docker",
  "Automation",
];

function StackRow({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div aria-hidden={ariaHidden} className="flex shrink-0 items-center">
      {STACK.map((item) => (
        <div key={item} className="group/item flex shrink-0 items-center gap-5 px-4 md:gap-8 md:px-7">
          <span className="text-sm font-black uppercase tracking-[-0.02em] text-white transition-colors duration-200 group-hover/item:text-system-lime md:text-base">
            {item}
          </span>
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 bg-system-lime transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover/item:rotate-45 group-hover/item:scale-125"
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Scroll-velocity ticker: drifts at a base speed, accelerates with scroll,
 * reverses when scrolling up, and skews slightly under momentum. Hovering
 * eases it to a stop (interruptible — it never snaps).
 */
function VelocityTicker() {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const skew = useTransform(smoothVelocity, [-2000, 0, 2000], [-2.5, 0, 2.5], { clamp: true });
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);

  const direction = useRef(1);
  const hoverEase = useRef(1);
  const hovered = useRef(false);

  useAnimationFrame((_, delta) => {
    // Ease toward stopped while hovered, back to full speed on leave.
    const target = hovered.current ? 0 : 1;
    hoverEase.current += (target - hoverEase.current) * Math.min(1, (delta / 1000) * 8);

    let moveBy = direction.current * -1.6 * (delta / 1000);
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    moveBy += direction.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy * hoverEase.current);
  });

  return (
    <div
      className="relative flex w-full flex-nowrap overflow-hidden"
      onMouseEnter={() => (hovered.current = true)}
      onMouseLeave={() => (hovered.current = false)}
    >
      <motion.div className="flex w-max flex-nowrap" style={{ x, skewX: skew }}>
        <StackRow />
        <StackRow ariaHidden />
        <StackRow ariaHidden />
        <StackRow ariaHidden />
      </motion.div>
    </div>
  );
}

export default function StackIndex() {
  const reduce = useReducedMotionPreference();

  return (
    <section aria-labelledby="stack-index-title" className="editorial-ink overflow-hidden border-y border-white/10">
      <div className="editorial-grid py-8 md:py-10">
        <motion.div
          initial={{ opacity: 0, transform: reduce ? "none" : "translateY(14px)" }}
          whileInView={{ opacity: 1, transform: "translateY(0px)" }}
          viewport={inView}
          transition={{ duration: 0.45, ease: ease.out }}
          className="col-span-12 grid grid-cols-12 items-start gap-x-3 md:gap-x-5"
        >
          <div className="col-span-6 md:col-span-3">
            <p id="stack-index-title" className="editorial-kicker text-system-lime">
              <ScrambleText text="Technical index" />
            </p>
            <p className="mt-2 text-xs font-semibold text-white/45">Current working stack</p>
          </div>
          <div className="col-span-6 hidden md:col-span-4 md:col-start-5 md:block">
            <p className="editorial-meta">Discipline</p>
            <p className="mt-2 text-xs font-semibold text-white/45">Systems / Product / Interface</p>
          </div>
          <div className="col-span-6 text-right md:col-span-3 md:col-start-10">
            <p className="editorial-meta">Updated</p>
            <p className="mt-2 text-xs font-semibold text-white/45 tabular-nums">07 / 2026</p>
          </div>
        </motion.div>
      </div>

      <div className="border-t border-white/10 py-5">
        {reduce ? (
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4">
            {STACK.map((item) => (
              <span key={item} className="flex items-center gap-4">
                <span className="text-sm font-black uppercase tracking-[-0.02em] text-white md:text-base">{item}</span>
                <span aria-hidden="true" className="h-1.5 w-1.5 bg-system-lime" />
              </span>
            ))}
          </div>
        ) : (
          <VelocityTicker />
        )}
      </div>
    </section>
  );
}
