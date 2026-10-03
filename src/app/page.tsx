import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DeprosLogo } from "@/components/brand/DeprosLogo";
import { SelectedWork } from "@/components/portfolio/SelectedWork";
import { ManifestoBanner } from "@/components/studio/ManifestoBanner";
import { ClientIndex } from "@/components/studio/ClientIndex";
import { getPortfolioEntries, getClientItems } from "@/lib/dataSource";

export default async function HomePage() {
  const [allProjects, clients] = await Promise.all([
    getPortfolioEntries(),
    getClientItems(),
  ]);

  const featuredProjects = allProjects.filter((project) => project.featured);
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* HOMEPAGE HERO — Refined Editorial Translation of DEPROS PDF Cover (Page 1) */}
        <section
          id="hero"
          className="relative min-h-[90vh] sm:min-h-screen bg-depros-orange text-white flex flex-col justify-between pt-28 sm:pt-36 pb-16 sm:pb-24 px-6 sm:px-10 lg:px-16 select-none"
        >
          {/* Top Row: Official Logo & STUDIO PROFILE Header */}
          <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-start justify-between gap-8">
            {/* Top Left: Official Logo SVG with strong intentional presence */}
            <div>
              <DeprosLogo variant="white" className="w-48 sm:w-60 md:w-72 lg:w-80" />
            </div>

            {/* Top Right: STUDIO PROFILE + . + o Micro Elements */}
            <div className="flex flex-col items-start sm:items-end">
              <div className="flex items-center gap-4 text-xs sm:text-sm font-sans tracking-ultraWide uppercase text-white/95 font-medium">
                <span>STUDIO</span>
                <span>PROFILE</span>
              </div>
              <div
                className="mt-2 text-xs font-mono tracking-widest text-white/70"
                aria-hidden="true"
              >
                . + o
              </div>
            </div>
          </div>

          {/* Generous Negative Space in the Middle */}
          <div className="my-auto py-12 sm:py-20" aria-hidden="true" />

          {/* Bottom Row: Source Manifesto Statements (Restrained Editorial Tone) */}
          <div className="max-w-6xl mx-auto w-full flex flex-col items-start sm:items-end text-left sm:text-right space-y-3">
            <h1 className="font-sans font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight text-white max-w-lg">
              Challenge the Usual.
              <br />
              Break the Expected.
            </h1>
            <p className="font-sans text-xs sm:text-sm text-white/85 font-normal max-w-md tracking-wide">
              Confident in Vision. Disruptive by Design. Intentional in Every Detail.
            </p>
          </div>
        </section>

        {/* 01: SELECTED WORK SHOWCASE */}
        <SelectedWork projects={featuredProjects} />

        {/* 02: STUDIO PROFILE & PHILOSOPHY */}
        <ManifestoBanner />

        {/* 03: NOTABLE CLIENTS */}
        <ClientIndex clients={clients} />
      </main>

      <Footer />
    </>
  );
}
