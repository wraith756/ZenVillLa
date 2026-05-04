import * as z from "zod";
import { PropertyTypeEnum } from "@/lib/constants";

/* ---------------- Shared Helpers ---------------- */

const nonEmptyString = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

const positiveInt = (label: string) =>
  z.coerce
    .number({
      invalid_type_error: `${label} must be a number`,
    })
    .int(`${label} must be an integer`)
    .min(0, `${label} must be at least 0`);

/* ---------------- Property Schema ---------------- */

export const propertySchema = z.object({
  name: nonEmptyString("Name").max(100),
  description: nonEmptyString("Description").max(2000),

  pricePerMonth: positiveInt("Price per month"),
  securityDeposit: positiveInt("Security deposit"),
  applicationFee: positiveInt("Application fee"),

  isPetsAllowed: z.boolean(),
  isParkingIncluded: z.boolean(),

  photoUrls: z
    .array(
      z.custom<File>((file) => file instanceof File, {
        message: "Invalid file upload",
      })
    )
    .min(1, "At least one photo is required")
    .max(10, "Maximum 10 photos allowed"),

  // ✅ Correct data modeling
  amenities: z.array(z.string()).min(1, "Select at least one amenity"),
  highlights: z.array(z.string()).min(1, "Select at least one highlight"),

  beds: z.coerce.number().int().min(0).max(10),
  baths: z.coerce.number().int().min(0).max(10),

  squareFeet: z.coerce.number().int().min(100).max(100_000),

  propertyType: z.nativeEnum(PropertyTypeEnum),

  address: nonEmptyString("Address").max(255),
  city: nonEmptyString("City").max(100),
  state: nonEmptyString("State").max(100),
  country: nonEmptyString("Country").max(100),
  postalCode: nonEmptyString("Postal code").max(20),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

/* ---------------- Application Schema ---------------- */

export const applicationSchema = z.object({
  name: nonEmptyString("Name").max(100),

  email: z.string().trim().email("Invalid email address"),

  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number"),

  message: z.string().trim().max(1000).optional(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

/* ---------------- Settings Schema ---------------- */

export const settingsSchema = z.object({
  name: nonEmptyString("Name").max(100),

  email: z.string().trim().email("Invalid email address"),

  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number"),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
