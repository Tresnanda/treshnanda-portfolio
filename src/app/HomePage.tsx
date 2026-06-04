"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Mail, ExternalLink, Menu, X, ChevronRight, Layout } from "lucide-react";
import Link from "next/link";
import SmoothScroll from "@/components/SmoothScroll";
import Magnetic from "@/components/Magnetic";
import ShaderBackground from "@/components/ShaderBackground";
import VelocityMarquee from "@/components/VelocityMarquee";
import Reveal from "@/components/Reveal";
import StatusPill from "@/components/StatusPill";
import { ease, spring } from "@/lib/motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: ease.out }
  }
};

// Each billboard letter rises from a bottom clip — clip-path doesn't touch the
// heavy scale transform on the span, so the two never fight.
const letterReveal: any = {
  hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
  visible: {
    opacity: 1,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.9, ease: ease.drawer }
  }
};

const letterParent: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } }
};

export default function HomePage({ initialProjects, userProfile }: any) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    // Shorter hold; the preloader is a first-impression delight, not a tax.
    const timer = setTimeout(() => setIsLoading(false), reduce ? 400 : 1500);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [reduce]);

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

  const hero = {
    name: userProfile?.name || "Treshnanda",
    role: userProfile?.role || "AI SYSTEMS & AUTOMATION ENGINEER",
    headline: userProfile?.heroHeadline || "I build AI systems that eliminate repetitive work.",
    subheadline: userProfile?.heroSubheadline || "AI systems & automation engineer.",
  };

  // Cards: variant-level transition controls the entrance; the component-level
  // spring (below) drives hover/tap. Movement is dropped under reduced motion.
  const cardVariants: any = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: ease.out, delay: Math.min(i * 0.08, 0.5) },
    }),
  };

  return (
    <SmoothScroll>
      <div className="min-h-screen selection:bg-system-lime/20 selection:text-black bg-[#FCFBFA]">
        
        {/* Preloader */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              exit={{ y: "-100%" }}
              transition={{ duration: 0.9, ease: ease.drawer }}
              className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
            >
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center"
              >
                <div className="text-white text-2xl font-black tracking-tighter mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-system-lime rounded-xl flex items-center justify-center text-black">N</span>
                   NANDA.SYSTEM
                </div>
                <div className="w-48 h-px bg-white/10 relative overflow-hidden">
                   <motion.div 
                    initial={{ left: "-100%" }}
                    animate={{ left: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-system-lime w-1/2"
                   />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-8">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ y: 100, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 100, opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
              >
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-8 right-8 z-10 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:rotate-90 transition-transform shadow-xl"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="w-full md:w-1/2 h-64 md:h-auto bg-zinc-950 relative group/img overflow-hidden">
                  {allImages[currentImageIndex] ? (
                    <>
                      <img
                        aria-hidden="true"
                        src={allImages[currentImageIndex]}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover scale-125 blur-3xl opacity-70 saturate-150"
                      />
                      <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/40" />
                      <motion.img 
                        key={currentImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        src={allImages[currentImageIndex]} 
                        alt={selectedProject.title}
                        className="relative z-[1] w-full h-full object-contain drop-shadow-2xl"
                      />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-200">
                       <Layout className="w-20 h-20" />
                    </div>
                  )}
                  
                  {allImages.length > 1 && (
                    <div className="absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-4 pointer-events-none">
                       <button 
                         aria-label="Previous project image"
                         onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((currentImageIndex - 1 + allImages.length) % allImages.length); }}
                         className="pointer-events-auto w-11 h-11 bg-white/15 border border-white/25 backdrop-blur-xl text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-system-lime hover:text-black hover:border-system-lime transition-colors"
                       >
                          <ChevronRight className="w-5 h-5 rotate-180" />
                       </button>
                       <button 
                         aria-label="Next project image"
                         onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((currentImageIndex + 1) % allImages.length); }}
                         className="pointer-events-auto w-11 h-11 bg-white/15 border border-white/25 backdrop-blur-xl text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-system-lime hover:text-black hover:border-system-lime transition-colors"
                       >
                          <ChevronRight className="w-5 h-5" />
                       </button>
                    </div>
                  )}

                  <div className="absolute bottom-8 left-8 flex items-end gap-4">
                    <span className="px-4 py-2 bg-system-lime text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      {selectedProject.category}
                    </span>
                    {allImages.length > 1 && (
                       <div className="flex gap-1.5 pb-2">
                          {allImages.map((_: any, i: number) => (
                             <button 
                               key={i} 
                               onClick={() => setCurrentImageIndex(i)}
                               className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'bg-system-lime w-4' : 'bg-white/40 hover:bg-white'}`} 
                             />
                          ))}
                       </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 p-8 sm:p-12 overflow-y-auto bg-white text-left">
                  <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase mb-6 leading-[0.9]">
                    {selectedProject.title}
                  </h2>
                  <div className="w-16 h-1 bg-system-lime mb-8 rounded-full" />
                  <p className="text-lg text-zinc-500 font-medium leading-relaxed mb-8">
                    {selectedProject.description}
                  </p>

                  <div className="flex flex-wrap gap-6">
                    {selectedProject.link && (
                      <a href={selectedProject.link} target="_blank" className="bg-black text-white px-8 py-4 rounded-xl flex items-center gap-3 font-black uppercase tracking-widest text-xs hover:bg-system-lime-dark transition-colors shadow-lg active:scale-95">
                        View Project <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {selectedProject.github && (
                      <a href={selectedProject.github} target="_blank" className="bg-zinc-50 text-black px-8 py-4 rounded-xl flex items-center gap-3 font-black uppercase tracking-widest text-xs border border-zinc-100 hover:bg-zinc-100 transition-colors active:scale-95">
                        Source Code <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
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
                  <Link href="https://wa.me/6287852986638" target="_blank" className={`press px-8 py-3 rounded-full text-[10px] font-black transition-colors flex items-center gap-3 ${isScrolled ? "bg-black text-white hover:bg-system-lime-dark" : "bg-white text-black hover:bg-system-lime"}`}>
                    LET'S TALK <ArrowRight className="w-3 h-3" />
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
              <div className="flex flex-col gap-8 text-6xl font-black tracking-tighter">
                 {["Work", "Services", "About"].map((item) => (
                   <Link key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between group hover:text-system-lime transition-colors">
                     {item} <ArrowRight className="w-10 h-10 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                   </Link>
                 ))}
              </div>
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
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center w-full"
                >
                  <motion.div
                    variants={letterParent}
                    initial="hidden"
                    animate="visible"
                    className="w-full flex justify-between items-center select-none py-32 md:py-48 px-0"
                  >
                    {"NANDA".split("").map((letter, i) => (
                      <motion.span
                        key={i}
                        variants={reduce ? itemVariants : letterReveal}
                        className="block font-black leading-none uppercase text-[12vw] md:text-[3vw] scale-y-[3.5] scale-x-[2.2] md:scale-y-[11.0] md:scale-x-[8.5]"
                        style={{
                          transformOrigin: 'center',
                          width: '20%',
                          textAlign: 'center'
                        }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </motion.div>
                  
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
                    <motion.div
                      initial={{ opacity: 0, scale: reduce ? 1 : 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={reduce ? { delay: 0.5, duration: 0.5 } : { delay: 0.7, ...spring.pop }}
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
                    </motion.div>
                  </div>
                </motion.div>
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
                <StatusPill label="Available for work" />
            </div>
          </section>

          {/* STACK — full-bleed marquee band */}
          <section className="relative bg-[#0A0A0A] py-14 md:py-20 border-t border-white/5 overflow-hidden">
            <p className="text-center text-[9px] font-black uppercase tracking-[0.5em] text-zinc-600 mb-8">Stack</p>
            <VelocityMarquee
              items={['Next.js', 'TypeScript', 'Supabase', 'pgvector', 'Hono', 'Python', 'React Native', 'Docker']}
            />
          </section>

          {/* PROJECT GRID */}
          <section id="work" className="py-16 md:py-28 bg-white text-zinc-900 relative">
            <div className="max-w-7xl mx-auto px-6">
              <Reveal as="div" className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 border-b border-zinc-100 pb-6">
                <div className="text-left">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-2 uppercase leading-[0.9]">Selected<br/>Works</h2>
                    <p className="text-zinc-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Recent projects &amp; systems I&apos;ve built</p>
                </div>
                <div className="text-[9px] font-black text-system-lime bg-black px-4 py-1.5 rounded-full uppercase tracking-[0.3em] tabular-nums">
                  001 — {initialProjects.length.toString().padStart(3, '0')}
                </div>
              </Reveal>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {initialProjects.map((project: any, i: number) => (
                  <motion.div
                    key={project.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    whileHover={reduce ? undefined : { y: -8 }}
                    whileTap={reduce ? undefined : { scale: 0.99 }}
                    transition={spring.soft}
                    onClick={() => setSelectedProject(project)}
                    className="group cursor-pointer text-left"
                  >
                    <div className="aspect-[16/10] bg-gradient-to-br from-zinc-900 to-black rounded-2xl md:rounded-3xl mb-5 overflow-hidden relative border border-zinc-100 shadow-sm group-hover:shadow-2xl group-hover:shadow-system-lime/10 transition-shadow duration-500">
                      {project.imageUrl ? (
                         <img src={project.imageUrl} className="absolute inset-0 w-full h-full object-contain scale-100 group-hover:scale-[1.05] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" alt={project.title} />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                           <span className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-600">{project.title}</span>
                        </div>
                      )}

                      {/* Category tag — always visible, top-left */}
                      <span className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-md text-system-lime text-[9px] font-black uppercase tracking-widest rounded-full border border-white/10">
                        {project.category}
                      </span>

                      {/* "View" affordance — slides in on hover so it's clear the card opens */}
                      <span className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-system-lime text-black text-[10px] font-black uppercase tracking-widest rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-lg">
                        View <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div className="px-1">
                      <h3 className="text-xl md:text-2xl font-black mb-2 tracking-tighter uppercase group-hover:text-system-lime-dark transition-colors leading-none">{project.title}</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed font-medium line-clamp-2">{project.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>
        
        {/* Footer */}
        <footer id="about" className="pt-16 pb-8 px-6 bg-black text-white relative overflow-hidden text-left">
            {/* Visual background element */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-system-lime/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-20 md:mb-24">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[9px] font-black text-system-lime uppercase tracking-[0.6em] mb-8"
              >
                Get in touch
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-6xl font-black tracking-tighter mb-12 md:mb-16 leading-tight"
              >
                Let's build<br/>something <span className="italic font-serif text-system-lime">great</span>.
              </motion.p>
              
              <div className="flex flex-wrap justify-center gap-6">
                <Magnetic strength={0.5}>
                  <Link href="https://wa.me/6287852986638" className="press inline-block bg-system-lime text-black px-8 py-4 rounded-xl text-lg font-black uppercase tracking-tighter hover:bg-white transition-colors shadow-xl shadow-system-lime/20">
                    Start a Project
                  </Link>
                </Magnetic>
              </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 border-t border-white/5 pt-16">
               <div className="flex flex-col gap-8">
                  <div className="text-2xl font-black tracking-tighter flex items-center gap-3">
                    <span className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-lg text-xs">N</span>
                    NANDA
                  </div>
                  <p className="text-zinc-500 font-medium leading-relaxed max-w-xs">
                    Building AI systems and automation that help businesses work faster and waste less.
                  </p>
               </div>
               
               <div className="grid grid-cols-2 gap-10">
                  <div className="flex flex-col gap-6">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Connect</p>
                    <Link href="https://github.com/Tresnanda" className="text-sm font-bold hover:text-system-lime transition-colors uppercase tracking-widest">Github</Link>
                    <Link href="https://linkedin.com/in/treshnanda" className="text-sm font-bold hover:text-system-lime transition-colors uppercase tracking-widest">Linkedin</Link>
                    <Link href="mailto:hi@treshnanda.tech" className="text-sm font-bold hover:text-system-lime transition-colors uppercase tracking-widest">Mail</Link>
                  </div>
                  <div className="flex flex-col gap-6">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Index</p>
                    <Link href="#work" className="text-sm font-bold hover:text-system-lime transition-colors uppercase tracking-widest">Work</Link>
                    <Link href="#services" className="text-sm font-bold hover:text-system-lime transition-colors uppercase tracking-widest">Services</Link>
                    <Link href="/admin" className="text-sm font-bold text-zinc-800 transition-colors uppercase tracking-widest">Admin</Link>
                  </div>
               </div>

               <div className="md:text-right flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Availability</p>
                    <p className="text-sm font-bold uppercase tracking-tighter text-system-lime">Open to new projects</p>
                  </div>
                  <div className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] mt-10">
                    © 2026 Treshnanda
                  </div>
               </div>
            </div>
        </footer>
      </div>
    </SmoothScroll>
  );
}
