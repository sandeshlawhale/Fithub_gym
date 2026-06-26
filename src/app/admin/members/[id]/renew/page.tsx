import { notFound } from "next/navigation";
import { MemberService } from "@/services/member.service";
import { prisma } from "@/lib/prisma";
import RenewForm from "./RenewForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function RenewMemberPage({ params }: PageProps) {
  const { id } = await params;
  
  // Fetch member info
  const member = await MemberService.getMemberById(id);
  if (!member) {
    notFound();
  }

  // Fetch active plans
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

  const plans = activePlans.map(plan => ({
    id: plan.id,
    name: plan.name,
    memberType: plan.memberType,
    price: Number(plan.price),
    durationMonths: plan.durationMonths,
  }));

  const memberPayload = {
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    coupleGroupId: member.coupleGroupId,
    latestMembership: member.latestMembership ? {
      endDate: member.latestMembership.endDate,
    } : null,
  };

  return <RenewForm member={memberPayload} plans={plans} />;
}
