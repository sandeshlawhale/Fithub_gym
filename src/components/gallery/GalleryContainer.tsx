"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Image as ImageIcon } from "lucide-react";
import { GalleryItem } from "@/data/galleryData";
import GalleryCard from "./GalleryCard";
import Lightbox from "./Lightbox";
import CTASection from "./CTASection";

interface GalleryContainerProps {
  initialItems: GalleryItem[];
}

export default function GalleryContainer({ initialItems }: GalleryContainerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // 1. Filter visible items only
  const visibleItems = useMemo(() => {
    return initialItems.filter((item) => item.isVisible);
  }, [initialItems]);

  // 2. Derive unique categories dynamically from visible database/static entries
  const categories = useMemo(() => {
    const unique = new Set(visibleItems.map((item) => item.category));
    return ["All", ...Array.from(unique)];
  }, [visibleItems]);

  // 3. Filter items for grid display based on active chip selection
  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") {
      return [...visibleItems].sort((a, b) => a.displayOrder - b.displayOrder);
    }
    return visibleItems
      .filter((item) => item.category === selectedCategory)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [visibleItems, selectedCategory]);

  // Lightbox handlers
  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handlePrevLightbox = () => {
    if (lightboxIndex === null || filteredItems.length === 0) return;
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null));
  };

  const handleNextLightbox = () => {
    if (lightboxIndex === null || filteredItems.length === 0) return;
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : null));
  };

  const currentLightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[400px] md:aspect-16/5 items-center flex justify-center overflow-hidden px-container-margin py-xl">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat opacity-45 grayscale"
            style={{ backgroundImage: "url('/assets/gallery/hero.webp')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center justify-center">
          <div className="text-center px-2 max-w-4xl mx-auto flex flex-col items-center gap-sm">
            <div className="inline-flex items-center gap-xs px-3 py-1 rounded-full border border-outline-variant bg-surface-container-low/60 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
              <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">
                Our Showcase
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase text-on-surface tracking-tight leading-tight text-center">
              Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-primary">Gym</span>
            </h1>

            <p className="font-body-md text-sm md:text-base text-secondary max-w-2xl text-center leading-relaxed">
              Take a closer look inside The FitHub Gym. From modern equipment and dedicated training spaces to our motivating environment, explore the place where fitness goals become reality.
            </p>
          </div>
        </div>
      </section>

      {/* 2. INTRODUCTION */}
      {/* <section className="pt-16 pb-8 px-container-margin">
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-sm">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight">
            A Gym Built For Every Fitness Journey
          </h2>
          <p className="font-body-md text-sm md:text-base text-secondary leading-relaxed max-w-3xl mx-auto">
            Every corner of The FitHub Gym is designed to provide a comfortable, motivating, and high-quality training experience. Browse through our gallery and discover the equipment, workout areas, and environment that make our gym the preferred fitness destination in Narkhed.
          </p>
        </div>
      </section> */}

      {/* 3. CATEGORY FILTERS */}
      {visibleItems.length > 0 && (
        <section className="py-6 px-container-margin">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-start md:justify-center overflow-x-auto hide-scrollbar gap-sm py-2">
              <div className="flex gap-sm whitespace-nowrap px-1">
                {categories.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`relative px-5 py-2.5 rounded-full font-label-md text-xs uppercase tracking-wider transition-colors duration-300 cursor-pointer ${isActive
                        ? "text-black font-extrabold"
                        : "text-on-surface-variant bg-surface-container-low/40 hover:bg-surface-container hover:text-white border border-outline-variant/60"
                        }`}
                    >
                      <span className="relative z-10">{category}</span>
                      {isActive && (
                        <motion.span
                          layoutId="activeCategoryPill"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          className="absolute inset-0 bg-primary-container border border-primary rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. GALLERY GRID OR EMPTY STATE */}
      <section className="py-8 px-container-margin min-h-[400px]">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {filteredItems.length === 0 ? (
              /* 8. EMPTY STATE */
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center py-20 px-md rounded-2xl border border-outline-variant/40 bg-surface-container-low/20 max-w-lg mx-auto"
              >
                <div className="p-4 rounded-full bg-surface-container-low border border-outline-variant text-secondary mb-md">
                  <ImageIcon className="w-8 h-8 text-outline" />
                </div>
                <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider mb-xs">
                  No Images Found
                </h3>
                <p className="font-body-md text-sm text-secondary mb-lg">
                  No gallery images are available at the moment.
                </p>
                <Link
                  href="/"
                  prefetch={false}
                  className="inline-flex items-center gap-xs bg-primary-container text-black font-bold py-2.5 px-6 rounded-xl hover:bg-primary transition-all font-label-md text-xs uppercase tracking-wider scale-95 active:scale-90 transition-transform duration-200"
                >
                  <Home className="w-4 h-4" />
                  Back to Home
                </Link>
              </motion.div>
            ) : (
              /* 5 & 7. MASONRY GRID LAYOUT */
              <motion.div
                key="gallery-grid"
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-sm md:gap-md lg:gap-lg auto-rows-[160px] md:auto-rows-[190px] grid-flow-row-dense"
              >
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item, idx) => (
                    <GalleryCard
                      key={item.id}
                      item={item}
                      index={idx}
                      onClick={() => handleOpenLightbox(idx)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 6. LIGHTBOX */}
      <Lightbox
        isOpen={lightboxIndex !== null}
        item={currentLightboxItem}
        onClose={handleCloseLightbox}
        onPrev={handlePrevLightbox}
        onNext={handleNextLightbox}
      />

      {/* 9. CTA SECTION */}
      <CTASection />
    </div>
  );
}
