"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import ProjectRow from "@/components/ProjectRow";

// Three.js stays out of the main bundle / off the server.
const ProjectGallery3D = dynamic(() => import("@/components/ProjectGallery3D"), { ssr: false });

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

/**
 * Selected Works renderer. Defaults to the flat alternating rows (SSR-safe, the
 * universal fallback). On a capable desktop — wide viewport, motion allowed,
 * WebGL present — it upgrades to the 3D coverflow after mount.
 */
export default function ProjectGallery({
  projects,
  onOpen,
}: {
  projects: any[];
  onOpen: (project: any) => void;
}) {
  const reduce = useReducedMotion();
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    setUse3D(wide && !reduce && projects.length > 0 && webglAvailable());
  }, [reduce, projects.length]);

  if (use3D) {
    return <ProjectGallery3D projects={projects} onOpen={onOpen} />;
  }

  return (
    <div className="space-y-16 md:space-y-24">
      {projects.map((p, i) => (
        <ProjectRow key={p.id ?? i} project={p} index={i} onOpen={() => onOpen(p)} />
      ))}
    </div>
  );
}
