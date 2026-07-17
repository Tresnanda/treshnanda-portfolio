"use client";
/* eslint-disable react-hooks/immutability -- R3F frame loops intentionally mutate Three.js objects and shader uniforms. */

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import * as THREE from "three";

import type { PortfolioProject } from "@/lib/portfolio-types";
import { ease } from "@/lib/motion";

/**
 * Three swiss-editorial 3D showcase experiments for the Work chapter. The rule
 * they all share: 3D is a MATERIAL inside a grid-aligned, hairline-framed
 * figure — never the layout. Typography stays in HTML on the 12-column grid.
 *
 *  - "plates":   the editorial feature rows, but each image is a WebGL plane
 *                that unfurls on reveal and tilts subtly under the cursor.
 *  - "stack":    index-and-plate spread; flat planes stacked like printed
 *                cards under an orthographic camera, shuffled from the index.
 *  - "exploded": one project separated into layered slices, isometric, like
 *                an exploded technical illustration.
 */

export type ShowcaseVariant = "plates" | "stack" | "exploded";

const lerp = THREE.MathUtils.lerp;
const clampN = THREE.MathUtils.clamp;

const FALLBACK_TEXTURE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='1000'%3E%3Crect width='100%25' height='100%25' fill='%23161616'/%3E%3C/svg%3E";

function getTextureUrl(url: string | null | undefined) {
  if (!url) return FALLBACK_TEXTURE;
  if (url.startsWith("/")) return `/_next/image?url=${encodeURIComponent(url)}&w=1200&q=75`;
  return url;
}

/** Cover-crop UV transform for a texture displayed inside a box of `boxAspect`. */
function coverUv(texture: THREE.Texture, boxAspect: number) {
  const img = texture.image as { width?: number; height?: number } | undefined;
  const ta = (img?.width || 16) / (img?.height || 10);
  let sx = 1;
  let sy = 1;
  if (ta > boxAspect) sx = boxAspect / ta;
  else sy = ta / boxAspect;
  return { scale: new THREE.Vector2(sx, sy), offset: new THREE.Vector2((1 - sx) / 2, (1 - sy) / 2) };
}

// Raw sample + sRGB re-encode keeps brightness correct in custom shaders.
const FRAG_COMMON = `
  precision highp float;
  uniform sampler2D map;
  uniform vec2 uUvScale;
  uniform vec2 uUvOffset;
  uniform float uDim;
  uniform float uEdge;
  varying vec2 vUv;
  void main() {
    vec2 uv = uUvOffset + vUv * uUvScale;
    vec4 c = texture2D(map, uv);
    vec3 col = pow(c.rgb, vec3(1.0 / 2.2));
    col *= 1.0 - uDim;
    // Hairline edge so slices read as printed plates, not floating pixels.
    if (uEdge > 0.5) {
      float d = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
      float line = 1.0 - smoothstep(0.0, 0.012, d);
      col = mix(col, vec3(0.956, 0.949, 0.925), line * 0.55);
    }
    gl_FragColor = vec4(col, 1.0);
  }
`;

