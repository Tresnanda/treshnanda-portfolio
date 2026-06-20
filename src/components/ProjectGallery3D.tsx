"use client";

import { useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as THREE from "three";

/**
 * Scroll-driven 3D project gallery (Three.js / R3F). The section PINS while in
 * view and vertical scroll rotates the ring through every project, so scrolling
 * is browsing — nobody scrolls past without seeing the work. Centred card opens
 * the detail modal; arrows scroll to the prev/next project.
 *
 * Isolated, lazy-loaded leaf (no SSR). The page falls back to the flat rows on
 * mobile / reduced-motion / no-WebGL — see ProjectGallery.
 */

type Variant = "coverflow" | "cylinder" | "helix";
const lerp = THREE.MathUtils.lerp;
const clampN = THREE.MathUtils.clamp;

type Layout = { x: number; y: number; z: number; rotY: number; scale: number };
type Drag = { down: boolean; startX: number; startScroll: number; moved: number; min: number; max: number };

function ringTarget(variant: Variant, offset: number, hovered: boolean): Layout {
  const abs = Math.abs(offset);
  const focus = abs < 0.5;
  const hp = hovered && focus ? 1.05 : 1;
  if (variant === "cylinder") {
    const a = offset * 0.5, R = 4.2;
    return { x: Math.sin(a) * R, y: 0, z: (Math.cos(a) - 1) * R, rotY: -a, scale: (focus ? 1 : 0.92) * hp };
  }
  if (variant === "helix") {
    const a = offset * 0.62, R = 3.4;
    return { x: Math.sin(a) * R, y: -offset * 0.55, z: (Math.cos(a) - 1) * R, rotY: -a, scale: (focus ? 1 : 0.9) * hp };
  }
  return { x: offset * 1.9, y: 0, z: -abs * 1.15 + (hovered && focus ? 0.25 : 0), rotY: clampN(-offset * 0.55, -1, 1), scale: (1 - Math.min(abs * 0.13, 0.42)) * hp };
}

function Card({
  texture,
  index,
  variant,
  posRef,
  dragRef,
  onOpen,
  onHover,
}: {
  texture: THREE.Texture;
  index: number;
  variant: Variant;
  posRef: React.MutableRefObject<number>;
  dragRef: React.MutableRefObject<Drag>;
  onOpen: (index: number) => void;
  onHover: (index: number) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const img = texture.image as { width?: number; height?: number } | undefined;
  const aspect = (img?.width || 16) / (img?.height || 10);
  const H = 2.15;
  const W = H * aspect;

  // Out-of-focus cards get a real disk blur (not transparency); raw sample +
  // sRGB re-encode keeps brightness correct in this custom shader.
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { map: { value: texture }, uBlur: { value: 0 }, uOpacity: { value: 1 } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `
          precision highp float;
          uniform sampler2D map; uniform float uBlur; uniform float uOpacity; varying vec2 vUv;
          void main(){
            vec4 c = texture2D(map, vUv);
            if (uBlur > 0.0002) {
              float total = 1.0;
              for (int i = 0; i < 12; i++) {
                float a = float(i) * 0.5235988;
                vec2 d = vec2(cos(a), sin(a));
                c += texture2D(map, vUv + d * uBlur);
                c += texture2D(map, vUv + d * (uBlur * 0.5));
                total += 2.0;
              }
              c /= total;
            }
            vec3 col = pow(c.rgb, vec3(1.0 / 2.2));
            gl_FragColor = vec4(col, c.a * uOpacity);
          }
        `,
        transparent: true,
        depthWrite: false,
      }),
    [texture]
  );

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const offset = index - posRef.current;
    const abs = Math.abs(offset);
    const t = ringTarget(variant, offset, hovered);
    m.position.x = lerp(m.position.x, t.x, 0.14);
    m.position.y = lerp(m.position.y, t.y, 0.14);
    m.position.z = lerp(m.position.z, t.z, 0.14);
    m.rotation.y = lerp(m.rotation.y, t.rotY, 0.14);
    const s = lerp(m.scale.x, t.scale, 0.14);
    m.scale.set(s, s, s);
    material.uniforms.uBlur.value = lerp(material.uniforms.uBlur.value, abs < 0.5 ? 0 : Math.min(abs * 0.0065, 0.013), 0.14);
    material.uniforms.uOpacity.value = lerp(material.uniforms.uOpacity.value, abs < 0.5 ? 1 : 0.9, 0.14);
  });

  return (
    <mesh
      ref={mesh}
      material={material}
      onClick={(e) => {
        e.stopPropagation();
        if (dragRef.current.moved < 6) onOpen(index);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(index);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[W, H]} />
    </mesh>
  );
}

