import { notFound } from "next/navigation";
import { MemberService } from "@/services/member.service";
import { prisma } from "@/lib/prisma";
import RenewForm from "./RenewForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

import { Suspense } from "react";
import RenewMemberLoading from "./loading";

export const unstable_instant = { prefetch: "static", unstable_disableValidation: true };

export default function RenewMemberPage({ params }: PageProps) {
  return (
    <Suspense fallback={<RenewMemberLoading />}>
      <RenewMemberContent params={params} />
    </Suspense>
  );
}

async function RenewMemberContent({ params }: PageProps) {
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

  const partner = member.coupleGroup?.members[0] || null;

  const memberPayload = {
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    coupleGroupId: member.coupleGroupId,
    partner: partner ? {
      id: partner.id,
      firstName: partner.firstName,
      lastName: partner.lastName,
      phone: partner.phone,
    } : null,
    latestMembership: member.latestMembership ? {
      endDate: member.latestMembership.endDate,
    } : null,
  };

  return <RenewForm member={memberPayload} plans={plans} />;
}
