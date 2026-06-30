import { prisma } from "@/lib/prisma";

export default async function HeroSection() {
  const memberCount = await prisma.member.count({
    where: { isDeleted: false },
  });
  const displayCount = Math.floor(memberCount / 10) * 10;
  return (
    <section className="relative w-full min-h-[450px] md:aspect-16/6 items-center flex justify-center overflow-hidden px-container-margin py-0 ">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-45"
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
              {memberCount < 100
                ? "Premium Unisex Fitness Center"
                : `trusted by ${displayCount}+ consistent members`}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase text-on-surface tracking-tight leading-tight text-center">
            YOUR STRONGEST <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-primary">SELF</span> BUILDS HERE.
          </h1>

          <p className="font-body-md text-sm md:text-base text-secondary max-w-xl text-center">
            Whether you're starting your fitness journey or pushing your limits, The FitHub Gym provides everything you need to achieve your goals.
          </p>

          <div className="flex flex-col md:flex-row gap-sm mt-md w-full md:w-auto">
            <a
              href="#contact"
              className="bg-primary-container text-[#0F0F0F] font-bold py-3 px-6 rounded-xl hover:bg-primary transition-colors font-label-md text-sm scale-95 active:scale-90 transition-transform duration-200 w-full md:w-auto"
            >
              Join FitHub Today
            </a>
            <a
              href="#training"
              className="bg-transparent border border-outline-variant text-on-surface font-bold py-3 px-6 rounded-xl hover:border-primary-container hover:text-primary transition-colors font-label-md text-sm scale-95 active:scale-90 transition-transform duration-200 w-full md:w-auto"
            >
              Explore Facility
            </a>
          </div>

          <div className="text-center px-2 max-w-4xl mx-auto flex flex-col items-center gap-sm">
            <p className="font-body-md text-xs md:text-sm text-secondary max-w-xl text-center mt-4">Weight Training
              •
              Cardio
              •
              Ladies Batch
              •
              Couple Plans</p>
          </div>
        </div>
      </div>
    </section>
  );
}
