"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const navLinks = [
  { label: "About Us", href: "/about" },
  { label: "Memberships", href: "/memberships" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/#contact" },
];
interface HeaderProps {
  isLoggedIn?: boolean;
}

export default function Header({ isLoggedIn }: HeaderProps) {
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
        className="fixed top-0 w-full z-50 transition-all duration-300 border-b bg-surface/90 backdrop-blur-md border-outline-variant shadow-lg h-20"
      >
        <div className="flex justify-between items-center h-full px-container-margin max-w-7xl mx-auto w-full">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-md hover:opacity-90 transition-opacity">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-lg font-label-md text-label-md">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                className="text-on-surface-variant hover:text-primary transition-colors duration-200"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}

            {isLoggedIn ? (
              <Link href="/admin/dashboard" className="text-primary">
                Dashboard
              </Link>
            ) : (
              <Link href="/auth/login" className="text-primary">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-on-surface-variant hover:text-on-surface p-sm focus:outline-none"
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen);
              console.log("drawer ===>>>", !isMobileMenuOpen);
            }}
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
        className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-md md:hidden transition-all duration-300 flex flex-col justify-center items-center ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        <div className="flex flex-col space-y-xl text-center font-display text-2xl uppercase tracking-wider">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              className="text-on-surface hover:text-primary transition-colors"
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-outline-variant w-42 mx-auto"></div>
          {isLoggedIn ? (
            <Link
              href="/admin/dashboard"
              className="text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
