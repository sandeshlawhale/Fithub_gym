export default function HeroSection() {
  return (
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
              PRICING & PACKAGES
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase text-on-surface tracking-tight leading-tight text-center">
            MEMBERSHIP <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-primary">PLANS</span>
          </h1>

          <p className="font-body-md text-sm md:text-base text-secondary max-w-2xl text-center leading-relaxed">
            Choose the membership plan that best suits your fitness goals. All plans displayed below are always updated directly from our latest pricing.
          </p>
        </div>
      </div>
    </section>
  );
}
