"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

export interface TestimonialItem {
  id: string;
  name: string;
  email: string;
  rating: number;
  review: string;
  createdAt: Date | string;
}

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}: {
  items: TestimonialItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow" | number;
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  }, [items]);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      // Clear any existing duplicated items to prevent stacking duplicates on re-renders
      const scroller = scrollerRef.current;
      const originalChildrenCount = items.length;
      
      // If we already duplicated, reset first
      while (scroller.children.length > originalChildrenCount) {
        scroller.removeChild(scroller.lastChild!);
      }

      const scrollerContent = Array.from(scroller.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        scroller.appendChild(duplicatedItem);
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty("--animation-direction", "forwards");
      } else {
        containerRef.current.style.setProperty("--animation-direction", "reverse");
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (typeof speed === "number") {
        containerRef.current.style.setProperty("--animation-duration", `${speed}s`);
      } else if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "30s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "50s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return "??";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0]! + parts[parts.length - 1]![0]).toUpperCase();
  };

  const formatDate = (dateVal: Date | string) => {
    try {
      const date = new Date(dateVal);
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return "";
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-full overflow-hidden",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-md py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <motion.li
            whileHover={{ 
              y: -5, 
              borderColor: "rgba(255, 193, 116, 0.4)",
              boxShadow: "0 10px 30px -10px rgba(255, 193, 116, 0.15)"
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[320px] md:w-[400px] h-[210px] flex flex-col justify-between shrink-0 rounded-2xl border border-outline-variant/40 bg-surface-container-low/80 backdrop-blur-xs p-md relative overflow-hidden"
            key={`${item.id}-${idx}`}
          >
            {/* Glow accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/2 rounded-full blur-2xl pointer-events-none" />
            
            {/* Review text */}
            <div className="text-secondary text-sm leading-relaxed line-clamp-4 italic">
              "{item.review}"
            </div>

            {/* Bottom metadata */}
            <div className="flex items-center justify-between border-t border-outline-variant/20 pt-md mt-md">
              <div className="flex items-center gap-sm">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center text-primary font-bold text-sm uppercase tracking-wide shrink-0">
                  {getInitials(item.name)}
                </div>
                
                {/* Name & Stars */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-white text-sm font-semibold truncate max-w-[130px] md:max-w-[180px]">
                    {item.name}
                  </span>
                  <div className="flex gap-px">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "w-3 h-3",
                          star <= item.rating
                            ? "fill-primary text-primary"
                            : "text-[#2e2e2d] fill-none"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Date */}
              <span className="text-on-surface-variant/60 text-xs font-medium">
                {formatDate(item.createdAt)}
              </span>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};
