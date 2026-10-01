import React from "react";
import { STUDIO_CAPABILITIES } from "@/lib/data";

export const ManifestoBanner: React.FC = () => {
  return (
    <section id="studio" className="py-20 sm:py-28 bg-white border-t border-depros-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        {/* Section Label */}
        <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-depros-orange mb-8 sm:mb-12">
          <span>02</span>
          <span>/</span>
          <span>STUDIO PROFILE</span>
        </div>

        {/* Editorial 2-Column Spread (Translating PDF Page 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Column: Hello There! & Manifesto */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-depros-black">
              Hello There!
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-depros-black/85 font-sans leading-relaxed">
              <p className="font-medium text-depros-black">
                DEPROS is a design and brand development studio driven by clarity,
                confidence, and intention. We believe strong brands are built
                through restraint, where simplicity becomes the foundation for bold,
                memorable statements.
              </p>
              <p>
                Our work is about breaking away from the expected and creating
                visual identities that resonate. By stripping design back to what
                truly matters, we craft brands that speak clearly, stand
                confidently, and leave a lasting impression across every
                touchpoint.
              </p>
              <p>
                Every project is approached with a sharp eye and a considered
                process, resulting in design solutions that are distinctive yet
                functional. From brand identity to print-ready execution, DEPROS
                creates work that feels purposeful, refined, and quietly powerful.
              </p>
            </div>
          </div>

          {/* Right Column: What We Do */}
          <div className="lg:col-span-5 space-y-6 pt-2 lg:pt-0">
            <div>
              <h3 className="font-sans font-bold text-xl sm:text-2xl text-depros-black mb-4">
                What We Do
              </h3>
              <p className="text-sm sm:text-base font-sans text-depros-black/80 leading-relaxed">
                {STUDIO_CAPABILITIES.map((cap, idx) => (
                  <span key={idx}>
                    <span className="font-medium">{cap}</span>
                    {idx < STUDIO_CAPABILITIES.length - 1 && (
                      <span className="text-depros-orange font-bold mx-2">/</span>
                    )}
                  </span>
                ))}
              </p>
            </div>

            <div className="pt-6 border-t border-depros-border">
              <div className="text-xs sm:text-sm font-sans font-bold text-depros-orange tracking-wide">
                DEPROS - Confident in Vision. Disruptive by Design. Intentional in
                Every Detail.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
