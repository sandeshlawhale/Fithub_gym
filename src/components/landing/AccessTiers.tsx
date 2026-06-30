import { MembershipPlan } from "@prisma/client";

interface AccessTiersProps {
  plans: MembershipPlan[];
}

export default function AccessTiers({ plans }: AccessTiersProps) {
  return (
    <section className="py-16 bg-linear-to-b from-surface-container to-surface-container-lowest" id="memberships">
      <div className="max-w-7xl px-container-margin mx-auto">
        <div className="text-center mb-2xl">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-on-background uppercase tracking-tight">
            MEMBERSHIP PLANS
          </h2>
          <p className="font-body-md text-body-md text-secondary">
            Flexible plans designed to fit your fitness journey and budget.
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
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-container text-[#0F0F0F] font-label-sm capitalize px-md py-xs rounded-full whitespace-nowrap font-bold">
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
          <p>
            🏋️ Modern Equipment • 💪 Trainer Guidance • ❤️ Cardio Access • 👫 Couple Memberships • 📅 Flexible Plans
          </p>
          <p className="text-secondary text-sm max-w-xl mx-auto">
            Looking for customized cardio programs, personal trainers, or couple discounts? Get in touch with us!
          </p>
          <a
            href="#contact-form"
            className="inline-flex items-center gap-xs bg-transparent border border-outline-variant hover:border-primary-container hover:text-primary-container text-on-background font-bold py-2.5 px-6 rounded-xl text-sm transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">mail</span>
            Inquire Custom Programs & Discounts
          </a>
        </div>
      </div>
    </section>
  );
}
