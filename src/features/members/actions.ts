"use server";

import { revalidatePath } from "next/cache";
import { MemberService } from "@/services/member.service";
import { MembershipService } from "@/services/membership.service";
import { WhatsAppService } from "@/services/whatsapp.service";
import { prisma } from "@/lib/prisma";
import { PaymentMethod } from "@prisma/client";
import { z } from "zod";
import {
  createSingleMemberSchema,
  createCoupleMemberSchema,
  updateMemberSchema,
} from "./schemas";



// Actions
export async function createSingleMemberAction(data: any) {
  try {
    const validated = createSingleMemberSchema.parse(data);

    // Create member and membership
    const member = await MemberService.createMember({
      firstName: validated.firstName,
      lastName: validated.lastName,
      phone: validated.phone,
      gender: validated.gender,
      email: validated.email,
      dateOfBirth: validated.dateOfBirth,
      address: validated.address,
      emergencyContact: validated.emergencyContact,
      emergencyPhone: validated.emergencyPhone,
      notes: validated.notes,
      avatarUrl: validated.avatarUrl,
    });

    const membership = await MembershipService.createMembership({
      memberId: member.id,
      membershipPlanId: validated.membershipPlanId || undefined,
      customPlanName: validated.customPlanName,
      amount: validated.amount,
      registrationFee: validated.registrationFee,
      paymentMethod: validated.paymentMethod,
      paymentReference: validated.paymentReference,
      startDate: validated.startDate,
      endDate: validated.endDate,
      remarks: validated.remarks,
    });

    // Send receipt notification
    try {
      await WhatsAppService.sendReceipt(member.id, membership.id);
    } catch (wsError) {
      console.error("Failed to send WhatsApp receipt:", wsError);
    }

    revalidatePath("/admin/members");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating single member:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}

export async function createCoupleMemberAction(data: any) {
  try {
    const validated = createCoupleMemberSchema.parse(data);

    if (validated.memberOne.phone === validated.memberTwo.phone) {
      throw new Error("Partner phone numbers must be unique.");
    }

    const { m1, m2, group, membership } = await prisma.$transaction(async (tx) => {
      // 1. Uniqueness check for member one
      const existingOne = await tx.member.findUnique({
        where: { phone: validated.memberOne.phone },
      });
      if (existingOne && !existingOne.isDeleted) {
        throw new Error(`Phone number ${validated.memberOne.phone} is already registered to an active member.`);
      }

      // Uniqueness check for member two
      const existingTwo = await tx.member.findUnique({
        where: { phone: validated.memberTwo.phone },
      });
      if (existingTwo && !existingTwo.isDeleted) {
        throw new Error(`Phone number ${validated.memberTwo.phone} is already registered to an active member.`);
      }

      // 2. Create/Reactivate the two members
      let member1;
      if (existingOne && existingOne.isDeleted) {
        member1 = await tx.member.update({
          where: { id: existingOne.id },
          data: {
            firstName: validated.memberOne.firstName,
            lastName: validated.memberOne.lastName,
            phone: validated.memberOne.phone,
            gender: validated.memberOne.gender,
            email: validated.memberOne.email || null,
            dateOfBirth: validated.memberOne.dateOfBirth || null,
            address: validated.memberOne.address || null,
            emergencyContact: validated.emergencyContact || null,
            emergencyPhone: validated.emergencyPhone || null,
            notes: validated.notes || null,
            isDeleted: false,
          },
        });
      } else {
        member1 = await tx.member.create({
          data: {
            firstName: validated.memberOne.firstName,
            lastName: validated.memberOne.lastName,
            phone: validated.memberOne.phone,
            gender: validated.memberOne.gender,
            email: validated.memberOne.email || null,
            dateOfBirth: validated.memberOne.dateOfBirth || null,
            address: validated.memberOne.address || null,
            emergencyContact: validated.emergencyContact || null,
            emergencyPhone: validated.emergencyPhone || null,
            notes: validated.notes || null,
          },
        });
      }

      let member2;
      if (existingTwo && existingTwo.isDeleted) {
        member2 = await tx.member.update({
          where: { id: existingTwo.id },
          data: {
            firstName: validated.memberTwo.firstName,
            lastName: validated.memberTwo.lastName,
            phone: validated.memberTwo.phone,
            gender: validated.memberTwo.gender,
            email: validated.memberTwo.email || null,
            dateOfBirth: validated.memberTwo.dateOfBirth || null,
            address: validated.memberTwo.address || null,
            emergencyContact: validated.emergencyContact || null,
            emergencyPhone: validated.emergencyPhone || null,
            notes: validated.notes || null,
            isDeleted: false,
          },
        });
      } else {
        member2 = await tx.member.create({
          data: {
            firstName: validated.memberTwo.firstName,
            lastName: validated.memberTwo.lastName,
            phone: validated.memberTwo.phone,
            gender: validated.memberTwo.gender,
            email: validated.memberTwo.email || null,
            dateOfBirth: validated.memberTwo.dateOfBirth || null,
            address: validated.memberTwo.address || null,
            emergencyContact: validated.emergencyContact || null,
            emergencyPhone: validated.emergencyPhone || null,
            notes: validated.notes || null,
          },
        });
      }

      // 3. Create the Couple Group
      const cpGroup = await tx.coupleGroup.create({
        data: {},
      });

      // 4. Link both members to the group
      await tx.member.updateMany({
        where: {
          id: { in: [member1.id, member2.id] },
        },
        data: {
          coupleGroupId: cpGroup.id,
        },
      });

      // 5. Check overlapping dates for this couple group
      const overlapping = await tx.membership.findFirst({
        where: {
          OR: [
            { memberId: member1.id },
            { coupleGroupId: cpGroup.id },
          ],
          AND: [
            {
              OR: [
                {
                  startDate: { lte: validated.startDate },
                  endDate: { gte: validated.startDate },
                },
                {
                  startDate: { lte: validated.endDate },
                  endDate: { gte: validated.endDate },
                },
                {
                  startDate: { gte: validated.startDate },
                  endDate: { lte: validated.endDate },
                },
              ],
            },
          ],
        },
      });

      if (overlapping) {
        throw new Error(`The membership dates overlap with an existing membership (${overlapping.startDate.toLocaleDateString()} to ${overlapping.endDate.toLocaleDateString()}).`);
      }

      // 6. Create shared membership
      const start = new Date(validated.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(validated.endDate);
      end.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let status = "ACTIVE";
      if (start > today) {
        status = "UPCOMING";
      } else if (end < today) {
        status = "EXPIRED";
      }

      const cpMembership = await tx.membership.create({
        data: {
          memberId: member1.id,
          coupleGroupId: cpGroup.id,
          membershipPlanId: validated.membershipPlanId || undefined,
          customPlanName: validated.customPlanName,
          amount: validated.amount,
          registrationFee: validated.registrationFee,
          paymentMethod: validated.paymentMethod,
          paymentReference: validated.paymentReference,
          startDate: validated.startDate,
          endDate: validated.endDate,
          remarks: validated.remarks,
          status: status as any,
        },
      });

      return { m1: member1, m2: member2, group: cpGroup, membership: cpMembership };
    });

    // Send receipt notifications to both members
    try {
      await WhatsAppService.sendReceipt(m1.id, membership.id);
      await WhatsAppService.sendReceipt(m2.id, membership.id);
    } catch (wsError) {
      console.error("Failed to send WhatsApp receipts for couple:", wsError);
    }

    revalidatePath("/admin/members");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating couple member:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}

export async function updateMemberAction(id: string, data: any) {
  try {
    const validated = updateMemberSchema.parse(data);
    await MemberService.updateMember(id, validated);
    revalidatePath(`/admin/members/${id}`);
    revalidatePath("/admin/members");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating member:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}

export async function softDeleteMemberAction(id: string) {
  try {
    await MemberService.softDeleteMember(id);
    revalidatePath("/admin/members");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting member:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}

export async function renewMembershipAction(memberId: string, data: any) {
  try {
    const schema = z.object({
      membershipPlanId: z.string().uuid().optional().or(z.literal("")),
      customPlanName: z.string().optional(),
      customPlanDuration: z.coerce.number().min(1).optional(),
      amount: z.coerce.number().min(0, "Amount cannot be negative"),
      paymentMethod: z.nativeEnum(PaymentMethod),
      paymentReference: z.string().optional(),
      startDate: z.string().transform(v => new Date(v)),
      remarks: z.string().optional(),
    });

    const validated = schema.parse(data);

    const member = await MemberService.getMemberById(memberId);
    if (!member) throw new Error("Member not found");

    // Fetch plan duration if provided
    let durationMonths = 1;
    if (validated.membershipPlanId) {
      const plan = await prisma.membershipPlan.findUnique({
        where: { id: validated.membershipPlanId },
      });
      if (!plan) throw new Error("Selected plan not found");
      durationMonths = plan.durationMonths;
    } else if (validated.customPlanDuration) {
      durationMonths = validated.customPlanDuration;
    }

    const endDate = new Date(validated.startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);

    // Build the payload for renewMembership
    const payload = {
      membershipPlanId: validated.membershipPlanId || undefined,
      customPlanName: validated.customPlanName,
      amount: validated.amount,
      paymentMethod: validated.paymentMethod,
      paymentReference: validated.paymentReference,
      startDate: validated.startDate,
      endDate: endDate,
      remarks: validated.remarks,
    };

    if (member.coupleGroupId) {
      // It's a couple renewal. We renew the single shared membership under the primary member.
      const renewed = await MembershipService.renewMembership(memberId, {
        ...payload,
        amount: validated.amount, // Full amount
      });

      // Send receipt notifications to both members
      try {
        await WhatsAppService.sendReceipt(memberId, renewed.id);
        const partner = member.coupleGroup?.members[0];
        if (partner) {
          await WhatsAppService.sendReceipt(partner.id, renewed.id);
        }
      } catch (wsError) {
        console.error("Failed to send WhatsApp receipts for couple renewal:", wsError);
      }
    } else {
      // Regular single member renewal
      const m1Renewed = await MembershipService.renewMembership(memberId, {
        ...payload,
      });

      // Send receipt notification
      try {
        await WhatsAppService.sendReceipt(memberId, m1Renewed.id);
      } catch (wsError) {
        console.error("Failed to send WhatsApp receipt for renewal:", wsError);
      }
    }

    revalidatePath(`/admin/members/${memberId}`);
    revalidatePath("/admin/membership-history");
    return { success: true };
  } catch (error: any) {
    console.error("Error renewing membership:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}

export async function getMembershipHistoryForExportAction(filters: { search?: string; status?: string; planId?: string; dateRange?: string }) {
  try {
    const result = await MembershipService.getMembershipHistoryLog({
      limit: 100000,
      search: filters.search || "",
      status: filters.status || "",
      planId: filters.planId || "",
      dateRange: filters.dateRange || "all_time",
    });
    return { success: true, data: result.data };
  } catch (error: any) {
    console.error("Error fetching membership history for export:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}

