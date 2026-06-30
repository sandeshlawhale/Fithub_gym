import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import FAQSection from "@/components/common/FAQSection";
import HeroSection from "@/components/membership-plans/HeroSection";
import OverviewSection from "@/components/membership-plans/OverviewSection";
import PlansTables from "@/components/membership-plans/PlansTables";
import CTASection from "@/components/membership-plans/CTASection";

export const metadata = {
  title: "Membership Plans | The FitHub Gym",
  description: "Choose the membership plan that best suits your fitness goals. All plans displayed are always updated directly from our latest pricing. Premium fitness facility in Narkhed.",
};

export default async function MembershipsPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  // Fetch active, non-deleted plans from Prisma sorted by durationMonths ASC
  const allPlans = await prisma.membershipPlan.findMany({
    where: {
      isActive: true,
      isDeleted: false,
    },
    orderBy: {
      durationMonths: "asc",
    },
  });

  // Group plans into Single and Couple
  const singlePlans = allPlans.filter((plan) => plan.memberType === "SINGLE");
  const couplePlans = allPlans.filter((plan) => plan.memberType === "COUPLE");

  return (
    <div className="bg-background text-on-background min-h-screen font-sans antialiased overflow-x-hidden relative selection:bg-primary-container selection:text-on-primary-container flex flex-col justify-between">
      <Header isLoggedIn={isLoggedIn} />

      <main className="pt-20 flex-grow">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Membership Overview */}
        <OverviewSection />

        {/* 3 & 4. Membership Tables & Empty State */}
        <section className="py-16 px-container-margin">
          <div className="max-w-7xl mx-auto">
            <PlansTables singlePlans={singlePlans} couplePlans={couplePlans} />
          </div>
        </section>

        {/* 5. CTA Section */}
        <CTASection />

        {/* 6. FAQ Section */}
        <FAQSection />
      </main>

      <Footer isLoggedIn={isLoggedIn} />
    </div>
  );
}
