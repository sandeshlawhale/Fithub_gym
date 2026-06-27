import { prisma } from "@/lib/prisma";
import { MembershipStatus, PaymentMethod } from "@prisma/client";

export interface CreateMembershipInput {
  memberId: string;
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
  static async validateDates(memberId: string, startDate: Date, endDate: Date, currentMembershipId?: string) {
    if (endDate <= startDate) {
      throw new Error("End date must be after the start date.");
    }

    const member = await prisma.member.findUnique({
      where: { id: memberId },
      select: { coupleGroupId: true },
    });

    // Check for overlapping membership dates for this member or their couple group
    const overlapping = await prisma.membership.findFirst({
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

  static async createMembership(data: CreateMembershipInput) {
    // 1. Validation checks
    if (data.amount < 0) throw new Error("Amount cannot be negative.");
    if (data.registrationFee < 0) throw new Error("Registration fee cannot be negative.");
    
    await this.validateDates(data.memberId, data.startDate, data.endDate);

    // 2. Derive status
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let status: MembershipStatus = MembershipStatus.ACTIVE;
    
    if (data.startDate > today) {
      status = MembershipStatus.UPCOMING;
    } else if (data.endDate < today) {
      status = MembershipStatus.EXPIRED;
    }

    // 3. Create the record
    return prisma.membership.create({
      data: {
        ...data,
        status,
      },
    });
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let status: MembershipStatus = MembershipStatus.ACTIVE;
    if (input.startDate > today) {
      status = MembershipStatus.UPCOMING;
    } else if (input.endDate < today) {
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
    const member = await prisma.member.findUnique({
      where: { id: memberId },
    });
    if (!member) return [];

    return prisma.membership.findMany({
      where: {
        OR: [
          { memberId },
          member.coupleGroupId ? { coupleGroupId: member.coupleGroupId } : {},
        ],
      },
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
  }: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    planId?: string;
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
      const now = new Date();
      if (status === "active") {
        conditions.push({
          status: "ACTIVE",
          startDate: { lte: now },
          endDate: { gte: now },
        });
      } else if (status === "expiring_soon") {
        const fiveDaysFromNow = new Date();
        fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);
        conditions.push({
          status: "ACTIVE",
          startDate: { lte: now },
          endDate: {
            gte: now,
            lte: fiveDaysFromNow,
          },
        });
      } else if (status === "expired") {
        conditions.push({
          OR: [
            { status: "EXPIRED" },
            { endDate: { lt: now } },
          ],
        });
      } else if (status === "upcoming") {
        conditions.push({
          OR: [
            { status: "UPCOMING" },
            { startDate: { gt: now } },
          ],
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
        },
      }),
      prisma.membership.count({ where }),
    ]);

    return {
      data: data.map(m => ({
        id: m.id,
        memberName: `${m.member.firstName} ${m.member.lastName}`,
        memberId: m.memberId,
        planName: m.membershipPlan?.name || m.customPlanName || "Custom Plan",
        amount: Number(m.amount),
        registrationFee: Number(m.registrationFee),
        paymentMethod: m.paymentMethod,
        paymentReference: m.paymentReference,
        startDate: m.startDate,
        endDate: m.endDate,
        status: m.status,
        createdAt: m.createdAt,
      })),
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
