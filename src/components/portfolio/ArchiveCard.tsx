import React from "react";
import Image from "next/image";
import { CanonicalPortfolioEntry } from "@/lib/types";
import { CATEGORY_DISPLAY_NAMES } from "@/lib/data";

interface ArchiveCardProps {
  project: CanonicalPortfolioEntry;
  index: number;
  priority?: boolean;
}

export const ArchiveCard: React.FC<ArchiveCardProps> = ({
  project,
  index,
  priority = false,
}) => {
  const displayCategory =
    CATEGORY_DISPLAY_NAMES[project.category] ||
    project.category.replace(/-/g, " ");

  const displayIndex =
    project.number || (index + 1 < 10 ? `0${index + 1}` : `${index + 1}`);

  // Select representative primary media asset
  const primaryMedia =
    project.media.find((m) => m.role === "primary" || m.role === "composite") ||
    project.media[0] || {
      src: project.image,
      alt: `${project.title} - ${project.subtitle || "Designed by DEPROS"}`,
      width: 1584,
      height: 754,
    };

  const imageAspect =
    primaryMedia.width && primaryMedia.height
      ? `${primaryMedia.width} / ${primaryMedia.height}`
      : "16 / 9";

  return (
    <article className="border border-depros-border/80 bg-white flex flex-col justify-between group transition-colors duration-200 hover:border-depros-black">
      {/* Card Header Bar */}
      <div className="p-4 sm:p-5 border-b border-depros-border/80 flex items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-bold tracking-widest text-depros-orange">
            {displayIndex}
          </span>
          <span className="text-depros-border">/</span>
          <span className="font-sans font-bold text-xs uppercase tracking-wider text-depros-black">
            {displayCategory}
          </span>
        </div>

        {project.client && (
          <div className="text-[11px] uppercase tracking-wider text-depros-muted font-sans truncate max-w-[180px] sm:max-w-[220px]">
            <span>for </span>
            <strong className="text-depros-black font-semibold">
              {project.clientDisplayName || project.client}
            </strong>
          </div>
        )}
      </div>

      {/* Representative Visual Frame */}
      <div className="relative w-full bg-depros-light overflow-hidden border-b border-depros-border/80">
        <div
          className="relative w-full"
          style={{ aspectRatio: imageAspect }}
        >
          <Image
            src={primaryMedia.src}
            alt={primaryMedia.alt || `${project.title} artwork`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            className="object-contain object-center p-2 sm:p-3 transition-transform duration-300 group-hover:scale-[1.01]"
            priority={priority}
          />
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="font-sans font-bold text-xl sm:text-2xl tracking-tight text-depros-black uppercase">
            {project.title}
          </h3>

          {project.subtitle && (
            <p className="font-sans text-xs sm:text-sm text-depros-muted capitalize tracking-wide">
              {project.subtitle}
            </p>
          )}

          {project.description && (
            <p className="font-sans text-xs text-depros-black/80 leading-relaxed line-clamp-2 pt-1">
              {project.description}
            </p>
          )}
        </div>

        {/* Card Footer Info */}
        <div className="mt-5 pt-4 border-t border-depros-border/60 flex items-center justify-between text-[10px] sm:text-[11px] font-sans uppercase tracking-wider text-depros-muted">
          <div className="truncate max-w-[70%]">
            {project.scope && project.scope.length > 0 ? (
              <span>{project.scope.join(" · ")}</span>
            ) : (
              <span className="capitalize">{project.presentationType} showcase</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {project.year && <span>{project.year}</span>}
            <span className="font-mono text-depros-orange font-bold">
              {displayIndex}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
