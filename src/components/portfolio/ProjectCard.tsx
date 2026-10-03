import React from "react";
import { CanonicalPortfolioEntry } from "@/lib/types";
import { CATEGORY_DISPLAY_NAMES } from "@/lib/data";
import { ProjectFraming } from "./ProjectFraming";

interface ProjectCardProps {
  project: CanonicalPortfolioEntry;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const displayCategory =
    CATEGORY_DISPLAY_NAMES[project.category] ||
    project.category.replace(/^\d+\s*\/\s*/, "").replace(/-/g, " ");

  const displayIndex =
    project.number || (index + 1 < 10 ? `0${index + 1}` : `${index + 1}`);

  return (
    <article className="border-t border-depros-black pt-6 sm:pt-8 pb-12 sm:pb-16 group">
      {/* Editorial Header Bar (Derived directly from DEPROS visual identity) */}
      <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
        {/* Left: Section Prefix + Category */}
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-depros-black">
            {displayIndex} / DEP ROS
          </span>
          <span className="font-sans font-bold text-sm sm:text-base tracking-wider uppercase text-depros-black">
            {displayCategory}
          </span>
        </div>

        {/* Right: Client Attribution */}
        {project.client && (
          <div className="text-xs sm:text-sm uppercase tracking-wider text-depros-black/90 font-sans flex items-center gap-2">
            <span className="text-depros-muted">Crafted for</span>
            <strong className="text-depros-black font-bold">
              {project.clientDisplayName || project.client}
            </strong>
          </div>
        )}
      </div>

      {/* Project Title & Short Pitch */}
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-baseline">
        <div className="lg:col-span-6">
          <h3 className="font-sans font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-depros-black uppercase">
            {project.title}
            {project.subtitle && (
              <span className="font-normal text-depros-muted text-lg sm:text-xl capitalize ml-2">
                . {project.subtitle}
              </span>
            )}
          </h3>
        </div>
        {project.description && (
          <div className="lg:col-span-6">
            <p className="text-xs sm:text-sm text-depros-black/80 font-sans leading-relaxed">
              {project.description}
            </p>
          </div>
        )}
      </div>

      {/* Visual Showcase — Dynamic Framing System */}
      <ProjectFraming project={project} priority={index === 0} />

      {/* Footer Scope & Metadata */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] font-sans uppercase tracking-wider text-depros-muted">
        <div>
          {project.scope && project.scope.length > 0 ? (
            <span>Scope: {project.scope.join(" / ")}</span>
          ) : (
            <span className="capitalize">{project.presentationType} Presentation</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {project.year && <span>Year: {project.year}</span>}
          <span className="font-mono text-depros-orange font-bold">{displayIndex}</span>
        </div>
      </div>
    </article>
  );
};

