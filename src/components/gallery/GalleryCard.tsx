"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { GalleryItem } from "@/data/galleryData";

interface GalleryCardProps {
  item: GalleryItem;
  index: number;
  onClick: () => void;
}

export default function GalleryCard({ item, index, onClick }: GalleryCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Determine span classes to create visual rhythm inside the masonry grid
  const getGridSpans = () => {
    if (item.isFeatured) {
      // 2x size on desktop and tablet, full width on mobile
      return "col-span-2 row-span-2 min-h-[320px] md:min-h-[400px]";
    }
    // Alternate normal heights: index % 3 === 0 makes it tall (2 rows), otherwise short (1 row)
    const isTall = index % 3 === 0;
    return isTall 
      ? "col-span-1 row-span-2 min-h-[320px]" 
      : "col-span-1 row-span-1 min-h-[160px] md:min-h-[190px]";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative w-full overflow-hidden rounded-2xl border bg-surface-container-low/30 border-outline-variant/60 hover:border-primary-container/40 transition-colors duration-300 group cursor-zoom-in ${getGridSpans()}`}
      onClick={onClick}
    >
      {/* Skeleton Loader */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-surface-container-low animate-pulse flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-outline-variant border-t-primary-container rounded-full animate-spin"></div>
        </div>
      )}

      {/* Image Component */}
      <Image
        src={item.imageUrl}
        alt={item.title}
        fill
        sizes={item.isFeatured ? "(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Dark Overlay - Fades in on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

      {/* Top Left: Category Badge (Always visible, shifts slightly on hover) */}
      <div className="absolute top-sm left-sm z-20 transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1">
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-container-high/90 text-on-surface-variant border border-outline-variant backdrop-blur-sm shadow-md group-hover:bg-primary-container group-hover:text-black group-hover:border-primary transition-all duration-300">
          {item.category}
        </span>
      </div>

      {/* Center: "View Image" Button (Appears on hover) */}
      <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300">
        <div className="flex items-center gap-xs bg-primary-container text-black font-bold py-2.5 px-5 rounded-xl shadow-lg border border-primary hover:bg-primary transition-colors">
          <Eye className="w-4 h-4" />
          <span className="font-label-md text-xs uppercase tracking-wider">View Image</span>
        </div>
      </div>

      {/* Bottom Text Overlay: Title & Description (Fades in on hover) */}
      <div className="absolute bottom-0 inset-x-0 p-md z-20 flex flex-col gap-xs translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <h4 className="font-display text-sm md:text-base font-bold text-white uppercase tracking-wider line-clamp-1">
          {item.title}
        </h4>
        <p className="font-body-md text-xs text-secondary line-clamp-2">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}
