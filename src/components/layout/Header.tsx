"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
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
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-200 ${
        scrolled
          ? "bg-white border-b border-depros-border py-4"
          : "bg-transparent py-6 sm:py-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between">
        {/* Simple Text Navigation Header — DEPROS in Gotham */}
        <Link
          href="#hero"
          className={`font-sans font-bold text-lg sm:text-xl tracking-tight transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-depros-orange ${
            scrolled ? "text-depros-black" : "text-white"
          }`}
          aria-label="DEPROS Homepage"
          onClick={() => setMobileMenuOpen(false)}
        >
          DEPROS
        </Link>

        {/* Editorial Navigation Links */}
        <nav
          className={`hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-200 ${
            scrolled ? "text-depros-black" : "text-white"
          }`}
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
          className={`md:hidden flex flex-col justify-center items-center w-10 h-10 border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-depros-orange ${
            scrolled
              ? "border-depros-border bg-white text-depros-black"
              : "border-white/30 bg-transparent text-white"
          }`}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`w-5 h-[1.5px] transition-transform duration-200 ${
              scrolled ? "bg-depros-black" : "bg-white"
            } ${mobileMenuOpen ? "rotate-45 translate-y-[3.5px]" : "-translate-y-1"}`}
          />
          <span
            className={`w-5 h-[1.5px] transition-transform duration-200 ${
              scrolled ? "bg-depros-black" : "bg-white"
            } ${mobileMenuOpen ? "-rotate-45 -translate-y-[2px]" : "translate-y-1"}`}
          />
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bg-depros-black text-white border-b border-white/20 p-8 shadow-none animate-fadeIn">
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
        </div>
      )}
    </header>
  );
};