function makePlateMaterial(texture: THREE.Texture, boxAspect: number, edge = false) {
  const { scale, offset } = coverUv(texture, boxAspect);
  return new THREE.ShaderMaterial({
    uniforms: {
      map: { value: texture },
      uUvScale: { value: scale },
      uUvOffset: { value: offset },
      uDim: { value: 0 },
      uEdge: { value: edge ? 1 : 0 },
      uReveal: { value: 0 },
    },
    vertexShader: `
      uniform float uReveal;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 p = position;
        float r = 1.0 - uReveal;
        // Unfurl: the sheet settles flat as it reveals.
        p.z += sin(uv.y * 3.14159) * r * 0.22;
        p.z += sin((uv.x + uv.y) * 6.28318) * r * 0.045;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: FRAG_COMMON,
  });
}

function useSRGB(textures: THREE.Texture[]) {
  textures.forEach((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(texture.anisotropy || 1, 4);
  });
}

type InvalidateRef = React.MutableRefObject<(() => void) | null>;

function InvalidateBridge({ invalidateRef }: { invalidateRef: InvalidateRef }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidateRef.current = invalidate;
    invalidate();
    return () => {
      invalidateRef.current = null;
    };
  }, [invalidate, invalidateRef]);
  return null;
}

/* ----------------------------------------------------------------------------
   Variant A — Figure plates: editorial rows, WebGL image material
   ------------------------------------------------------------------------- */

function PlateScene({
  url,
  revealRef,
  pointerRef,
  hoverRef,
}: {
  url: string;
  revealRef: React.MutableRefObject<number>;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  hoverRef: React.MutableRefObject<boolean>;
}) {
  const texture = useTexture(url) as THREE.Texture;
  useSRGB([texture]);
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport, invalidate } = useThree((state) => ({ viewport: state.viewport, invalidate: state.invalidate }));
  const material = useMemo(() => makePlateMaterial(texture, 4 / 3), [texture]);

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const p = pointerRef.current;
    const reveal = material.uniforms.uReveal.value as number;
    const revealTarget = revealRef.current;
    material.uniforms.uReveal.value = lerp(reveal, revealTarget, 0.07);
    const tiltAmt = hoverRef.current ? 1 : 0;
    m.rotation.y = lerp(m.rotation.y, p.x * 0.09 * tiltAmt, 0.09);
    m.rotation.x = lerp(m.rotation.x, -p.y * 0.07 * tiltAmt, 0.09);
    const dimTarget = hoverRef.current ? -0.06 : 0; // negative dim = slight lift in brightness
    material.uniforms.uDim.value = lerp(material.uniforms.uDim.value as number, dimTarget, 0.1);

    const settling =
      Math.abs((material.uniforms.uReveal.value as number) - revealTarget) > 0.002 ||
      Math.abs(m.rotation.y - p.x * 0.09 * tiltAmt) > 0.0015 ||
      Math.abs(m.rotation.x - -p.y * 0.07 * tiltAmt) > 0.0015 ||
      Math.abs((material.uniforms.uDim.value as number) - dimTarget) > 0.002;
    if (settling) invalidate();
  });

  return (
    <mesh ref={mesh} material={material}>
      <planeGeometry args={[viewport.width, viewport.height, 24, 24]} />
    </mesh>
  );
}

function PlateMedia({ url }: { url: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { once: true, margin: "-60px" });
  const revealRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const hoverRef = useRef(false);
  const invalidateRef: InvalidateRef = useRef(null);

  useEffect(() => {
    revealRef.current = inView ? 1 : 0;
    invalidateRef.current?.();
  }, [inView]);

  return (
    <div
      ref={wrap}
      className="absolute inset-0"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        pointerRef.current.x = clampN(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
        pointerRef.current.y = clampN(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
        invalidateRef.current?.();
      }}
      onPointerEnter={() => {
        hoverRef.current = true;
        invalidateRef.current?.();
      }}
      onPointerLeave={() => {
        hoverRef.current = false;
        pointerRef.current.x = 0;
        pointerRef.current.y = 0;
        invalidateRef.current?.();
      }}
    >
      <Canvas camera={{ position: [0, 0, 2.3], fov: 27 }} dpr={[1, 1.5]} frameloop="demand" gl={{ antialias: true }}>
        <InvalidateBridge invalidateRef={invalidateRef} />
        <Suspense fallback={null}>
          <PlateScene url={url} revealRef={revealRef} pointerRef={pointerRef} hoverRef={hoverRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}

const rowFadeUp = {
  hidden: { opacity: 0, transform: "translateY(16px)" },
  visible: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.5, ease: ease.out } },
};

function FigurePlateRows({ projects, onOpen }: { projects: PortfolioProject[]; onOpen: (p: PortfolioProject) => void }) {
  return (
    <div className="space-y-8 md:space-y-12">
      {projects.map((project, index) => {
        const flipped = index % 2 === 1;
        const issue = String(index + 1).padStart(2, "0");
        const year = project.createdAt ? new Date(project.createdAt).getFullYear() : "—";
        return (
          <motion.button
            key={project.id ?? index}
            type="button"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.055 } } }}
            onClick={() => onOpen(project)}
            aria-label={`Open project: ${project.title}`}
            className="editorial-paper group grid w-full grid-cols-12 gap-x-3 p-4 text-left text-[#11110f] outline-none focus-visible:ring-2 focus-visible:ring-system-lime focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--editorial-ink)] md:gap-x-5 md:p-7"
          >
            <div className={`col-span-12 md:col-span-7 ${flipped ? "md:order-2 md:col-start-6" : ""}`}>
              <div className="relative aspect-[4/3] overflow-hidden bg-black/5 outline outline-1 -outline-offset-1 outline-black/10">
                {project.imageUrl ? (
                  <PlateMedia url={getTextureUrl(project.imageUrl)} />
                ) : (
                  <div className="absolute inset-0 grid place-items-center bg-[var(--editorial-paper-muted)]">
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-black/35">Image pending / {issue}</span>
                  </div>
                )}
              </div>
            </div>
            <div className={`col-span-12 flex min-h-full flex-col pt-7 md:col-span-5 md:pt-0 ${flipped ? "md:order-1 md:pr-8" : "md:pl-8"}`}>
              <motion.div variants={rowFadeUp} className="flex items-start justify-between gap-4 border-b border-black/20 pb-4">
                <p className="editorial-meta !text-black/45">Fig. / {issue}</p>
                <p className="editorial-meta !text-black/45 tabular-nums">{year}</p>
              </motion.div>
              <motion.div variants={rowFadeUp} className="pt-6">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-black/45">{project.category}</p>
                <h3 className="mt-3 text-3xl font-black leading-[0.9] tracking-[-0.06em] text-balance md:text-5xl">{project.title}</h3>
                <p className="mt-6 max-w-lg text-sm leading-relaxed text-black/58 text-pretty md:text-base">{project.description}</p>
              </motion.div>
              <motion.div variants={rowFadeUp} className="mt-auto flex items-end justify-between gap-5 border-t border-black/20 pt-5 md:mt-10">
                <p className="max-w-[70%] text-[10px] font-bold uppercase leading-relaxed tracking-[0.12em] text-black/40">
                  {(project.tags ?? []).slice(0, 4).join(" / ") || project.status || "Project archive"}
                </p>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-black text-white transition-[background-color,color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-system-lime group-hover:text-black">
                  <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                </span>
              </motion.div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------------------
   Variant B — Index & plate: orthographic card stack
   ------------------------------------------------------------------------- */

function StackScene({
  urls,
  activeRef,
  onFrontClick,
}: {
  urls: string[];
  activeRef: React.MutableRefObject<number>;
  onFrontClick: () => void;
}) {
  const textures = useTexture(urls) as THREE.Texture[];
  useSRGB(textures);
  const { viewport, invalidate } = useThree((state) => ({ viewport: state.viewport, invalidate: state.invalidate }));
  const count = urls.length;
  const W = viewport.width * 0.66;
  const H = W / 1.5;
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const materials = useMemo(() => textures.map((t) => makePlateMaterial(t, 1.5, true)), [textures]);
  useEffect(() => {
    materials.forEach((m) => {
      m.uniforms.uReveal.value = 1;
    });
  }, [materials]);

  useFrame(() => {
    let settling = false;
    for (let i = 0; i < count; i++) {
      const m = meshes.current[i];
      if (!m) continue;
      // Depth order cycles so the active card is always the front of the deck.
      const order = (((i - activeRef.current) % count) + count) % count;
      const tx = order * W * 0.055;
      const ty = order * H * 0.06;
      const tz = -order * 0.02;
      const trz = -order * 0.016;
      const tdim = Math.min(order * 0.16, 0.55);
      m.position.x = lerp(m.position.x, tx, 0.12);
      m.position.y = lerp(m.position.y, ty, 0.12);
      m.position.z = lerp(m.position.z, tz, 0.12);
      m.rotation.z = lerp(m.rotation.z, trz, 0.12);
      m.renderOrder = count - order;
      const mat = materials[i];
      mat.uniforms.uDim.value = lerp(mat.uniforms.uDim.value as number, tdim, 0.12);
      mat.depthTest = false;
      if (
        Math.abs(m.position.x - tx) > 0.002 ||
        Math.abs(m.position.y - ty) > 0.002 ||
        Math.abs((mat.uniforms.uDim.value as number) - tdim) > 0.003
      )
        settling = true;
    }
    if (settling) invalidate();
  });

  return (
    <group position={[-W * 0.06, -H * 0.07, 0]}>
      {urls.map((url, i) => (
        <mesh
          key={url + i}
          ref={(el) => {
            meshes.current[i] = el;
          }}
          material={materials[i]}
          onClick={(e) => {
            e.stopPropagation();
            const order = (((i - activeRef.current) % count) + count) % count;
            if (order === 0) onFrontClick();
          }}
        >
          <planeGeometry args={[W, H]} />
        </mesh>
      ))}
    </group>
  );
}

function OrthoStack({ projects, onOpen }: { projects: PortfolioProject[]; onOpen: (p: PortfolioProject) => void }) {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const invalidateRef: InvalidateRef = useRef(null);
  const urls = useMemo(() => projects.map((p) => getTextureUrl(p.imageUrl)), [projects]);
  const current = projects[active];

  const select = (index: number) => {
    activeRef.current = index;
    setActive(index);
    invalidateRef.current?.();
  };

  return (
    <div className="grid grid-cols-12 gap-x-3 md:gap-x-5">
      {/* The index — a ledger of plates */}
      <div className="col-span-12 md:col-span-4">
        <p className="editorial-meta">Index of plates</p>
        <div className="mt-4">
          {projects.map((project, index) => {
            const isActive = index === active;
            return (
              <button
                key={project.id ?? index}
                type="button"
                onClick={() => select(index)}
                aria-current={isActive}
                className="group/idx grid w-full grid-cols-12 items-baseline gap-x-2 border-t border-white/15 py-4 text-left transition-colors duration-200 last:border-b hover:border-white/35"
              >
                <span className={`col-span-2 editorial-meta transition-colors duration-200 ${isActive ? "!text-system-lime" : ""}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={`col-span-8 text-base font-black tracking-[-0.03em] transition-colors duration-200 ${isActive ? "text-white" : "text-white/45 group-hover/idx:text-white/70"}`}>
                  {project.title}
                </span>
                <span className="col-span-2 text-right editorial-meta tabular-nums">
                  {project.createdAt ? new Date(project.createdAt).getFullYear() : "—"}
                </span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => current && onOpen(current)}
          className="press group/open mt-8 inline-flex min-h-11 items-center gap-3 bg-system-lime px-5 py-3 text-[11px] font-black uppercase tracking-[0.12em] text-black transition-colors duration-200 hover:bg-white"
        >
          Open plate {String(active + 1).padStart(2, "0")}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/open:-translate-y-0.5 group-hover/open:translate-x-0.5" aria-hidden="true" />
        </button>
      </div>

      {/* The plate — orthographic deck inside a ruled figure box */}
      <div className="col-span-12 mt-10 md:col-span-8 md:col-start-6 md:mt-0">
        <div className="relative aspect-[16/11] cursor-pointer border border-white/15" onClick={() => current && onOpen(current)}>
          <Canvas orthographic camera={{ position: [0, 0, 10], zoom: 100 }} dpr={[1, 1.5]} frameloop="demand" gl={{ antialias: true }}>
            <InvalidateBridge invalidateRef={invalidateRef} />
            <Suspense fallback={null}>
              <StackScene urls={urls} activeRef={activeRef} onFrontClick={() => current && onOpen(current)} />
            </Suspense>
          </Canvas>
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-4">
          <p className="editorial-meta">
            Plate {String(active + 1).padStart(2, "0")} / {current?.title}
          </p>
          <p className="editorial-meta">{current?.category}</p>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   Variant C — Exploded sheet: one project as layered technical slices
   ------------------------------------------------------------------------- */

type Slice = {
  /** region of the (cover-cropped) image this slice shows, in 0..1 uv space */
  region: [number, number, number, number]; // x, y, w, h
  z: number;
};

const SLICES: Slice[] = [
  { region: [0, 0, 1, 1], z: 0 },
  { region: [0, 0.68, 1, 0.32], z: 0.5 },
  { region: [0.07, 0.16, 0.44, 0.46], z: 1.0 },
];

function ExplodedScene({
  url,
  pointerRef,
  revealRef,
}: {
  url: string;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  revealRef: React.MutableRefObject<number>;
}) {
  const texture = useTexture(url) as THREE.Texture;
  useSRGB([texture]);
  const { viewport, invalidate } = useThree((state) => ({ viewport: state.viewport, invalidate: state.invalidate }));
  const group = useRef<THREE.Group>(null);
  const W = viewport.width * 0.52;
  const H = W / 1.5;
  const explodeRef = useRef(0);

  const materials = useMemo(
    () =>
      SLICES.map((slice, i) => {
        const mat = makePlateMaterial(texture, 1.5, i > 0);
        const cover = coverUv(texture, 1.5);
        const [rx, ry, rw, rh] = slice.region;
        (mat.uniforms.uUvOffset.value as THREE.Vector2).set(cover.offset.x + rx * cover.scale.x, cover.offset.y + ry * cover.scale.y);
        (mat.uniforms.uUvScale.value as THREE.Vector2).set(rw * cover.scale.x, rh * cover.scale.y);
        mat.uniforms.uReveal.value = 1;
        mat.depthTest = false;
        return mat;
      }),
    [texture],
  );

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    explodeRef.current = lerp(explodeRef.current, revealRef.current, 0.06);
    const p = pointerRef.current;
    const targetY = 0.46 + p.x * 0.05;
    const targetX = -0.3 - p.y * 0.04;
    g.rotation.y = lerp(g.rotation.y, targetY, 0.08);
    g.rotation.x = lerp(g.rotation.x, targetX, 0.08);
    let settling =
      Math.abs(explodeRef.current - revealRef.current) > 0.002 ||
      Math.abs(g.rotation.y - targetY) > 0.0015 ||
      Math.abs(g.rotation.x - targetX) > 0.0015;
    g.children.forEach((child, i) => {
      const tz = SLICES[i].z * explodeRef.current * 0.72;
      child.position.z = lerp(child.position.z, tz, 0.1);
      if (Math.abs(child.position.z - tz) > 0.002) settling = true;
    });
    if (settling) invalidate();
  });

  return (
    <group ref={group} rotation={[-0.3, 0.46, 0]}>
      {SLICES.map((slice, i) => {
        const [rx, ry, rw, rh] = slice.region;
        return (
          <mesh
            key={i}
            material={materials[i]}
            renderOrder={i}
            position={[(rx + rw / 2 - 0.5) * W, (ry + rh / 2 - 0.5) * H, 0]}
          >
            <planeGeometry args={[rw * W, rh * H]} />
          </mesh>
        );
      })}
    </group>
  );
}

