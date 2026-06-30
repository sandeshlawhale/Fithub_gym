"use client";

import { useEffect, useState } from "react";
import { useScroll, useSpring, motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowUp } from "lucide-react";
import { usePathname } from "next/navigation";

export default function FloatingElements() {
  const pathname = usePathname();
  const [hasScrolled, setHasScrolled] = useState(false);

  const { scrollYProgress } = useScroll();

  // Smooth spring progress for the outline circle
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001
  });

  useEffect(() => {
    // Determine scroll state dynamically
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setHasScrolled(latest > 0.005); // Set scrolled state as soon as user scrolls slightly
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  // Exclude admin dashboard pages completely
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  const handleScrollAction = () => {
    if (hasScrolled) {
      // Scroll smoothly to hero section (top)
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Scroll down past Hero section (roughly 90% of screen height)
      window.scrollTo({ top: window.innerHeight * 0.9, behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1 cursor-pointer select-none group"
      onClick={handleScrollAction}
      title={hasScrolled ? "Back to Top" : "Scroll Down"}
    >
      {/* Circular Progress Indicator Button */}
      <div className="relative w-14 h-14 flex items-center justify-center rounded-full bg-surface-container/95 border border-outline-variant/60 backdrop-blur-md shadow-2xl hover:border-primary-container/60 hover:shadow-primary-container/10 transition-all duration-300 active:scale-95">
        {/* SVG Circle representing scroll progress */}
        <svg width="56" height="56" viewBox="0 0 56 56" className="absolute -rotate-90">
          {/* Background Track Circle */}
          <circle
            cx="28"
            cy="28"
            r="24"
            className="stroke-outline-variant/30"
            strokeWidth="3"
            fill="transparent"
          />
          {/* Animated Progress Circle */}
          <motion.circle
            cx="28"
            cy="28"
            r="24"
            className="stroke-primary-container"
            strokeWidth="3"
            fill="transparent"
            style={{ pathLength }}
            strokeLinecap="round"
          />
        </svg>

        {/* Morphing Icon */}
        <div className="relative z-10 text-on-surface">
          <AnimatePresence mode="wait">
            {hasScrolled ? (
              <motion.div
                key="up-arrow"
                initial={{ opacity: 0, rotate: -180, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 180, scale: 0.6 }}
                transition={{ duration: 0.25 }}
              >
                <ArrowUp className="w-5 h-5 text-primary-container group-hover:text-primary transition-colors" />
              </motion.div>
            ) : (
              <motion.div
                key="down-arrow"
                initial={{ opacity: 0, rotate: 180, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -180, scale: 0.6 }}
                transition={{ duration: 0.25 }}
              >
                <ArrowDown className="w-5 h-5 text-secondary group-hover:text-primary-container transition-colors animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Morphing Text Label */}
      <div className="h-4 overflow-hidden relative w-24 text-center">
        <AnimatePresence mode="wait">
          {hasScrolled ? (
            <motion.span
              key="lbl-top"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 font-label-md text-[10px] text-primary-container font-extrabold uppercase tracking-widest"
            >
              Back to Top
            </motion.span>
          ) : (
            <motion.span
              key="lbl-scroll"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 font-label-md text-[10px] text-secondary font-bold uppercase tracking-wider group-hover:text-primary-container transition-colors"
            >
              Scroll
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
