"use server";

import { revalidatePath } from "next/cache";
import { PlanService } from "@/services/plan.service";
import { MemberType } from "@prisma/client";
import { z } from "zod";

const createPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required").trim(),
  memberType: z.nativeEnum(MemberType),
  durationMonths: z.coerce.number().min(1, "Duration must be at least 1 month"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  description: z.string().optional(),
});

const updatePlanSchema = z.object({
  name: z.string().min(1, "Plan name is required").trim(),
  memberType: z.nativeEnum(MemberType),
  durationMonths: z.coerce.number().min(1, "Duration must be at least 1 month"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  description: z.string().optional(),
});

export async function createPlanAction(data: any) {
  try {
    const validated = createPlanSchema.parse(data);
    await PlanService.createPlan(validated);
    revalidatePath("/admin/membership-plans");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating plan:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}

export async function updatePlanAction(id: string, data: any) {
  try {
    const validated = updatePlanSchema.parse(data);
    await PlanService.updatePlan(id, validated);
    revalidatePath("/admin/membership-plans");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating plan:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}

export async function togglePlanAction(id: string, isActive: boolean) {
  try {
    await PlanService.togglePlanActive(id, isActive);
    revalidatePath("/admin/membership-plans");
    return { success: true };
  } catch (error: any) {
    console.error("Error toggling plan:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}

export async function deletePlanAction(id: string) {
  try {
    await PlanService.softDeletePlan(id);
    revalidatePath("/admin/membership-plans");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting plan:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}
