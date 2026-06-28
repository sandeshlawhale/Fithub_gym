const excellenceCards = [
  {
    colSpan: "col-span-1 md:col-span-8",
    minHeight: "min-h-[400px]",
    icon: "fitness_center",
    title: "MODERN TRAINING EQUIPMENT",
    description: "Train with a complete range of modern strength machines, benches, cable stations, free weights, and squat racks designed for safe and effective workouts.",
    bgImage: "/assets/gallery/gallery1.jpeg",
    overlayClass: "bg-gradient-to-t from-surface-container via-surface-container/80 to-transparent",
    contentClass: "justify-end",
  },
  {
    colSpan: "col-span-1 md:col-span-4",
    minHeight: "min-h-[250px]",
    icon: "sports",
    title: "EXPERT TRAINER GUIDANCE",
    description: "Former collegiate athletes and certified strength specialists dedicated to optimizing your form and programming.",
    isTextCard: true,
  },
  {
    colSpan: "col-span-1 md:col-span-5",
    minHeight: "min-h-[250px]",
    icon: "key",
    title: "CARDIO & FAT LOSS ZONE",
    description: "Burn calories and improve endurance with treadmills, exercise bikes, and dedicated cardio equipment suitable for every fitness level.",
    bgImage: "/assets/gallery/gallery6.jpeg",
    overlayClass: "bg-gradient-to-r from-surface-container via-surface-container/90 to-transparent",
    contentClass: "justify-end",
  },
  {
    colSpan: "col-span-1 md:col-span-7",
    minHeight: "min-h-[250px]",
    icon: "spa",
    title: "CLEAN & MOTIVATING ENVIRONMENT",
    description: "A spacious, clean, and motivating atmosphere that helps you stay focused and enjoy every workout.",
    bgImage: "/assets/gallery/gallery2.jpeg",
    overlayClass: "bg-gradient-to-r from-surface-container via-surface-container/90 to-transparent",
    contentClass: "justify-center w-full md:w-2/3",
  },
];

export default function StandardOfExcellence() {
  return (
    <section className="py-16 bg-surface-container-lowest" id="training">
      <div className="max-w-7xl px-container-margin mx-auto space-y-lg">
        <div className="text-center space-y-sm max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-on-background uppercase tracking-tight">
            WHY CHOOSE THE FITHUB GYM
          </h2>
          <p className="font-body-md text-sm md:text-base text-secondary">
            Everything you need to achieve your fitness goals in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
          {excellenceCards.map((card, idx) => {
            const hasBg = !!card.bgImage;
            return (
              <div
                key={idx}
                className={`${card.colSpan} ${card.minHeight} bg-surface-container border border-outline-variant rounded-xl group relative ${hasBg ? "overflow-hidden" : "p-xl flex flex-col hover:border-outline transition-colors"
                  }`}
              >
                {hasBg && (
                  <div className="absolute inset-0 z-0">
                    <div
                      className="w-full h-full bg-cover bg-center opacity-100 md:opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ backgroundImage: `url('${card.bgImage}')` }}
                    ></div>
                    <div className={`absolute inset-0 ${card.overlayClass}`}></div>
                  </div>
                )}

                <div
                  className={`relative z-10 p-xl h-full flex flex-col ${card.isTextCard ? "justify-between" : card.contentClass || ""
                    }`}
                >
                  <div
                    className={`w-12 h-12 rounded-lg bg-surface border border-outline-variant flex items-center justify-center text-primary-container ${hasBg ? "mb-md" : "self-start"
                      }`}
                  >
                    <span className="material-symbols-outlined">{card.icon}</span>
                  </div>

                  <div className={hasBg ? "" : "mt-xl"}>
                    <h3
                      className={`font-headline-md text-on-background ${hasBg ? "mb-sm text-headline-md" : "mb-xs text-[20px] font-semibold"
                        }`}
                    >
                      {card.title}
                    </h3>
                    <p
                      className={`font-body-md text-secondary ${hasBg ? "max-w-lg text-body-md" : "text-sm text-body-md"
                        }`}
                    >
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
