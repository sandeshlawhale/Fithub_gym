const gallerySlides = [
  { src: "/assets/gallery/hero.webp" },
  { src: "/assets/gallery/gallery1.webp" },
  { src: "/assets/gallery/gallery2.webp" },
  { src: "/assets/gallery/gallery3.webp" },
  { src: "/assets/gallery/gallery4.webp" },
  { src: "/assets/gallery/gallery5.webp" },
  { src: "/assets/gallery/gallery6.webp" },
  { src: "/assets/gallery/gallery7.webp" },
  { src: "/assets/gallery/gallery9.webp" },
  { src: "/assets/gallery/gallery10.webp" },
  { src: "/assets/gallery/gallery11.webp" },
  { src: "/assets/gallery/gallery12.webp" },
];

export default function ProvingGrounds() {
  return (
    <section className="py-16 bg-surface-container-lowest" id="gallery">
      <div className="max-w-7xl mx-auto px-container-margin space-y-xl">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-on-background uppercase tracking-tight">
            EXPLORE OUR GYM
          </h2>
          <p className="font-body-md text-body-md text-secondary mt-xs">
            Take a look inside The FitHub Gym and discover the spaces where your fitness journey begins.
          </p>
        </div>

        {/* Horizontal Scroll Container inside the padding hierarchy */}
        <div
          className="flex w-full max-w-full overflow-x-auto gap-lg pb-lg snap-x snap-mandatory scrollbar-themed"
          style={{ scrollbarWidth: "thin" }}
        >
          {gallerySlides.map((slide, index) => (
            <div
              key={index}
              className="min-w-[280px] sm:min-w-[450px] md:min-w-[600px] h-[300px] sm:h-[400px] snap-center rounded-xl overflow-hidden relative group shrink-0 border border-outline-variant"
            >
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={slide.src}
                alt={`The FitHub Gym training zone - image ${index + 1}`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent"></div>
              {/* <div className="absolute bottom-lg left-lg">
                <h3 className="font-headline-md text-headline-md text-on-background font-bold uppercase tracking-tight">
                  {slide.title}
                </h3>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
