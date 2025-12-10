import { z } from "zod";

// Client-side validation schema with translations
export function getClientContactAgentSchema(t?: (key: string) => string) {
  return z.object({
    first_name: z
      .string()
      .min(1, t ? t("firstNameRequired") : "First name is required"),

    last_name: z
      .string()
      .min(1, t ? t("lastNameRequired") : "Last name is required"),

    phone: z
      .string()
      .min(1, t ? t("phoneRequired") : "Phone number is required"),

    email: z
      .string()
      .email(t ? t("emailInvalid") : "Please enter a valid email address"),

    message: z.string().optional(),

    primary_contact_channel: z
      .enum(["Email", "Phone", "Whatsapp", "SMS"], {
        required_error: t
          ? t("primaryContactChannelRequired")
          : "Please select a primary contact channel",
        invalid_type_error: t
          ? t("primaryContactChannelInvalid")
          : "Please select a valid primary contact channel",
        message: t
          ? t("primaryContactChannelInvalid")
          : "Please select a valid primary contact channel",
      })
      .optional(),

    accept_terms: z.boolean().refine((val) => val === true, {
      message: t
        ? t("acceptTermsRequired")
        : "You must accept the terms and conditions",
    }),

    source_url: z.string().optional(),
  });
}

// Type definitions
export type ContactAgentFormData = z.infer<
  ReturnType<typeof getClientContactAgentSchema>
>;

// API Response types
export interface ContactAgentResponse {
  success: boolean;
  message: string;
  data: ContactAgentFormData;
}

export interface ContactAgentError {
  error?: string;
  message?: string;
  errors?: { [key: string]: string[] };
}
