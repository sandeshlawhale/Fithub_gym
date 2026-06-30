"use client";

import { useEffect, useRef } from "react";
import { useInView, animate } from "framer-motion";
import { Users, Dumbbell, Receipt, Sparkles } from "lucide-react";

interface CounterProps {
  value: number;
  suffix?: string;
}

function Counter({ value, suffix = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView && ref.current) {
      const controls = animate(0, value, {
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1], // Custom ultra-smooth easeOutExpo curve
        onUpdate: (latest) => {
          if (ref.current) {
            ref.current.textContent = Math.round(latest).toString();
          }
        },
      });
      return () => controls.stop();
    }
  }, [value, inView]);

  return (
    <span className="font-display font-extrabold text-3xl sm:text-4xl text-primary-container tracking-tight">
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}

interface StatsSectionProps {
  memberCount: number;
}

export default function StatsSection({ memberCount }: StatsSectionProps) {
  const activeMembersTarget = Math.max(memberCount, 150);

  const stats = [
    {
      icon: <Users className="w-5 h-5 text-primary-container" />,
      value: activeMembersTarget,
      suffix: "+",
      label: "Active Members",
      description: "Consistent fitness enthusiasts",
    },
    {
      icon: <Dumbbell className="w-5 h-5 text-primary-container" />,
      value: 25,
      suffix: "+",
      label: "Modern Machines",
      description: "Premium training equipment",
    },
    {
      icon: <Receipt className="w-5 h-5 text-primary-container" />,
      value: 10,
      suffix: "+",
      label: "Membership Plans",
      description: "Flexible options for everyone",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-primary-container" />,
      value: 2,
      suffix: "",
      label: "Ladies Only Batches",
      description: "Dedicated safe training sessions",
    },
  ];

  return (
    <section className="border-y border-outline-variant bg-surface-container-low/30 backdrop-blur-xs py-8 relative z-10">
      <div className="max-w-7xl mx-auto px-container-margin">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-2 rounded-xl transition-all duration-300 hover:bg-surface-container/10"
            >
              <div className="w-10 h-10 rounded-lg bg-surface border border-outline-variant flex items-center justify-center mb-3">
                {stat.icon}
              </div>
              <Counter value={stat.value} suffix={stat.suffix} />
              <h3 className="font-display text-xs sm:text-sm font-bold text-white uppercase tracking-wider mt-2">
                {stat.label}
              </h3>
              <p className="font-body-md text-[11px] sm:text-xs text-secondary mt-1 max-w-[180px]">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
