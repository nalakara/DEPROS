import React from "react";
import Link from "next/link";
import { STUDIO_CAPABILITIES } from "@/lib/data";

export const Footer: React.FC = () => {
  return (
    <footer
      id="contact"
      className="scroll-mt-20 sm:scroll-mt-24 bg-depros-orange text-white pt-24 pb-16 sm:pt-32 sm:pb-20 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        {/* Top Header Row with . + o accent */}
        <div className="flex justify-between items-start mb-16 sm:mb-24">
          <div className="text-xs font-mono tracking-[0.3em] uppercase text-white/80">
            03 / CONTACT
          </div>
          <div
            className="text-xs font-mono tracking-widest text-white/80"
            aria-hidden="true"
          >
            . + o
          </div>
        </div>

        {/* Main Spread (Directly matching PDF Page 21) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: LETS DO IT + Services */}
          <div className="lg:col-span-7 space-y-8">
            <h2 className="font-sans font-bold text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tighter leading-[0.85] text-white">
              LETS DO
              <br />
              IT
            </h2>

            <p className="max-w-xl text-xs sm:text-sm font-sans text-white/85 leading-relaxed">
              {STUDIO_CAPABILITIES.join(" / ")}
            </p>
          </div>

          {/* Right Column: Direct Contact Actions */}
          <div className="lg:col-span-5 space-y-6 pt-4 lg:pt-2">
            <div className="border-b border-white/20 pb-2">
              <span className="text-xs font-sans uppercase tracking-[0.25em] font-bold text-white">
                CONTACT
              </span>
            </div>

            {/* Email Link */}
            <div>
              <div className="text-[11px] font-sans uppercase tracking-widest text-white/70 mb-1">
                Email
              </div>
              <a
                href="mailto:depros.bali@gmail.com"
                className="font-sans font-bold text-xl sm:text-2xl text-white hover:text-depros-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                depros.bali@gmail.com
              </a>
            </div>

            {/* Phone & WhatsApp Links */}
            <div className="pt-2 space-y-3">
              <div className="text-[11px] font-sans uppercase tracking-widest text-white/70">
                Phone / WhatsApp
              </div>
              <div className="space-y-1.5 font-sans text-base sm:text-lg font-medium">
                <div>
                  <a
                    href="https://wa.me/6281805588333"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-depros-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white inline-flex items-center gap-2"
                  >
                    <span>+62 (0) 8180 5588 333</span>
                    <span className="text-xs text-white/70 font-mono">↗ WhatsApp</span>
                  </a>
                </div>
                <div>
                  <a
                    href="https://wa.me/6281239584802"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-depros-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white inline-flex items-center gap-2"
                  >
                    <span>+62 (0) 8123 9584 802</span>
                    <span className="text-xs text-white/70 font-mono">↗ WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 text-xs font-sans text-white/70">
              Bali, Indonesia
            </div>
          </div>
        </div>

        {/* Bottom Minimalist Bar */}
        <div className="mt-20 sm:mt-28 pt-8 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans text-white/80">
          <div>
            <span>Confident in Vision. Disruptive by Design. Intentional in Every Detail.</span>
          </div>

          <div>
            <a
              href="#hero"
              className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white uppercase tracking-wider font-medium"
            >
              Back to Top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
