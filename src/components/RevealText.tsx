"use client";

import { motion } from "framer-motion";

import useReducedMotionPreference from "@/hooks/useReducedMotionPreference";
import { ease } from "@/lib/motion";

export default function RevealText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotionPreference();

  if (reduce) {
    return (
      <motion.h2
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.35, delay, ease: ease.out }}
      >
        {text}
      </motion.h2>
    );
  }

  const words = text.split(" ");
  const parent = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: delay } } };
  const child = { hidden: { y: "110%" }, visible: { y: 0, transition: { duration: 0.7, ease: ease.drawer } } };

  return (
    <motion.h2
      className={className}
      variants={parent}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      aria-label={text}
    >
      {words.map((word, index) => (
        // The separating space lives outside the overflow-hidden span --
        // trailing whitespace inside an inline-block is collapsed.
        <span key={`${word}-${index}`} aria-hidden="true">
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span className="inline-block" variants={child}>
              {word}
            </motion.span>
          </span>
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </motion.h2>
  );
}
