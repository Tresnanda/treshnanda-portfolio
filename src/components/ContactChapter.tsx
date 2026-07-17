"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { chromatic } from "slot-text";

import useReducedMotionPreference from "@/hooks/useReducedMotionPreference";
import ChapterFolio from "@/components/ChapterFolio";
import CursorGlow from "@/components/CursorGlow";
import Rule from "@/components/Rule";
import ScrambleText from "@/components/ScrambleText";
import SlotText from "@/components/SlotText";
import type { PortfolioProfile } from "@/lib/portfolio-types";
import { ease, inView, spring, staggerParent } from "@/lib/motion";

type CopyState = "idle" | "copied" | "failed";

const DEFAULT_EMAIL = "treshnanda@gmail.com";
const DEFAULT_WHATSAPP = "https://wa.me/6287852986638";

export default function ContactChapter({ profile }: { profile?: PortfolioProfile }) {
  const reduce = useReducedMotionPreference();
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const resetTimer = useRef<number | null>(null);
  const email = profile?.contactEmail || DEFAULT_EMAIL;
  const whatsapp = profile?.socials?.whatsapp || DEFAULT_WHATSAPP;
  const github = profile?.socials?.github || "https://github.com/Tresnanda";
  const linkedin = profile?.socials?.linkedin || "https://linkedin.com/in/treshnanda";

  useEffect(() => () => {
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }

    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopyState("idle"), 1_800);
  }

  const copyLabel = copyState === "copied" ? "Copied" : copyState === "failed" ? "Copy failed — select email" : email;

  const footerItem = {
    hidden: { opacity: 0, transform: reduce ? "none" : "translateY(14px)" },
    visible: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.5, ease: ease.out } },
  };

  return (
    <footer id="about" className="editorial-ink relative overflow-hidden border-t border-white/10 pb-8 pt-20 text-white md:pt-32">
      <div className="editorial-grid relative">
        <div className="col-span-12 pb-8 md:pb-12">
          <div className="flex items-baseline justify-between gap-4">
            <p className="editorial-kicker text-system-lime">
              <ScrambleText text="Chapter 03 / Contact" />
            </p>
            <p className="editorial-meta">Bali / Remote</p>
          </div>
          <Rule className="mt-8 md:mt-12" />
        </div>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="col-span-12 pt-12 md:pt-20"
        >
          <div className="relative">
            <ChapterFolio number="03" className="absolute right-0 top-1/2 -translate-y-1/2" />
            <div className="relative overflow-hidden pb-[0.18em] -mb-[0.1em]">
              <motion.h2
                variants={{
                  hidden: { opacity: 0, transform: reduce ? "none" : "translateY(105%)" },
                  visible: { opacity: 1, transform: "translateY(0%)", transition: { duration: 0.75, ease: ease.drawer } },
                }}
                className="editorial-display text-white"
              >
                Tell me what&apos;s <span className="text-system-lime">slowing you down.</span>
              </motion.h2>
            </div>
          </div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.45, delay: 0.12, ease: ease.out } },
            }}
            className="grid grid-cols-12 gap-x-3 md:gap-x-5"
          >
            <p className="col-span-12 mt-10 max-w-md text-base leading-relaxed text-white/55 text-pretty md:col-span-4 md:mt-14">
              Most projects start with a process someone runs by hand, every week, forever. I build the system that runs it instead.
            </p>
            <div className="col-span-12 mt-8 grid grid-cols-2 gap-8 md:col-span-4 md:col-start-9 md:mt-14">
              <div>
                <p className="editorial-meta">Status</p>
                <p className="mt-2 text-sm font-semibold text-white">Available for work</p>
              </div>
              <div>
                <p className="editorial-meta">Based in</p>
                <p className="mt-2 text-sm font-semibold text-white">Bali / GMT+8</p>
              </div>
            </div>
          </motion.div>

          <CursorGlow wrapperClassName="mt-12 md:mt-16" color="rgba(204,255,0,0.08)" size={640}>
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.45, delay: 0.2, ease: ease.out } },
            }}
          >
            <Link
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="press group/wa -mx-6 grid grid-cols-12 items-baseline gap-x-3 bg-system-lime px-6 py-7 text-black transition-colors duration-200 hover:bg-white md:-mx-8 md:gap-x-5 md:px-8 md:py-9"
            >
              <span className="col-span-12 editorial-meta !text-black/55 md:col-span-3">WhatsApp / fastest reply</span>
              <span className="col-span-12 mt-2 inline-flex items-center gap-4 text-2xl font-black tracking-[-0.045em] md:col-span-8 md:col-start-5 md:mt-0 md:text-4xl">
                Start a project
                {/* Box-out arrow: exits top-right, re-enters from bottom-left. */}
                <span aria-hidden="true" className="relative h-6 w-6 shrink-0 overflow-hidden md:h-8 md:w-8">
                  <ArrowUpRight className="absolute inset-0 h-full w-full transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover/wa:-translate-y-full group-hover/wa:translate-x-full" />
                  <ArrowUpRight className="absolute inset-0 h-full w-full -translate-x-full translate-y-full transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover/wa:translate-x-0 group-hover/wa:translate-y-0" />
                </span>
              </span>
            </Link>

            <button
              type="button"
              onClick={copyEmail}
              aria-live="polite"
              className="group/mail grid w-full grid-cols-12 items-baseline gap-x-3 border-t border-white/15 py-6 text-left md:gap-x-5 md:py-8"
            >
              <span className="col-span-12 editorial-meta md:col-span-3">Email / replies within a day</span>
              <span className="col-span-12 mt-2 inline-flex max-w-full items-center gap-4 text-2xl font-black tracking-[-0.045em] text-white transition-colors duration-200 group-hover/mail:text-system-lime md:col-span-8 md:col-start-5 md:mt-0 md:text-4xl">
                <SlotText
                  text={copyLabel}
                  options={{ skipUnchanged: false, direction: "up", color: copyState === "copied" ? chromatic() : undefined }}
                  className="break-all sm:break-normal"
                />
                {copyState === "copied" ? (
                  <Check className="h-6 w-6 shrink-0 text-system-lime md:h-8 md:w-8" aria-hidden="true" />
                ) : (
                  <Copy className="h-5 w-5 shrink-0 text-white/40 transition-colors duration-200 group-hover/mail:text-system-lime md:h-6 md:w-6" aria-hidden="true" />
                )}
              </span>
            </button>
          </motion.div>
          </CursorGlow>
        </motion.div>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="col-span-12 grid grid-cols-12 gap-x-3 border-t border-white/20 pb-6 pt-8 md:gap-x-5 md:pb-0 md:pt-10"
        >
          <motion.div variants={footerItem} className="col-span-12 flex flex-col gap-6 md:col-span-4">
            <Link href="/" className="flex w-fit items-center gap-3 text-xl font-black tracking-[-0.05em]">
              <motion.span
                whileHover={reduce ? undefined : { rotate: 90 }}
                transition={spring.press}
                className="flex h-9 w-9 items-center justify-center bg-white text-xs text-black"
              >
                N
              </motion.span>
              NANDA
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/40 text-pretty">Automation engineer in Bali.</p>
          </motion.div>

          <motion.nav variants={footerItem} aria-label="Footer" className="col-span-12 mt-10 grid grid-cols-2 gap-8 md:col-span-4 md:col-start-6 md:mt-0">
            <div className="flex flex-col items-start gap-4">
              <p className="editorial-meta">Connect</p>
              <Link href={github} target="_blank" rel="noreferrer" className="link-underline text-sm font-bold">GitHub</Link>
              <Link href={linkedin} target="_blank" rel="noreferrer" className="link-underline text-sm font-bold">LinkedIn</Link>
              <Link href={`mailto:${email}`} className="link-underline text-sm font-bold">Email</Link>
            </div>
            <div className="flex flex-col items-start gap-4">
              <p className="editorial-meta">Index</p>
              <Link href="#work" className="link-underline text-sm font-bold">Work</Link>
              <Link href="#experience" className="link-underline text-sm font-bold">Experience</Link>
              <Link href="#about" className="link-underline text-sm font-bold">About</Link>
            </div>
          </motion.nav>

          <motion.div variants={footerItem} className="col-span-12 mt-10 flex items-end justify-between md:col-span-3 md:col-start-10 md:mt-0 md:flex-col md:items-end">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
              className="press link-underline group/top inline-flex min-h-11 items-center gap-2 text-sm font-bold text-white/55 transition-colors duration-200 hover:text-white"
            >
              Back to top
              <ArrowRight className="h-4 w-4 -rotate-90 transition-transform duration-200 group-hover/top:-translate-y-1" />
            </button>
            <p className="editorial-meta tabular-nums">© 2026 Treshnanda</p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
