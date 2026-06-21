"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, ExternalLink, Menu, X, ChevronRight, Layout, Copy, Check } from "lucide-react";
import Link from "next/link";
import SmoothScroll from "@/components/SmoothScroll";
import Magnetic from "@/components/Magnetic";
import ShaderBackground from "@/components/ShaderBackground";
import VelocityMarquee from "@/components/VelocityMarquee";
import Reveal from "@/components/Reveal";
import StatusPill from "@/components/StatusPill";
import ProjectGallery from "@/components/ProjectGallery";
import RevealText from "@/components/RevealText";
import CursorGlow from "@/components/CursorGlow";
import ScrambleText from "@/components/ScrambleText";
import SlotText from "@/components/SlotText";
import { chromatic } from "slot-text";
import { ease, spring } from "@/lib/motion";

export default function HomePage({ initialProjects, userProfile }: any) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgDir, setImgDir] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const reduce = useReducedMotion();

  const EMAIL = "treshnanda@gmail.com";
  const copyEmail = () => {
    navigator.clipboard?.writeText(EMAIL).catch(() => {});
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 1600);
  };

  // Top scroll-progress bar — spring-smoothed so it eases rather than snaps.
  const { scrollYProgress } = useScroll();
  const progressX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
      setCurrentImageIndex(0);
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedProject]);

  const allImages = useMemo(() => {
    if (!selectedProject) return [];
    const images = selectedProject.images || [];
    if (selectedProject.imageUrl && !images.includes(selectedProject.imageUrl)) {
      return [selectedProject.imageUrl, ...images];
    }
    return images.length > 0 ? images : [selectedProject.imageUrl];
  }, [selectedProject]);

  // Image paging tracks direction so the gallery slides the correct way.
  const paginate = useCallback((dir: number) => {
    setImgDir(dir);
    setCurrentImageIndex((prev) => (prev + dir + allImages.length) % allImages.length);
  }, [allImages.length]);

  // Keyboard: Esc closes, arrows page through images (modal only).
  useEffect(() => {
    if (!selectedProject) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
      else if (e.key === "ArrowRight" && allImages.length > 1) paginate(1);
      else if (e.key === "ArrowLeft" && allImages.length > 1) paginate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedProject, allImages.length, paginate]);

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
  const modalItem: any = { hidden: { opacity: 0, y: reduce ? 0 : 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } } };
  const imgSlide: any = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d > 0 ? 50 : -50, filter: "blur(8px)" }),
    center: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: ease.out } },
    exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d > 0 ? -50 : 50, filter: "blur(6px)", transition: { duration: 0.3, ease: ease.in } }),
  };

  // Footer motion — headline rises line-by-line out of a clip, columns cascade.
  const footerStagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } };
  const lineRise: any = { hidden: { y: reduce ? 0 : "110%", opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: ease.drawer } } };
  const colItem: any = { hidden: { opacity: 0, y: reduce ? 0 : 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.out } } };

  return (
    <SmoothScroll>
      <div className="min-h-screen selection:bg-system-lime/20 selection:text-black bg-[#FCFBFA]">
        
        {/* Scroll progress — thin lime line that fills as you move down the page */}
        <motion.div
          style={{ scaleX: progressX }}
          className="fixed top-0 left-0 right-0 h-[3px] bg-system-lime origin-left z-[250] pointer-events-none"
        />

        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedProject(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />
              <motion.div
                {...modalPanel}
                role="dialog"
                aria-modal="true"
                aria-label={selectedProject.title}
                className="relative w-full max-w-5xl h-[85vh] max-h-[680px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row will-change-transform"
              >
                <motion.button
                  onClick={() => setSelectedProject(null)}
                  aria-label="Close"
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
                          {allImages.map((_: any, i: number) => (
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
                  <motion.h2 variants={modalItem} className="text-3xl sm:text-5xl font-black tracking-tighter uppercase mb-6 leading-[0.9]">
                    {selectedProject.title}
                  </motion.h2>
                  <motion.div variants={modalItem} className="w-16 h-1 bg-system-lime mb-8 rounded-full origin-left" />
                  <motion.p variants={modalItem} className="text-lg text-zinc-500 font-medium leading-relaxed mb-8">
                    {selectedProject.description}
                  </motion.p>

                  <motion.div variants={modalItem} className="flex flex-wrap gap-4">
                    {selectedProject.link && (
                      <a href={selectedProject.link} target="_blank" className="press shine group/btn bg-black text-white px-8 py-4 rounded-xl flex items-center gap-3 font-black uppercase tracking-widest text-xs hover:bg-system-lime-dark transition-colors shadow-lg">
                        View Project <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                      </a>
                    )}
                    {selectedProject.github && (
                      <a href={selectedProject.github} target="_blank" className="press group/btn bg-zinc-50 text-black px-8 py-4 rounded-xl flex items-center gap-3 font-black uppercase tracking-widest text-xs border border-zinc-100 hover:bg-zinc-100 transition-colors">
                        Source Code <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                      </a>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Header */}
        <header className={`fixed top-0 w-full z-50 transition-all duration-700 ${isScrolled ? "py-4 bg-white/70 backdrop-blur-2xl border-b border-zinc-100 shadow-sm" : "py-8 bg-transparent"}`}>
          <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <Link href="/" className={`text-xl font-black tracking-tighter flex items-center gap-2 group transition-colors ${isScrolled ? "text-zinc-900" : "text-white"}`}>
              <motion.span 
                whileHover={{ rotate: 90 }}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs transition-colors ${isScrolled ? "bg-black text-white group-hover:bg-system-lime-dark" : "bg-white text-black group-hover:bg-system-lime"}`}
              >
                N
              </motion.span>
              {hero.name}
            </Link>
            
            <div className={`hidden md:flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${isScrolled ? "text-zinc-400" : "text-white/60"}`}>
              {["Work", "Services", "About"].map((item) => (
                <Link key={item} href={`#${item.toLowerCase()}`} className={`transition-colors relative group py-2 ${isScrolled ? "hover:text-system-lime-dark text-zinc-400" : "hover:text-system-lime text-white/60"}`}>
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-system-lime transition-all duration-500 group-hover:w-full" />
                </Link>
              ))}
              <Magnetic>
                <div>
                  <Link href="https://wa.me/6287852986638" target="_blank" className={`press shine group/talk px-8 py-3 rounded-full text-[10px] font-black transition-colors flex items-center gap-3 ${isScrolled ? "bg-black text-white hover:bg-system-lime-dark" : "bg-white text-black hover:bg-system-lime"}`}>
                    LET'S TALK <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover/talk:translate-x-1" />
                  </Link>
                </div>
              </Magnetic>
            </div>

            <button className={`md:hidden p-2 transition-colors ${isScrolled ? "text-zinc-900" : "text-white"}`} onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </nav>
        </header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-[100] bg-black p-8 flex flex-col text-white"
            >
              <div className="flex justify-between items-center mb-20">
                 <div className="text-xs font-black tracking-[0.4em] uppercase text-zinc-500">Navigation</div>
                 <button onClick={() => setMobileMenuOpen(false)} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                   <X className="w-6 h-6" />
                 </button>
              </div>
              <motion.div
                className="flex flex-col gap-8 text-6xl font-black tracking-tighter"
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
              >
                 {["Work", "Services", "About"].map((item) => (
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
              <div className="relative w-full text-center mt-12 md:mt-24 mb-12 md:mb-16 overflow-visible">
                <div className="flex flex-col items-center w-full">
                  <div className="w-full flex justify-between items-center select-none py-32 md:py-48 px-0">
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
                      animate={{ x: ["0%", "-50%"] }}
                      transition={{ 
                        duration: 30, 
                        ease: "linear", 
                        repeat: Infinity 
                      }}
                      className="flex whitespace-nowrap"
                      style={{ width: 'max-content' }}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div key={n} className="flex items-center gap-12 text-black font-black text-[12px] md:text-[18px] uppercase tracking-[0.2em] px-6">
                          <span>AI Systems & Automation</span>
                          <span className="text-2xl">/</span>
                          <span>Workflow & Process Automation</span>
                          <span className="text-2xl">/</span>
                          <span>Full-Stack Engineering</span>
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
                  <motion.p 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="text-[13px] md:text-xl text-zinc-400 font-medium leading-relaxed mb-8"
                  >
                    I design and build AI systems and automation that remove repetitive work,
                    streamline operations, and help teams ship faster.
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.5, ease: ease.out }}
                  >
                    <Magnetic strength={0.4}>
                      <Link href="https://wa.me/6287852986638" className="press bg-white text-black px-8 py-4 md:px-10 md:py-5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-system-lime hover:text-black transition-colors shadow-xl inline-block">
                        Start a Project
                      </Link>
                    </Magnetic>
                  </motion.div>
                </div>

              </div>
            </div>

            {/* Corner Navigation/Socials */}
            <div className="absolute bottom-10 left-10 hidden md:flex gap-8 mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <Link href="#" className="hover:text-system-lime transition-colors">Github</Link>
                <Link href="#" className="hover:text-system-lime transition-colors">Linkedin</Link>
            </div>
            <div className="absolute bottom-10 right-10 hidden md:flex items-center gap-4">
                <StatusPill cycle={["Available for work", "Open to collab", "Replies in 24h"]} />
            </div>
          </section>

          {/* STACK — full-bleed marquee band */}
          <section className="relative bg-[#0A0A0A] py-14 md:py-20 border-t border-white/5 overflow-hidden">
            <div className="text-center mb-8">
              <ScrambleText text="Stack" className="mono text-[9px] font-black uppercase tracking-[0.5em] text-zinc-600" />
            </div>
            <VelocityMarquee
              items={['Next.js', 'TypeScript', 'Supabase', 'pgvector', 'Hono', 'Python', 'React Native', 'Docker']}
            />
          </section>

          {/* PROJECT GRID */}
          <section id="work" className="py-16 md:py-28 bg-white text-zinc-900 relative">
            <div className="max-w-7xl mx-auto px-6">
              <Reveal as="div" className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 md:mb-16 border-b border-zinc-200/70 pb-6">
                <div className="text-left">
                    <RevealText as="h2" text="Selected Works" className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] text-zinc-900 mb-3" />
                    <p className="text-zinc-500 text-sm font-medium">Recent projects &amp; systems I&apos;ve built</p>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 tabular-nums">
                  <SlotText from="00" text={initialProjects.length.toString().padStart(2, "0")} options={{ direction: "up" }} /> Projects
                </span>
              </Reveal>
              
              <ProjectGallery projects={initialProjects} onOpen={setSelectedProject} />
            </div>
          </section>
        </main>
        
        {/* Footer */}
        <footer id="about" className="pt-16 pb-8 px-6 bg-black text-white relative overflow-hidden text-left">
            {/* Visual background element */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-system-lime/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            
            <CursorGlow className="max-w-7xl mx-auto mb-20 md:mb-28">
              {/* Top row — decoding eyebrow on the left, live availability on the right */}
              <div className="flex items-center justify-between mb-8 md:mb-12">
                <ScrambleText text="Get in touch" className="mono text-[10px] sm:text-[11px] font-black text-system-lime uppercase tracking-[0.45em]" />
                <p className="hidden sm:flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  <span className="relative flex h-2 w-2">
                    {!reduce && (
                      <motion.span
                        className="absolute inset-0 rounded-full bg-system-lime"
                        animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
                        transition={{ duration: 2, ease: ease.out, repeat: Infinity }}
                      />
                    )}
                    <span className="relative h-2 w-2 rounded-full bg-system-lime" />
                  </span>
                  <SlotText cycle={["Open to new projects", "Replies within 24h", "Remote, worldwide"]} cycleMs={3000} options={{ skipUnchanged: false }} className="uppercase" />
                </p>
              </div>

              {/* Giant left-aligned statement, rising line-by-line */}
              <motion.h2
                variants={footerStagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-12 md:mb-16"
              >
                <span className="block overflow-hidden pb-[0.05em]">
                  <motion.span variants={lineRise} className="block">Let&apos;s build</motion.span>
                </span>
                <span className="block overflow-hidden pb-[0.14em]">
                  <motion.span variants={lineRise} className="block">
                    something <span className="italic font-serif text-system-lime">great</span>.
                  </motion.span>
                </span>
              </motion.h2>

              {/* Primary action + a big magnetic email as the second path */}
              <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
                <Magnetic strength={0.4}>
                  <Link href="https://wa.me/6287852986638" className="press shine group/cta inline-flex items-center gap-3 bg-system-lime text-black px-8 py-4 rounded-xl text-base md:text-lg font-black uppercase tracking-tighter hover:bg-white transition-colors shadow-xl shadow-system-lime/20">
                    Start a Project
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/cta:translate-x-1" />
                  </Link>
                </Magnetic>

                <Magnetic strength={0.25}>
                  <button
                    onClick={copyEmail}
                    aria-label={emailCopied ? "Email copied" : "Copy email address"}
                    className={`group/mail inline-flex items-center gap-3 text-2xl md:text-4xl font-black tracking-tighter transition-colors ${emailCopied ? "text-system-lime" : "text-white hover:text-system-lime"}`}
                  >
                    <SlotText
                      text={emailCopied ? "Copied!" : EMAIL}
                      options={{ skipUnchanged: false, direction: "up", color: emailCopied ? chromatic() : undefined }}
                    />
                    {emailCopied ? (
                      <Check className="w-6 h-6 md:w-7 md:h-7 shrink-0 text-system-lime" />
                    ) : (
                      <Copy className="w-5 h-5 md:w-6 md:h-6 shrink-0 opacity-50 transition-opacity group-hover/mail:opacity-100" />
                    )}
                  </button>
                </Magnetic>
              </div>
            </CursorGlow>

            {/* Divider draws itself in as the footer enters view */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: ease.out }}
              className="max-w-7xl mx-auto h-px bg-white/10 origin-left mb-16"
            />

            <motion.div
              variants={footerStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20"
            >
               <motion.div variants={colItem} className="flex flex-col gap-8">
                  <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-3 w-fit">
                    <motion.span
                      whileHover={reduce ? undefined : { rotate: 90 }}
                      transition={spring.press}
                      className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-lg text-xs"
                    >
                      N
                    </motion.span>
                    NANDA
                  </Link>
                  <p className="text-zinc-500 font-medium leading-relaxed max-w-xs">
                    Building AI systems and automation that help businesses work faster and waste less.
                  </p>
               </motion.div>

               <motion.div variants={colItem} className="grid grid-cols-2 gap-10">
                  <div className="flex flex-col gap-6">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Connect</p>
                    <Link href="https://github.com/Tresnanda" className="link-underline text-sm font-bold hover:text-system-lime transition-colors uppercase tracking-widest">Github</Link>
                    <Link href="https://linkedin.com/in/treshnanda" className="link-underline text-sm font-bold hover:text-system-lime transition-colors uppercase tracking-widest">Linkedin</Link>
                    <Link href="mailto:treshnanda@gmail.com" className="link-underline text-sm font-bold hover:text-system-lime transition-colors uppercase tracking-widest">Mail</Link>
                  </div>
                  <div className="flex flex-col gap-6">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Index</p>
                    <Link href="#work" className="link-underline text-sm font-bold hover:text-system-lime transition-colors uppercase tracking-widest">Work</Link>
                    <Link href="#services" className="link-underline text-sm font-bold hover:text-system-lime transition-colors uppercase tracking-widest">Services</Link>
                    <Link href="/admin" className="text-sm font-bold text-zinc-800 transition-colors uppercase tracking-widest">Admin</Link>
                  </div>
               </motion.div>

               <motion.div variants={colItem} className="md:items-end flex flex-col justify-between gap-10">
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
                    className="link-underline group/top inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
                  >
                    Back to top
                    <ArrowRight className="w-4 h-4 -rotate-90 transition-transform duration-300 group-hover/top:-translate-y-1" />
                  </button>
                  <div className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] md:text-right">
                    © 2026 Treshnanda
                  </div>
               </motion.div>
            </motion.div>
        </footer>
      </div>
    </SmoothScroll>
  );
}
