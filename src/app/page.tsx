import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DeprosLogo } from "@/components/brand/DeprosLogo";
import { SelectedWork } from "@/components/portfolio/SelectedWork";
import { ManifestoBanner } from "@/components/studio/ManifestoBanner";
import { ClientIndex } from "@/components/studio/ClientIndex";
import { FEATURED_PROJECTS } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* HOMEPAGE HERO — Exact Translation of DEPROS PDF Cover (Page 1) */}
        <section
          id="hero"
          className="relative min-h-[92vh] sm:min-h-screen bg-depros-orange text-white flex flex-col justify-between pt-24 sm:pt-32 pb-12 sm:pb-16 px-6 sm:px-10 lg:px-16 overflow-hidden select-none"
        >
          {/* Top Row: Official Logo & STUDIO PROFILE Header */}
          <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-start justify-between gap-8">
            {/* Top Left: Official Logo SVG */}
            <div>
              <DeprosLogo variant="white" className="scale-105 sm:scale-110 origin-top-left" />
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
          <div className="my-auto py-12" aria-hidden="true" />

          {/* Bottom Row: Source Manifesto Statements */}
          <div className="max-w-7xl mx-auto w-full flex flex-col items-start sm:items-end text-left sm:text-right space-y-3 pt-8">
            <h1 className="font-sans font-bold text-2xl sm:text-4xl lg:text-5xl leading-tight text-white max-w-xl">
              Challenge the Usual.
              <br />
              Break the Expected.
            </h1>
            <p className="font-sans text-xs sm:text-sm text-white/90 font-normal max-w-lg tracking-wide">
              Confident in Vision. Disruptive by Design. Intentional in Every Detail.
            </p>
          </div>
        </section>

        {/* 01: SELECTED WORK SHOWCASE */}
        <SelectedWork projects={FEATURED_PROJECTS} />

        {/* 02: STUDIO PROFILE & PHILOSOPHY */}
        <ManifestoBanner />

        {/* 03: NOTABLE CLIENTS */}
        <ClientIndex />
      </main>

      <Footer />
    </>
  );
}
