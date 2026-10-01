import React from "react";
import { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

interface SelectedWorkProps {
  projects: Project[];
}

export const SelectedWork: React.FC<SelectedWorkProps> = ({ projects }) => {
  return (
    <section id="work" className="scroll-mt-20 sm:scroll-mt-24 py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        {/* Section Header Divider */}
        <div className="border-b-2 border-depros-black pb-8 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-depros-orange mb-2">
              <span>01</span>
              <span>/</span>
              <span>SELECTED WORK</span>
            </div>
            <h2 className="font-sans font-bold text-3xl sm:text-5xl tracking-tight text-depros-black uppercase">
              Portfolio
            </h2>
          </div>

          <div className="max-w-md text-xs sm:text-sm text-depros-muted font-sans leading-relaxed">
            <p className="font-bold text-depros-black mb-1">
              Breaking Norms, Creating Waves, Simple Designs, Bold Statements.
            </p>
            <p>
              We take simplicity to make bold statements, going beyond the usual to
              leave a lasting impression.
            </p>
          </div>
        </div>

        {/* Projects Stream */}
        <div className="space-y-4">
          {projects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};
