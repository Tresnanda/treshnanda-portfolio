"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/motion";

/**
 * Word-by-word reveal: each word rises out of a clipped baseline with a short
 * stagger, so a headline "sets" into place instead of just fading. Reduced
 * motion collapses to a single opacity fade (movement dropped, meaning kept).
 */
export default function RevealText({
  text,
  className,
  as = "h2",
  delay = 0,
}: {
  text: string;
  className?: string;
  as?: "h2" | "h3" | "p" | "span";
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as any;

  if (reduce) {
    return (
      <MotionTag
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay }}
      >
        {text}
      </MotionTag>
    );
  }

  const words = text.split(" ");
  const parent = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: delay } } };
  const child = { hidden: { y: "110%" }, visible: { y: 0, transition: { duration: 0.7, ease: ease.drawer } } };

  return (
    <MotionTag
      className={className}
      variants={parent}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      aria-label={text}
    >
      {words.map((word, i) => (
        // overflow-hidden clips the word until it rises; padding reserves room
        // for descenders so g/y/p don't get cropped by the clip.
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span className="inline-block" variants={child}>
            {word}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </MotionTag>
  );
}
