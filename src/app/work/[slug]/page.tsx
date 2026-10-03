import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProjectFraming } from "@/components/portfolio/ProjectFraming";
import { CATEGORY_DISPLAY_NAMES } from "@/lib/data";
import { getPortfolioEntries, getPortfolioEntryBySlug } from "@/lib/dataSource";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const allProjects = await getPortfolioEntries();
  return allProjects.map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPortfolioEntryBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found — DEPROS",
    };
  }

  const categoryName =
    CATEGORY_DISPLAY_NAMES[project.category] || project.category;

  return {
    title: `${project.title} — ${categoryName} — DEPROS`,
    description:
      project.description ||
      `${project.title} (${categoryName}) designed by DEPROS.${
        project.client
          ? ` Client: ${project.clientDisplayName || project.client}.`
          : ""
      }`,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const draft = await draftMode();
  const isDraftMode = draft.isEnabled;

  // Retrieve project catalog with draft mode support
  const allProjects = await getPortfolioEntries({ isDraftMode });
  const projectIndex = allProjects.findIndex(
    (p) => p.slug === slug
  );

  if (projectIndex === -1) {
    notFound();
  }

  const project = allProjects[projectIndex];
  const total = allProjects.length;

  // Continuous archive loop calculation
  const prevIndex = (projectIndex - 1 + total) % total;
  const nextIndex = (projectIndex + 1) % total;
  const prevProject = allProjects[prevIndex];
  const nextProject = allProjects[nextIndex];

  const displayCategory =
    CATEGORY_DISPLAY_NAMES[project.category] ||
    project.category.replace(/-/g, " ");

  const displayIndex =
    project.number ||
    (projectIndex + 1 < 10
      ? `0${projectIndex + 1}`
      : `${projectIndex + 1}`);

  return (
    <>
      <Header variant="light" />

      <main className="flex-1 bg-white min-h-screen flex flex-col justify-between pt-24 sm:pt-28">
        {/* Project Header Section */}
        <article className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full pt-8 sm:pt-12">
          {/* Breadcrumb & Top Bar Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 sm:mb-12 border-b border-depros-border/80 text-xs font-sans uppercase tracking-wider"
          >
            <div className="flex items-center gap-3">
              <Link
                href="/work"
                className="font-mono text-depros-muted hover:text-depros-orange transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-depros-orange"
              >
                <span>←</span>
                <span>Work Archive</span>
              </Link>
              <span className="text-depros-border">/</span>
              <Link
                href={`/work?category=${project.category}`}
                className="font-bold text-depros-black hover:text-depros-orange transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-depros-orange"
              >
                {displayCategory}
              </Link>
            </div>

            <div className="flex items-center gap-3 text-depros-muted font-mono text-xs">
              <span className="text-depros-orange font-bold font-mono">
                {displayIndex}
              </span>
              <span>/</span>
              <span>{total < 10 ? `0${total}` : `${total}`}</span>
            </div>
          </nav>

          {/* Main Title & Subtitle */}
          <header className="space-y-4 mb-10 sm:mb-14">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono tracking-widest uppercase text-depros-orange">
              <span>{displayIndex}</span>
              <span>•</span>
              <span>{displayCategory}</span>
              {project.presentationType === "grouped" && (
                <>
                  <span>•</span>
                  <span className="text-depros-muted">Grouped Showcase</span>
                </>
              )}
            </div>

            <h1 className="font-sans font-bold text-4xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tighter uppercase leading-[0.9] text-depros-black">
              {project.title}
            </h1>

            {project.subtitle && (
              <p className="font-sans text-lg sm:text-xl md:text-2xl text-depros-muted tracking-tight font-normal">
                {project.subtitle}
              </p>
            )}
          </header>

          {/* Structured Metadata Bar (Render only available fields without placeholders) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 py-6 sm:py-8 border-y border-depros-border/80 text-xs font-sans mb-12 sm:mb-16">
            {/* Category */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-depros-muted block font-mono">
                Category
              </span>
              <strong className="text-depros-black uppercase tracking-wider font-semibold block">
                {displayCategory}
              </strong>
            </div>

            {/* Client (when present) */}
            {project.client && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-depros-muted block font-mono">
                  Client
                </span>
                <strong className="text-depros-black uppercase tracking-wider font-semibold block">
                  {project.clientDisplayName || project.client}
                </strong>
              </div>
            )}

            {/* Year (when present) */}
            {project.year && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-depros-muted block font-mono">
                  Year
                </span>
                <span className="text-depros-black font-mono font-medium block">
                  {project.year}
                </span>
              </div>
            )}

            {/* Scope / Deliverables (when present) */}
            {project.scope && project.scope.length > 0 && (
              <div className="col-span-2 sm:col-span-1 space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-depros-muted block font-mono">
                  Scope
                </span>
                <span className="text-depros-black font-medium leading-relaxed block">
                  {project.scope.join(" · ")}
                </span>
              </div>
            )}
          </div>

          {/* Frozen ProjectFraming Visual Presentation */}
          <section
            aria-label="Project Visual Presentation"
            className="w-full mb-12 sm:mb-16"
          >
            <ProjectFraming project={project} priority />
          </section>

          {/* Project Description (Rendered only when present) */}
          {project.description && (
            <section
              aria-label="Project Description"
              className="max-w-3xl py-8 sm:py-12 border-t border-depros-border/80 mb-12 sm:mb-16"
            >
              <h2 className="text-[11px] font-mono tracking-widest uppercase text-depros-orange mb-4">
                01 / Project Overview
              </h2>
              <p className="font-sans text-base sm:text-lg md:text-xl text-depros-black/90 leading-relaxed font-normal">
                {project.description}
              </p>
            </section>
          )}

          {/* Continuous Loop Project Navigation */}
          <nav
            aria-label="Project Navigation"
            className="border-t border-depros-border/80 pt-10 pb-16 sm:pb-24 mt-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
              {/* Previous Project Link */}
              <Link
                href={`/work/${prevProject.slug}`}
                className="group border border-depros-border/80 p-6 flex flex-col justify-between hover:border-depros-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-depros-orange"
              >
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-depros-muted group-hover:text-depros-orange transition-colors">
                  <span>←</span>
                  <span>Previous Project</span>
                </div>
                <div className="mt-4 space-y-1">
                  <div className="text-[11px] font-mono text-depros-muted">
                    {prevProject.number || "00"}
                  </div>
                  <h3 className="font-sans font-bold text-lg sm:text-xl text-depros-black uppercase tracking-tight group-hover:text-depros-orange transition-colors">
                    {prevProject.title}
                  </h3>
                </div>
              </Link>

              {/* Back to All Work Center Link */}
              <Link
                href="/work"
                className="border border-depros-border/80 p-6 flex flex-col items-center justify-center text-center bg-depros-light/50 hover:bg-depros-black hover:text-white transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-depros-orange"
              >
                <span className="text-[11px] font-mono uppercase tracking-widest text-depros-muted group-hover:text-white/80 transition-colors mb-2">
                  All Selected Works
                </span>
                <span className="font-sans font-bold text-sm uppercase tracking-wider text-depros-black group-hover:text-white transition-colors">
                  Return to Archive
                </span>
                <span className="text-xs font-mono text-depros-orange mt-2">
                  16 Projects
                </span>
              </Link>

              {/* Next Project Link */}
              <Link
                href={`/work/${nextProject.slug}`}
                className="group border border-depros-border/80 p-6 flex flex-col justify-between text-left md:text-right hover:border-depros-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-depros-orange"
              >
                <div className="flex items-center md:justify-end gap-2 text-[10px] font-mono uppercase tracking-widest text-depros-muted group-hover:text-depros-orange transition-colors">
                  <span>Next Project</span>
                  <span>→</span>
                </div>
                <div className="mt-4 space-y-1">
                  <div className="text-[11px] font-mono text-depros-muted">
                    {nextProject.number || "00"}
                  </div>
                  <h3 className="font-sans font-bold text-lg sm:text-xl text-depros-black uppercase tracking-tight group-hover:text-depros-orange transition-colors">
                    {nextProject.title}
                  </h3>
                </div>
              </Link>
            </div>
          </nav>
        </article>

        <Footer />
      </main>
    </>
  );
}
