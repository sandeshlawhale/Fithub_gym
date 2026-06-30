import { MembershipPlan } from "@prisma/client";

interface PlansTablesProps {
  singlePlans: MembershipPlan[];
  couplePlans: MembershipPlan[];
}

export default function PlansTables({ singlePlans, couplePlans }: PlansTablesProps) {
  const hasPlans = singlePlans.length > 0 || couplePlans.length > 0;

  if (!hasPlans) {
    return (
      <div className="text-center py-16 px-container-margin bg-surface-container-lowest/50 border border-outline-variant rounded-2xl max-w-3xl mx-auto my-12">
        <p className="font-body-md text-base md:text-lg text-secondary leading-relaxed">
          No membership plans are available at the moment. Please contact us for the latest pricing.
        </p>
      </div>
    );
  }

  const renderTable = (plans: MembershipPlan[], title: string) => {
    return (
      <div className="flex flex-col gap-sm">
        <h3 className="font-display text-xl md:text-2xl font-bold text-white uppercase tracking-wider pl-1">
          {title}
        </h3>
        <div className="bg-surface border border-outline-variant rounded-xl flex flex-col shadow-lg overflow-hidden w-full max-w-full">
          <div className="overflow-x-auto w-full max-w-full scrollbar-themed">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-surface-container border-b border-outline-variant sticky top-0 z-10">
                <tr>
                  <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold w-1/4">
                    Plan Name
                  </th>
                  <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold w-1/6">
                    Duration
                  </th>
                  <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold w-5/12">
                    Description
                  </th>
                  <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold text-right w-1/6">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 font-body-md text-sm">
                {plans.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-xl text-center text-on-surface-variant bg-surface/50">
                      No plans available in this category.
                    </td>
                  </tr>
                ) : (
                  plans.map((plan, idx) => (
                    <tr
                      key={plan.id}
                      className={`hover:bg-surface-container-high/40 transition-colors duration-200 ${
                        idx % 2 === 0 ? "bg-surface" : "bg-surface-container-low/20"
                      }`}
                    >
                      <td className="py-md px-lg font-semibold text-white">
                        {plan.name}
                      </td>
                      <td className="py-md px-lg text-white">
                        {plan.durationMonths} {plan.durationMonths === 1 ? "Month" : "Months"}
                      </td>
                      <td className="py-md px-lg text-secondary text-sm leading-relaxed max-w-xs md:max-w-md truncate md:whitespace-normal">
                        {plan.description || "No description provided."}
                      </td>
                      <td className="py-md px-lg text-right text-primary font-bold text-base whitespace-nowrap">
                        ₹{Number(plan.price).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2xl w-full">
      {singlePlans.length > 0 && renderTable(singlePlans, "Single Memberships")}
      {couplePlans.length > 0 && renderTable(couplePlans, "Couple Memberships")}
    </div>
  );
}
