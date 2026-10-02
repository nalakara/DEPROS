import React from "react";
import Image from "next/image";
import { Project, ProjectImage } from "@/lib/types";
import { computeFramingRows } from "@/lib/framing";

interface ProjectFramingProps {
  project: Project;
  priority?: boolean;
}

export const ProjectFraming: React.FC<ProjectFramingProps> = ({
  project,
  priority = false,
}) => {
  // If `images` array is provided and not empty, use it; otherwise fallback to single `project.image`
  const imageSources: ProjectImage[] =
    project.images && project.images.length > 0
      ? project.images
      : [
          {
            src: project.image,
            alt: `${project.title} - ${project.subtitle} designed by DEPROS`,
          },
        ];

  const rows = computeFramingRows(imageSources, project.framingConfig);

  return (
    <div className="w-full space-y-3 sm:space-y-4 select-none">
      {rows.map((row, rowIdx) => {
        const colCount = row.columns;

        // Determine responsive grid columns
        let gridColsClass = "grid-cols-1";
        if (colCount === 2) {
          gridColsClass = "grid-cols-1 md:grid-cols-2";
        } else if (colCount === 3) {
          gridColsClass = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
        } else if (colCount >= 4) {
          gridColsClass = "grid-cols-1 sm:grid-cols-2 md:grid-cols-4";
        }

        // Determine frame aspect ratio based on column count and orientation
        let frameAspectClass = "aspect-[16/9] sm:aspect-[21/10]";
        if (colCount === 2) {
          frameAspectClass = "aspect-[4/3] sm:aspect-[16/11]";
        } else if (colCount >= 3) {
          frameAspectClass = "aspect-[3/4] sm:aspect-[4/5]";
        }

        return (
          <div
            key={rowIdx}
            className={`grid ${gridColsClass} gap-3 sm:gap-4 w-full`}
          >
            {row.images.map((img) => (
              <div
                key={img.index}
                className="group/frame flex flex-col w-full"
              >
                <div
                  className={`relative w-full ${frameAspectClass} bg-depros-light overflow-hidden border border-depros-border/80`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt || `${project.title} artwork ${img.index + 1}`}
                    fill
                    sizes={
                      colCount === 1
                        ? "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                        : colCount === 2
                        ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                        : "(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    }
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                    priority={priority && img.index === 0}
                  />
                </div>

                {img.caption && (
                  <span className="mt-1.5 text-[10px] font-sans uppercase tracking-wider text-depros-muted">
                    {img.caption}
                  </span>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
