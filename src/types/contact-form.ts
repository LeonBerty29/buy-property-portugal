import { z } from "zod";

// Client-side validation schema with translations
export function getClientContactFormSchema(t?: (key: string) => string) {
  return z.object({
    first_name: z
      .string()
      .min(1, t ? t("firstNameRequired") : "First name is required")
      .min(
        2,
        t ? t("firstNameMinLength") : "First name must be at least 2 characters"
      )
      .max(
        50,
        t
          ? t("firstNameMaxLength")
          : "First name must be less than 50 characters"
      ),

    last_name: z
      .string()
      .min(1, t ? t("lastNameRequired") : "Last name is required")
      .min(
        2,
        t ? t("lastNameMinLength") : "Last name must be at least 2 characters"
      )
      .max(
        50,
        t ? t("lastNameMaxLength") : "Last name must be less than 50 characters"
      ),

    phone: z
      .string()
      .min(1, t ? t("phoneRequired") : "Phone number is required")
      .regex(
        /^[\+]?[\d\s\-\(\)]+$/,
        t ? t("phoneInvalid") : "Please enter a valid phone number"
      ),

    email: z
      .string()
      .min(1, t ? t("emailRequired") : "Email is required")
      .email(t ? t("emailInvalid") : "Please enter a valid email address"),

    message: z
      .string()
      .min(1, t ? t("messageRequired") : "Message is required")
      .min(
        10,
        t ? t("messageMinLength") : "Message must be at least 10 characters"
      )
      .max(
        500,
        t ? t("messageMaxLength") : "Message must be less than 500 characters"
      ),

    accept_terms: z.boolean().refine((val) => val === true, {
      message: t
        ? t("acceptTermsRequired")
        : "You must accept the terms and conditions",
    }),

    source_url: z.string().url().optional().or(z.literal("")),
  });
}

export type ContactFormData = z.infer<
  ReturnType<typeof getClientContactFormSchema>
>;

export interface ContactFormResponse {
  success: true;
  message: string;
  data: ContactFormData;
}

export interface ContactFormError {
  error?: string;
  message?: string;
  errors?: {
    [key: string]: string[];
  };
}
