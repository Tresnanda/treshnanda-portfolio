"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import useReducedMotionPreference from "@/hooks/useReducedMotionPreference";
import { ease } from "@/lib/motion";

const CHAPTERS = [
  { id: "work", index: "01", label: "Work" },
  { id: "experience", index: "02", label: "Experience" },
  { id: "about", index: "03", label: "Contact" },
];

/**
 * Fixed running-head on the right edge: shows which chapter of the issue is
 * crossing the viewport center. Crossfades with blur between chapters and
 * disappears entirely in the hero. Decorative, desktop only.
 */
export default function ChapterRail() {
  const reduce = useReducedMotionPreference();
  const [active, setActive] = useState<string | null>(null);
  const centered = useRef(new Set<string>());

  useEffect(() => {
    const sections = CHAPTERS.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    // A section is "current" while it crosses the viewport's center band.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) centered.current.add(entry.target.id);
          else centered.current.delete(entry.target.id);
        }
        const current = CHAPTERS.find((c) => centered.current.has(c.id));
        setActive(current?.id ?? null);
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const chapter = CHAPTERS.find((c) => c.id === active);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed bottom-10 right-7 z-40 hidden lg:block">
      <AnimatePresence mode="wait" initial={false}>
        {chapter ? (
          <motion.p
            key={chapter.id}
            initial={{ opacity: 0, filter: "blur(6px)", y: reduce ? 0 : 12 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(6px)", y: reduce ? 0 : -12, transition: { duration: 0.22, ease: ease.in } }}
            transition={{ duration: 0.45, ease: ease.out }}
            className="editorial-meta"
            style={{ writingMode: "vertical-rl" }}
          >
            Chapter {chapter.index} / {chapter.label}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
