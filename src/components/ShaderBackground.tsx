"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { useReducedMotion } from "framer-motion";

/**
 * Flowing mesh-gradient shader behind the hero (Paper Shaders — the library
 * Framer ships). Weighted heavily toward near-black with a single lime spot so
 * the giant NANDA type stays legible; vignette + grain blend it into #0A0A0A.
 *
 * Decorative only — `aria-hidden`, and speed drops to 0 under reduced motion.
 */
export default function ShaderBackground() {
  const reduce = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <MeshGradient
        className="absolute inset-0 h-full w-full"
        style={{ width: "100%", height: "100%" }}
        colors={["#0A0A0A", "#0A0A0A", "#141a00", "#3a4a00", "#CCFF00"]}
        distortion={0.9}
        swirl={0.6}
        grainOverlay={0.05}
        speed={reduce ? 0 : 0.4}
      />

      {/* Black stays the theme — the shader reads as a single lime glow rising
          from one corner. Heavy overlay + vignette keep the field near-black. */}
      <div className="absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_10%,transparent_30%,rgba(10,10,10,0.6)_68%,#0A0A0A_100%)]" />
      <div className="absolute inset-0 bg-[#0A0A0A]/45" />

      {/* Film grain on top — the texture that reads as "premium" not "flat". */}
      <div className="grain-overlay absolute inset-[-50%] opacity-[0.05] mix-blend-overlay pointer-events-none" />
    </div>
  );
}
