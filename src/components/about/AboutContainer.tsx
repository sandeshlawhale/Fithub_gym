"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shirt,
  Dumbbell,
  Footprints,
  Users,
  Smartphone,
  Ban,
  Coffee,
  ShieldAlert,
  Compass,
  Eye,
  Target,
  Sparkles,
  ArrowRight
} from "lucide-react";
// StandardOfExcellence is passed as a Server Component prop to avoid async Client Component issues

// Variants for Framer Motion scroll animations
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const imageReveal = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" as const }
  }
};

interface AboutContainerProps {
  whyChooseSection: React.ReactNode;
}

export default function AboutContainer({ whyChooseSection }: AboutContainerProps) {
  const missionVision = [
    {
      title: "Our Mission",
      description: "To inspire healthier lifestyles by providing quality equipment, supportive trainers, and a motivating environment where every member can achieve their fitness goals.",
      icon: <Target className="w-8 h-8 text-primary-container" />
    },
    {
      title: "Our Vision",
      description: "To become the most trusted fitness destination in Narkhed by building a strong community focused on health, consistency, and personal growth.",
      icon: <Compass className="w-8 h-8 text-primary-container" />
    }
  ];

  const trainers = [
    {
      name: "Kunal Ladikar",
      role: "Trainer",
      description: "Helping members start their day with proper guidance, motivation, and safe workout techniques.",
    },
    {
      name: "Bhavesh Rewatar",
      role: "Trainer",
      description: "Dedicated to helping members improve strength, confidence, and consistency during evening training sessions.",
    }
  ];

  const partners = [
    "Dipanshu Korde",
    "Himanshu Bagde",
    "Rushikesh Kakde",
    "Anand Bafna",
    "Krupal Rai"
  ];

  const rules = [
    {
      text: "Wear proper gym attire.",
      icon: <Shirt className="w-6 h-6 text-primary-container" />
    },
    {
      text: "Bring and use a personal towel.",
      icon: <Sparkles className="w-6 h-6 text-primary-container" />
    },
    {
      text: "Re-rack weights after use.",
      icon: <Dumbbell className="w-6 h-6 text-primary-container" />
    },
    {
      text: "No outside shoes on the gym floor.",
      icon: <Footprints className="w-6 h-6 text-primary-container" />
    },
    {
      text: "Respect everyone's personal space.",
      icon: <Users className="w-6 h-6 text-primary-container" />
    },
    {
      text: "Keep mobile phone usage to a minimum.",
      icon: <Smartphone className="w-6 h-6 text-primary-container" />
    },
    {
      text: "No food or drinks on the gym floor.",
      icon: <Coffee className="w-6 h-6 text-primary-container" />
    }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      viewport={{ once: true }}
      className="space-y-0"
    >
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[480px] md:h-[600px] flex items-center justify-center overflow-hidden px-container-margin py-0">
        {/* Background Image with Overlays */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/gallery/hero.webp"
            alt="The FitHub Gym Hero Showcase"
            fill
            priority
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent"></div>
        </div>

        <div className="max-w-4xl mx-auto w-full relative z-10 text-center flex flex-col items-center gap-md">
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-xs px-3 py-1 rounded-full border border-outline-variant bg-surface-container-low/60 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">
              Narkhed's Premium Fitness Center
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold uppercase text-on-surface tracking-tight leading-tight"
          >
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-primary">The FitHub</span> Gym
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="font-body-md text-base md:text-lg text-secondary max-w-2xl leading-relaxed"
          >
            More than just a gym, The FitHub Gym is a community dedicated to helping people build healthier lifestyles through consistency, motivation, and quality training.
          </motion.p>
        </div>
      </section>

      {/* 2. OUR STORY SECTION */}
      <section className="py-2xl bg-surface border-y border-outline-variant/30">
        <div className="max-w-7xl px-container-margin mx-auto grid grid-cols-1 lg:grid-cols-2 gap-xl lg:gap-2xl items-center">
          {/* Left: Text Content */}
          <motion.div
            variants={fadeInUp}
            viewport={{ once: true, margin: "-100px" }}
            initial="hidden"
            whileInView="visible"
            className="space-y-lg"
          >
            <div>
              <span className="font-label-sm text-xs text-primary-container uppercase tracking-widest font-bold">
                ESTABLISHED 2026
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-on-background uppercase tracking-tight mt-xs">
                Our Story
              </h2>
            </div>

            <div className="space-y-md font-body-md text-secondary leading-relaxed text-sm md:text-base">
              <p>
                The FitHub Gym was built with one simple goal — to provide a modern, welcoming, and motivating fitness environment for the people of Narkhed.
              </p>
              <p>
                We believe that fitness should be accessible to everyone, whether you're taking your very first step into the gym or working toward your next personal milestone.
              </p>
              <p>
                Our focus is on creating a supportive atmosphere where members can train with confidence, stay consistent, and achieve lasting results.
              </p>
            </div>
          </motion.div>

          {/* Right: Large Gym Image */}
          <motion.div
            variants={imageReveal}
            viewport={{ once: true, margin: "-100px" }}
            initial="hidden"
            whileInView="visible"
            className="relative h-[320px] md:h-[450px] rounded-xl overflow-hidden border border-outline-variant/50 group"
          >
            <Image
              src="/assets/gallery/gallery8.webp"
              alt="Premium FitHub Floor Layout"
              fill
              className="object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-102 transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent"></div>
          </motion.div>
        </div>
      </section>

      {/* 3. MISSION & VISION SECTION */}
      <section className="py-2xl bg-surface-container-lowest">
        <div className="max-w-7xl px-container-margin mx-auto">
          <motion.div
            variants={staggerContainer}
            viewport={{ once: true, margin: "-100px" }}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-lg"
          >
            {missionVision.map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -5, borderColor: "var(--color-primary-container)" }}
                className="bg-surface-container border border-outline-variant rounded-xl p-xl flex flex-col gap-md transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-surface border border-outline-variant flex items-center justify-center group-hover:border-primary-container/40 transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-display text-2xl font-extrabold text-white uppercase tracking-tight">
                  {item.title}
                </h3>
                <p className="font-body-md text-sm md:text-base text-secondary leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. MEET OUR TEAM SECTION */}
      <section className="py-2xl bg-surface border-y border-outline-variant/30">
        <div className="max-w-7xl px-container-margin mx-auto space-y-2xl">
          {/* Header */}
          <div className="text-center space-y-sm max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-on-background uppercase tracking-tight">
              Meet Our Team
            </h2>
            <p className="font-body-md text-sm md:text-base text-secondary">
              Behind every great workout is a team dedicated to helping you succeed.
            </p>
          </div>

          {/* Trainer Grid */}
          <motion.div
            variants={staggerContainer}
            viewport={{ once: true, margin: "-100px" }}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-lg max-w-4xl mx-auto"
          >
            {trainers.map((trainer, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -6, borderColor: "var(--color-primary-container)" }}
                className="bg-surface-container border border-outline-variant rounded-xl p-lg flex flex-col gap-md group transition-all duration-300"
              >
                {/* {trainer.image &&
                  <div className="relative w-full h-[280px] sm:h-[340px] rounded-lg overflow-hidden border border-outline-variant/30 bg-surface">
                    <Image
                      src={trainer.image}
                      alt={trainer.name}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-102 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container/90 via-transparent to-transparent"></div>
                  </div>
                } */}

                <div className="space-y-xs">
                  <span className="font-label-sm text-[11px] text-primary-container uppercase tracking-widest font-bold">
                    {trainer.role}
                  </span>
                  <h3 className="font-display text-2xl font-extrabold text-white">
                    {trainer.name}
                  </h3>
                  <p className="font-body-md text-sm text-secondary leading-relaxed pt-xs">
                    {trainer.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Partners Sub-section */}
          <div className="pt-2xl border-t border-outline-variant/20 space-y-xl">
            <div className="text-center">
              <h3 className="font-display text-2xl font-extrabold text-on-background uppercase tracking-tight">
                Our Partners
              </h3>
            </div>

            <motion.div
              variants={staggerContainer}
              viewport={{ once: true, margin: "-100px" }}
              initial="hidden"
              whileInView="visible"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-md max-w-5xl mx-auto"
            >
              {partners.map((partner, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.03, borderColor: "var(--color-primary-container)" }}
                  className="bg-surface-container-low border border-outline-variant rounded-xl p-md flex items-center justify-center text-center transition-all duration-300"
                >
                  <span className="font-display text-sm md:text-base font-extrabold text-white uppercase tracking-tight">
                    {partner}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. GYM RULES & GUIDELINES SECTION */}
      <section className="py-2xl bg-surface-container-lowest">
        <div className="max-w-7xl px-container-margin mx-auto space-y-2xl">
          {/* Header */}
          <div className="text-center space-y-sm max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-on-background uppercase tracking-tight">
              Gym Rules & Guidelines
            </h2>
            <p className="font-body-md text-sm md:text-base text-secondary">
              Following these simple guidelines helps maintain a clean, safe, and respectful environment for everyone.
            </p>
          </div>

          {/* Rules Grid */}
          <motion.div
            variants={staggerContainer}
            viewport={{ once: true, margin: "-100px" }}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md"
          >
            {rules.map((rule, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ scale: 1.02, borderColor: "var(--color-outline)" }}
                className="bg-surface-container border border-outline-variant/60 rounded-xl p-lg flex flex-col gap-sm hover:bg-surface-container-high transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-surface border border-outline-variant flex items-center justify-center shrink-0">
                  {rule.icon}
                </div>
                <p className="font-body-md text-sm font-semibold text-white leading-snug">
                  {rule.text}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Notice Box */}
          <motion.div
            variants={fadeInUp}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto bg-surface border-l-4 border-primary-container rounded-r-xl p-xl shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-md opacity-5 pointer-events-none">
              <ShieldAlert className="w-24 h-24 text-primary-container" />
            </div>
            <div className="flex gap-md">
              <div className="mt-1">
                <ShieldAlert className="w-6 h-6 text-primary-container shrink-0" />
              </div>
              <div className="space-y-xs">
                <h4 className="font-display text-lg font-bold text-white uppercase tracking-wider">
                  Important Notice
                </h4>
                <p className="font-body-md text-sm text-secondary leading-relaxed">
                  Membership fees are non-refundable. Please read all gym rules before joining.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. WHY CHOOSE THE FITHUB GYM (Reused landing component) */}
      <section className="border-y border-outline-variant/30">
        {whyChooseSection}
      </section>

      {/* 7. FINAL CTA SECTION */}
      <section className="relative py-3xl bg-surface-container-lowest overflow-hidden">
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.06),transparent)] pointer-events-none"></div>

        <div className="max-w-4xl px-container-margin mx-auto text-center space-y-xl relative z-10">
          <div className="space-y-sm">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-background uppercase tracking-tight">
              Ready To Begin Your Fitness Journey?
            </h2>
            <p className="font-body-md text-base text-secondary max-w-2xl mx-auto leading-relaxed">
              Whether your goal is weight loss, muscle building, strength training, or improving your overall fitness, The FitHub Gym is here to support you every step of the way.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-md justify-center items-center w-full sm:w-auto">
            <Link
              href="/memberships"
              prefetch={false}
              className="bg-primary-container text-black font-bold py-3 px-8 rounded-xl hover:bg-primary transition-colors font-label-md text-sm flex items-center gap-sm active:scale-98 transition-transform w-full sm:w-auto justify-center"
            >
              View Membership Plans
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#contact"
              prefetch={false}
              className="bg-transparent border border-outline-variant text-on-surface font-bold py-3 px-8 rounded-xl hover:border-primary-container hover:text-primary transition-colors font-label-md text-sm active:scale-98 transition-transform w-full sm:w-auto justify-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
