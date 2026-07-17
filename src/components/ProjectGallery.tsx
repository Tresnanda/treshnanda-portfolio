"use client";

import ProjectRow from "@/components/ProjectRow";
import type { PortfolioProject } from "@/lib/portfolio-types";

/**
 * Editorial project index: paper feature plates on the 12-column grid.
 * (The 3D showcase experiments live in WorkShowcase3D.tsx, currently unused.)
 */
export default function ProjectGallery({
  projects,
  onOpen,
}: {
  projects: PortfolioProject[];
  onOpen: (project: PortfolioProject) => void;
}) {
  return (
    // One continuous paper signature — hairlines separate the plates, not gaps.
    <div className="editorial-paper">
      {projects.map((project, index) => (
        <ProjectRow key={project.id ?? index} project={project} index={index} onOpen={() => onOpen(project)} />
      ))}
      {projects.length === 0 ? (
        <div className="editorial-paper grid min-h-64 place-items-center p-8 text-center text-[#11110f]">
          <div>
            <p className="editorial-meta !text-black/40">Archive status / Empty</p>
            <p className="mt-5 text-2xl font-black tracking-[-0.045em]">Projects will appear here when published.</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
