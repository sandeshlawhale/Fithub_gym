"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import faqData from "@/data/faq.json";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-surface-container-lowest relative overflow-hidden" id="faq">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/2 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl px-container-margin mx-auto relative z-10">
        {/* Title Block */}
        <div className="text-center space-y-sm max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-on-background uppercase tracking-tight">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="font-body-md text-xs md:text-base text-secondary">
            Got questions? We've got answers. Explore the details below to learn more about joining The FitHub Gym.
          </p>
        </div>

        {/* Accordion List with dividers, no gaps, no border radius, no side borders */}
        <div className="border-t border-b border-outline-variant">
          {faqData.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`group border-outline-variant transition-colors duration-300 ${idx !== faqData.length - 1 ? "border-b" : ""
                  }`}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="cursor-pointer w-full py-4 px-2 flex items-center justify-between text-left focus:outline-none group"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-sm sm:text-base font-semibold text-white uppercase tracking-wider group-hover:text-primary transition-colors duration-200">
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="ml-4 shrink-0 text-primary-container group-hover:text-primary transition-colors hidden group-hover:block"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: {
                          height: { type: "spring", stiffness: 150, damping: 20 },
                          opacity: { duration: 0.2 },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.25 },
                          opacity: { duration: 0.15 },
                        },
                      }}
                    >
                      <div className="px-2 pb-4 pt-2">
                        <p className="font-body-md text-xs sm:text-sm text-secondary leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
