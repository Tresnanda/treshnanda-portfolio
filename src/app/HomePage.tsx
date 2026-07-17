"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, ExternalLink, Menu, X, ChevronRight, Layout } from "lucide-react";
import Link from "next/link";
import SmoothScroll from "@/components/SmoothScroll";
import Magnetic from "@/components/Magnetic";
import ShaderBackground from "@/components/ShaderBackground";
import StatusPill from "@/components/StatusPill";
import ProjectGallery from "@/components/ProjectGallery";
import RevealText from "@/components/RevealText";
import PortfolioLoader from "@/components/PortfolioLoader";
import StackIndex from "@/components/StackIndex";
import ExperienceChapter from "@/components/ExperienceChapter";
import ContactChapter from "@/components/ContactChapter";
import ChapterFolio from "@/components/ChapterFolio";
import ChapterRail from "@/components/ChapterRail";
import CountUp from "@/components/CountUp";
import Rule from "@/components/Rule";
import ScrambleText from "@/components/ScrambleText";
import { ease, spring } from "@/lib/motion";
import type { PortfolioProfile, PortfolioProject } from "@/lib/portfolio-types";

export default function HomePage({
  initialProjects,
  userProfile,
}: {
  initialProjects: PortfolioProject[];
  userProfile?: PortfolioProfile;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgDir, setImgDir] = useState(0);
  const [imgError, setImgError] = useState(false);
  const reduce = useReducedMotion();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  const openProject = useCallback((project: PortfolioProject) => {
    lastFocusedElement.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setCurrentImageIndex(0);
    setImgDir(0);
    setSelectedProject(project);
  }, []);

  const closeProject = useCallback(() => {
    setSelectedProject(null);
    window.requestAnimationFrame(() => lastFocusedElement.current?.focus());
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    const pageContent = document.querySelector<HTMLElement>("[data-page-content]");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    pageContent?.setAttribute("inert", "");
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      pageContent?.removeAttribute("inert");
    };
  }, [selectedProject]);

  const allImages = useMemo(() => {
    if (!selectedProject) return [];
    const images = selectedProject.images ?? [];
    const cover = selectedProject.imageUrl;

    if (cover && !images.includes(cover)) return [cover, ...images];
    if (images.length > 0) return images;
    return cover ? [cover] : [];
  }, [selectedProject]);

  // Image paging tracks direction so the gallery slides the correct way.
  const paginate = useCallback((dir: number) => {
    setImgDir(dir);
    setCurrentImageIndex((prev) => (prev + dir + allImages.length) % allImages.length);
  }, [allImages.length]);

  // Modal keyboard support: trap focus, close with Escape, and page media with arrows.
  useEffect(() => {
    if (!selectedProject) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeProject();
        return;
      }
      if (event.key === "ArrowRight" && allImages.length > 1) paginate(1);
      else if (event.key === "ArrowLeft" && allImages.length > 1) paginate(-1);
      else if (event.key === "Tab") {
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable?.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedProject, allImages.length, paginate, closeProject]);

  const hero = {
    name: userProfile?.name || "Treshnanda",
    role: userProfile?.role || "AI SYSTEMS & AUTOMATION ENGINEER",
    headline: userProfile?.heroHeadline || "I build AI systems that eliminate repetitive work.",
    subheadline: userProfile?.heroSubheadline || "AI systems & automation engineer.",
  };

  // Modal motion — premium personality: weighty drawer-curve enter, snappy exit.
  // Reduced motion collapses everything to a plain fade.
  const modalPanel = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0, transition: { duration: 0.15 } }, transition: { duration: 0.25 } }
    : {
        initial: { opacity: 0, scale: 0.96, y: 24, filter: "blur(8px)" },
        animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, scale: 0.98, y: 12, filter: "blur(4px)", transition: { duration: 0.2, ease: ease.in } },
        transition: { duration: 0.5, ease: ease.drawer },
      };
  const modalStagger = { hidden: {}, visible: { transition: { staggerChildren: reduce ? 0 : 0.07, delayChildren: 0.15 } } };
  const modalItem: Variants = { hidden: { opacity: 0, y: reduce ? 0 : 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } } };
  const imgSlide: Variants = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d > 0 ? 50 : -50, filter: "blur(8px)" }),
    center: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: ease.out } },
    exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d > 0 ? -50 : 50, filter: "blur(6px)", transition: { duration: 0.3, ease: ease.in } }),
  };

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#0A0A0A]">
        <PortfolioLoader portraitUrl={userProfile?.avatarUrl} />

        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={closeProject}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />
              <motion.div
                ref={modalRef}
                {...modalPanel}
                role="dialog"
                aria-modal="true"
                aria-labelledby="project-modal-title"
                className="relative w-full max-w-5xl h-[85vh] max-h-[680px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row will-change-transform"
              >
                <motion.button
                  ref={closeButtonRef}
                  onClick={closeProject}
                  aria-label="Close project details"
                  whileHover={reduce ? undefined : { rotate: 90 }}
                  whileTap={reduce ? undefined : { scale: 0.88 }}
                  transition={spring.press}
                  className="absolute top-6 right-6 sm:top-8 sm:right-8 z-30 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-xl"
                >
                  <X className="w-6 h-6" />
                </motion.button>

                <div className="w-full md:w-1/2 h-72 md:h-auto bg-zinc-950 relative overflow-hidden">
                  {allImages[currentImageIndex] ? (
                    <>
                      <motion.img
                        key={`bg-${currentImageIndex}`}
                        aria-hidden="true"
                        src={allImages[currentImageIndex]}
                        alt=""
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                        transition={{ duration: 0.6, ease: ease.out }}
                        className="absolute inset-0 w-full h-full object-cover scale-125 blur-3xl saturate-150"
                      />
                      <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/40" />
                      <AnimatePresence initial={false} custom={imgDir}>
                        <motion.img
                          key={currentImageIndex}
                          custom={imgDir}
                          variants={imgSlide}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          src={allImages[currentImageIndex]}
                          alt={selectedProject.title}
                          className="absolute inset-0 z-[1] w-full h-full object-contain drop-shadow-2xl"
                        />
                      </AnimatePresence>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-200">
                       <Layout className="w-20 h-20" />
                    </div>
                  )}

                  {allImages.length > 1 && (
                    <div className="absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-4 pointer-events-none">
                       <motion.button
                         aria-label="Previous project image"
                         whileTap={reduce ? undefined : { scale: 0.88 }}
                         transition={spring.press}
                         onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                         className="pointer-events-auto w-11 h-11 bg-white/15 border border-white/25 backdrop-blur-xl text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-system-lime hover:text-black hover:border-system-lime transition-colors duration-200"
                       >
                          <ChevronRight className="w-5 h-5 rotate-180" />
                       </motion.button>
                       <motion.button
                         aria-label="Next project image"
                         whileTap={reduce ? undefined : { scale: 0.88 }}
                         transition={spring.press}
                         onClick={(e) => { e.stopPropagation(); paginate(1); }}
                         className="pointer-events-auto w-11 h-11 bg-white/15 border border-white/25 backdrop-blur-xl text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-system-lime hover:text-black hover:border-system-lime transition-colors duration-200"
                       >
                          <ChevronRight className="w-5 h-5" />
                       </motion.button>
                    </div>
                  )}

                  <div className="absolute bottom-8 left-8 flex items-end gap-4 z-20">
                    <span className="px-4 py-2 bg-system-lime text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      {selectedProject.category}
                    </span>
                    {allImages.length > 1 && (
                       <div className="flex items-center gap-1.5 pb-2.5">
                          {allImages.map((_, i) => (
                             <button
                               key={i}
                               aria-label={`Go to image ${i + 1}`}
                               onClick={(e) => { e.stopPropagation(); setImgDir(i > currentImageIndex ? 1 : -1); setCurrentImageIndex(i); }}
                               className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ease-out ${i === currentImageIndex ? 'bg-system-lime w-5' : 'bg-white/40 w-1.5 hover:bg-white'}`}
                             />
                          ))}
                       </div>
                    )}
                  </div>
                </div>

                <motion.div
                  variants={modalStagger}
                  initial="hidden"
                  animate="visible"
                  className="flex-1 p-8 sm:p-12 overflow-y-auto bg-white text-left"
                >
                  <motion.h2 id="project-modal-title" variants={modalItem} className="text-3xl sm:text-5xl font-black tracking-tighter uppercase mb-6 leading-[0.9]">
                    {selectedProject.title}
                  </motion.h2>
                  <motion.div variants={modalItem} className="w-16 h-1 bg-system-lime mb-8 rounded-full origin-left" />
                  <motion.p variants={modalItem} className="text-lg text-zinc-500 font-medium leading-relaxed mb-8">
                    {selectedProject.description}
                  </motion.p>

                  <motion.div variants={modalItem} className="flex flex-wrap gap-4">
                    {selectedProject.link && (
                      <a href={selectedProject.link} target="_blank" rel="noreferrer" className="press shine group/btn bg-black text-white px-8 py-4 rounded-xl flex items-center gap-3 font-black uppercase tracking-widest text-xs hover:bg-system-lime-dark transition-colors shadow-lg">
                        View Project <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                      </a>
                    )}
                    {selectedProject.github && (
                      <a href={selectedProject.github} target="_blank" rel="noreferrer" className="press group/btn bg-zinc-50 text-black px-8 py-4 rounded-xl flex items-center gap-3 font-black uppercase tracking-widest text-xs border border-zinc-100 hover:bg-zinc-100 transition-colors">
                        Source Code <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                      </a>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div data-page-content>
        <ChapterRail />
        {/* Header */}
        <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "py-4 bg-[#0A0A0A]/70 backdrop-blur-2xl border-b border-white/10" : "py-8 bg-transparent"}`}>
          <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-2 group text-white">
              <motion.span
                whileHover={reduce ? undefined : { rotate: 90 }}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-xs transition-colors bg-white text-black group-hover:bg-system-lime"
              >
                N
              </motion.span>
              {hero.name}
            </Link>

            <div className="hidden md:flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.2em] text-white/60">
              {["Work", "Experience", "About"].map((item) => (
                <Link key={item} href={`#${item.toLowerCase()}`} className="transition-colors relative group py-2 text-white/60 hover:text-system-lime">
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-system-lime transition-[width] duration-300 group-hover:w-full" />
                </Link>
              ))}
              <Magnetic>
                <div>
                  <Link href="https://wa.me/6287852986638" target="_blank" rel="noreferrer" className="press shine group/talk px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-3 bg-white text-black hover:bg-system-lime">
                    Let&apos;s talk <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover/talk:translate-x-1" />
                  </Link>
                </div>
              </Magnetic>
            </div>

            <button aria-label="Open navigation" className="md:hidden min-h-11 min-w-11 p-2 text-white" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>
          </nav>
        </header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={reduce ? { opacity: 0 } : { x: "100%" }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%" }}
              transition={{ duration: reduce ? 0.18 : 0.45, ease: ease.drawer }}
              className="fixed inset-0 z-[100] bg-black p-8 flex flex-col text-white"
            >
              <div className="flex justify-between items-center mb-20">
                 <div className="text-xs font-black tracking-[0.4em] uppercase text-zinc-500">Navigation</div>
                 <button aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                   <X className="w-6 h-6" aria-hidden="true" />
                 </button>
              </div>
              <motion.div
                className="flex flex-col gap-8 text-6xl font-black tracking-tighter"
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
              >
                 {["Work", "Experience", "About"].map((item) => (
                   <motion.div
                     key={item}
                     variants={{ hidden: { opacity: 0, x: reduce ? 0 : 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: ease.out } } }}
                   >
                     <Link href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between group hover:text-system-lime transition-colors">
                       {item} <ArrowRight className="w-10 h-10 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0" />
                     </Link>
                   </motion.div>
                 ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="bg-[#0A0A0A] text-white">
          {/* BRUTALIST BILLBOARD HERO - SCALED DOWN */}
          <section className="relative h-screen flex flex-col items-center justify-center pt-20 pb-10 overflow-hidden">
            {/* Flowing mesh-gradient shader (Paper Shaders) sits behind everything */}
            <ShaderBackground />

            <div className="w-full relative z-10 flex flex-col items-center h-full justify-center">
              {/* Massive Billboard Name - Stretched fully horizontal */}
              <div className="relative w-full text-center mt-12 md:mt-4 mb-12 md:mb-10 overflow-visible">
                <div className="flex flex-col items-center w-full">
                  <div className="w-full flex justify-between items-center select-none py-32 md:py-40 px-0">
                    {"NANDA".split("").map((letter, i) => (
                      <span
                        key={i}
                        className="block font-black leading-none uppercase text-[12vw] md:text-[3vw] scale-y-[3.5] scale-x-[2.2] md:scale-y-[11.0] md:scale-x-[8.5]"
                        style={{
                          transformOrigin: 'center',
                          width: '20%',
                          textAlign: 'center'
                        }}
                      >
                        {letter}
                      </span>
                    ))}
                  </div>
                  
                  {/* The Danny Petty Style Lime Bar - Cutting through from Bottom-Left to Top-Right */}
                  <div
                    className="absolute top-1/2 left-1/2 z-30 flex items-center overflow-hidden border-y border-black/10 bg-system-lime h-8 md:h-16 w-[400vw]"
                    style={{ transform: 'translate(-50%, -50%) rotate(-12deg)' }}
                  >
                    <motion.div
                      animate={reduce ? undefined : { x: ["0%", "-50%"] }}
                      transition={reduce ? undefined : {
                        duration: 30,
                        ease: "linear",
                        repeat: Infinity
                      }}
                      className="flex whitespace-nowrap"
                      style={{ width: 'max-content' }}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div key={n} className="flex items-center gap-12 text-black font-black text-[12px] md:text-[18px] uppercase tracking-[0.2em] px-6">
                          <span>AI agents</span>
                          <span className="text-2xl">/</span>
                          <span>Workflow automation</span>
                          <span className="text-2xl">/</span>
                          <span>Full-stack engineering</span>
                          <span className="text-2xl">/</span>
                        </div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Circular Profile Overlay — positioning stays on the wrapper so
                      the spring pop (scale/opacity) never clobbers the centering. */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                    <div
                      className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 md:border-8 border-[#0A0A0A] overflow-hidden shadow-2xl bg-zinc-900 flex items-center justify-center ring-1 ring-system-lime/30"
                    >
                      {(userProfile?.avatarUrl && !imgError) ? (
                         <img
                           src={userProfile.avatarUrl}
                           className="w-full h-full object-cover"
                           alt=""
                           fetchPriority="high"
                           decoding="async"
                           onError={() => setImgError(true)}
                         />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-500 italic font-serif">
                           <span className="text-3xl md:text-3xl">N</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tagline & Call to Action - Contained within max-w-7xl */}
              <div className="max-w-7xl mx-auto w-full px-6 flex flex-col items-center">
                <div className="text-center max-w-xl">
                  <p className="text-sm md:text-xl text-zinc-400 font-medium leading-relaxed mb-8">
                    I build AI systems and automations that take repetitive work off people&apos;s plates.
                  </p>

                  <div>
                    <Magnetic strength={0.4}>
                      <Link href="https://wa.me/6287852986638" className="press bg-white text-black px-8 py-4 md:px-10 md:py-5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-system-lime hover:text-black transition-colors shadow-xl inline-block">
                        Start a Project
                      </Link>
                    </Magnetic>
                  </div>
                </div>

              </div>
            </div>

            {/* Corner Navigation/Socials */}
            <div className="absolute bottom-10 left-10 hidden md:flex gap-8 font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <Link href="https://github.com/Tresnanda" target="_blank" rel="noreferrer" className="py-2 hover:text-system-lime transition-colors">GitHub</Link>
                <Link href="https://linkedin.com/in/treshnanda" target="_blank" rel="noreferrer" className="py-2 hover:text-system-lime transition-colors">LinkedIn</Link>
            </div>
            <div className="absolute bottom-10 right-10 hidden md:flex items-center gap-4">
                <StatusPill label="Available for work" />
            </div>
          </section>

          <StackIndex />

          <section id="work" aria-labelledby="work-title" className="editorial-ink relative border-t border-white/10 py-20 md:py-32">
            <div className="editorial-grid">
              <header className="col-span-12 pb-10 md:pb-14">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="editorial-kicker text-system-lime">
                    <ScrambleText text="Chapter 01 / Selected work" />
                  </p>
                  <p className="editorial-meta">
                    <CountUp value={initialProjects.length} /> projects
                  </p>
                </div>
                <div className="relative mt-10 md:mt-14">
                  <ChapterFolio number="01" className="absolute right-0 top-1/2 -translate-y-1/2" />
                  <RevealText
                    text="Shipped."
                    className="editorial-display relative text-white"
                  />
                </div>
                <div className="mt-8 grid grid-cols-12 gap-x-3 md:mt-10 md:gap-x-5">
                  <motion.p
                    initial={{ opacity: 0, transform: reduce ? "none" : "translateY(14px)" }}
                    whileInView={{ opacity: 1, transform: "translateY(0px)" }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.55, delay: 0.25, ease: ease.out }}
                    className="col-span-12 text-base leading-relaxed text-white/50 text-pretty md:col-span-5 md:col-start-8"
                  >
                    Everything here runs in production. Open a project for the problem it solved and how it was built.
                  </motion.p>
                </div>
                <Rule className="mt-10 md:mt-14" />
              </header>

              <div className="col-span-12 pt-10 md:pt-16">
                <ProjectGallery projects={initialProjects} onOpen={openProject} />
              </div>
            </div>
          </section>

          <ExperienceChapter />
        </main>

        <ContactChapter profile={userProfile} />
        </div>
      </div>
    </SmoothScroll>
  );
}
