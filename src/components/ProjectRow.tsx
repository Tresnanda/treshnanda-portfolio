"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

import useReducedMotionPreference from "@/hooks/useReducedMotionPreference";
import { ease, inView, spring } from "@/lib/motion";
import type { PortfolioProject } from "@/lib/portfolio-types";

const rowParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.04 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, transform: "translateY(16px)" },
  visible: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.5, ease: ease.out } },
};

const imageReveal: Variants = {
  hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)", transform: "scale(1.035)" },
  visible: {
    opacity: 1,
    clipPath: "inset(0 0 0% 0)",
    transform: "scale(1)",
    transition: { duration: 0.8, ease: ease.drawer },
  },
};

const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: ease.out } },
};

export default function ProjectRow({
  project,
  index,
  onOpen,
}: {
  project: PortfolioProject;
  index: number;
  onOpen: () => void;
}) {
  const reduce = useReducedMotionPreference();
  const flipped = index % 2 === 1;
  const imageRef = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [4, -4]), { stiffness: 170, damping: 24 });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-5, 5]), { stiffness: 170, damping: 24 });
  const sheen = useTransform([pointerX, pointerY], ([x, y]: number[]) =>
    `radial-gradient(320px circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.22), transparent 62%)`,
  );

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType === "touch" || !imageRef.current) return;
    const bounds = imageRef.current.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  const issue = String(index + 1).padStart(2, "0");
  const year = project.createdAt ? new Date(project.createdAt).getFullYear() : "—";

  return (
    <motion.button
      type="button"
      variants={rowParent}
      initial="hidden"
      whileInView="visible"
      viewport={inView}
      whileTap={reduce ? undefined : { scale: 0.99 }}
      transition={spring.press}
      onClick={onOpen}
      aria-label={`Open project: ${project.title}`}
      className="group grid w-full grid-cols-12 gap-x-3 border-t border-black/15 p-4 text-left text-[#11110f] outline-none transition-colors duration-300 first:border-t-0 hover:bg-black/[0.03] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black/60 md:gap-x-5 md:p-7 md:py-10"
    >
      <div className={`col-span-12 md:col-span-7 ${flipped ? "md:order-2 md:col-start-6" : ""}`}>
        <div
          ref={imageRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetPointer}
          style={{ perspective: 1200 }}
        >
          <motion.div
            variants={reduce ? fadeOnly : imageReveal}
            whileHover={reduce ? undefined : { scale: 1.012 }}
            transition={spring.soft}
            style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative aspect-[4/3] overflow-hidden bg-black/5 outline outline-1 -outline-offset-1 outline-black/10"
          >
            {project.imageUrl?.startsWith("/") ? (
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="object-cover object-top transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-[1.015]"
              />
            ) : project.imageUrl ? (
              <img
                src={project.imageUrl}
                alt={project.title}
                width={1600}
                height={1200}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-[1.015]"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-[var(--editorial-paper-muted)]">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-black/35">Image pending / {issue}</span>
              </div>
            )}

            {!reduce ? (
              <motion.div
                aria-hidden="true"
                style={{ backgroundImage: sheen }}
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              />
            ) : null}
          </motion.div>
        </div>

        {/* Figure caption — the meta lives under the image, like a printed plate. */}
        <motion.div variants={fadeUp} className="mt-3 flex items-baseline justify-between gap-4 border-t border-black/20 pt-3">
          <p className="editorial-meta !text-black/45 transition-colors duration-300 group-hover:!text-black/70">
            Fig. {issue} / {project.category}
          </p>
          <p className="editorial-meta !text-black/45 tabular-nums transition-colors duration-300 group-hover:!text-black/70">{year}</p>
        </motion.div>
      </div>

      <div className={`col-span-12 flex min-h-full flex-col pt-7 md:col-span-5 md:pt-0 ${flipped ? "md:order-1 md:pr-8" : "md:pl-8"}`}>
        {/* Editorial masthead: micro-caps kicker beside a giant outlined issue
            numeral. Mirrored on flipped rows so the numeral always sits on the
            outer page edge, like folio numbers on facing spreads. */}
        <motion.div
          variants={fadeUp}
          className={`flex items-start justify-between gap-4 border-b border-black/20 pb-3 ${flipped ? "md:flex-row-reverse" : ""}`}
        >
          <p className="editorial-meta !text-black/45 pt-2">Feature</p>
          <span
            aria-hidden="true"
            className="folio-outline-ink -mt-3 text-[4.5rem] font-black leading-[0.85] tracking-[-0.05em] tabular-nums text-transparent transition-colors duration-300 group-hover:text-[#11110f] md:-mt-4 md:text-[6.5rem]"
          >
            {issue}
          </span>
        </motion.div>

        <motion.div variants={fadeUp} className="pt-6">
          <h3 className="text-3xl font-black leading-[0.9] tracking-[-0.06em] text-balance md:text-5xl">
            {/* Ink underline draws left→right under the title on hover. */}
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat [background-position:0%_96%] [background-size:0%_0.05em] transition-[background-size] duration-350 ease-[var(--ease-out-quint)] group-hover:[background-size:100%_0.05em]">
              {project.title}
            </span>
          </h3>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-black/58 text-pretty transition-colors duration-300 group-hover:text-black/75 md:text-base">{project.description}</p>
        </motion.div>

        {/* Spec ledger: the plate's technical colophon fills the column with
            real information instead of dead paper. */}
        <motion.dl variants={fadeUp} className="mt-8 md:mt-10">
          {(project.tags ?? []).length > 0 ? (
            <div className="grid grid-cols-12 gap-x-3 border-t border-black/15 py-3 md:gap-x-5">
              <dt className="col-span-4 editorial-meta !text-black/45">Stack</dt>
              <dd className="col-span-8 text-[10px] font-bold uppercase leading-relaxed tracking-[0.12em] text-black/60 transition-colors duration-300 group-hover:text-black/80">
                {(project.tags ?? []).slice(0, 4).join(" / ")}
              </dd>
            </div>
          ) : null}
          <div className="grid grid-cols-12 gap-x-3 border-t border-black/15 py-3 md:gap-x-5">
            <dt className="col-span-4 editorial-meta !text-black/45">Status</dt>
            <dd className="col-span-8 text-[10px] font-bold uppercase leading-relaxed tracking-[0.12em] text-black/60 transition-colors duration-300 group-hover:text-black/80">
              {project.status || "In production"}
            </dd>
          </div>
        </motion.dl>

        {/* Pinned to the plate's bottom edge, level with the figure caption. */}
        <motion.div variants={fadeUp} className="mt-auto flex items-center justify-between gap-5 border-t border-black/20 pt-5">
          <p className="editorial-meta !text-black/45 transition-colors duration-300 group-hover:!text-black/70">Open the feature</p>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-black text-white transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </span>
        </motion.div>
      </div>
    </motion.button>
  );
}
