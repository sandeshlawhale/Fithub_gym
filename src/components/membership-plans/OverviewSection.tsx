import { Check } from "lucide-react";

export default function OverviewSection() {
  const features = [
    "No Hidden Charges",
    "Flexible Membership Options",
    "Single & Couple Plans",
    "Personal Training Available",
  ];

  return (
    <section className="py-8 bg-background border-y border-outline-variant/30">
      <div className="max-w-7xl px-container-margin mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-md p-md bg-surface-container-low/40 backdrop-blur-sm border border-outline-variant rounded-xl hover:border-primary-container/40 hover:bg-surface-container/50 transition-all duration-300 group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary-container/10 border border-primary-container/30 flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-black transition-colors shrink-0">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="font-display text-sm font-semibold tracking-wide text-white uppercase">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
