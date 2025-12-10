import { z } from "zod";

export function getRequestFloorPlanSchema(t?: (key: string) => string) {
  return z.object({
    first_name: z
      .string()
      .min(1, t ? t("nameRequired") : "Name is required")
      .min(2, t ? t("nameMinLength") : "Name must be at least 2 characters"),
    last_name: z
      .string()
      .min(1, t ? t("nameRequired") : "Name is required")
      .min(2, t ? t("nameMinLength") : "Name must be at least 2 characters"),
    //   .max(
    //     100,
    //     t
    //       ? t("nameMaxLength")
    //       : "Name must be at most 100 characters"
    //   ),

    email: z
      .string()
      .min(1, t ? t("emailRequired") : "Email is required")
      .email(t ? t("emailInvalid") : "Please enter a valid email address"),
    source_url: z.string().url().optional(),
    property_reference: z.string().optional(),
    phone: z
      .string()
      .min(1, t ? t("phoneRequired") : "Phone number is required")
  });
}

export type RequestFloorPlanData = z.infer<
  ReturnType<typeof getRequestFloorPlanSchema>
>;

export interface RequestFloorPlanResponse {
  success: true;
  message: string;
  data: RequestFloorPlanData;
}

export interface RequestFloorPlanError {
  error?: string;
  message?: string;
  errors?: {
    [key: string]: string[];
  };
}
