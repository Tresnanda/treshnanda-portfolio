"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, GitBranch as Github, Link as Linkedin, Mail, ExternalLink, Menu, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import SmoothScroll from "@/components/SmoothScroll";
import Magnetic from "@/components/Magnetic";

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
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const textRevealVariants = {
  hidden: { y: "100%" },
  visible: { 
    y: 0, 
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
  }
};

export default function HomePage({ initialProjects, userProfile }: any) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    // Simulate loading for preloader
    const timer = setTimeout(() => setIsLoading(false), 2000);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const hero = {
    name: userProfile?.name || "Treshnanda",
    role: userProfile?.role || "AI SYSTEMS & BUSINESS AUTOMATION ENGINEER",
    headline: userProfile?.heroHeadline || "I build systems that eliminate manual work and help businesses scale.",
    subheadline: userProfile?.heroSubheadline || "From AI-powered automation to custom business platforms, I design and build reliable systems that save time, reduce costs, and drive real results.",
  };

  return (
    <SmoothScroll>
      <div className="min-h-screen selection:bg-emerald-100 selection:text-emerald-900 bg-[#FCFBFA]">
        
        {/* Preloader */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              exit={{ y: "-100%" }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
            >
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center"
              >
                <div className="text-white text-2xl font-black tracking-tighter mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-black">N</span>
                   TRESHNANDA.SYSTEM
                </div>
                <div className="w-48 h-px bg-white/10 relative overflow-hidden">
                   <motion.div 
                    initial={{ left: "-100%" }}
                    animate={{ left: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-emerald-500 w-1/2"
                   />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Header */}
        <header className={`fixed top-0 w-full z-50 transition-all duration-700 ${isScrolled ? "py-4 bg-white/70 backdrop-blur-2xl border-b border-zinc-100 shadow-sm" : "py-8 bg-transparent"}`}>
          <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-2 group">
              <motion.span 
                whileHover={{ rotate: 90 }}
                className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-lg text-xs transition-colors group-hover:bg-emerald-600"
              >
                N
              </motion.span>
              {hero.name}
            </Link>
            
            <div className="hidden md:flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
              {["Work", "Services", "About"].map((item) => (
                <Link key={item} href={`#${item.toLowerCase()}`} className="hover:text-black transition-colors relative group py-2">
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-emerald-500 transition-all duration-500 group-hover:w-full" />
                </Link>
              ))}
              <Magnetic>
                <div>
                  <Link href="mailto:hi@treshnanda.tech" className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-black hover:bg-emerald-600 transition-all flex items-center gap-3">
                    LET'S TALK <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </Magnetic>
            </div>

            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </nav>
        </header>

        {/* Mobile Menu Overlay */}
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
                   <Link key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between group hover:text-emerald-500 transition-colors">
                     {item} <ArrowRight className="w-10 h-10 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                   </Link>
                 ))}
              </div>
              <div className="mt-auto flex flex-col gap-6">
                 <div className="flex gap-4">
                    <Link href="#" className="p-4 bg-white/5 rounded-2xl hover:bg-emerald-500 transition-colors"><Github className="w-6 h-6" /></Link>
                    <Link href="#" className="p-4 bg-white/5 rounded-2xl hover:bg-emerald-500 transition-colors"><Linkedin className="w-6 h-6" /></Link>
                 </div>
                 <Link href="mailto:hi@treshnanda.tech" className="w-full bg-emerald-500 text-black py-6 rounded-2xl text-center font-black uppercase tracking-widest">
                   Initiate Project
                 </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main>
          {/* Hero Section */}
          <section className="pt-56 pb-40 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="lg:col-span-8"
              >
                <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-10">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  {hero.role}
                </motion.div>
                
                <div className="overflow-hidden mb-10">
                  <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl md:text-[7rem] font-black tracking-tighter leading-[0.9] text-zinc-900">
                    {hero.headline.split(" ").map((word: string, i: number) => (
                      <span key={i} className="inline-block mr-4">
                        <span className={word.toLowerCase() === "eliminate" ? "text-emerald-600 italic font-serif" : ""}>
                          {word}
                        </span>
                      </span>
                    ))}
                  </motion.h1>
                </div>

                <motion.p variants={itemVariants} className="text-xl md:text-3xl text-zinc-400 max-w-2xl leading-tight mb-16 font-medium">
                  {hero.subheadline}
                </motion.p>
                
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6">
                  <Magnetic>
                    <Link href="mailto:hi@treshnanda.tech" className="btn-primary text-xl px-12 py-6 rounded-2xl group">
                      Tell me your problem <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />
                    </Link>
                  </Magnetic>
                  <Magnetic>
                    <Link href="#work" className="btn-secondary text-xl px-12 py-6 rounded-2xl">
                      View my work
                    </Link>
                  </Magnetic>
                </motion.div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                className="lg:col-span-4 relative group hidden lg:block"
              >
                <div className="aspect-[3/4] bg-zinc-100 rounded-[4rem] overflow-hidden relative border border-zinc-200 shadow-2xl overflow-hidden">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-black/5"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                     <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8 rotate-3">
                        <span className="text-4xl">🏗️</span>
                     </div>
                     <p className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400 mb-2">System.Active</p>
                     <p className="text-xl font-bold tracking-tight text-zinc-600 italic font-serif">"Architecting logic that scales with zero friction."</p>
                  </div>
                </div>

                {/* Floating HUD elements */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }} 
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-10 -right-10 p-8 bg-black text-white shadow-2xl rounded-[2.5rem] border border-white/10 z-10"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-black font-black text-xl">99</div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Stability Index</p>
                      <p className="text-base font-bold tracking-tighter">Autonomous Core</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Selected Works */}
          <section id="work" className="py-40 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8 border-b border-zinc-100 pb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">Selected<br/>Architecture</h2>
                  <p className="text-zinc-400 text-xl max-w-md font-medium">Real-world solutions engineered for absolute scale.</p>
                </motion.div>
                <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-6 py-3 rounded-full uppercase tracking-[0.3em] tabular-nums mb-2">
                  BUFFER_INDEX: 01 — {initialProjects.length.toString().padStart(2, '0')}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {initialProjects.length > 0 ? initialProjects.map((project: any, i: number) => (
                  <motion.div 
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                    className="project-card border-none bg-transparent shadow-none"
                  >
                    <div className="aspect-[16/9] bg-zinc-100 rounded-[3rem] mb-10 overflow-hidden relative group cursor-pointer border border-zinc-100 shadow-sm hover:shadow-2xl transition-all duration-700">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 bg-white flex items-center justify-center"
                      >
                         <span className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-200 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700">{project.title}</span>
                         <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/5 transition-colors duration-700" />
                      </motion.div>
                      <div className="absolute top-8 right-8 w-14 h-14 bg-black rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500 ease-out">
                         <ArrowRight className="w-6 h-6 -rotate-45" />
                      </div>
                    </div>
                    <div className="px-4">
                      <span className="inline-block text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">
                        {project.category}
                      </span>
                      <h3 className="text-4xl font-black mb-6 tracking-tighter text-zinc-900 group-hover:text-emerald-600 transition-colors uppercase">{project.title}</h3>
                      <p className="text-zinc-500 text-lg leading-relaxed mb-10 max-w-xl font-medium">
                        {project.description}
                      </p>
                      <Link href={project.link || "#"} className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] group/link">
                        EXPLORE ARCHITECTURE <div className="w-8 h-[1px] bg-zinc-200 group-hover/link:w-12 group-hover/link:bg-emerald-500 transition-all duration-500" />
                      </Link>
                    </div>
                  </motion.div>
                )) : (
                  <div className="col-span-2 py-60 text-center border-2 border-dashed border-zinc-100 rounded-[4rem] text-zinc-300 uppercase tracking-[0.5em] font-black text-sm">
                    Cache empty. Awaiting commitment.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer id="about" className="pt-40 pb-20 px-6 bg-black text-white relative overflow-hidden">
            {/* Visual background element */}
            <div className="absolute top-0 right-0 w-[60rem] h-[60rem] bg-emerald-500/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-40">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.6em] mb-12"
              >
                The Next Iteration
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-9xl font-black tracking-tighter mb-20 leading-[0.85]"
              >
                Let's architect<br/>the <span className="italic font-serif text-emerald-500 underline decoration-white/10">impossible</span>.
              </motion.p>
              
              <div className="flex flex-wrap justify-center gap-8">
                <Magnetic>
                  <Link href="mailto:hi@treshnanda.tech" className="bg-emerald-500 text-black px-16 py-8 rounded-[2rem] text-2xl font-black uppercase tracking-tighter hover:scale-105 transition-transform">
                    Initiate Sequence
                  </Link>
                </Magnetic>
              </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20 border-t border-white/10 pt-20">
               <div className="flex flex-col gap-8">
                  <div className="text-2xl font-black tracking-tighter flex items-center gap-3">
                    <span className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-lg text-xs">N</span>
                    TRESHNANDA
                  </div>
                  <p className="text-zinc-500 font-medium leading-relaxed max-w-xs">
                    Engineering autonomous intelligence and high-fidelity business systems.
                  </p>
               </div>
               
               <div className="grid grid-cols-2 gap-10">
                  <div className="flex flex-col gap-6">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Connect</p>
                    <Link href="https://github.com/Tresnanda" className="text-sm font-bold hover:text-emerald-500 transition-colors uppercase tracking-widest">Github</Link>
                    <Link href="https://linkedin.com/in/treshnanda" className="text-sm font-bold hover:text-emerald-500 transition-colors uppercase tracking-widest">Linkedin</Link>
                    <Link href="mailto:hi@treshnanda.tech" className="text-sm font-bold hover:text-emerald-500 transition-colors uppercase tracking-widest">Mail</Link>
                  </div>
                  <div className="flex flex-col gap-6">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Index</p>
                    <Link href="#work" className="text-sm font-bold hover:text-emerald-500 transition-colors uppercase tracking-widest">Work</Link>
                    <Link href="#services" className="text-sm font-bold hover:text-emerald-500 transition-colors uppercase tracking-widest">Services</Link>
                    <Link href="/admin" className="text-sm font-bold text-zinc-800 transition-colors uppercase tracking-widest">Admin</Link>
                  </div>
               </div>

               <div className="md:text-right flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Uptime Status</p>
                    <p className="text-sm font-bold uppercase tracking-tighter text-emerald-500">System Operational 100%</p>
                  </div>
                  <div className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] mt-10">
                    © 2026 Treshnanda Architecture
                  </div>
               </div>
            </div>
          </footer>
        </main>
      </div>
    </SmoothScroll>
  );
}
