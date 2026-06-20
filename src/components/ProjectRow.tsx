"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ease, spring, inView } from "@/lib/motion";

/**
 * One Selected-Works row. Microinteractions, all gated on reduced-motion:
 *  - entrance: image wipes up (clip-path), text cascades in (stagger)
 *  - hover: image tilts toward the cursor on a spring (decorative, weighty)
 *           with a cursor-following sheen + a gentle scale
 *  - CTA: arrow nudges out, underline draws left→right
 *  - press: whole row dips (Emil's tactile feedback)
 *
 * Premium personality: long, smooth reveals (no overshoot); springy but damped hover.
 */

const rowParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: ease.out } },
};

const imageReveal: Variants = {
  // Wipe up from the bottom; the rounded corners come from the clipping parent.
  hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)", scale: 1.06 },
  visible: { opacity: 1, clipPath: "inset(0 0 0% 0)", scale: 1, transition: { duration: 0.9, ease: ease.drawer } },
};

const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: ease.out } },
};

export default function ProjectRow({
  project,
  index,
  onOpen,
}: {
  project: any;
  index: number;
  onOpen: () => void;
}) {
  const reduce = useReducedMotion();
  const flipped = index % 2 === 1;
  const ref = useRef<HTMLDivElement>(null);

  // Pointer position within the image, normalised to -0.5..0.5, spring-smoothed
  // so the tilt has momentum instead of snapping to the cursor.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), { stiffness: 150, damping: 18 });
  const sheen = useTransform([px, py], ([x, y]: number[]) =>
    `radial-gradient(300px circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.22), transparent 60%)`
  );

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <motion.div
      variants={rowParent}
      initial="hidden"
      whileInView="visible"
      viewport={inView}
      whileTap={reduce ? undefined : { scale: 0.99 }}
      transition={spring.press}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}
      className="group grid md:grid-cols-2 gap-7 md:gap-14 items-center cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-system-lime focus-visible:ring-offset-4 focus-visible:ring-offset-white rounded-3xl"
    >
      {/* Image — tilts on a spring, sheen follows the cursor, wipes up on enter */}
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ perspective: 1000 }}
        className={flipped ? "md:order-2" : ""}
      >
        <motion.div
          variants={reduce ? fadeOnly : imageReveal}
          whileHover={reduce ? undefined : { scale: 1.03 }}
          transition={spring.soft}
          style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200/70 transition-colors duration-300 group-hover:border-zinc-300 will-change-transform"
        >
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">{project.title}</span>
            </div>
          )}

          {/* Sheen — secondary layer, only paints on hover */}
          {!reduce && (
            <motion.div
              aria-hidden
              style={{ backgroundImage: sheen }}
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
            />
          )}
        </motion.div>
      </div>

      {/* Text */}
      <div className="md:px-2">
        <motion.p variants={fadeUp} className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
          {project.category}
        </motion.p>
        <motion.h3 variants={fadeUp} className="text-2xl md:text-4xl font-black tracking-tighter text-zinc-900 mb-4 leading-[1.05]">
          {project.title}
        </motion.h3>
        <motion.p variants={fadeUp} className="text-zinc-500 text-base leading-relaxed line-clamp-3 max-w-md mb-6">
          {project.description}
        </motion.p>
        <motion.span
          variants={fadeUp}
          className="relative inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-900"
        >
          View Project
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-zinc-900 transition-transform duration-300 ease-out group-hover:scale-x-100" />
        </motion.span>
      </div>
    </motion.div>
  );
}
