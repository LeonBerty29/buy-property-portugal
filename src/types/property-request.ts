import { z } from "zod";

export function getPropertyFormSchema(t?: (key: string) => string) {
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

    property_types: z
      .string()
      .min(
        1,
        t
          ? t("propertyTypesRequired")
          : "At least one property type is required"
      ),

    budget_min: z
      .string()
      .min(1, t ? t("budgetMinRequired") : "Minimum budget is required"),

    budget_max: z
      .string()
      .min(1, t ? t("budgetMaxRequired") : "Maximum budget is required"),

    location: z
      .string()
      .min(1, t ? t("locationRequired") : "Location is required"),

    bedrooms_min: z
      .number()
      .min(0, t ? t("bedroomsMinRequired") : "Minimum bedrooms is required"),

    bedrooms_max: z
      .number()
      .min(0, t ? t("bedroomsMaxRequired") : "Maximum bedrooms is required"),

    bathrooms_min: z
      .number()
      .min(0, t ? t("bathroomsMinRequired") : "Minimum bathrooms is required"),

    bathrooms_max: z
      .number()
      .min(0, t ? t("bathroomsMaxRequired") : "Maximum bathrooms is required"),

    with_pool: z.boolean(),

    with_garage: z.boolean(),

    additional_text: z.string().optional(),

    source_url: z
      .string()
      .url()
      .min(1, t ? t("sourceUrlRequired") : "Source URL is required"),

    consent: z.boolean().refine((val) => val === true, {
      message: t
        ? t("consentRequired")
        : "You must authorize us to contact you",
    }),
  });
}

export type PropertyFormData = z.infer<
  ReturnType<typeof getPropertyFormSchema>
>;

export interface PropertyFormResponse {
  success: true;
  message: string;
  data: PropertyFormData;
}

export interface PropertyFormError {
  error?: string;
  message?: string;
  errors?: {
    [key: string]: string[];
  };
}

// export const stepOneSchema = z.object({
// first_name: z.string().min(1, "First name is required"),
// last_name: z.string().min(1, "Last name is required"),
// phone: z.string().min(1, "Phone number is required"),
// email: z
//     .string()
//     .min(1, "Email is required")
//     .email("Please enter a valid email address"),
// consent: z.boolean().refine((val) => val === true, {
//     message: "You must authorize us to contact you",
// }),
// });

// export const stepTwoBaseSchema = z.object({
// property_types: z
//     .array(z.string())
//     .min(1, "At least one property type is required"),
// budget_min: z.string().min(1, "Minimum budget is required"),
// budget_max: z.string().min(1, "Maximum budget is required"),
// location: z.string().min(1, "Location is required"),
// bedrooms_min: z.number().min(0, "Minimum bedrooms is required"),
// bedrooms_max: z.number().min(0, "Maximum bedrooms is required"),
// bathrooms_min: z.number().min(0, "Minimum bathrooms is required"),
// bathrooms_max: z.number().min(0, "Maximum bathrooms is required"),
// with_pool: z.boolean(),
// with_garage: z.boolean(),
// });

// export const stepThreeSchema = z.object({
// additional_text: z.string().optional(),
// source_url: z.string().min(1, "Source URL is required"),
// });

// // Main client schema - all fields required except additional_text
// export const clientPropertyFormSchema = z.object({
// first_name: z.string().min(1, "First name is required"),
// last_name: z.string().min(1, "Last name is required"),
// phone: z.string().min(1, "Phone number is required"),
// email: z
//     .string()
//     .min(1, "Email is required")
//     .email("Please enter a valid email address"),
// property_types: z
//     .array(z.string())
//     .min(1, "At least one property type is required"),
// budget_min: z.string().min(1, "Minimum budget is required"),
// budget_max: z.string().min(1, "Maximum budget is required"),
// location: z.string().min(1, "Location is required"),
// bedrooms_min: z.number().min(0, "Minimum bedrooms is required"),
// bedrooms_max: z.number().min(0, "Maximum bedrooms is required"),
// bathrooms_min: z.number().min(0, "Minimum bathrooms is required"),
// bathrooms_max: z.number().min(0, "Maximum bathrooms is required"),
// with_pool: z.boolean(),
// with_garage: z.boolean(),
// additional_text: z.string().optional(),
// source_url: z.string().min(1, "Source URL is required"),
// consent: z.boolean().refine((val) => val === true, {
//     message: "You must authorize us to contact you",
// }),
// });

// export type ClientPropertyFormData = z.infer<typeof clientPropertyFormSchema>;
