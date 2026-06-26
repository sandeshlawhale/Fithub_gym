import { prisma } from "@/lib/prisma";
import MemberForm from "./MemberForm";
import { MemberType } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function NewMemberPage() {
  // Fetch active plans to pass to form
  const activePlans = await prisma.membershipPlan.findMany({
    where: { isActive: true, isDeleted: false },
    select: {
      id: true,
      name: true,
      memberType: true,
      price: true,
      durationMonths: true,
    },
  });

  // Map Decimal to Number for React components compatibility
  const plans = activePlans.map((plan) => ({
    id: plan.id,
    name: plan.name,
    memberType: plan.memberType,
    price: Number(plan.price),
    durationMonths: plan.durationMonths,
  }));

  return <MemberForm plans={plans} />;
}
