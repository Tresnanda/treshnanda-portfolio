"use client";

import { motion } from "framer-motion";

import { educationEntries, experienceEntries } from "@/data/experience";
import useReducedMotionPreference from "@/hooks/useReducedMotionPreference";
import ChapterFolio from "@/components/ChapterFolio";
import CursorGlow from "@/components/CursorGlow";
import Rule from "@/components/Rule";
import ScrambleText from "@/components/ScrambleText";
import { ease, inView, staggerParent } from "@/lib/motion";

// Same-year engagements print once ("2024"), ranges get an en dash.
const range = (start: string, end: string) => (start === end ? start : `${start}–${end}`);

export default function ExperienceChapter() {
  const reduce = useReducedMotionPreference();
  const entries = experienceEntries.filter((entry) => !entry.placeholder);
  const item = {
    hidden: { opacity: 0, transform: reduce ? "none" : "translateY(16px)" },
    visible: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.5, ease: ease.out } },
  };

  return (
    <section id="experience" aria-labelledby="experience-title" className="editorial-ink border-t border-white/10 py-20 md:py-32">
      <div className="editorial-grid">
        <header className="col-span-12 pb-8 md:pb-12">
          <div className="relative grid grid-cols-12 gap-x-3 md:gap-x-5">
            <ChapterFolio number="02" className="absolute right-0 top-1/2 -translate-y-1/2" />
            <div className="col-span-12 md:col-span-3">
              <p className="editorial-kicker text-system-lime">
                <ScrambleText text="Chapter 02 / Experience" />
              </p>
            </div>
            <div className="col-span-12 mt-8 md:col-span-8 md:col-start-5 md:mt-0">
              <motion.h2
                id="experience-title"
                initial="hidden"
                whileInView="visible"
                viewport={inView}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
                aria-label="Where I've worked."
                className="editorial-display relative max-w-4xl text-white"
              >
                {["Where", "I've", "worked."].map((word, index) => (
                  // The space must live OUTSIDE the overflow-hidden span —
                  // trailing whitespace inside an inline-block is collapsed.
                  <span key={word} aria-hidden="true">
                    <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                      <motion.span
                        variants={{
                          hidden: { y: reduce ? "0%" : "110%", opacity: reduce ? 0 : 1 },
                          visible: { y: "0%", opacity: 1, transition: { duration: 0.7, ease: ease.drawer } },
                        }}
                        className={`inline-block ${index === 2 ? "text-system-lime" : ""}`}
                      >
                        {word}
                      </motion.span>
                    </span>
                    {index < 2 ? " " : ""}
                  </span>
                ))}
              </motion.h2>
            </div>
          </div>
          <Rule className="mt-8 md:mt-12" />
        </header>

        <CursorGlow wrapperClassName="col-span-12" color="rgba(204,255,0,0.07)" size={640}>
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
        >
          {entries.map((entry, index) => (
            <motion.article
              key={entry.id}
              variants={item}
              className="group grid grid-cols-12 gap-x-3 border-b border-white/15 py-8 transition-colors duration-300 hover:border-white/35 md:gap-x-5 md:py-10"
            >
              <p className="col-span-12 editorial-meta transition-colors duration-200 group-hover:!text-system-lime md:col-span-3">
                <span className="mr-4 tabular-nums text-white/25 transition-colors duration-200 group-hover:text-system-lime/60">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {range(entry.start, entry.end)}
              </p>
              <div className="col-span-12 mt-4 md:col-span-5 md:col-start-5 md:mt-0">
                <h3 className="text-xl font-black tracking-[-0.04em] text-white md:text-2xl">{entry.role}</h3>
                <p className="mt-1 text-sm font-semibold text-white/50 transition-colors duration-200 group-hover:text-white/70">
                  {entry.company}
                  {entry.location ? ` / ${entry.location}` : ""}
                </p>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/60 text-pretty transition-colors duration-200 group-hover:text-white/75">
                  {entry.summary}
                </p>
              </div>
              <p className="col-span-12 mt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-white/35 transition-colors duration-200 group-hover:text-white/55 md:col-span-3 md:col-start-10 md:mt-0 md:text-right">
                {(entry.technologies ?? []).join(" / ")}
              </p>
            </motion.article>
          ))}

          <motion.div variants={item} className="mt-16 pb-4 md:mt-20">
            <p className="editorial-kicker text-white/60">
              <ScrambleText text="Appendix / Education" />
            </p>
            <Rule className="mt-4" />
          </motion.div>
          {educationEntries.map((entry) => (
            <motion.div
              key={entry.id}
              variants={item}
              className="group grid grid-cols-12 gap-x-3 border-b border-white/15 py-6 transition-colors duration-300 hover:border-white/35 md:gap-x-5 md:py-7"
            >
              <p className="col-span-12 editorial-meta transition-colors duration-200 group-hover:!text-system-lime md:col-span-3">
                {range(entry.start, entry.end)}
              </p>
              <div className="col-span-12 mt-3 md:col-span-5 md:col-start-5 md:mt-0">
                <h3 className="text-base font-black tracking-[-0.03em] text-white md:text-lg">{entry.program}</h3>
                <p className="mt-1 text-sm font-semibold text-white/50 transition-colors duration-200 group-hover:text-white/70">{entry.school}</p>
              </div>
              <p className="col-span-12 mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white/35 transition-colors duration-200 group-hover:text-white/55 md:col-span-3 md:col-start-10 md:mt-0 md:text-right">
                {entry.note}
              </p>
            </motion.div>
          ))}
        </motion.div>
        </CursorGlow>
      </div>
    </section>
  );
}
