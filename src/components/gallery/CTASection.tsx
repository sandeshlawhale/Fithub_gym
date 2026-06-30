"use client";

import Link from "next/link";
import { Compass } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-4xl px-container-margin mx-auto">
        <div className="relative overflow-hidden bg-surface-container-low/30 border border-outline-variant rounded-2xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-lg group hover:border-primary-container/20 transition-all duration-300">
          {/* Subtle gold glow behind the card */}
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/2 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col gap-sm text-center md:text-left max-w-xl">
            <div className="flex items-center gap-xs justify-center md:justify-start text-primary-container">
              <Compass className="w-5 h-5" />
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Visit Facility</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight leading-tight">
              Ready to Experience It Yourself?
            </h2>
            <p className="font-body-md text-sm md:text-base text-secondary leading-relaxed">
              Photos are just the beginning. Visit The FitHub Gym in person, explore our facilities, and discover the environment that keeps our members motivated every day.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-sm shrink-0 w-full md:w-auto mt-4 md:mt-0">
            <Link
              href="/memberships"
              className="inline-flex items-center justify-center bg-primary-container text-black font-bold py-3.5 px-6 rounded-xl hover:bg-primary transition-all font-label-md text-sm scale-95 active:scale-90 transition-transform duration-200 text-center w-full sm:w-auto"
            >
              View Membership Plans
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center bg-transparent border border-outline-variant text-on-surface font-bold py-3.5 px-6 rounded-xl hover:border-primary-container hover:text-primary transition-all font-label-md text-sm scale-95 active:scale-90 transition-transform duration-200 text-center w-full sm:w-auto"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
