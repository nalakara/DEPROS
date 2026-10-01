"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DeprosLogo } from "../brand/DeprosLogo";

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-depros-border py-3 shadow-sm"
          : "bg-transparent py-5 sm:py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex items-center justify-between">
        {/* Brand Anchor */}
        <Link
          href="#hero"
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-depros-orange"
          aria-label="DEPROS Homepage"
          onClick={() => setMobileMenuOpen(false)}
        >
          <DeprosLogo variant="black" showTagline={false} className="scale-90 origin-left" />
        </Link>

        {/* Studio Status Accent */}
        <div className="hidden md:flex items-center gap-2.5 text-[11px] tracking-widest uppercase text-depros-muted font-sans font-medium">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-depros-orange animate-pulse" />
          <span>Bali, Indonesia</span>
          <span className="text-depros-borderDark font-mono">/</span>
          <span>Studio Profile 2026</span>
        </div>

        {/* Editorial Navigation */}
        <nav
          className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium text-depros-black"
          aria-label="Main Navigation"
        >
          <Link
            href="#work"
            className="hover:text-depros-orange transition-colors duration-200 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-depros-orange"
          >
            Work
          </Link>
          <Link
            href="#studio"
            className="hover:text-depros-orange transition-colors duration-200 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-depros-orange"
          >
            Studio
          </Link>
          <Link
            href="#contact"
            className="hover:text-depros-orange transition-colors duration-200 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-depros-orange"
          >
            Contact
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-11 h-11 border border-depros-border bg-white text-depros-black focus:outline-none focus-visible:ring-2 focus-visible:ring-depros-orange"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`w-5 h-[1.5px] bg-depros-black transition-transform duration-200 ${
              mobileMenuOpen ? "rotate-45 translate-y-[3.5px]" : "-translate-y-1"
            }`}
          />
          <span
            className={`w-5 h-[1.5px] bg-depros-black transition-transform duration-200 ${
              mobileMenuOpen ? "-rotate-45 -translate-y-[2px]" : "translate-y-1"
            }`}
          />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bg-depros-black text-white border-b border-white/20 p-8 shadow-2xl animate-fadeIn">
          <nav className="flex flex-col gap-6 text-sm uppercase tracking-[0.2em] font-medium">
            <Link
              href="#work"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3 border-b border-white/10 hover:text-depros-orange transition-colors"
            >
              <span>Work</span>
              <span className="text-depros-orange font-mono">→</span>
            </Link>
            <Link
              href="#studio"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3 border-b border-white/10 hover:text-depros-orange transition-colors"
            >
              <span>Studio</span>
              <span className="text-depros-orange font-mono">→</span>
            </Link>
            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3 border-b border-white/10 hover:text-depros-orange transition-colors"
            >
              <span>Contact</span>
              <span className="text-depros-orange font-mono">→</span>
            </Link>
          </nav>
          <div className="mt-8 pt-4 text-[11px] text-white/50 flex justify-between items-center tracking-widest font-sans">
            <span>DEPROS STUDIO</span>
            <span>BALI, INDONESIA</span>
          </div>
        </div>
      )}
    </header>
  );
};
