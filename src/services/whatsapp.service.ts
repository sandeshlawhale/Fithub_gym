import { prisma } from "@/lib/prisma";
import { NotificationType, DeliveryStatus } from "@prisma/client";
import { getSettings } from "@/features/settings/actions";

export class WhatsAppService {
  /**
   * Helper to format phone number to include country code (e.g., +91 for India if not present)
   */
  private static formatPhoneNumber(phone: string): string {
    let clean = phone.replace(/\D/g, "");
    // If it's a 10 digit Indian number, prefix with 91
    if (clean.length === 10) {
      clean = "91" + clean;
    }
    return clean;
  }

  /**
   * Internal helper to make the API call to Meta WhatsApp Cloud API
   */
  private static async sendMetaWhatsAppMessage(
    to: string,
    payload: any,
    settings: any
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!settings.whatsappEnabled || !settings.whatsappPhoneId || !settings.whatsappToken) {
      return { success: false, error: "WhatsApp integration is disabled or not fully configured." };
    }

    const phoneId = settings.whatsappPhoneId;
    const token = settings.whatsappToken;
    const url = `https://graph.facebook.com/v19.0/${phoneId}/messages`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to,
          ...payload,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Meta WhatsApp API error:", data);
        return {
          success: false,
          error: data.error?.message || "Unknown error from Meta API",
        };
      }

      return {
        success: true,
        messageId: data.messages?.[0]?.id,
      };
    } catch (err: any) {
      console.error("Failed to send WhatsApp message via Meta API:", err);
      return {
        success: false,
        error: err.message || "Network error",
      };
    }
  }

  /**
   * Send membership payment receipt notification
   */
  static async sendReceipt(memberId: string, membershipId: string): Promise<boolean> {
    try {
      const member = await prisma.member.findUnique({
        where: { id: memberId },
      });
      const membership = await prisma.membership.findUnique({
        where: { id: membershipId },
        include: { membershipPlan: true },
      });

      if (!member || !membership) return false;

      const settings = await getSettings();

      const planName = membership.membershipPlan?.name || membership.customPlanName || "Custom Plan";
      const amount = Number(membership.amount) + Number(membership.registrationFee);
      const startDateStr = membership.startDate.toLocaleDateString("en-IN", { dateStyle: "medium" });
      const endDateStr = membership.endDate.toLocaleDateString("en-IN", { dateStyle: "medium" });

      const messagePreview = `Hi ${member.firstName}, welcome to ${settings.gymName || "The FitHub Gym"}! We have received your payment of ₹${amount}. Your membership for ${planName} is active from ${startDateStr} to ${endDateStr}.`;

      // Log notification as pending
      const log = await prisma.notificationLog.create({
        data: {
          memberId: member.id,
          type: NotificationType.RECEIPT,
          templateName: "fithub_receipt",
          messagePreview,
          deliveryStatus: DeliveryStatus.PENDING,
        },
      });

      if (!settings.whatsappEnabled || !settings.whatsappPhoneId || !settings.whatsappToken) {
        await prisma.notificationLog.update({
          where: { id: log.id },
          data: { deliveryStatus: DeliveryStatus.FAILED },
        });
        return false;
      }

      // Meta Cloud API template payload
      // Template: fithub_receipt
      // Parameters: 1: Name, 2: Gym Name, 3: Amount, 4: Plan Name, 5: Start Date, 6: End Date
      const payload = {
        type: "template",
        template: {
          name: "fithub_receipt",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: member.firstName },
                { type: "text", text: settings.gymName || "The FitHub Gym" },
                { type: "text", text: `₹${amount}` },
                { type: "text", text: planName },
                { type: "text", text: startDateStr },
                { type: "text", text: endDateStr },
              ],
            },
          ],
        },
      };

      const formattedPhone = this.formatPhoneNumber(member.phone);
      const result = await this.sendMetaWhatsAppMessage(formattedPhone, payload, settings);

      await prisma.notificationLog.update({
        where: { id: log.id },
        data: {
          deliveryStatus: result.success ? DeliveryStatus.SENT : DeliveryStatus.FAILED,
        },
      });

      return result.success;
    } catch (error) {
      console.error("Error in sendReceipt:", error);
      return false;
    }
  }

  /**
   * Send membership expiry reminder
   */
  static async sendExpiryReminder(memberId: string, membershipId: string): Promise<boolean> {
    try {
      const member = await prisma.member.findUnique({
        where: { id: memberId },
      });
      const membership = await prisma.membership.findUnique({
        where: { id: membershipId },
        include: { membershipPlan: true },
      });

      if (!member || !membership) return false;

      const settings = await getSettings();

      const planName = membership.membershipPlan?.name || membership.customPlanName || "Custom Plan";
      const endDateStr = membership.endDate.toLocaleDateString("en-IN", { dateStyle: "medium" });

      const messagePreview = `Hi ${member.firstName}, this is a reminder that your membership for ${planName} at ${settings.gymName || "The FitHub Gym"} is expiring on ${endDateStr}. Please renew soon to continue your workouts!`;

      const log = await prisma.notificationLog.create({
        data: {
          memberId: member.id,
          type: NotificationType.EXPIRY_REMINDER,
          templateName: "fithub_expiry",
          messagePreview,
          deliveryStatus: DeliveryStatus.PENDING,
        },
      });

      if (!settings.whatsappEnabled || !settings.whatsappPhoneId || !settings.whatsappToken) {
        await prisma.notificationLog.update({
          where: { id: log.id },
          data: { deliveryStatus: DeliveryStatus.FAILED },
        });
        return false;
      }

      // Meta Cloud API template payload
      // Template: fithub_expiry
      // Parameters: 1: Name, 2: Plan Name, 3: Gym Name, 4: Expiry Date
      const payload = {
        type: "template",
        template: {
          name: "fithub_expiry",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: member.firstName },
                { type: "text", text: planName },
                { type: "text", text: settings.gymName || "The FitHub Gym" },
                { type: "text", text: endDateStr },
              ],
            },
          ],
        },
      };

      const formattedPhone = this.formatPhoneNumber(member.phone);
      const result = await this.sendMetaWhatsAppMessage(formattedPhone, payload, settings);

      await prisma.notificationLog.update({
        where: { id: log.id },
        data: {
          deliveryStatus: result.success ? DeliveryStatus.SENT : DeliveryStatus.FAILED,
        },
      });

      return result.success;
    } catch (error) {
      console.error("Error in sendExpiryReminder:", error);
      return false;
    }
  }

  /**
   * Broadcast a manual text message to multiple members
   */
  static async sendBroadcast(memberIds: string[], message: string): Promise<{ sent: number; failed: number }> {
    const settings = await getSettings();

    let sent = 0;
    let failed = 0;

    for (const id of memberIds) {
      try {
        const member = await prisma.member.findUnique({ where: { id } });
        if (!member) {
          failed++;
          continue;
        }

        // Log notification as pending
        const log = await prisma.notificationLog.create({
          data: {
            memberId: id,
            type: NotificationType.BROADCAST,
            messagePreview: message,
            deliveryStatus: DeliveryStatus.PENDING,
          },
        });

        if (!settings.whatsappEnabled || !settings.whatsappPhoneId || !settings.whatsappToken) {
          await prisma.notificationLog.update({
            where: { id: log.id },
            data: { deliveryStatus: DeliveryStatus.FAILED },
          });
          failed++;
          continue;
        }

        // For manual broadcasts, we use plain text body (requires customer support window or template depending on Meta status,
        // but text is standard for custom broadcasts).
        const payload = {
          type: "text",
          text: { body: message },
        };

        const formattedPhone = this.formatPhoneNumber(member.phone);
        const result = await this.sendMetaWhatsAppMessage(formattedPhone, payload, settings);

        await prisma.notificationLog.update({
          where: { id: log.id },
          data: {
            deliveryStatus: result.success ? DeliveryStatus.SENT : DeliveryStatus.FAILED,
          },
        });

        if (result.success) {
          sent++;
        } else {
          failed++;
        }
      } catch (err) {
        console.error(`Failed to send broadcast to member ${id}:`, err);
        failed++;
      }
    }

    return { sent, failed };
  }

  /**
   * Get notification logs
   */
  static async getLogs({
    page = 1,
    limit = 15,
    search = "",
    type = "",
  }) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (type) {
      where.type = type as NotificationType;
    }

    if (search) {
      const trimmedSearch = search.trim();
      const parts = trimmedSearch.split(/\s+/);
      let memberOrConditions: any[] = [
        { firstName: { contains: trimmedSearch, mode: "insensitive" } },
        { lastName: { contains: trimmedSearch, mode: "insensitive" } },
        { phone: { contains: trimmedSearch, mode: "insensitive" } },
      ];

      if (parts.length >= 2) {
        const firstPart = parts[0];
        const lastPart = parts.slice(1).join(" ");
        const reverseFirstPart = parts[parts.length - 1];
        const reverseLastPart = parts.slice(0, parts.length - 1).join(" ");

        memberOrConditions.push(
          {
            AND: [
              { firstName: { contains: firstPart, mode: "insensitive" } },
              { lastName: { contains: lastPart, mode: "insensitive" } },
            ],
          },
          {
            AND: [
              { firstName: { contains: reverseLastPart, mode: "insensitive" } },
              { lastName: { contains: reverseFirstPart, mode: "insensitive" } },
            ],
          }
        );
      }

      where.OR = [
        {
          member: {
            OR: memberOrConditions,
          },
        },
        {
          messagePreview: { contains: search, mode: "insensitive" },
        },
      ];
    }

    const [data, total] = await prisma.$transaction([
      prisma.notificationLog.findMany({
        where,
        orderBy: { sentAt: "desc" },
        skip,
        take: limit,
        include: {
          member: true,
        },
      }),
      prisma.notificationLog.count({ where }),
    ]);

    return {
      data: data.map(log => ({
        id: log.id,
        memberId: log.memberId,
        memberName: `${log.member.firstName} ${log.member.lastName}`,
        memberPhone: log.member.phone,
        type: log.type,
        templateName: log.templateName,
        messagePreview: log.messagePreview,
        deliveryStatus: log.deliveryStatus,
        sentAt: log.sentAt,
      })),
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
