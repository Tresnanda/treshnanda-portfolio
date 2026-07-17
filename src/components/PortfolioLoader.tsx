"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import useReducedMotionPreference from "@/hooks/useReducedMotionPreference";
import { ease } from "@/lib/motion";
import {
  getLoaderReleaseTime,
  LOADER_MAX_MS,
} from "@/lib/portfolio-loader";

type PortfolioLoaderProps = {
  portraitUrl?: string | null;
  /** Fires the moment the loader starts its exit — lets the hero choreograph its entrance. */
  onRelease?: () => void;
};

function waitForPortrait(url?: string | null) {
  if (!url) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const image = new Image();
    const finish = () => resolve();

    image.onload = finish;
    image.onerror = finish;
    image.src = url;

    if (image.complete) {
      image.decode?.().catch(() => undefined).finally(finish);
    }
  });
}

export default function PortfolioLoader({ portraitUrl, onRelease }: PortfolioLoaderProps) {
  const reduce = useReducedMotionPreference();
  const startedAt = useRef<number | null>(null);
  const [visible, setVisible] = useState(true);
  const releaseCallback = useRef(onRelease);
  releaseCallback.current = onRelease;

  useEffect(() => {
    const start = performance.now();
    startedAt.current = start;
    let releaseTimer = 0;
    let released = false;

    const releaseAt = (readyAt: number | null) => {
      if (released || startedAt.current === null) return;

      const releaseTime = getLoaderReleaseTime(startedAt.current, readyAt);
      releaseTimer = window.setTimeout(() => {
        released = true;
        setVisible(false);
        releaseCallback.current?.();
      }, Math.max(0, releaseTime - performance.now()));
    };

    const fontReady = document.fonts?.ready ?? Promise.resolve();
    Promise.allSettled([fontReady, waitForPortrait(portraitUrl)]).then(() => {
      releaseAt(performance.now());
    });

    const safetyTimer = window.setTimeout(() => releaseAt(null), LOADER_MAX_MS);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(releaseTimer);
      window.clearTimeout(safetyTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [portraitUrl]);

  useEffect(() => {
    if (!visible) document.body.style.overflow = "";
  }, [visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="portfolio-loader"
          className="fixed inset-0 z-[500] overflow-hidden bg-[#090909] text-[#f3f0e8]"
          initial={{ opacity: 1 }}
          exit={
            reduce
              ? { opacity: 0, transition: { duration: 0.2, ease: ease.out } }
              : {
                  clipPath: "inset(0 0 100% 0)",
                  transition: { duration: 0.65, ease: ease.inOut },
                }
          }
          aria-live="polite"
          aria-label="Preparing portfolio"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)",
              backgroundSize: "calc(100vw / 12) 100%, 100% 12.5vh",
            }}
          />

          <div className="relative flex min-h-full flex-col justify-between px-5 py-5 sm:px-8 sm:py-7 md:px-12 md:py-10">
            <div className="flex items-start justify-between gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45 tabular-nums">
              <span>Portfolio / Issue 01</span>
              <span className="text-right">Bali<br />08°39′S 115°13′E</span>
            </div>

            <div aria-hidden="true" className="grid grid-cols-12 items-end gap-2 md:gap-4">
              <div className="col-span-8 md:col-span-7">
                <div className="overflow-hidden">
                  <motion.p
                    initial={reduce ? { opacity: 0 } : { transform: "translateY(108%)" }}
                    animate={reduce ? { opacity: 1 } : { transform: "translateY(0%)" }}
                    transition={{ duration: reduce ? 0.2 : 0.75, ease: ease.drawer }}
                    className="text-[clamp(3.3rem,11vw,10rem)] font-black leading-[0.72] tracking-[-0.08em]"
                  >
                    TRESH
                  </motion.p>
                </div>
                <div className="overflow-hidden pl-[12vw] md:pl-[10vw]">
                  <motion.p
                    initial={reduce ? { opacity: 0 } : { transform: "translateY(-108%)" }}
                    animate={reduce ? { opacity: 1 } : { transform: "translateY(0%)" }}
                    transition={{ duration: reduce ? 0.2 : 0.75, delay: reduce ? 0 : 0.08, ease: ease.drawer }}
                    className="text-[clamp(3.3rem,11vw,10rem)] font-black leading-[0.72] tracking-[-0.08em]"
                  >
                    NANDA
                  </motion.p>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduce ? 0 : 0.35, duration: 0.3 }}
                className="col-span-4 col-start-9 border-t border-white/25 pt-3 text-[9px] font-bold uppercase leading-relaxed tracking-[0.18em] text-white/50 md:col-span-3 md:col-start-10"
              >
                AI systems<br />Automation<br />Full-stack engineering
              </motion.div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-white/45 tabular-nums">
                <span>Now loading</span>
                <span>Vol. 01 / 2026</span>
              </div>
              <div className="h-px overflow-hidden bg-white/15">
                <motion.div
                  className="h-full origin-left bg-[#CCFF00]"
                  initial={{ transform: "scaleX(0)" }}
                  animate={{ transform: "scaleX(1)" }}
                  transition={{ duration: reduce ? 0.2 : 1.05, ease: ease.out }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
