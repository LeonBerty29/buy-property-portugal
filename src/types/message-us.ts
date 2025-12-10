import { z } from "zod";

export function getMessageFormSchema(t?: (key: string) => string) {
  return z.object({
    first_name: z
      .string()
      .min(1, t ? t("firstNameRequired") : "First name is required")
      .min(
        2,
        t ? t("firstNameMinLength") : "First name must be at least 2 characters"
      )
      .max(
        70,
        t
          ? t("firstNameMaxLength")
          : "First name must be less than 70 characters"
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

    source_url: z.string().url().optional(),
  });
}

export type MessageFormData = z.infer<ReturnType<typeof getMessageFormSchema>>;

export interface MessageFormResponse {
  success: true;
  message: string;
  data: MessageFormData;
}

export interface MessageFormError {
  error?: string;
  message?: string;
  errors?: {
    [key: string]: string[];
  };
}
