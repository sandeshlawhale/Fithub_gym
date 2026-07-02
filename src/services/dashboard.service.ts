import { prisma } from "@/lib/prisma";
import { MembershipStatus } from "@prisma/client";
import { getSettings } from "@/features/settings/actions";

export class DashboardService {
  static async getSummary() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const sevenDaysFromNow = new Date(todayStart);
    sevenDaysFromNow.setDate(todayStart.getDate() + 7);

    const thirtyDaysAgo = new Date(todayStart);
    thirtyDaysAgo.setDate(todayStart.getDate() - 30);

    // 1. Total Memberships in Current Month
    const totalMembers = await prisma.membership.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        member: { isDeleted: false },
      },
    });

    // 2. Active Memberships
    const activeMembers = await prisma.membership.count({
      where: {
        member: { isDeleted: false },
        startDate: { lte: todayEnd },
        endDate: { gte: todayStart },
      },
    });

    // 3. Expiring Soon (memberships ending within expiryReminderDays)
    const settings = await getSettings();
    const reminderDays = settings?.expiryReminderDays ?? 5;
    const expiryThresholdEnd = new Date(todayEnd);
    expiryThresholdEnd.setDate(todayEnd.getDate() + reminderDays);

    const expiringSoon = await prisma.membership.count({
      where: {
        member: { isDeleted: false },
        startDate: { lte: todayEnd },
        endDate: {
          gte: todayStart,
          lte: expiryThresholdEnd,
        },
      },
    });

    // 4. Expired in Last 30 Days
    const expiredMembers = await prisma.membership.count({
      where: {
        member: { isDeleted: false },
        endDate: {
          lt: todayStart,
          gte: thirtyDaysAgo,
        },
      },
    });

    // 5. Monthly Revenue (sum of amount + registrationFee for current month)
    const revenueResult = await prisma.membership.aggregate({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        member: { isDeleted: false },
      },
      _sum: {
        amount: true,
        registrationFee: true,
      },
    });

    const monthlyRevenue = 
      Number(revenueResult._sum.amount || 0) + 
      Number(revenueResult._sum.registrationFee || 0);

    // 6. Recent Members (last 5 created)
    const recentMembers = await prisma.member.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        memberships: {
          orderBy: { endDate: "desc" },
          take: 1,
          include: { membershipPlan: true },
        },
      },
    });

    // 7. Recent Renewals (last 5 memberships created where it's a renewal)
    // We can fetch the latest 5 memberships since every purchase/renewal creates a new record.
    const recentRenewals = await prisma.membership.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        member: true,
        membershipPlan: true,
      },
    });

    return {
      totalMembers,
      activeMembers,
      expiringSoon,
      expiredMembers,
      monthlyRevenue,
      recentMembers: recentMembers.map(m => {
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
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            if (end >= thirtyDaysAgo) {
              status = "EXPIRED";
            } else {
              status = "INACTIVE";
            }
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
          name: `${m.firstName} ${m.lastName}`,
          phone: m.phone,
          joinDate: m.createdAt,
          planName: latestMembership?.membershipPlan?.name || latestMembership?.customPlanName || "No Plan",
          status,
        };
      }),
      recentRenewals: recentRenewals.map(r => ({
        id: r.id,
        memberName: `${r.member.firstName} ${r.member.lastName}`,
        planName: r.membershipPlan?.name || r.customPlanName || "Custom Plan",
        amount: Number(r.amount),
        date: r.createdAt,
      })),
      chartData: await (async () => {
        const data: { month: string; count: number }[] = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthLabel = d.toLocaleString("en-US", { month: "short" });
          const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
          
          const count = await prisma.member.count({
            where: {
              isDeleted: false,
              createdAt: { lte: endOfMonth }
            }
          });
          
          data.push({
            month: monthLabel,
            count
          });
        }
        return data;
      })()
    };
  }
}
