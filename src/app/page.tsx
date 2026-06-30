import { prisma } from "@/lib/prisma";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import StandardOfExcellence from "@/components/landing/StandardOfExcellence";
import PerformanceFramework from "@/components/landing/PerformanceFramework";
import ProvingGrounds from "@/components/landing/ProvingGrounds";
import AccessTiers from "@/components/landing/AccessTiers";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import ConnectWithUs from "@/components/landing/ConnectWithUs";
import Footer from "@/components/landing/Footer";
import { auth } from "@/auth";


export default async function LandingPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  // Fetch active plans to display in the pricing grid
  const allPlans = await prisma.membershipPlan.findMany({
    where: { isActive: true },
  });

  // Fetch approved testimonials
  const testimonials = await prisma.testimonial.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: "desc" },
  });

  // Filter for exactly Monthly (1 month), Quarterly (3 months), and Annually (12 months)
  // Preferring "Weight + Cardio" or the highest price one if there are multiples
  const getBestPlanForDuration = (duration: number) => {
    const durationPlans = allPlans.filter(p => p.durationMonths === duration);
    if (durationPlans.length === 0) return null;
    return durationPlans.sort((a, b) => Number(a.price) - Number(b.price))[0];
  };

  const monthlyPlan = getBestPlanForDuration(1);
  const quarterlyPlan = getBestPlanForDuration(3);
  const yearlyPlan = getBestPlanForDuration(12);

  const plans = [monthlyPlan, quarterlyPlan, yearlyPlan].filter((plan): plan is NonNullable<typeof plan> => plan !== null);

  return (
    <div className="bg-background text-on-background min-h-screen font-sans antialiased overflow-x-hidden relative selection:bg-primary-container selection:text-on-primary-container">
      <Header isLoggedIn={isLoggedIn} />

      <main className="pt-20">
        <HeroSection />

        <StandardOfExcellence />

        <PerformanceFramework />

        <ProvingGrounds />

        <AccessTiers plans={plans} />

        <TestimonialsSection testimonials={testimonials} />

        <ConnectWithUs />
      </main>

      <Footer isLoggedIn={isLoggedIn} />
    </div>
  );
}

