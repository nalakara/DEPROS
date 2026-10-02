import React, { Suspense } from "react";
import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArchiveCard } from "@/components/portfolio/ArchiveCard";
import { ArchiveFilter } from "@/components/portfolio/ArchiveFilter";
import { CANONICAL_PORTFOLIO_ENTRIES, CATEGORY_DISPLAY_NAMES } from "@/lib/data";
import { SemanticCategoryId } from "@/lib/types";

export const metadata: Metadata = {
  title: "Work Archive — DEPROS Portfolio",
  description:
    "Complete portfolio archive of DEPROS across Product Design, Brand Identity, Logos, Corporate Identity, Marketing Kit, Graphic & Visual, and Social Media Content.",
};

interface WorkPageProps {
  searchParams: Promise<{ category?: string }>;
}

const VALID_CATEGORIES: SemanticCategoryId[] = [
  "product-design",
  "brand-identity",
  "logos",
  "corporate-identity",
  "marketing-kit",
  "graphic-visual",
  "social-media-content",
];

async function WorkContent({ searchParams }: WorkPageProps) {
  const resolvedParams = await Promise.resolve(searchParams);
  const rawCategory = resolvedParams?.category;

  // Validate category param; fall back safely to undefined (All) if invalid
  const selectedCategory: SemanticCategoryId | undefined =
    rawCategory && VALID_CATEGORIES.includes(rawCategory as SemanticCategoryId)
      ? (rawCategory as SemanticCategoryId)
      : undefined;

  // Filter canonical portfolio records
  const filteredProjects = selectedCategory
    ? CANONICAL_PORTFOLIO_ENTRIES.filter((p) => p.category === selectedCategory)
    : CANONICAL_PORTFOLIO_ENTRIES;

  // Pre-calculate category counts
  const categoryCounts: Record<string, number> = {};
  for (const cat of VALID_CATEGORIES) {
    categoryCounts[cat] = CANONICAL_PORTFOLIO_ENTRIES.filter(
      (p) => p.category === cat
    ).length;
  }

  const activeCategoryLabel = selectedCategory
    ? CATEGORY_DISPLAY_NAMES[selectedCategory]
    : "All Categories";

  return (
    <>
      <Header variant="light" />

      <main className="flex-1 bg-white min-h-screen flex flex-col justify-between">
        {/* Editorial Top Hero Banner (Matching DEPROS brand aesthetic) */}
        <section className="bg-depros-orange text-white pt-28 sm:pt-36 pb-16 sm:pb-20 px-6 sm:px-10 lg:px-16 select-none">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-white/80">
                <span>01</span>
                <span>/</span>
                <span>PORTFOLIO ARCHIVE</span>
                <span>. + o</span>
              </div>
              <h1 className="font-sans font-bold text-4xl sm:text-6xl lg:text-7xl tracking-tighter uppercase leading-[0.9] text-white">
                Work
                <br />
                Archive
              </h1>
            </div>

            <div className="max-w-md space-y-2 text-xs sm:text-sm text-white/90 font-sans leading-relaxed">
              <p className="font-bold text-white uppercase tracking-wider">
                Selected Works & Case Studies
              </p>
              <p className="font-normal text-white/80">
                Complete inventory of 16 portfolio presentation units spanning product packaging, brand systems, corporate collateral, marketing kits, and environmental graphics.
              </p>
            </div>
          </div>
        </section>

        {/* Main Archive Grid Section */}
        <section className="py-12 sm:py-16 px-6 sm:px-10 lg:px-16 flex-1">
          <div className="max-w-7xl mx-auto">
            {/* Category Filter Bar */}
            <ArchiveFilter
              activeCategory={selectedCategory}
              categoryCounts={categoryCounts}
              totalCount={CANONICAL_PORTFOLIO_ENTRIES.length}
            />

            {/* Current Filter Status / Context Header */}
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-depros-border/60 text-xs font-sans uppercase tracking-wider text-depros-muted">
              <div>
                <span>Viewing: </span>
                <strong className="text-depros-black font-bold">
                  {activeCategoryLabel}
                </strong>
              </div>
              <div className="font-mono text-depros-black font-medium">
                {filteredProjects.length} of {CANONICAL_PORTFOLIO_ENTRIES.length} Works
              </div>
            </div>

            {/* Archive Grid (1 col mobile, 2 col tablet/desktop) */}
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                {filteredProjects.map((project, idx) => (
                  <ArchiveCard
                    key={project.id}
                    project={project}
                    index={idx}
                    priority={idx < 4}
                  />
                ))}
              </div>
            ) : (
              /* Fallback Empty State */
              <div className="py-24 text-center border border-dashed border-depros-border bg-depros-light p-12">
                <p className="font-sans text-sm uppercase tracking-wider text-depros-muted mb-2">
                  No projects found in this category
                </p>
                <p className="text-xs text-depros-muted">
                  Please select another category or view all portfolio works.
                </p>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

export default function WorkPage(props: WorkPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center p-12">
          <span className="font-mono text-xs uppercase tracking-widest text-depros-orange animate-pulse">
            Loading DEPROS Archive...
          </span>
        </div>
      }
    >
      <WorkContent {...props} />
    </Suspense>
  );
}
