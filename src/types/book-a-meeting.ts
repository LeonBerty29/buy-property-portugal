import { z } from "zod";

export function getClientBookMeetingSchema(t?: (key: string) => string) {
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
      .min(1, t ? t("emailRequired") : "Email is required")
      .email(t ? t("emailInvalid") : "Please enter a valid email address"),
    meeting_date: z.date({
      required_error: t ? t("dateRequired") : "Date is required",
    }).optional(),
    meeting_time: z.string().min(1, t ? t("timeRequired") : "Time is required"),
    additional_text: z.string().optional(),
    meeting_type: z
      .string()
      .min(1, t ? t("chooseMeetingType") : "Time is required"),
    meeting_location: z.string().min(1, t ? t("locationPlatformRequired") : "Meeting location or platform is required"),
    source_url: z.string().optional(),
    accept_terms: z.boolean().refine((val) => val === true, {
      message: t
        ? t("acceptTermsRequired")
        : "You must accept the terms and conditions",
    }),
  });
}

export type BookMeetingRequest = z.infer<
  ReturnType<typeof getClientBookMeetingSchema>
>;

export type ClientBookMeetingFormData = z.infer<
  ReturnType<typeof getClientBookMeetingSchema>
>;

export interface BookMeetingResponse {
  success: true;
  message: string;
  data: BookMeetingRequest;
}

export interface BookMeetingError {
  error?: string;
  message?: string;
  errors?: {
    [key: string]: string[];
  };
}