function ExplodedSheet({ projects, onOpen }: { projects: PortfolioProject[]; onOpen: (p: PortfolioProject) => void }) {
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { once: true, margin: "-80px" });
  const pointerRef = useRef({ x: 0, y: 0 });
  const revealRef = useRef(0);
  const invalidateRef: InvalidateRef = useRef(null);
  const current = projects[active];
  const year = current?.createdAt ? new Date(current.createdAt).getFullYear() : "—";

  useEffect(() => {
    revealRef.current = inView ? 1 : 0;
    invalidateRef.current?.();
  }, [inView]);

  return (
    <div ref={wrap} className="grid grid-cols-12 gap-x-3 md:gap-x-5">
      {/* Caption column */}
      <div className="col-span-12 md:col-span-4">
        <p className="editorial-meta">Fig. {String(active + 1).padStart(2, "0")} / Exploded view</p>
        <h3 className="mt-6 text-3xl font-black leading-[0.9] tracking-[-0.05em] text-white md:text-5xl">{current?.title}</h3>
        <p className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white/45">
          {current?.category} / {year}
        </p>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60 text-pretty">{current?.description}</p>
        <button
          type="button"
          onClick={() => current && onOpen(current)}
          className="press group/open mt-8 inline-flex min-h-11 items-center gap-3 bg-system-lime px-5 py-3 text-[11px] font-black uppercase tracking-[0.12em] text-black transition-colors duration-200 hover:bg-white"
        >
          Open project
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/open:-translate-y-0.5 group-hover/open:translate-x-0.5" aria-hidden="true" />
        </button>

        {/* Sheet selector: editorial numerals */}
        <div className="mt-12 flex items-center gap-1 border-t border-white/15 pt-5">
          {projects.map((project, index) => (
            <button
              key={project.id ?? index}
              type="button"
              onClick={() => {
                setActive(index);
                invalidateRef.current?.();
              }}
              aria-label={`Show ${project.title}`}
              aria-current={index === active}
              className={`min-h-11 min-w-11 px-2 text-sm font-black tabular-nums transition-colors duration-200 ${
                index === active ? "text-system-lime" : "text-white/30 hover:text-white/70"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>

      {/* Figure box */}
      <div className="col-span-12 mt-10 md:col-span-8 md:col-start-6 md:mt-0">
        <div
          className="relative aspect-[16/11] cursor-pointer border border-white/15"
          onClick={() => current && onOpen(current)}
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            pointerRef.current.x = clampN(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
            pointerRef.current.y = clampN(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
            invalidateRef.current?.();
          }}
          onPointerLeave={() => {
            pointerRef.current.x = 0;
            pointerRef.current.y = 0;
            invalidateRef.current?.();
          }}
        >
          <Canvas orthographic camera={{ position: [0, 0, 10], zoom: 100 }} dpr={[1, 1.5]} frameloop="demand" gl={{ antialias: true }}>
            <InvalidateBridge invalidateRef={invalidateRef} />
            <Suspense fallback={null}>
              <ExplodedScene key={active} url={getTextureUrl(current?.imageUrl)} pointerRef={pointerRef} revealRef={revealRef} />
            </Suspense>
          </Canvas>
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-4">
          <p className="editorial-meta">Surface / Interface / Detail</p>
          <p className="editorial-meta tabular-nums">Sheet {String(active + 1).padStart(2, "0")} of {String(projects.length).padStart(2, "0")}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */

export default function WorkShowcase3D({
  variant,
  projects,
  onOpen,
}: {
  variant: ShowcaseVariant;
  projects: PortfolioProject[];
  onOpen: (project: PortfolioProject) => void;
}) {
  if (variant === "stack") return <OrthoStack projects={projects} onOpen={onOpen} />;
  if (variant === "exploded") return <ExplodedSheet projects={projects} onOpen={onOpen} />;
  return <FigurePlateRows projects={projects} onOpen={onOpen} />;
}
