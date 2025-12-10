import { z } from "zod";

export function getPartnershipFormSchema(t?: (key: string) => string) {
  return z.object({
    company_name: z
      .string()
      .min(1, t ? t("companyNameRequired") : "Company name is required")
      .min(2, t ? t("companyNameMinLength") : "Company name must be at least 2 characters")
      .max(100, t ? t("companyNameMaxLength") : "Company name must be less than 100 characters"),

    company_email: z
      .string()
      .min(1, t ? t("companyEmailRequired") : "Company email is required")
      .email(t ? t("companyEmailInvalid") : "Please enter a valid company email address"),

    company_phone: z
      .string()
      .min(1, t ? t("companyPhoneRequired") : "Company phone is required")
      .regex(/^[\+]?[\d\s\-\(\)]+$/, t ? t("companyPhoneInvalid") : "Please enter a valid phone number"),

    contact_person: z
      .string()
      .min(1, t ? t("contactPersonRequired") : "Contact person is required")
      .min(2, t ? t("contactPersonMinLength") : "Contact person must be at least 2 characters")
      .max(100, t ? t("contactPersonMaxLength") : "Contact person must be less than 100 characters"),

    client_first_name: z
      .string()
      .min(1, t ? t("clientFirstNameRequired") : "Client first name is required")
      .min(2, t ? t("clientFirstNameMinLength") : "Client first name must be at least 2 characters")
      .max(50, t ? t("clientFirstNameMaxLength") : "Client first name must be less than 50 characters"),

    client_last_name: z
      .string()
      .min(1, t ? t("clientLastNameRequired") : "Client last name is required")
      .min(2, t ? t("clientLastNameMinLength") : "Client last name must be at least 2 characters")
      .max(50, t ? t("clientLastNameMaxLength") : "Client last name must be less than 50 characters"),

    partial_client_email: z
      .string()
      .min(1, t ? t("partialClientEmailRequired") : "Partial client email is required")
      .min(3, t ? t("partialClientEmailMinLength") : "Partial client email must be at least 3 characters")
      .max(100, t ? t("partialClientEmailMaxLength") : "Partial client email must be less than 100 characters"),

    partial_client_phone: z
      .string()
      .min(1, t ? t("partialClientPhoneRequired") : "Partial client phone is required")
      .regex(/^[\+]?[\d\s\-\(\)]+$/, t ? t("partialClientPhoneInvalid") : "Please enter a valid phone number"),

    interested_property: z
      .string()
      .min(1, t ? t("interestedPropertyRequired") : "Interested property is required")
      .max(1000, t ? t("interestedPropertyMaxLength") : "Interested property must be less than 1000 characters")
      .optional(),

    remarks: z
      .string()
      .min(1, t ? t("remarksRequired") : "Remarks is required")
      .max(1000, t ? t("remarksMaxLength") : "Remarks must be less than 1000 characters")
      .optional(),

    confirmed_visit_date: z.date({
      required_error: t ? t("visitDateRequired") : "Visit Date is required",
    }).optional(),

    confirmed_visit_time: z.string().optional(),

    accept_terms: z.boolean().refine((val) => val === true, {
      message: t
        ? t("acceptTermsRequired")
        : "You must accept the terms and conditions",
    }),

    source_url: z.string().url().optional(),
  });
}

export type PartnershipFormData = z.infer<
  ReturnType<typeof getPartnershipFormSchema>
>;

export interface PartnershipFormResponse {
  success: true;
  message: string;
  data: PartnershipFormData;
}

export interface PartnershipFormError {
  error?: string;
  message?: string;
  errors?: {
    [key: string]: string[];
  };
}