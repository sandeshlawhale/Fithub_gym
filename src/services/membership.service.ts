import { prisma } from "@/lib/prisma";
import { MembershipStatus, PaymentMethod } from "@prisma/client";
import { getSettings } from "@/features/settings/actions";

export interface CreateMembershipInput {
  memberId: string;
  partnerMemberId?: string;
  coupleGroupId?: string;
  membershipPlanId?: string;
  customPlanName?: string;
  amount: number;
  registrationFee: number;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  startDate: Date;
  endDate: Date;
  remarks?: string;
}

export class MembershipService {
  static async validateDates(
    memberId: string,
    startDate: Date,
    endDate: Date,
    currentMembershipId?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    txClient: any = prisma
  ) {
    if (endDate <= startDate) {
      throw new Error("End date must be after the start date.");
    }

    const member = await txClient.member.findUnique({
      where: { id: memberId },
      select: { coupleGroupId: true },
    });

    // Check for overlapping membership dates for this member or their couple group
    const overlapping = await txClient.membership.findFirst({
      where: {
        OR: [
          { memberId },
          member?.coupleGroupId ? { coupleGroupId: member.coupleGroupId } : {},
        ],
        id: currentMembershipId ? { not: currentMembershipId } : undefined,
        AND: [
          {
            OR: [
              {
                // New startDate is within an existing membership
                startDate: { lte: startDate },
                endDate: { gte: startDate },
              },
              {
                // New endDate is within an existing membership
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
              {
                // Existing membership is fully inside new membership
                startDate: { gte: startDate },
                endDate: { lte: endDate },
              },
            ],
          },
        ],
      },
    });

    if (overlapping) {
      throw new Error(`The membership dates overlap with an existing membership (${overlapping.startDate.toLocaleDateString()} to ${overlapping.endDate.toLocaleDateString()}).`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async createMembership(data: CreateMembershipInput, txClient?: any) {
    // 1. Validation checks
    if (data.amount < 0) throw new Error("Amount cannot be negative.");
    if (data.registrationFee < 0) throw new Error("Registration fee cannot be negative.");
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const execute = async (tx: any) => {
      // Find the plan to check its memberType
      let isCouple = false;
      if (data.partnerMemberId) {
        isCouple = true;
      } else if (data.membershipPlanId) {
        const plan = await tx.membershipPlan.findUnique({
          where: { id: data.membershipPlanId },
        });
        if (plan && plan.memberType === "COUPLE") {
          isCouple = true;
        }
      }

      let coupleGroupId = data.coupleGroupId;

      if (isCouple) {
        if (!data.partnerMemberId) {
          throw new Error("Partner member ID is required for Couple membership plan.");
        }

        const m1 = await tx.member.findUnique({ where: { id: data.memberId } });
        const m2 = await tx.member.findUnique({ where: { id: data.partnerMemberId } });

        if (!m1 || m1.isDeleted) throw new Error("Primary member not found.");
        if (!m2 || m2.isDeleted) throw new Error("Partner member not found.");

        let cpGroup;
        if (m1.coupleGroupId && m1.coupleGroupId === m2.coupleGroupId) {
          cpGroup = await tx.coupleGroup.findUnique({ where: { id: m1.coupleGroupId } });
        }

        if (!cpGroup) {
          cpGroup = await tx.coupleGroup.create({ data: {} });
          await tx.member.updateMany({
            where: { id: { in: [m1.id, m2.id] } },
            data: { coupleGroupId: cpGroup.id },
          });
        }
        coupleGroupId = cpGroup.id;
      }

      // Validate dates
      await this.validateDates(data.memberId, data.startDate, data.endDate, undefined, tx);
      if (isCouple && data.partnerMemberId) {
        await this.validateDates(data.partnerMemberId, data.startDate, data.endDate, undefined, tx);
      }

      // Derive status
      const start = new Date(data.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(data.endDate);
      end.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let status: MembershipStatus = MembershipStatus.ACTIVE;
      
      if (start > today) {
        status = MembershipStatus.UPCOMING;
      } else if (end < today) {
        status = MembershipStatus.EXPIRED;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { partnerMemberId, ...rest } = data;

      if (isCouple && data.partnerMemberId) {
        const membershipA = await tx.membership.create({
          data: {
            ...rest,
            coupleGroupId,
            status,
          },
        });

        const membershipB = await tx.membership.create({
          data: {
            ...rest,
            memberId: data.partnerMemberId,
            coupleGroupId,
            status,
          },
        });

        return { primary: membershipA, partner: membershipB };
      } else {
        const membership = await tx.membership.create({
          data: {
            ...rest,
            status,
          },
        });

        return { primary: membership };
      }
    };

    if (txClient) {
      return execute(txClient);
    } else {
      return prisma.$transaction(async (tx) => execute(tx));
    }
  }

  static async renewMembership(memberId: string, input: {
    membershipPlanId?: string;
    customPlanName?: string;
    amount: number;
    paymentMethod: PaymentMethod;
    paymentReference?: string;
    startDate: Date;
    endDate: Date;
    remarks?: string;
  }) {
    // Business Rule: Renewal never edits an existing membership.
    // Every renewal creates a brand-new membership record.
    // Registration fee is never applied during renewal.
    
    const member = await prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!member) throw new Error("Member not found.");

    // Validate dates
    await this.validateDates(memberId, input.startDate, input.endDate);

    const start = new Date(input.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(input.endDate);
    end.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let status: MembershipStatus = MembershipStatus.ACTIVE;
    if (start > today) {
      status = MembershipStatus.UPCOMING;
    } else if (end < today) {
      status = MembershipStatus.EXPIRED;
    }


    // Create new membership record
    const newMembership = await prisma.membership.create({
      data: {
        memberId,
        coupleGroupId: member.coupleGroupId,
        membershipPlanId: input.membershipPlanId,
        customPlanName: input.customPlanName,
        amount: input.amount,
        registrationFee: 0.00, // Never charged on renewal
        paymentMethod: input.paymentMethod,
        paymentReference: input.paymentReference,
        startDate: input.startDate,
        endDate: input.endDate,
        status,
        remarks: input.remarks,
      },
    });

    // Update other active memberships to expired if their end dates are past
    // or keep them as is (derived status is best, but we keep table fields updated).
    return newMembership;
  }

  static async getHistoryByMember(memberId: string) {
    return prisma.membership.findMany({
      where: { memberId },
      orderBy: { startDate: "desc" },
      include: { membershipPlan: true },
    });
  }

  static async getMembershipHistoryLog({
    page = 1,
    limit = 10,
    search = "",
    status = "",
    planId = "",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dateRange = "all_time",
  }: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    planId?: string;
    dateRange?: string;
  }) {
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = {};
    const conditions: any[] = [];

    if (search) {
      conditions.push({
        OR: [
          {
            member: {
              OR: [
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
                { phone: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            },
          },
          {
            coupleGroup: {
              members: {
                some: {
                  OR: [
                    { firstName: { contains: search, mode: "insensitive" } },
                    { lastName: { contains: search, mode: "insensitive" } },
                    { phone: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                  ],
                },
              },
            },
          },
        ],
      });
    }

    if (status) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      if (status === "active") {
        conditions.push({
          startDate: { lte: todayEnd },
          endDate: { gte: todayStart },
        });
      } else if (status === "expiring_soon") {
        const settings = await getSettings();
        const reminderDays = settings?.expiryReminderDays ?? 5;
        const expiryThresholdEnd = new Date();
        expiryThresholdEnd.setDate(expiryThresholdEnd.getDate() + reminderDays);
        expiryThresholdEnd.setHours(23, 59, 59, 999);

        conditions.push({
          startDate: { lte: todayEnd },
          endDate: {
            gte: todayStart,
            lte: expiryThresholdEnd,
          },
        });
      } else if (status === "expired") {
        conditions.push({
          endDate: { lt: todayStart },
        });
      } else if (status === "expired_last_30_days") {
        const thirtyDaysAgo = new Date(todayStart);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        conditions.push({
          endDate: {
            lt: todayStart,
            gte: thirtyDaysAgo,
          },
        });
      } else if (status === "upcoming") {
        conditions.push({
          startDate: { gt: todayEnd },
        });
      }
    }

    if (planId) {
      conditions.push({ membershipPlanId: planId });
    }

    if (conditions.length > 0) {
      where.AND = conditions;
    }

    const [data, total] = await prisma.$transaction([
      prisma.membership.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          member: true,
          membershipPlan: true,
          coupleGroup: {
            include: {
              members: true,
            },
          },
        },
      }),
      prisma.membership.count({ where }),
    ]);

    return {
      data: data.map(m => {
        const partner = m.coupleGroup?.members.find(
          (member) => member.id !== m.memberId
        ) || null;
        return {
          id: m.id,
          memberName: `${m.member.firstName} ${m.member.lastName}`,
          memberId: m.memberId,
          memberPhone: m.member.phone,
          memberEmail: m.member.email || "",
          partnerName: partner ? `${partner.firstName} ${partner.lastName}` : "",
          planName: m.membershipPlan?.name || m.customPlanName || "Custom Plan",
          amount: Number(m.amount),
          registrationFee: Number(m.registrationFee),
          paymentMethod: m.paymentMethod,
          paymentReference: m.paymentReference,
          startDate: m.startDate,
          endDate: m.endDate,
          status: m.status,
          createdAt: m.createdAt,
        };
      }),
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getMembershipReceiptDetails(id: string) {
    const membership = await prisma.membership.findUnique({
      where: { id },
      include: {
        member: true,
        membershipPlan: true,
        coupleGroup: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!membership) return null;

    // Get sequence count of memberships created on or before this membership's createdAt
    const count = await prisma.membership.count({
      where: {
        createdAt: {
          lt: membership.createdAt,
        },
      },
    }) + 1;

    const partner = membership.coupleGroup?.members.find(
      (m) => m.id !== membership.memberId
    ) || null;

    return {
      ...membership,
      partner,
      receiptNo: `REC_${new Date(membership.createdAt).getFullYear()}_${String(count).padStart(6, "0")}`,
    };
  }
}
