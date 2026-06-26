import { prisma } from "@/lib/prisma";
import { MemberType } from "@prisma/client";

export class PlanService {
  static async getPlans() {
    return prisma.membershipPlan.findMany({
      where: { isDeleted: false },
      orderBy: [{ memberType: "asc" }, { price: "asc" }],
    });
  }

  static async createPlan(data: {
    name: string;
    memberType: MemberType;
    durationMonths: number;
    price: number;
    description?: string;
  }) {
    if (data.price < 0) throw new Error("Price cannot be negative.");
    if (data.durationMonths <= 0) throw new Error("Duration must be at least 1 month.");

    return prisma.membershipPlan.create({
      data: {
        name: data.name,
        memberType: data.memberType,
        durationMonths: data.durationMonths,
        price: data.price,
        description: data.description,
        isActive: true,
        isDeleted: false,
      },
    });
  }

  static async updatePlan(id: string, data: {
    name?: string;
    price?: number;
    durationMonths?: number;
    description?: string;
    isActive?: boolean;
  }) {
    if (data.price !== undefined && data.price < 0) throw new Error("Price cannot be negative.");
    return prisma.membershipPlan.update({
      where: { id },
      data,
    });
  }

  static async togglePlanActive(id: string, isActive: boolean) {
    return prisma.membershipPlan.update({
      where: { id },
      data: { isActive },
    });
  }

  static async softDeletePlan(id: string) {
    // Business rule: Soft delete only. Never permanently delete plans already used.
    return prisma.membershipPlan.update({
      where: { id },
      data: { isDeleted: true, isActive: false },
    });
  }
}
