"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

// Input sanitization: strips HTML tags to prevent XSS
function sanitizeText(text: string): string {
  return text.replace(/<[^>]*>/g, "").trim();
}

// Zod Schema for validation
const submitTestimonialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be 100 characters or less").trim(),
  email: z.string().email("Invalid email address").trim(),
  rating: z.coerce.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  review: z.string().min(10, "Testimonial must be at least 10 characters").max(500, "Testimonial must be 500 characters or less").trim(),
  consent: z.boolean().refine((val) => val === true, "Consent is required to submit"),
});

export async function submitTestimonialAction(data: any) {
  try {
    const validated = submitTestimonialSchema.parse(data);

    // Sanitize fields
    const sanitizedName = sanitizeText(validated.name);
    const sanitizedReview = sanitizeText(validated.review);

    if (!sanitizedName || !sanitizedReview) {
      return { error: "Invalid submission content." };
    }

    // Spam prevention: Check if same email has submitted a review in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentSubmission = await prisma.testimonial.findFirst({
      where: {
        email: validated.email,
        createdAt: { gte: fiveMinutesAgo },
      },
    });

    if (recentSubmission) {
      return { error: "You have recently submitted a testimonial. Please wait a few minutes before trying again." };
    }

    // Save to database as pending (isApproved = false)
    await prisma.testimonial.create({
      data: {
        name: sanitizedName,
        email: validated.email,
        rating: validated.rating,
        review: sanitizedReview,
        consent: validated.consent,
        isApproved: false,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error submitting testimonial:", error);
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Validation failed." };
    }
    return { error: error.message || "An unexpected error occurred." };
  }
}

export async function approveTestimonialAction(id: string) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { error: "Unauthorized access." };
    }

    await prisma.testimonial.update({
      where: { id },
      data: { isApproved: true },
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error: any) {
    console.error("Error approving testimonial:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}

export async function unapproveTestimonialAction(id: string) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { error: "Unauthorized access." };
    }

    await prisma.testimonial.update({
      where: { id },
      data: { isApproved: false },
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error: any) {
    console.error("Error unapproving testimonial:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}

export async function deleteTestimonialAction(id: string) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { error: "Unauthorized access." };
    }

    await prisma.testimonial.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting testimonial:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}
