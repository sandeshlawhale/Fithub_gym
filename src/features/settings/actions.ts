"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { DEFAULT_SETTINGS } from "./defaults";


export async function getSettings() {
  try {
    const settings = await prisma.settings.findFirst();
    if (!settings) return DEFAULT_SETTINGS;

    return {
      id: settings.id,
      gymName: settings.gymName || DEFAULT_SETTINGS.gymName,
      addressLine1: settings.addressLine1 || DEFAULT_SETTINGS.addressLine1,
      addressLine2: settings.addressLine2 || DEFAULT_SETTINGS.addressLine2,
      addressLine3: settings.addressLine3 || DEFAULT_SETTINGS.addressLine3,
      phoneNo: settings.phoneNo || DEFAULT_SETTINGS.phoneNo,
      registrationFee: settings.registrationFee ? Number(settings.registrationFee) : DEFAULT_SETTINGS.registrationFee,
      expiryReminderDays: settings.expiryReminderDays !== null && settings.expiryReminderDays !== undefined ? settings.expiryReminderDays : DEFAULT_SETTINGS.expiryReminderDays,
      socialInstagram: settings.socialInstagram || DEFAULT_SETTINGS.socialInstagram,
      socialWhatsapp: settings.socialWhatsapp || DEFAULT_SETTINGS.socialWhatsapp,
      socialGoogleMaps: settings.socialGoogleMaps || DEFAULT_SETTINGS.socialGoogleMaps,
      socialEmail: settings.socialEmail || DEFAULT_SETTINGS.socialEmail,
      whatsappEnabled: settings.whatsappEnabled ?? DEFAULT_SETTINGS.whatsappEnabled,
      whatsappPhoneId: settings.whatsappPhoneId,
      whatsappToken: settings.whatsappToken,
      businessId: settings.businessId,
      timezone: settings.timezone || DEFAULT_SETTINGS.timezone,
    };
  } catch (error) {
    console.error("Error reading settings from DB, using fallback:", error);
    return DEFAULT_SETTINGS;
  }
}

const settingsSchema = z.object({
  gymName: z.string().min(1, "Gym name is required").trim(),
  addressLine1: z.string().trim().default(""),
  addressLine2: z.string().trim().default(""),
  addressLine3: z.string().trim().default(""),
  phoneNo: z.string().trim().default(""),
  registrationFee: z.coerce.number().min(0, "Registration fee cannot be negative"),
  expiryReminderDays: z.coerce.number().int().min(1, "Expiry reminder days must be at least 1"),
  socialInstagram: z.string().nullable().optional().transform(v => v === "" ? null : v),
  socialWhatsapp: z.string().nullable().optional().transform(v => v === "" ? null : v),
  socialGoogleMaps: z.string().nullable().optional().transform(v => v === "" ? null : v),
  socialEmail: z.string().nullable().optional().transform(v => v === "" ? null : v),
  whatsappEnabled: z.boolean().default(false),
  whatsappPhoneId: z.string().nullable().optional().transform(v => v === "" ? null : v),
  whatsappToken: z.string().nullable().optional().transform(v => v === "" ? null : v),
  businessId: z.string().nullable().optional().transform(v => v === "" ? null : v),
  timezone: z.string().trim().default("Asia/Kolkata"),
});


export async function getSettingsAction() {
  try {
    const data = await getSettings();
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error("Error fetching settings action:", error);
    return { error: error.message || "Failed to fetch settings." };
  }
}

export async function updateSettingsAction(data: any) {
  try {
    console.log("[Settings] Incoming save data:", JSON.stringify(data, null, 2));
    const validated = settingsSchema.parse(data);
    console.log("[Settings] Validated data:", JSON.stringify(validated, null, 2));
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      await prisma.settings.create({
        data: validated,
      });
    } else {
      await prisma.settings.update({
        where: { id: settings.id },
        data: validated,
      });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/gallery");
    revalidatePath("/memberships");
    revalidatePath("/testimonials/submit");
    return { success: true };
  } catch (error: any) {
    console.error("[Settings] Error updating settings:", error);
    // Return the first Zod validation error in a friendly format
    if (error?.errors?.length) {
      const firstErr = error.errors[0];
      return { error: `${firstErr.path.join(".")}: ${firstErr.message}` };
    }
    return { error: error.message || "Failed to update settings." };
  }
}
