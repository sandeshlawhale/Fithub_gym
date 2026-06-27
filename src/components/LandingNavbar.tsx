"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          isScrolled
            ? "bg-surface/90 backdrop-blur-md border-outline-variant shadow-lg h-20"
            : "bg-transparent border-transparent h-24"
        }`}
      >
        <div className="flex justify-between items-center h-full px-container-margin max-w-7xl mx-auto w-full">
          {/* Brand Logo */}
          <Link href="#" className="flex items-center gap-md hover:opacity-90 transition-opacity">
            <img 
              src="/assets/gallery/logo.jpeg" 
              alt="The FitHub Gym Logo" 
              className="h-12 w-auto object-contain rounded" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-lg font-label-md text-label-md">
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors duration-200"
              href="#training"
            >
              Training
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors duration-200"
              href="#memberships"
            >
              Memberships
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors duration-200"
              href="#coaches"
            >
              Coaches
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors duration-200"
              href="#contact"
            >
              Contact
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors duration-200"
              href="#gallery"
            >
              Gallery
            </Link>
          </div>

          {/* Trailing Action */}
          <div className="hidden md:flex items-center gap-md">
            <Link
              href="/auth/login"
              className="border border-outline-variant hover:border-primary text-white hover:bg-surface-container-high transition-all font-label-md text-label-md font-bold px-lg py-sm rounded-xl"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-on-surface-variant hover:text-on-surface p-sm focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-on-surface" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-md md:hidden transition-all duration-300 flex flex-col justify-center items-center ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col space-y-xl text-center font-display text-2xl uppercase tracking-wider">
          <Link
            className="text-on-surface hover:text-primary transition-colors"
            href="#training"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Training
          </Link>
          <Link
            className="text-on-surface hover:text-primary transition-colors"
            href="#memberships"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Memberships
          </Link>
          <Link
            className="text-on-surface hover:text-primary transition-colors"
            href="#coaches"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Coaches
          </Link>
          <Link
            className="text-on-surface hover:text-primary transition-colors"
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <Link
            className="text-on-surface hover:text-primary transition-colors"
            href="#gallery"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Gallery
          </Link>
          <div className="h-px bg-outline-variant w-24 mx-auto my-md"></div>
          <Link
            href="/auth/login"
            className="border border-outline-variant text-white hover:bg-surface-container-high font-bold px-xl py-3 rounded-xl text-lg w-48 text-center"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </Link>
        </div>
      </div>
    </>
  );
}
