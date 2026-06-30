"use client";

import Link from "next/link";
import { MessageSquare, Share, Share2, Star } from "lucide-react";
import { InfiniteMovingCards, TestimonialItem } from "../ui/infinite-moving-cards";

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  // Show section only when there are more than 4 testimonials
  if (!testimonials || testimonials.length < 5) {
    return null;
  }

  // Split testimonials into two rows
  let row1 = testimonials.filter((_, idx) => idx % 2 === 0);
  let row2 = testimonials.filter((_, idx) => idx % 2 !== 0);

  // Handle case with very few testimonials
  if (row2.length === 0) {
    row2 = [...row1];
  }
  if (row1.length < 3) {
    row1 = [...row1, ...row1, ...row1];
  }
  if (row2.length < 3) {
    row2 = [...row2, ...row2, ...row2];
  }

  const googleMapsUrl = "https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUqCAgAEEUYJxg7MggIABBFGCcYOzIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIHCAgQABiABDIHCAkQABiABNIBCTEwNTM0ajBqN6gCALACAA&um=1&ie=UTF8&fb=1&gl=in&sa=X&geocode=KY-RnQyGrdU7MaHJY1UE-nxj&daddr=Plot+no+6456,+Ward+no+17,+opp+Govt+ITI,+Kalambha+Road,+Narkhed+-+441304";

  return (
    <section className="py-24 bg-surface-container-lowest relative overflow-hidden" id="testimonials">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-primary/2 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-primary-container/2 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-10xl px-container-margin mx-auto flex flex-col items-center gap-xl relative z-10">

        {/* Title Block */}
        <div className="text-center space-y-sm max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-on-background uppercase tracking-tight">
            COMMUNITY OF EXCELLENCE
          </h2>
          <p className="font-body-md text-sm md:text-base text-secondary">
            Hear from our members who have committed to their training and achieved exceptional results.
          </p>
        </div>

        {/* Marquee Wrapper with left & right gradient fades */}
        <div className="w-full relative py-md overflow-hidden">
          {/* Left Gradient Fade */}
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-surface-container-lowest to-transparent z-30 pointer-events-none" />

          {/* Right Gradient Fade */}
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-surface-container-lowest to-transparent z-30 pointer-events-none" />

          {/* Row 1 (Faster) */}
          <InfiniteMovingCards
            items={row1}
            direction="left"
            speed={45}
            className="mb-md"
          />

          {/* Row 2 (Slower for Parallax) */}
          <InfiniteMovingCards
            items={row2}
            direction="left"
            speed={60}
          />
        </div>

        {/* Bottom Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-sm">
          <Link
            href="/testimonials/submit"
            prefetch={false}
            className="inline-flex items-center gap-xs bg-transparent border border-outline-variant hover:border-primary-container hover:text-primary-container text-on-background font-bold py-2.5 px-6 rounded-xl text-sm transition-all duration-300 active:scale-95 cursor-pointer  "
          >
            <Share2 width={16} height={16} />
            Share Your Experience
          </Link>
          {/* <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-lg py-4 rounded-xl border border-outline-variant hover:border-primary/50 text-white font-label-md font-extrabold active:scale-95 transition-all text-center min-w-[200px]"
          >
            View All Reviews
          </a> */}
        </div>

      </div>
    </section>
  );
}
