"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryItem } from "@/data/galleryData";

interface LightboxProps {
  isOpen: boolean;
  item: GalleryItem | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({ isOpen, item, onClose, onPrev, onNext }: LightboxProps) {
  // Bind keyboard arrow keys and escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    // Lock background scroll when open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8 select-none"
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-md right-md z-50 p-2 rounded-xl bg-surface-container-low/40 border border-outline-variant/60 hover:border-primary-container hover:text-primary transition-all text-white scale-95 active:scale-90 transition-transform duration-200 cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Controls */}
          {/* Left Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-md p-3 rounded-xl bg-surface-container-low/40 border border-outline-variant/60 hover:border-primary-container hover:text-primary transition-all text-white z-40 hidden md:block scale-95 active:scale-90 cursor-pointer"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-md p-3 rounded-xl bg-surface-container-low/40 border border-outline-variant/60 hover:border-primary-container hover:text-primary transition-all text-white z-40 hidden md:block scale-95 active:scale-90 cursor-pointer"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image & Detail Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative max-w-5xl w-full flex flex-col gap-md items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Keep overlay clicks from closing when inside the content
          >
            {/* Image Slider Wrapper with swipe drag action */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(e, info) => {
                const swipeThreshold = 80;
                if (info.offset.x < -swipeThreshold) {
                  onNext();
                } else if (info.offset.x > swipeThreshold) {
                  onPrev();
                }
              }}
              className="relative w-full h-[55vh] md:h-[65vh] cursor-grab active:cursor-grabbing rounded-xl overflow-hidden"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                priority
                className="object-contain pointer-events-none select-none"
                sizes="(max-width: 1024px) 100vw, 85vw"
              />
            </motion.div>

            {/* Bottom Metadata */}
            <div className="w-full max-w-3xl flex flex-col gap-xs text-left px-sm">
              <div className="flex items-center gap-xs">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-container text-black border border-primary">
                  {item.category}
                </span>
              </div>
              <h3 className="font-display text-lg md:text-2xl font-extrabold text-white uppercase tracking-tight leading-tight mt-1">
                {item.title}
              </h3>
              {item.description && (
                <p className="font-body-md text-sm text-secondary leading-relaxed mt-1">
                  {item.description}
                </p>
              )}
            </div>
          </motion.div>

          {/* Swipe indicator helper on mobile devices */}
          <div className="absolute bottom-4 text-center md:hidden pointer-events-none">
            <span className="text-[10px] uppercase font-bold tracking-widest text-secondary/60">
              ← Swipe to Navigate →
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
