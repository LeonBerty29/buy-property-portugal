import { z } from "zod";

export function getNewsletterFormSchema(t?: (key: string) => string) {
  return z.object({
    email: z
      .string()
      .min(1, t ? t("emailRequired") : "Email is required")
      .email(t ? t("emailInvalid") : "Please enter a valid email address"),

    source_url: z.string().url().optional(),
  });
}

export type NewsletterFormData = z.infer<
  ReturnType<typeof getNewsletterFormSchema>
>;

export interface NewsletterFormResponse {
  success: true;
  message: string;
  data: NewsletterFormData;
}

export interface NewsletterFormError {
  error?: string;
  message?: string;
  errors?: {
    [key: string]: string[];
  };
}