function Scene({
  projects,
  variant,
  posRef,
  progressRef,
  dragRef,
  onOpen,
  onHover,
}: {
  projects: any[];
  variant: Variant;
  posRef: React.MutableRefObject<number>;
  progressRef: React.MutableRefObject<number>;
  dragRef: React.MutableRefObject<Drag>;
  onOpen: (index: number) => void;
  onHover: (index: number) => void;
}) {
  const urls = useMemo(() => projects.map((p) => p.imageUrl || ""), [projects]);
  const textures = useTexture(urls) as THREE.Texture[];
  textures.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace));
  const last = Math.max(0, projects.length - 1);

  // Scroll progress drives the ring; pos eases toward it for momentum.
  useFrame(() => {
    const target = progressRef.current * last;
    posRef.current += (target - posRef.current) * 0.18;
  });

  return (
    <>
      {projects.map((p, i) => (
        <Card key={p.id ?? i} texture={textures[i]} index={i} variant={variant} posRef={posRef} dragRef={dragRef} onOpen={onOpen} onHover={onHover} />
      ))}
    </>
  );
}

export default function ProjectGallery3D({
  projects,
  onOpen,
  variant = "helix",
}: {
  projects: any[];
  onOpen: (project: any) => void;
  variant?: Variant;
}) {
  const count = projects.length;
  const last = Math.max(1, count - 1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const progressRef = useRef(0);
  const dragRef = useRef<Drag>({ down: false, startX: 0, startScroll: 0, moved: 0, min: 0, max: 0 });
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    const idx = clampN(Math.round(v * last), 0, count - 1);
    setActive((a) => (a === idx ? a : idx));
  });

  const scrollToY = (top: number, immediate = false) => {
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: number, o?: { immediate?: boolean }) => void } }).lenis;
    if (lenis) lenis.scrollTo(top, immediate ? { immediate: true } : undefined);
    else window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
  };

  // Arrows scroll the page to a project's pinned position (smooth via Lenis).
  const go = (dir: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const idx = clampN(active + dir, 0, count - 1);
    const elTop = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    scrollToY(elTop + (idx / last) * range);
  };

  // Pointer drag scrubs the scroll (single source of truth), so dragging
  // left/right rotates the helix exactly like scrolling does.
  const onDragStart = (e: React.PointerEvent) => {
    const el = wrapRef.current;
    const elTop = el ? el.getBoundingClientRect().top + window.scrollY : 0;
    const range = el ? el.offsetHeight - window.innerHeight : 0;
    // Clamp drag-scroll to the pinned range so dragging past the ends can't
    // scroll the page out of the gallery.
    dragRef.current = { down: true, startX: e.clientX, startScroll: window.scrollY, moved: 0, min: elTop, max: elTop + range };
  };
  const onDragMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d.down) return;
    const dx = e.clientX - d.startX;
    d.moved = Math.abs(dx);
    scrollToY(clampN(d.startScroll - dx * 2.4, d.min, d.max), true);
  };
  const onDragEnd = () => {
    dragRef.current.down = false;
  };

  return (
    // Tall track gives the pin its scroll distance; full-bleed so the pinned
    // stage uses the whole viewport width.
    <div
      ref={wrapRef}
      className="relative w-screen left-1/2 -translate-x-1/2"
      style={{ height: `${100 + Math.max(1, count - 1) * 34}vh` }}
    >
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onPointerLeave={onDragEnd}
      >
        {/* Backdrop: soft lime glow behind a faint halftone dot-grid */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 45%, rgba(204,255,0,0.18), transparent 58%)" }} />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(rgba(9,9,11,0.10) 1.5px, transparent 1.6px)",
              backgroundSize: "24px 24px",
              maskImage: "radial-gradient(ellipse 80% 75% at 50% 46%, black 45%, transparent 90%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 75% at 50% 46%, black 45%, transparent 90%)",
            }}
          />
        </div>

        <Canvas className="!absolute inset-0" camera={{ position: [0, 0, 4.6], fov: 46 }} dpr={[1, 2]} gl={{ antialias: true }}>
          <Suspense fallback={null}>
            <Scene projects={projects} variant={variant} posRef={posRef} progressRef={progressRef} dragRef={dragRef} onOpen={(i) => onOpen(projects[i])} onHover={setActive} />
          </Suspense>
        </Canvas>

        {/* Prev / next arrows */}
        <button
          onClick={() => go(-1)}
          disabled={active <= 0}
          aria-label="Previous project"
          className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-zinc-200/70 shadow-lg flex items-center justify-center text-zinc-700 transition-colors hover:bg-black hover:text-system-lime disabled:opacity-25 disabled:hover:bg-white/80 disabled:hover:text-zinc-700"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => go(1)}
          disabled={active >= count - 1}
          aria-label="Next project"
          className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-zinc-200/70 shadow-lg flex items-center justify-center text-zinc-700 transition-colors hover:bg-black hover:text-system-lime disabled:opacity-25 disabled:hover:bg-white/80 disabled:hover:text-zinc-700"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Caption + position dots */}
        <div className="pointer-events-none absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3 px-6 text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">{projects[active]?.category}</p>
          <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-zinc-900">{projects[active]?.title}</h3>
          <div className="flex items-center gap-1.5">
            {projects.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-5 bg-system-lime" : "w-1.5 bg-zinc-300"}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
