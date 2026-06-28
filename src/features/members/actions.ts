"use server";

import { revalidatePath } from "next/cache";
import { MemberService } from "@/services/member.service";
import { MembershipService } from "@/services/membership.service";
import { WhatsAppService } from "@/services/whatsapp.service";
import { prisma } from "@/lib/prisma";
import { PaymentMethod, MemberType, MembershipStatus, Gender } from "@prisma/client";
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

    let member;
    const memberData = {
      firstName: validated.firstName,
      lastName: validated.lastName,
      phone: validated.phone,
      gender: validated.gender,
      email: validated.email || undefined,
      dateOfBirth: validated.dateOfBirth || undefined,
      address: validated.address || undefined,
      emergencyContact: validated.emergencyContact || undefined,
      emergencyPhone: validated.emergencyPhone || undefined,
      notes: validated.notes || undefined,
      avatarUrl: validated.avatarUrl || undefined,
    };

    if (validated.existingMemberId) {
      member = await MemberService.updateMember(validated.existingMemberId, memberData);
    } else {
      member = await MemberService.createMember(memberData);
    }

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
      const existingOne = validated.existingMemberId
        ? await tx.member.findUnique({ where: { id: validated.existingMemberId } })
        : await tx.member.findUnique({ where: { phone: validated.memberOne.phone } });

      if (validated.existingMemberId && (!existingOne || existingOne.isDeleted)) {
        throw new Error("Primary member not found.");
      }
      if (!validated.existingMemberId && existingOne && !existingOne.isDeleted) {
        throw new Error(`Phone number ${validated.memberOne.phone} is already registered to an active member.`);
      }

      // Uniqueness check for member two
      const existingTwo = validated.existingPartnerId
        ? await tx.member.findUnique({ where: { id: validated.existingPartnerId } })
        : await tx.member.findUnique({ where: { phone: validated.memberTwo.phone } });

      if (validated.existingPartnerId && (!existingTwo || existingTwo.isDeleted)) {
        throw new Error("Partner member not found.");
      }
      if (!validated.existingPartnerId && existingTwo && !existingTwo.isDeleted) {
        throw new Error(`Phone number ${validated.memberTwo.phone} is already registered to an active member.`);
      }

      // 2. Create/Update member one
      let member1;
      const m1Data = {
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
      };

      if (existingOne) {
        member1 = await tx.member.update({
          where: { id: existingOne.id },
          data: { ...m1Data, isDeleted: false },
        });
      } else {
        member1 = await tx.member.create({
          data: m1Data,
        });
      }

      // 3. Create/Update member two
      let member2;
      const m2Data = {
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
      };

      if (existingTwo) {
        member2 = await tx.member.update({
          where: { id: existingTwo.id },
          data: { ...m2Data, isDeleted: false },
        });
      } else {
        member2 = await tx.member.create({
          data: m2Data,
        });
      }

      // 4. Link both members to a Couple Group
      let cpGroup;
      if (member1.coupleGroupId && member1.coupleGroupId === member2.coupleGroupId) {
        cpGroup = await tx.coupleGroup.findUnique({
          where: { id: member1.coupleGroupId },
        });
      }

      if (!cpGroup) {
        cpGroup = await tx.coupleGroup.create({
          data: {},
        });
        await tx.member.updateMany({
          where: {
            id: { in: [member1.id, member2.id] },
          },
          data: {
            coupleGroupId: cpGroup.id,
          },
        });
      }

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
      renewType: z.nativeEnum(MemberType),
      membershipPlanId: z.string().uuid().optional().or(z.literal("")),
      customPlanName: z.string().optional(),
      customPlanDuration: z.coerce.number().min(1).optional(),
      amount: z.coerce.number().min(0, "Amount cannot be negative"),
      paymentMethod: z.nativeEnum(PaymentMethod),
      paymentReference: z.string().optional(),
      startDate: z.string().transform(v => new Date(v)),
      remarks: z.string().optional(),

      // Couple-specific options
      partnerOption: z.enum(["previous", "existing", "new"]).optional(),
      partnerMemberId: z.string().uuid().optional().or(z.literal("")),
      partnerDetails: z.object({
        firstName: z.string().min(1, "Partner first name is required").trim(),
        lastName: z.string().min(1, "Partner last name is required").trim(),
        phone: z.string().min(10, "Partner phone must be at least 10 digits"),
        gender: z.nativeEnum(Gender),
        email: z.string().email().optional().or(z.literal("")),
        address: z.string().optional(),
      }).optional(),
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

    // Perform database changes in a transaction to safely link couple groups and set coupleGroupIds
    const result = await prisma.$transaction(async (tx) => {
      let finalCoupleGroupId: string | null = null;
      let partnerIdToSendReceipt: string | null = null;

      if (validated.renewType === MemberType.SINGLE) {
        // If changing to Single, unlink the member from the previous couple group
        if (member.coupleGroupId) {
          await tx.member.update({
            where: { id: memberId },
            data: { coupleGroupId: null },
          });
        }
        finalCoupleGroupId = null;
      } else {
        // Renewing as COUPLE
        if (validated.partnerOption === "previous") {
          // Keep previous partner & group
          if (!member.coupleGroupId) {
            throw new Error("No previous couple group exists for this member.");
          }
          finalCoupleGroupId = member.coupleGroupId;
          
          // Find partner
          const groupMembers = await tx.member.findMany({
            where: { coupleGroupId: member.coupleGroupId, id: { not: memberId } },
          });
          if (groupMembers[0]) {
            partnerIdToSendReceipt = groupMembers[0].id;
          }
        } else if (validated.partnerOption === "existing") {
          if (!validated.partnerMemberId) {
            throw new Error("Partner member ID is required for existing partner renewal.");
          }
          const partner = await tx.member.findUnique({
            where: { id: validated.partnerMemberId },
          });
          if (!partner || partner.isDeleted) {
            throw new Error("Selected partner not found.");
          }
          
          // Create new couple group
          const cpGroup = await tx.coupleGroup.create({ data: {} });
          finalCoupleGroupId = cpGroup.id;

          // Link both members to the group
          await tx.member.update({
            where: { id: memberId },
            data: { coupleGroupId: cpGroup.id },
          });
          await tx.member.update({
            where: { id: partner.id },
            data: { coupleGroupId: cpGroup.id },
          });
          partnerIdToSendReceipt = partner.id;
        } else if (validated.partnerOption === "new") {
          if (!validated.partnerDetails) {
            throw new Error("Partner details are required for new partner renewal.");
          }
          // Check uniqueness of phone
          const existingPartner = await tx.member.findUnique({
            where: { phone: validated.partnerDetails.phone },
          });
          if (existingPartner && !existingPartner.isDeleted) {
            throw new Error(`Phone number ${validated.partnerDetails.phone} is already registered.`);
          }

          let newPartner;
          const partnerData = {
            firstName: validated.partnerDetails.firstName,
            lastName: validated.partnerDetails.lastName,
            phone: validated.partnerDetails.phone,
            gender: validated.partnerDetails.gender,
            email: validated.partnerDetails.email || null,
            address: validated.partnerDetails.address || null,
          };

          if (existingPartner && existingPartner.isDeleted) {
            newPartner = await tx.member.update({
              where: { id: existingPartner.id },
              data: { ...partnerData, isDeleted: false },
            });
          } else {
            newPartner = await tx.member.create({
              data: partnerData,
            });
          }

          // Create new couple group
          const cpGroup = await tx.coupleGroup.create({ data: {} });
          finalCoupleGroupId = cpGroup.id;

          // Link both members to the group
          await tx.member.update({
            where: { id: memberId },
            data: { coupleGroupId: cpGroup.id },
          });
          await tx.member.update({
            where: { id: newPartner.id },
            data: { coupleGroupId: cpGroup.id },
          });
          partnerIdToSendReceipt = newPartner.id;
        }
      }

      // Check overlapping dates
      const overlapping = await tx.membership.findFirst({
        where: {
          OR: [
            { memberId },
            finalCoupleGroupId ? { coupleGroupId: finalCoupleGroupId } : {},
          ],
          AND: [
            {
              OR: [
                {
                  startDate: { lte: validated.startDate },
                  endDate: { gte: validated.startDate },
                },
                {
                  startDate: { lte: endDate },
                  endDate: { gte: endDate },
                },
                {
                  startDate: { gte: validated.startDate },
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

      // Create new membership record
      const start = new Date(validated.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let status: MembershipStatus = MembershipStatus.ACTIVE;
      if (start > today) {
        status = MembershipStatus.UPCOMING;
      } else if (end < today) {
        status = MembershipStatus.EXPIRED;
      }

      const newMembership = await tx.membership.create({
        data: {
          memberId,
          coupleGroupId: finalCoupleGroupId,
          membershipPlanId: validated.membershipPlanId || undefined,
          customPlanName: validated.customPlanName,
          amount: validated.amount,
          registrationFee: 0.00, // Never charged on renewal
          paymentMethod: validated.paymentMethod,
          paymentReference: validated.paymentReference,
          startDate: validated.startDate,
          endDate: endDate,
          status,
          remarks: validated.remarks,
        },
      });

      return { newMembership, partnerIdToSendReceipt };
    });

    // Send receipt notifications outside transaction
    try {
      await WhatsAppService.sendReceipt(memberId, result.newMembership.id);
      if (validated.renewType === MemberType.COUPLE && result.partnerIdToSendReceipt) {
        await WhatsAppService.sendReceipt(result.partnerIdToSendReceipt, result.newMembership.id);
      }
    } catch (wsError) {
      console.error("Failed to send WhatsApp receipts for renewal:", wsError);
    }

    revalidatePath(`/admin/members/${memberId}`);
    revalidatePath("/admin/membership-history");
    return { success: true };
  } catch (error: any) {
    console.error("Error renewing membership:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}

export async function searchMembersAction(query: string) {
  try {
    if (!query || query.trim().length < 2) {
      return { success: true, data: [] };
    }
    const members = await prisma.member.findMany({
      where: {
        isDeleted: false,
        OR: [
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
          { phone: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        gender: true,
        email: true,
        dateOfBirth: true,
        address: true,
        emergencyContact: true,
        emergencyPhone: true,
        notes: true,
      }
    });
    return { success: true, data: members };
  } catch (error: any) {
    console.error("Error searching members:", error);
    return { error: error.message || "Failed to search members" };
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

