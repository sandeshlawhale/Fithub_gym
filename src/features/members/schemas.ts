import { z } from "zod";
import { Gender, PaymentMethod } from "@prisma/client";

// Shared profile fields used across schemas
const memberProfileFields = {
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
  phone: z
    .string()
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      "Please enter a valid phone number (e.g. +919876543210)"
    )
    .min(10, "Phone number must be at least 10 digits"),
  gender: z.nativeEnum(Gender),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  dateOfBirth: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  notes: z.string().optional(),
  avatarUrl: z.string().optional(),
};

export const createSingleMemberSchema = z.object({
  ...memberProfileFields,
  existingMemberId: z.string().uuid().optional().or(z.literal("")),
  membershipPlanId: z
    .string()
    .uuid("Invalid plan selected")
    .optional()
    .or(z.literal("")),
  customPlanName: z.string().optional(),
  amount: z.coerce.number().min(0, "Amount cannot be negative"),
  registrationFee: z.coerce
    .number()
    .min(0, "Registration fee cannot be negative"),
  paymentMethod: z.nativeEnum(PaymentMethod),
  paymentReference: z.string().optional(),
  startDate: z.string().transform((v) => new Date(v)),
  endDate: z.string().transform((v) => new Date(v)),
  remarks: z.string().optional(),
});

export const createCoupleMemberSchema = z.object({
  memberOne: z.object({
    firstName: z.string().min(1, "First name is required").trim(),
    lastName: z.string().min(1, "Last name is required").trim(),
    phone: z.string().min(10, "Phone must be at least 10 digits"),
    gender: z.nativeEnum(Gender),
    email: z
      .string()
      .email("Invalid email")
      .optional()
      .or(z.literal("")),
    dateOfBirth: z
      .string()
      .optional()
      .transform((v) => (v ? new Date(v) : undefined)),
    address: z.string().optional(),
  }),
  memberTwo: z.object({
    firstName: z.string().min(1, "First name is required").trim(),
    lastName: z.string().min(1, "Last name is required").trim(),
    phone: z.string().min(10, "Phone must be at least 10 digits"),
    gender: z.nativeEnum(Gender),
    email: z
      .string()
      .email("Invalid email")
      .optional()
      .or(z.literal("")),
    dateOfBirth: z
      .string()
      .optional()
      .transform((v) => (v ? new Date(v) : undefined)),
    address: z.string().optional(),
  }),
  existingMemberId: z.string().uuid().optional().or(z.literal("")),
  existingPartnerId: z.string().uuid().optional().or(z.literal("")),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  notes: z.string().optional(),

  membershipPlanId: z
    .string()
    .uuid("Invalid plan")
    .optional()
    .or(z.literal("")),
  customPlanName: z.string().optional(),
  amount: z.coerce.number().min(0, "Amount cannot be negative"),
  registrationFee: z.coerce
    .number()
    .min(0, "Registration fee cannot be negative"),
  paymentMethod: z.nativeEnum(PaymentMethod),
  paymentReference: z.string().optional(),
  startDate: z.string().transform((v) => new Date(v)),
  endDate: z.string().transform((v) => new Date(v)),
  remarks: z.string().optional(),
});

export const updateMemberSchema = z.object({
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  gender: z.nativeEnum(Gender),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  dateOfBirth: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  notes: z.string().optional(),
  avatarUrl: z.string().optional(),
});
