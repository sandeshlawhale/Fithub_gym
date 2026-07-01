import { prisma } from "@/lib/prisma";
import { Gender, MemberType } from "@prisma/client";
import { getSettings } from "@/features/settings/actions";

export interface CreateMemberInput {
  firstName: string;
  lastName: string;
  phone: string;
  gender: Gender;
  email?: string;
  dateOfBirth?: Date;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  notes?: string;
  avatarUrl?: string;
}

export class MemberService {
  static async getMembers({
    page = 1,
    limit = 10,
    search = "",
    status = "",
    planId = "",
  }) {
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = { isDeleted: false };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      if (status === "active") {
        where.memberships = {
          some: {
            startDate: { lte: todayEnd },
            endDate: { gte: todayStart },
          },
        };
      } else if (status === "expired") {
        where.memberships = {
          some: {
            endDate: { lt: todayStart },
          },
          none: {
            endDate: { gte: todayStart },
          },
        };
      } else if (status === "upcoming") {
        where.memberships = {
          some: {
            startDate: { gt: todayEnd },
          },
        };
      } else if (status === "expiring_soon") {
        const settings = await getSettings();
        const reminderDays = settings?.expiryReminderDays ?? 5;
        const expiryThresholdEnd = new Date();
        expiryThresholdEnd.setDate(expiryThresholdEnd.getDate() + reminderDays);
        expiryThresholdEnd.setHours(23, 59, 59, 999);

        where.memberships = {
          some: {
            startDate: { lte: todayEnd },
            endDate: {
              gte: todayStart,
              lte: expiryThresholdEnd,
            },
          },
        };
      }
    }

    if (planId) {
      where.memberships = {
        some: {
          membershipPlanId: planId,
        },
      };
    }

    const [data, total] = await prisma.$transaction([
      prisma.member.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          memberships: {
            orderBy: { endDate: "desc" },
            take: 1,
            include: { membershipPlan: true },
          },
          coupleGroup: {
            include: {
              members: true,
              memberships: {
                orderBy: { endDate: "desc" },
                take: 1,
                include: { membershipPlan: true },
              },
            },
          },
        },
      }),
      prisma.member.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map((m) => {
        const latestMembership = m.memberships[0] || null;
        let status = "INACTIVE";
        if (latestMembership) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const end = new Date(latestMembership.endDate);
          end.setHours(0, 0, 0, 0);
          const start = new Date(latestMembership.startDate);
          start.setHours(0, 0, 0, 0);

          if (start > today) {
            status = "UPCOMING";
          } else if (end < today) {
            status = "EXPIRED";
          } else {
            const diffTime = end.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays <= 5) {
              status = "EXPIRING_SOON";
            } else {
              status = "ACTIVE";
            }
          }
        }

        return {
          id: m.id,
          firstName: m.firstName,
          lastName: m.lastName,
          name: `${m.firstName} ${m.lastName}`,
          phone: m.phone,
          gender: m.gender,
          email: m.email,
          createdAt: m.createdAt,
          planName: latestMembership?.membershipPlan?.name || latestMembership?.customPlanName || "No Plan",
          status,
          latestMembership,
          coupleGroup: m.coupleGroup,
        };
      }),
      total,
      page,
      pageSize: limit,
      totalPages,
    };
  }

  static async getMemberById(id: string) {
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        memberships: {
          orderBy: { startDate: "desc" },
          include: { membershipPlan: true },
        },
        coupleGroup: {
          include: {
            members: {
              where: {
                id: { not: id },
                isDeleted: false,
              },
            },
            memberships: {
              orderBy: { startDate: "desc" },
              include: { membershipPlan: true },
            },
          },
        },
      },
    });

    if (!member || member.isDeleted) {
      return null;
    }

    const latestMembership = member.memberships.find(m => m.status === "ACTIVE") 
      || member.memberships[0] 
      || null;
    let status = "INACTIVE";
    if (latestMembership) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const end = new Date(latestMembership.endDate);
      end.setHours(0, 0, 0, 0);
      const start = new Date(latestMembership.startDate);
      start.setHours(0, 0, 0, 0);

      if (start > today) {
        status = "UPCOMING";
      } else if (end < today) {
        status = "EXPIRED";
      } else {
        const diffTime = end.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 5) {
          status = "EXPIRING_SOON";
        } else {
          status = "ACTIVE";
        }
      }
    }

    return {
      ...member,
      name: `${member.firstName} ${member.lastName}`,
      status,
      latestMembership,
    };
  }

  static async createMember(data: CreateMemberInput, coupleGroupId?: string) {
    // Validate phone number uniqueness
    const existing = await prisma.member.findUnique({
      where: { phone: data.phone },
    });

    if (existing && !existing.isDeleted) {
      throw new Error(`Phone number ${data.phone} is already registered to an active member.`);
    }

    // If member was soft deleted, we can reactivate or create new. Let's create new.
    return prisma.member.create({
      data: {
        ...data,
        coupleGroupId,
      },
    });
  }

  static async updateMember(id: string, data: Partial<CreateMemberInput>) {
    if (data.phone) {
      const existing = await prisma.member.findUnique({
        where: { phone: data.phone },
      });
      if (existing && existing.id !== id && !existing.isDeleted) {
        throw new Error(`Phone number ${data.phone} is already in use.`);
      }
    }

    return prisma.member.update({
      where: { id },
      data,
    });
  }

  static async softDeleteMember(id: string) {
    // Business rule: Deletion should be prevented if historical memberships exist, or soft delete.
    // Let's check if they have memberships.
    const membershipsCount = await prisma.membership.count({
      where: { memberId: id },
    });

    if (membershipsCount > 0) {
      // Soft delete only
      return prisma.member.update({
        where: { id },
        data: { isDeleted: true },
      });
    } else {
      // Hard delete if no history exists
      return prisma.member.delete({
        where: { id },
      });
    }
  }

  static async createCoupleGroup(memberOneId: string, memberTwoId: string) {
    const group = await prisma.coupleGroup.create({
      data: {},
    });

    await prisma.member.updateMany({
      where: {
        id: { in: [memberOneId, memberTwoId] },
      },
      data: {
        coupleGroupId: group.id,
      },
    });

    return group;
  }
}
