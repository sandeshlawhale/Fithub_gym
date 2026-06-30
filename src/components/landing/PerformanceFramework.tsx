const pillars = [
  {
    icon: "directions_run",
    title: "Weight Loss",
    description: "Burn calories, improve endurance, and lose fat through a combination of cardio and structured strength training.",
  },
  {
    icon: "bolt",
    title: "Muscle Building",
    description: "Build lean muscle with progressive strength training, quality equipment, and consistent workout routines.",
  },
  {
    icon: "monitor_heart",
    title: "Strength Training",
    description: "Increase overall strength and confidence using free weights, machines, and functional exercises.",
  },
  {
    icon: "self_improvement",
    title: "General Fitness",
    description: "Improve your energy, mobility, stamina, and overall health with balanced fitness programs.",
  },
];

export default function PerformanceFramework() {
  return (
    <section className="py-16 bg-surface">
      <div className="max-w-7xl px-container-margin mx-auto flex flex-col lg:flex-row gap-2xl items-center">
        <div className="flex-1 space-y-xl md:pl-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-on-background uppercase tracking-tight">
              YOUR FITNESS. YOUR GOAL.
            </h2>
            <p className="font-body-lg text-body-lg text-secondary">
              No matter where you're starting, we provide the right training environment and guidance to help you reach your fitness goals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="flex gap-md">
                <div className="mt-1">
                  <span className="material-symbols-outlined text-primary-container text-[28px]">
                    {pillar.icon}
                  </span>
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-on-background mb-xs uppercase tracking-wider">
                    {pillar.title}
                  </h4>
                  <p className="font-body-md text-sm text-secondary">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spinning decorative frame surrounding gallery3.webp */}
        <div className="flex-1 w-full relative">
          <div className="aspect-square w-full max-w-md mx-auto rounded-full border border-outline-variant flex items-center justify-center relative overflow-hidden p-lg">
            <div className="absolute inset-0 border border-primary-container/20 rounded-full animate-[spin_60s_linear_infinite]"></div>
            <div className="absolute inset-xl border border-outline-variant rounded-full border-dashed animate-[spin_40s_linear_infinite_reverse]"></div>
            <div
              className="w-full h-full rounded-full bg-cover bg-center grayscale contrast-125 mix-blend-luminosity opacity-80"
              style={{ backgroundImage: "url('/assets/gallery/gallery3.webp')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-surface/80 to-transparent rounded-full mix-blend-overlay"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
