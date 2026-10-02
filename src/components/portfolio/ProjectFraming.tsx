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
  // Universal Fallback: Every project without `images[]` falls back to its single `project.image`
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
  const gapMode = project.framingConfig?.gap || "hairline";

  // Wire gap configuration properly for crisp hairline spacing
  let gapClass = "gap-px bg-depros-border/80 border border-depros-border/80";
  let frameBorderClass = "";
  if (gapMode === "none") {
    gapClass = "gap-0 border border-depros-border/80";
  } else if (gapMode === "sm") {
    gapClass = "gap-1 sm:gap-1.5";
    frameBorderClass = "border border-depros-border/80";
  } else if (gapMode === "md") {
    gapClass = "gap-2 sm:gap-3";
    frameBorderClass = "border border-depros-border/80";
  }

  return (
    <div className="w-full space-y-2 select-none">
      {rows.map((row, rowIdx) => {
        const colCount = row.columns;

        // Check if all images in this row have known dimensions to compute row-level aspect ratio
        const allHaveDimensions = row.images.every(
          (img) => img.width && img.height
        );

        let rowTotalWidth = 0;
        let rowMaxHeight = 0;
        if (allHaveDimensions) {
          rowTotalWidth = row.images.reduce((acc, img) => acc + (img.width || 0), 0);
          rowMaxHeight = Math.max(...row.images.map((img) => img.height || 0));
        }

        return (
          <div
            key={rowIdx}
            className={`flex flex-col md:flex-row ${gapClass} overflow-hidden w-full ${
              allHaveDimensions ? "md:aspect-[var(--row-aspect)]" : ""
            }`}
            style={
              allHaveDimensions && rowTotalWidth > 0 && rowMaxHeight > 0
                ? ({
                    "--row-aspect": `${rowTotalWidth} / ${rowMaxHeight}`,
                  } as React.CSSProperties)
                : undefined
            }
          >
            {row.images.map((img) => {
              const hasDim = Boolean(img.width && img.height);
              const flexStyle = hasDim
                ? { flex: `${img.width} 1 0%` }
                : { flex: "1 1 0%" };

              // Determine fallback aspect ratio class when dimensions are not provided
              let fallbackAspectClass = "aspect-[16/9] sm:aspect-[21/10]";
              if (colCount === 2) {
                fallbackAspectClass = "aspect-[4/3] sm:aspect-[16/11]";
              } else if (colCount >= 3) {
                fallbackAspectClass = "aspect-[3/4] sm:aspect-[4/5]";
              }

              return (
                <div
                  key={img.index}
                  className="group/frame flex flex-col w-full bg-depros-light min-w-0"
                  style={flexStyle}
                >
                  <div
                    className={`relative w-full overflow-hidden bg-depros-light ${frameBorderClass} ${
                      hasDim
                        ? "aspect-[var(--mobile-aspect)] md:aspect-auto md:h-full"
                        : fallbackAspectClass
                    }`}
                    style={
                      hasDim
                        ? ({
                            "--mobile-aspect": `${img.width} / ${img.height}`,
                          } as React.CSSProperties)
                        : undefined
                    }
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
                    <span className="mt-1.5 px-1 text-[10px] font-sans uppercase tracking-wider text-depros-muted">
                      {img.caption}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
