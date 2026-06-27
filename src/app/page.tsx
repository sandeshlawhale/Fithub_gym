import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LandingNavbar from "@/components/LandingNavbar";
import { Phone, Mail, MapPin, Compass } from "lucide-react";

export const revalidate = 3600; // Revalidate every hour

export default async function LandingPage() {
  // Fetch active plans to display in the pricing grid
  const allPlans = await prisma.membershipPlan.findMany({
    where: { isActive: true },
  });

  // Filter for exactly Monthly (1 month), Quarterly (3 months), and Annually (12 months)
  // Preferring "Weight + Cardio" or the highest price one if there are multiples
  const getBestPlanForDuration = (duration: number) => {
    const durationPlans = allPlans.filter(p => p.durationMonths === duration);
    if (durationPlans.length === 0) return null;
    return durationPlans.sort((a, b) => Number(b.price) - Number(a.price))[0];
  };

  const monthlyPlan = getBestPlanForDuration(1);
  const quarterlyPlan = getBestPlanForDuration(3);
  const yearlyPlan = getBestPlanForDuration(12);

  const plans = [monthlyPlan, quarterlyPlan, yearlyPlan].filter((plan): plan is NonNullable<typeof plan> => plan !== null);

  // Curated gallery slides map
  const gallerySlides = [
    { src: "/assets/gallery/gallery4.jpeg", title: "Main Training Floor" },
    { src: "/assets/gallery/gallery5.jpeg", title: "Lifting Platforms" },
    { src: "/assets/gallery/gallery6.jpeg", title: "Functional Turf" },
    { src: "/assets/gallery/gallery7.jpeg", title: "Strength Zone" },
    { src: "/assets/gallery/gallery9.jpeg", title: "Cardio Arena" },
    { src: "/assets/gallery/gallery10.jpeg", title: "Group Class Studio" },
    { src: "/assets/gallery/gallery11.jpeg", title: "Combat Zone" },
    { src: "/assets/gallery/gallery12.jpeg", title: "Recovery Suite" },
  ];

  return (
    <div className="bg-background text-on-background min-h-screen font-sans antialiased overflow-x-hidden relative selection:bg-primary-container selection:text-on-primary-container">
      {/* Interactive Top Navbar */}
      <LandingNavbar />

      {/* Main Content Canvas */}
      <main className="pt-24 md:pt-20">
        {/* 1. Hero Section (Design from Screen 1 - Styled 16:9 aspect ratio, vertical paddings removed) */}
        <section className="relative w-full min-h-[400] md:aspect-16/6 items-center flex justify-center overflow-hidden px-6 py-0">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat opacity-45"
              style={{ backgroundImage: "url('/assets/gallery/hero.png')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent"></div>
          </div>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center gap-md">
            <div className="inline-flex items-center gap-xs px-3 py-1 rounded-full border border-outline-variant bg-surface-container-low/60 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
              <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">
                Premium Unisex Fitness Center
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase text-on-surface tracking-tight leading-tight text-center">
              Unleash Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-primary">Elite</span> Potential
            </h1>

            <p className="font-body-md text-sm md:text-base text-secondary max-w-xl text-center">
              Premium Unisex Fitness Center designed for high-performance training and unparalleled luxury. Forged in discipline, engineered for results.
            </p>

            <div className="flex flex-row gap-sm mt-md">
              <a
                href="#memberships"
                className="bg-primary-container text-[#0F0F0F] font-bold py-3 px-6 rounded-xl hover:bg-primary transition-colors font-label-md text-sm scale-95 active:scale-90 transition-transform duration-200"
              >
                Join Now
              </a>
              <a
                href="#training"
                className="bg-transparent border border-outline-variant text-on-surface font-bold py-3 px-6 rounded-xl hover:border-primary-container hover:text-primary transition-colors font-label-md text-sm scale-95 active:scale-90 transition-transform duration-200"
              >
                Explore Facility
              </a>
            </div>
          </div>
        </section>

        {/* 2. The Standard of Excellence (Bento Grid from Screen 2 - Consistent Padding) */}
        <section className="py-16 px-container-margin bg-surface-container-lowest" id="training">
          <div className="max-w-7xl mx-auto space-y-2xl">
            <div className="text-center space-y-sm max-w-3xl mx-auto">
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-on-background uppercase tracking-tight">
                The Standard of Excellence
              </h2>
              <p className="font-body-md text-body-md text-secondary">
                We don't do basic. Every square foot is optimized for peak performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
              {/* Premium Equipment (Large) */}
              <div className="col-span-1 md:col-span-8 bg-surface-container border border-outline-variant rounded-xl overflow-hidden group relative min-h-[400px]">
                <div className="absolute inset-0 z-0">
                  <div
                    className="w-full h-full bg-cover bg-center opacity-100 md:opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ backgroundImage: "url('/assets/gallery/gallery1.jpeg')" }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/80 to-transparent"></div>
                </div>
                <div className="relative z-10 p-xl h-full flex flex-col justify-end">
                  <div className="w-12 h-12 rounded-lg bg-surface border border-outline-variant flex items-center justify-center mb-md text-primary-container">
                    <span className="material-symbols-outlined">fitness_center</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-background mb-sm">Premium Equipment</h3>
                  <p className="font-body-md text-body-md text-secondary max-w-lg">
                    Competition-grade Eleiko bars, custom plate-loaded machines, and advanced biomechanical rigs. No compromises.
                  </p>
                </div>
              </div>

              {/* Expert Coaches (Small) */}
              <div className="col-span-1 md:col-span-4 bg-surface-container border border-outline-variant rounded-xl p-xl flex flex-col justify-between hover:border-outline transition-colors group min-h-[250px]">
                <div className="w-12 h-12 rounded-lg bg-surface border border-outline-variant flex items-center justify-center text-primary-container self-start">
                  <span className="material-symbols-outlined">sports</span>
                </div>
                <div className="mt-xl">
                  <h3 className="font-headline-md text-[20px] font-semibold text-on-background mb-xs">Expert Coaches</h3>
                  <p className="font-body-md text-body-md text-secondary text-sm">
                    Former collegiate athletes and certified strength specialists dedicated to optimizing your form and programming.
                  </p>
                </div>
              </div>

              {/* 24/7 Access (Small) */}
              <div className="col-span-1 md:col-span-5 bg-surface-container border border-outline-variant rounded-xl p-xl flex flex-col justify-between hover:border-outline transition-colors group min-h-[250px]">
                <div className="w-12 h-12 rounded-lg bg-surface border border-outline-variant flex items-center justify-center text-primary-container self-start">
                  <span className="material-symbols-outlined">key</span>
                </div>
                <div className="mt-xl">
                  <h3 className="font-headline-md text-[20px] font-semibold text-on-background mb-xs">24/7 Elite Access</h3>
                  <p className="font-body-md text-body-md text-secondary text-sm">
                    Secure, biometric entry systems. Train on your schedule, day or night, without restriction.
                  </p>
                </div>
              </div>

              {/* Luxury Amenities (Medium) */}
              <div className="col-span-1 md:col-span-7 bg-surface-container border border-outline-variant rounded-xl overflow-hidden group relative min-h-[250px]">
                <div className="absolute inset-0 z-0">
                  <div
                    className="w-full h-full bg-cover bg-center opacity-100 md:opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ backgroundImage: "url('/assets/gallery/gallery2.jpeg')" }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-surface-container via-surface-container/90 to-transparent"></div>
                </div>
                <div className="relative z-10 p-xl h-full flex flex-col justify-center w-2/3">
                  <div className="w-12 h-12 rounded-lg bg-surface border border-outline-variant flex items-center justify-center mb-md text-primary-container self-start">
                    <span className="material-symbols-outlined">spa</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-background mb-sm">Recovery &amp; Amenities</h3>
                  <p className="font-body-md text-body-md text-secondary">
                    Infrared saunas, cold plunge therapy, and executive locker rooms stocked with premium grooming products.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. The Elite Performance Framework (from Screen 2 - Consistent Padding) */}
        <section className="py-16 px-container-margin bg-surface">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-2xl items-center">
            <div className="flex-1 space-y-xl">
              <div>
                <h2 className="font-display text-4xl md:text-5xl font-extrabold text-on-background mb-md uppercase tracking-tight">
                  The Elite Performance Framework
                </h2>
                <p className="font-body-lg text-body-lg text-secondary">
                  Our methodology is rooted in sports science and adapted for the everyday athlete. We focus on four core pillars to build resilient, powerful bodies.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
                {/* Pillar 1 */}
                <div className="flex gap-md">
                  <div className="mt-1">
                    <span className="material-symbols-outlined text-primary-container text-[28px]">directions_run</span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-background mb-xs uppercase tracking-wider">Biomechanics</h4>
                    <p className="font-body-md text-sm text-secondary">Mastering movement patterns before adding load to prevent injury.</p>
                  </div>
                </div>
                {/* Pillar 2 */}
                <div className="flex gap-md">
                  <div className="mt-1">
                    <span className="material-symbols-outlined text-primary-container text-[28px]">bolt</span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-background mb-xs uppercase tracking-wider">Power Output</h4>
                    <p className="font-body-md text-sm text-secondary">Developing explosive strength through Olympic lifts and plyometrics.</p>
                  </div>
                </div>
                {/* Pillar 3 */}
                <div className="flex gap-md">
                  <div className="mt-1">
                    <span className="material-symbols-outlined text-primary-container text-[28px]">monitor_heart</span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-background mb-xs uppercase tracking-wider">Conditioning</h4>
                    <p className="font-body-md text-sm text-secondary">Targeted energy system development for sustained endurance.</p>
                  </div>
                </div>
                {/* Pillar 4 */}
                <div className="flex gap-md">
                  <div className="mt-1">
                    <span className="material-symbols-outlined text-primary-container text-[28px]">self_improvement</span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-background mb-xs uppercase tracking-wider">Recovery</h4>
                    <p className="font-body-md text-sm text-secondary">Active regeneration protocols to optimize adaptation and growth.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Spinning decorative frame surrounding gallery3.jpeg */}
            <div className="flex-1 w-full relative">
              <div className="aspect-square max-w-md mx-auto rounded-full border border-outline-variant flex items-center justify-center relative overflow-hidden p-lg">
                <div className="absolute inset-0 border border-primary-container/20 rounded-full animate-[spin_60s_linear_infinite]"></div>
                <div className="absolute inset-xl border border-outline-variant rounded-full border-dashed animate-[spin_40s_linear_infinite_reverse]"></div>
                <div
                  className="w-full h-full rounded-full bg-cover bg-center grayscale contrast-125 mix-blend-luminosity opacity-80"
                  style={{ backgroundImage: "url('/assets/gallery/gallery3.jpeg')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-surface/80 to-transparent rounded-full mix-blend-overlay"></div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. The Proving Grounds (Image Gallery from Screen 2 - Consistent Padding) */}
        <section className="py-16 bg-surface-container-lowest" id="gallery">
          <div className="max-w-7xl mx-auto px-container-margin space-y-xl">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-on-background uppercase tracking-tight">
                The Proving Grounds
              </h2>
              <p className="font-body-md text-body-md text-secondary mt-xs">
                A facility designed to inspire. Explore our specialized workout zones.
              </p>
            </div>

            {/* Horizontal Scroll Container inside the padding hierarchy */}
            <div
              className="flex overflow-x-auto gap-lg pb-lg snap-x snap-mandatory scrollbar-themed"
              style={{ scrollbarWidth: 'thin' }}
            >
              {gallerySlides.map((slide, index) => (
                <div
                  key={index}
                  className="min-w-[280px] sm:min-w-[450px] md:min-w-[600px] h-[300px] sm:h-[400px] snap-center rounded-xl overflow-hidden relative group shrink-0 border border-outline-variant"
                >
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={slide.src}
                    alt={slide.title}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent"></div>
                  <div className="absolute bottom-lg left-lg">
                    <h3 className="font-headline-md text-headline-md text-on-background font-bold uppercase tracking-tight">
                      {slide.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Access Tiers (Pricing Grid - Consistent Padding) */}
        <section className="py-16 px-container-margin bg-linear-to-b from-surface to-transparent" id="memberships">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-2xl">
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-on-background uppercase tracking-tight">
                Access Tiers
              </h2>
              <p className="font-body-md text-body-md text-secondary">
                Select the level of performance that matches your ambition.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg items-stretch">
              {plans.map((plan) => {
                const isQuarterly = plan.durationMonths === 3;
                return (
                  <div
                    key={plan.id}
                    className={`rounded-xl p-xl flex flex-col relative transition-all duration-300 ${isQuarterly
                      ? "bg-surface-container-high border-2 border-primary-container shadow-2xl shadow-primary-container/20 lg:scale-105"
                      : "bg-surface-container border border-outline-variant hover:border-outline"
                      }`}
                  >
                    {isQuarterly && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-container text-[#0F0F0F] font-label-sm uppercase px-md py-xs rounded-full whitespace-nowrap font-extrabold">
                        Fan Favourite
                      </div>
                    )}

                    <div className="mb-lg">
                      <span className="text-xs text-primary-container font-semibold uppercase tracking-widest">
                        {plan.memberType} PACKAGE
                      </span>
                      <h3 className="font-headline-md text-headline-md text-on-background mt-xs font-bold uppercase">
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline gap-xs mt-sm">
                        <span className="font-display text-[40px] text-on-background font-extrabold leading-none">
                          ₹{Number(plan.price).toLocaleString("en-IN")}
                        </span>
                        <span className="font-label-sm text-secondary uppercase">
                          /{plan.durationMonths} {plan.durationMonths === 1 ? "mo" : "mos"}
                        </span>
                      </div>
                      <p className="text-secondary text-sm mt-sm min-h-[40px]">
                        {plan.description || "Unrestricted access to the facilities and services included in this package."}
                      </p>
                    </div>

                    <ul className="space-y-md mb-xl flex-grow text-sm font-body-md text-secondary border-t border-outline-variant/30 pt-lg">
                      <li className="flex items-center gap-sm text-on-surface">
                        <span className={`material-symbols-outlined text-sm ${isQuarterly ? 'text-primary-container' : 'text-outline'}`}>check</span>
                        <span>Full Gym Floor Access</span>
                      </li>
                      <li className="flex items-center gap-sm text-on-surface">
                        <span className={`material-symbols-outlined text-sm ${isQuarterly ? 'text-primary-container' : 'text-outline'}`}>check</span>
                        <span>Elite Machine & Strength Zones</span>
                      </li>
                      <li className="flex items-center gap-sm text-on-surface">
                        <span className={`material-symbols-outlined text-sm ${isQuarterly ? 'text-primary-container' : 'text-outline'}`}>check</span>
                        <span>Locker & Recovery Rooms</span>
                      </li>
                      {plan.memberType === "COUPLE" && (
                        <li className="flex items-center gap-sm text-primary font-semibold">
                          <span className="material-symbols-outlined text-primary-container text-sm">check</span>
                          <span>Includes 2 Linked Members</span>
                        </li>
                      )}
                    </ul>

                    <a
                      href="#contact"
                      className={`w-full py-md rounded-xl font-bold font-label-md text-center transition-all ${isQuarterly
                        ? "bg-primary-container text-[#0F0F0F] hover:opacity-90"
                        : "border border-outline-variant text-on-background hover:bg-surface-bright"
                        }`}
                    >
                      Select {plan.name.split(" ")[0]}
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Custom program info and contact CTA */}
            <div className="mt-2xl text-center space-y-md">
              <p className="text-secondary text-sm max-w-xl mx-auto">
                Looking for customized cardio programs, personal trainers, or couple discounts? Get in touch with us!
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-xs bg-transparent border border-outline-variant hover:border-primary-container hover:text-primary-container text-on-background font-bold py-2.5 px-6 rounded-xl text-sm transition-all duration-300 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">mail</span>
                Inquire Custom Programs & Discounts
              </a>
            </div>
          </div>
        </section>

        {/* 6. Connect with Us (CTA Section - Standardized Margin/Padding) */}
        <section className="pt-16" id="contact">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2xl">

              <div className="flex flex-col gap-xl">
                {/* Contact Details */}
                <div className="flex flex-col gap-lg">
                  <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight">Facility Details</h3>
                  <div className="flex flex-col gap-md">
                    <div className="flex items-start gap-md">
                      <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary-container shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">Street Address</h4>
                        <p className="text-secondary text-sm mt-xs">Plot no 6456, Ward no 17, opp Govt ITI, Kalambha Road, Narkhed - 441304</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-md">
                      <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary-container shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">Contact Number</h4>
                        <p className="text-secondary text-sm mt-xs">+91 8788849529</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-md">
                      <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary-container shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">Email Address</h4>
                        <p className="text-secondary text-sm mt-xs">millennialcorpllp@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="md:pr-2xl overflow-hidden">
                  <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight mb-xs">Operating Hours</h3>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#323232]">
                        <th className="py-sm font-label-sm text-label-sm text-secondary uppercase font-semibold">Session</th>
                        <th className="py-sm font-label-sm text-label-sm text-secondary uppercase font-semibold text-right">Hours</th>
                      </tr>
                    </thead>
                    <tbody className="font-body-md text-body-md">
                      <tr className="border-b border-[#323232]">
                        <td className="py-md text-on-surface font-semibold">Morning</td>
                        <td className="py-md text-secondary text-right">6:00 AM - 11:00 AM</td>
                      </tr>
                      <tr className="border-b border-[#323232]">
                        <td className="py-md text-on-surface/80 pl-4 text-sm italic">└ Ladies Special</td>
                        <td className="py-md text-secondary/80 text-right text-sm italic">6:00 AM - 7:00 AM</td>
                      </tr>
                      <tr className="border-b border-[#323232]">
                        <td className="py-md text-on-surface font-semibold">Evening</td>
                        <td className="py-md text-secondary text-right">4:00 PM - 9:00 PM</td>
                      </tr>
                      <tr>
                        <td className="py-md text-on-surface/80 pl-4 text-sm italic">└ Ladies Special</td>
                        <td className="py-md text-secondary/80 text-right text-sm italic">4:00 PM - 5:00 PM</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-col gap-lg bg-surface rounded-2xl ">
                <div>
                  <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight">
                    Connect with us
                  </h2>
                  <p className="text-secondary text-sm mt-sm">
                    Have questions about memberships or want to schedule a visit? Send us a message and our team will connect with you.
                  </p>
                </div>
                <form className="flex flex-col gap-4">
                  <div className="flex flex-col gap-0">
                    <label className="input-label" htmlFor="fullName">Full Name</label>
                    <input className="input-field" id="fullName" placeholder="John Doe" type="text" required />
                  </div>
                  <div className="flex flex-col gap-0">
                    <label className="input-label" htmlFor="emailAddress">Email Address</label>
                    <input className="input-field" id="emailAddress" placeholder="john@example.com" type="email" required />
                  </div>
                  <div className="flex flex-col gap-0">
                    <label className="input-label" htmlFor="phoneNumber">Phone Number</label>
                    <input className="input-field" id="phoneNumber" placeholder="+91 98765 43210" type="tel" required />
                  </div>
                  <div className="flex flex-col gap-0">
                    <label className="input-label" htmlFor="message">Message</label>
                    <textarea
                      className="bg-[#181818] border border-[#323232] rounded-xl p-4 text-white placeholder:text-secondary focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors font-body-md text-body-md resize-none h-32"
                      id="message"
                      placeholder="Tell us about your goals..."
                      required
                    />
                  </div>
                  <button
                    className="w-full bg-primary-container text-[#0F0F0F] font-bold rounded-xl py-4 hover:bg-primary transition-all active:scale-[0.98] cursor-pointer text-sm font-label-md"
                    type="submit"
                  >
                    Send Request
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Map layout directly below contact panels - pointing to Narkher address iframe, grayscale, bounce pin removed */}
          <div className="w-full h-96 border-t border-[#323232] relative mt-16 overflow-hidden">
            <iframe
              src="https://maps.google.com/maps?q=Plot%20no%206456,%20Ward%20no%2017,%20opp%20Govt%20ITI,%20Kalambha%20Road,%20Narkhed%20-%20441304&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 grayscale opacity-80 contrast-125"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute bottom-lg left-1/2 -translate-x-1/2 bg-[#181818] border border-[#323232] px-lg py-md rounded-xl shadow-lg backdrop-blur-md flex items-center gap-md z-10">
              <Compass className="w-5 h-5 text-primary-container animate-spin" style={{ animationDuration: '6s' }} />
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUqCAgAEEUYJxg7MggIABBFGCcYOzIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIHCAgQABiABDIHCAkQABiABNIBCTEwNTM0ajBqN6gCALACAA&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KY-RnQyGrdU7MaHJY1UE-nxj&daddr=Plot+no+6456,+Ward+no+17,+opp+Govt+ITI,+Kalambha+Road,+Narkhed+-+441304"
                className="font-label-md text-xs md:text-sm font-bold text-white hover:text-primary transition-colors"
              >
                Find Us on Google Maps
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer (Re-structured columns and Copyright details) */}
      <footer className="bg-surface-container dark:bg-surface-container w-full border-t border-outline-variant py-16 px-container-margin">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 md:items-center">
          <div className="col-span-1 md:col-span-2 flex flex-col gap-md md:pr-xl">
            <div className="flex flex-col sm:flex-row sm:items-center gap-md">
              <div className="flex items-center gap-md">
                <img
                  src="/assets/gallery/logo.jpeg"
                  alt="The FitHub Gym Logo"
                  className="h-10 w-auto object-contain rounded border border-outline-variant/20"
                />
                <div className="h-6 w-px bg-outline-variant/40 hidden sm:block" />
              </div>
              <div className="flex gap-md">
                <a
                  href="https://www.instagram.com/thefithubgym.narkhed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs text-xs"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 shrink-0"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="mailto:millennialcorpllp@gmail.com"
                  className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs text-xs"
                >
                  <Mail className="w-6 h-6 shrink-0" />
                </a>
              </div>
            </div>

            <p className="text-on-surface-variant">Premium Unisex Fitness Center designed for high-performance training and unparalleled luxury. Forged in discipline, engineered for results.</p>
          </div>

          <div className="col-span-1 md:col-span-3 flex justify-between items-center w-full h-fit flex-wrap sm:flex-nowrap gap-sm">
            <Link className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Home</Link>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#training">Training</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#memberships">Memberships</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#coaches">Coaches</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#contact">Contact</a>
            <div className="h-6 w-px bg-outline-variant/40 hidden sm:block" />
            <Link className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold text-primary" href="/auth/login">Login</Link>
          </div>
        </div>

        {/* Below footer: copyright (left) and legal links (right) */}
        <div className="max-w-7xl mx-auto border-t border-outline-variant/20 mt-xl pt-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-md text-xs text-on-surface-variant">
          <div className="flex flex-col gap-xs">

            <div className="text-on-surface-variant/70">
              © {new Date().getFullYear()} The FitHub Gym by Millenial Corp LLP. All rights reserved.
            </div>
          </div>
          <div className="flex gap-lg justify-end">
            <Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link>
            <Link className="hover:text-primary transition-colors" href="#">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
