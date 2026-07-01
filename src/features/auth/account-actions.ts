"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

// Initialize Resend client only if API key is present to prevent crashes on startup/import in environments where the key is not defined.
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one special character.";
  return null;
}

export async function getAccountInfoAction() {
  try {
    const session = await auth();
    if (!session?.user?.email) return { error: "Not authenticated." };

    const admin = await prisma.admin.findUnique({
      where: { email: session.user.email },
      select: { email: true, name: true, lastLoginAt: true, createdAt: true },
    });

    if (!admin) return { error: "Admin account not found." };

    return {
      success: true,
      data: {
        email: admin.email,
        name: admin.name,
        lastLoginAt: admin.lastLoginAt?.toISOString() ?? null,
        createdAt: admin.createdAt.toISOString(),
      },
    };
  } catch (err: any) {
    return { error: err.message || "Failed to load account info." };
  }
}

export async function changePasswordAction(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.email) return { error: "Not authenticated." };

    if (data.newPassword !== data.confirmPassword) return { error: "New passwords do not match." };

    const validationError = validatePassword(data.newPassword);
    if (validationError) return { error: validationError };

    const admin = await prisma.admin.findUnique({ where: { email: session.user.email } });
    if (!admin) return { error: "Admin account not found." };

    const isCurrentValid = await bcrypt.compare(data.currentPassword, admin.passwordHash);
    if (!isCurrentValid) return { error: "Current password is incorrect." };

    const newHash = await bcrypt.hash(data.newPassword, 12);
    await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash: newHash } });

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to change password." };
  }
}

export async function sendForgotPasswordOtpAction(email: string) {
  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || !admin.isActive) {
      return { success: true }; // silent — do not reveal if email exists
    }

    await prisma.adminOtp.updateMany({
      where: { email, used: false },
      data: { used: true },
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.adminOtp.create({ data: { email, otpHash, expiresAt } });

    if (!resend) {
      console.error("Resend API key is missing. Cannot send password reset OTP.");
      return { error: "Email delivery service is not configured on this server." };
    }

    await resend.emails.send({
      from: "FitHub Admin <onboarding@resend.dev>",
      to: email,
      subject: "Your FitHub Admin Password Reset OTP",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#111;color:#fff;padding:32px;border-radius:12px;border:1px solid #333;">
          <h2 style="color:#C9A84C;margin-bottom:8px;">Password Reset OTP</h2>
          <p style="color:#aaa;margin-bottom:24px;">Use the code below to reset your FitHub Admin password. It expires in <strong style="color:#fff">10 minutes</strong>.</p>
          <div style="background:#1a1a1a;border:1px solid rgba(201,168,76,0.2);border-radius:8px;padding:24px;text-align:center;margin-bottom:24px;">
            <span style="font-size:40px;font-weight:900;letter-spacing:12px;color:#C9A84C;">${otp}</span>
          </div>
          <p style="color:#666;font-size:12px;">If you did not request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    return { success: true };
  } catch (err: any) {
    console.error("Error sending OTP:", err);
    return { error: err.message || "Failed to send OTP." };
  }
}

export async function verifyOtpAndResetPasswordAction(data: {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}) {
  try {
    if (data.newPassword !== data.confirmPassword) return { error: "Passwords do not match." };

    const validationError = validatePassword(data.newPassword);
    if (validationError) return { error: validationError };

    const otpRecord = await prisma.adminOtp.findFirst({
      where: { email: data.email, used: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) return { error: "OTP is invalid or has expired." };

    const isOtpValid = await bcrypt.compare(data.otp, otpRecord.otpHash);
    if (!isOtpValid) return { error: "Incorrect OTP. Please try again." };

    await prisma.adminOtp.update({ where: { id: otpRecord.id }, data: { used: true } });

    const admin = await prisma.admin.findUnique({ where: { email: data.email } });
    if (!admin) return { error: "Admin account not found." };

    const newHash = await bcrypt.hash(data.newPassword, 12);
    await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash: newHash } });

    return { success: true };
  } catch (err: any) {
    console.error("Error verifying OTP:", err);
    return { error: err.message || "Failed to reset password." };
  }
}

export async function changeEmailAction(data: {
  newEmail: string;
  passwordConfirm: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.email) return { error: "Not authenticated." };

    const newEmail = data.newEmail.trim().toLowerCase();
    if (!newEmail || !newEmail.includes("@")) {
      return { error: "Please enter a valid email address." };
    }

    const admin = await prisma.admin.findUnique({ where: { email: session.user.email } });
    if (!admin) return { error: "Admin account not found." };

    const isPasswordValid = await bcrypt.compare(data.passwordConfirm, admin.passwordHash);
    if (!isPasswordValid) return { error: "Incorrect password." };

    // Check if duplicate email
    if (newEmail !== admin.email) {
      const existing = await prisma.admin.findUnique({ where: { email: newEmail } });
      if (existing) return { error: "This email address is already registered." };
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: { email: newEmail },
    });

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to update email." };
  }
}
