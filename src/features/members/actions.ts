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

    // 1. Create the Couple Group
    const group = await MemberService.createCoupleGroup(
      // We will create both members first then group them
      "", "" // placeholders
    );

    // 2. Create the two members in the group
    const m1 = await MemberService.createMember({
      firstName: validated.memberOne.firstName,
      lastName: validated.memberOne.lastName,
      phone: validated.memberOne.phone,
      gender: validated.memberOne.gender,
      email: validated.memberOne.email,
      dateOfBirth: validated.memberOne.dateOfBirth,
      address: validated.memberOne.address,
      emergencyContact: validated.emergencyContact,
      emergencyPhone: validated.emergencyPhone,
      notes: validated.notes,
    }, group.id);

    const m2 = await MemberService.createMember({
      firstName: validated.memberTwo.firstName,
      lastName: validated.memberTwo.lastName,
      phone: validated.memberTwo.phone,
      gender: validated.memberTwo.gender,
      email: validated.memberTwo.email,
      dateOfBirth: validated.memberTwo.dateOfBirth,
      address: validated.memberTwo.address,
      emergencyContact: validated.emergencyContact,
      emergencyPhone: validated.emergencyPhone,
      notes: validated.notes,
    }, group.id);

    // Update group mapping
    await prisma.coupleGroup.update({
      where: { id: group.id },
      data: {
        members: {
          connect: [{ id: m1.id }, { id: m2.id }],
        },
      },
    });

    // 3. Create memberships for both linked members (split the price or store half on each)
    const splitAmount = validated.amount / 2;
    const splitRegFee = validated.registrationFee / 2;

    const m1Membership = await MembershipService.createMembership({
      memberId: m1.id,
      coupleGroupId: group.id,
      membershipPlanId: validated.membershipPlanId || undefined,
      customPlanName: validated.customPlanName,
      amount: splitAmount,
      registrationFee: splitRegFee,
      paymentMethod: validated.paymentMethod,
      paymentReference: validated.paymentReference,
      startDate: validated.startDate,
      endDate: validated.endDate,
      remarks: validated.remarks,
    });

    const m2Membership = await MembershipService.createMembership({
      memberId: m2.id,
      coupleGroupId: group.id,
      membershipPlanId: validated.membershipPlanId || undefined,
      customPlanName: validated.customPlanName,
      amount: splitAmount,
      registrationFee: splitRegFee,
      paymentMethod: validated.paymentMethod,
      paymentReference: validated.paymentReference,
      startDate: validated.startDate,
      endDate: validated.endDate,
      remarks: validated.remarks,
    });

    // Send receipt notifications
    try {
      await WhatsAppService.sendReceipt(m1.id, m1Membership.id);
      await WhatsAppService.sendReceipt(m2.id, m2Membership.id);
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
      // It's a couple renewal. We should renew both members linked in the couple group!
      const partner = member.coupleGroup?.members[0];
      if (partner) {
        const splitAmount = validated.amount / 2;
        
        const m1Renewed = await MembershipService.renewMembership(memberId, {
          ...payload,
          amount: splitAmount,
        });

        const m2Renewed = await MembershipService.renewMembership(partner.id, {
          ...payload,
          amount: splitAmount,
        });

        // Send receipt notifications
        try {
          await WhatsAppService.sendReceipt(memberId, m1Renewed.id);
          await WhatsAppService.sendReceipt(partner.id, m2Renewed.id);
        } catch (wsError) {
          console.error("Failed to send WhatsApp receipts for couple renewal:", wsError);
        }
      } else {
        // Just renew single member in group
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
