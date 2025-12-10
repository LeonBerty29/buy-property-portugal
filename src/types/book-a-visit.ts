import { z } from "zod";

export function getClientBookVisitSchema(t?: (key: string) => string) {
  return z.object({
    first_name: z
      .string()
      .min(1, t ? t("firstNameRequired") : "First name is required")
      .min(2, t ? t("firstNameMinLength") : "First name must be at least 2 characters")
      .max(50, t ? t("firstNameMaxLength") : "First name must be less than 50 characters"),

    last_name: z
      .string()
      .min(1, t ? t("lastNameRequired") : "Last name is required")
      .min(2, t ? t("lastNameMinLength") : "Last name must be at least 2 characters")
      .max(50, t ? t("lastNameMaxLength") : "Last name must be less than 50 characters"),

    phone: z
      .string()
      .min(1, t ? t("phoneRequired") : "Phone number is required")
      .regex(/^[\+]?[\d\s\-\(\)]+$/, t ? t("phoneInvalid") : "Please enter a valid phone number"),

    email: z
      .string()
      .min(1, t ? t("emailRequired") : "Email is required")
      .email(t ? t("emailInvalid") : "Please enter a valid email address"),

    visit_date: z.date({
      required_error: t ? t("dateRequired") : "Date is required",
    }),

    visit_time: z
      .string()
      .min(1, t ? t("visitTimeRequired") : "Visit time is required")
      .regex(/^\d{2}:\d{2}$/, t ? t("timeFormatInvalid") : "Time must be in HH:MM format"),

    additional_text: z.string().optional(),

    property_reference: z
      .string()
      .min(1, t ? t("propertyReferenceRequired") : "The reference for the property is required"),

    accept_terms: z.boolean().refine((val) => val === true, {
      message: t
        ? t("acceptTermsRequired")
        : "You must accept the terms and conditions",
    }),

    source_url: z.string().url().optional().or(z.literal("")),
  });
}

export type BookVisitFormData = z.infer<
  ReturnType<typeof getClientBookVisitSchema>
>;