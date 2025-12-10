import * as z from "zod";

export function getLoginSchema(t?: (key: string) => string) {
  return z.object({
    email: z
      .string()
      .min(1, t ? t("emailRequired") : "Email is required")
      .email(t ? t("emailInvalid") : "Please enter a valid email address"),
    password: z
      .string()
      .min(1, t ? t("passwordRequired") : "Password is required")
      .min(
        8,
        t ? t("passwordMinLength") : "Password must be at least 8 characters"
      ),
  });
}

export function getRegisterSchema(t?: (key: string) => string) {
  return z
    .object({
      email: z
        .string()
        .min(1, t ? t("emailRequired") : "Email is required")
        .email(t ? t("emailInvalid") : "Please enter a valid email address"),
      password: z
        .string()
        .min(1, t ? t("passwordRequired") : "Password is required")
        .min(
          8,
          t ? t("passwordMinLength") : "Password must be at least 8 characters"
        ),
      password_confirmation: z
        .string()
        .min(
          1,
          t
            ? t("passwordConfirmationRequired")
            : "Password confirmation is required"
        ),
      first_name: z
        .string()
        .min(1, t ? t("firstNameRequired") : "First name is required"),
      last_name: z
        .string()
        .min(1, t ? t("lastNameRequired") : "Last name is required"),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t ? t("passwordsDontMatch") : "Passwords don't match",
      path: ["password_confirmation"],
    });
}

export function getUserProfileSchema(t?: (key: string) => string) {
  return z.object({
    first_name: z
      .string()
      .min(1, t ? t("firstNameRequired") : "First name is required"),
    last_name: z
      .string()
      .min(1, t ? t("lastNameRequired") : "Last name is required"),
    phone_number: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 1, {
        message: t
          ? t("phoneMinLength")
          : "Phone number must be at least 10 digits",
      }),
    newsletter: z.boolean().optional(),
  });
}

export function getResetPasswordPageSearchParamsSchema(
  t?: (key: string) => string
) {
  return z.object({
    email: z
      .string()
      .min(1, t ? t("emailRequired") : "Email is required")
      .email(t ? t("emailInvalid") : "Please enter a valid email address"),
    token: z.string().min(1, t ? t("tokenRequired") : "Token is required"),
  });
}

export function getActivatePageSearchParamsSchema(t?: (key: string) => string) {
  return z.object({
    email: z
      .string()
      .min(1, t ? t("emailRequired") : "Email is required")
      .email(t ? t("emailInvalid") : "Please enter a valid email address"),
    token: z.string().min(1, t ? t("tokenRequired") : "Token is required"),
  });
}

export function getResendActivatePageSearchParamsSchema(
  t?: (key: string) => string
) {
  return z.object({
    email: z
      .string()
      .min(1, t ? t("emailRequired") : "Email is required")
      .email(t ? t("emailInvalid") : "Please enter a valid email address"),
  });
}

export function getCreatedPageSearchParamsSchema(t?: (key: string) => string) {
  return z.object({
    email: z
      .string()
      .min(1, t ? t("emailRequired") : "Email is required")
      .email(t ? t("emailInvalid") : "Please enter a valid email address"),
  });
}

// Type exports for convenience
export type LoginFormData = z.infer<ReturnType<typeof getLoginSchema>>;
export type RegisterFormData = z.infer<ReturnType<typeof getRegisterSchema>>;
export type UserProfileFormData = z.infer<
  ReturnType<typeof getUserProfileSchema>
>;
export type ResetPasswordSearchParams = z.infer<
  ReturnType<typeof getResetPasswordPageSearchParamsSchema>
>;
export type ActivateSearchParams = z.infer<
  ReturnType<typeof getActivatePageSearchParamsSchema>
>;
export type ResendActivateSearchParams = z.infer<
  ReturnType<typeof getResendActivatePageSearchParamsSchema>
>;
export type CreatedSearchParams = z.infer<
  ReturnType<typeof getCreatedPageSearchParamsSchema>
>;
