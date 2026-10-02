import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header variant="light" />

      <main className="flex-1 bg-white min-h-screen flex flex-col justify-between pt-24 sm:pt-28">
        <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full py-20 sm:py-32 flex-1 flex flex-col justify-center items-start">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-depros-orange">
              <span>404</span>
              <span>/</span>
              <span>RECORD NOT FOUND</span>
              <span>. + o</span>
            </div>

            <h1 className="font-sans font-bold text-5xl sm:text-7xl lg:text-8xl tracking-tighter uppercase leading-[0.9] text-depros-black">
              Page Not
              <br />
              Found
            </h1>

            <p className="font-sans text-sm sm:text-base text-depros-muted leading-relaxed pt-4">
              The project or page you are looking for does not exist in the canonical DEPROS portfolio catalog.
            </p>

            <div className="pt-8 flex flex-wrap gap-4">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 bg-depros-orange text-white px-6 py-3.5 text-xs font-sans uppercase font-bold tracking-widest hover:bg-depros-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-depros-orange"
              >
                <span>View Portfolio Archive</span>
                <span className="font-mono">→</span>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 border border-depros-border px-6 py-3.5 text-xs font-sans uppercase font-bold tracking-widest text-depros-black hover:border-depros-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-depros-orange"
              >
                <span>Return Home</span>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
