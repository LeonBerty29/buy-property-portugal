"use server";

import { getTranslations } from "next-intl/server";
import { ZodIssue } from "zod";
import { ForgotPasswordSchema } from "@/schema/schema.forgot-password";
import { forgotPassword } from "@/data/user";

export interface ForgotPasswordResult {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] };
  fieldErrors?: { [key: string]: string };
}

export async function forgotPasswordAction(
  formData: FormData
): Promise<ForgotPasswordResult> {
  const t = await getTranslations("forgotPasswordAction");

  try {
    // Extract data from FormData
    const rawData = {
      email: formData.get("email") as string,
    };

    const recaptchaToken = formData.get("recaptcha_token") as string;

    // Validate the data using Zod schema
    const validationResult = ForgotPasswordSchema.safeParse(rawData);

    if (!validationResult.success) {
      // Convert Zod errors to field errors with proper typing
      const fieldErrors: { [key: string]: string } = {};
      validationResult.error.errors.forEach((error: ZodIssue) => {
        const fieldName = error.path[0];
        if (fieldName && typeof fieldName === "string") {
          fieldErrors[fieldName] = error.message;
        }
      });

      return {
        success: false,
        message: t("checkFormErrors"),
        fieldErrors,
      };
    }

    if (!recaptchaToken) {
      return {
        success: false,
        message: t("recaptchaTokenMissing"),
      };
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    const verificationResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const verification = await verificationResponse.json();

    if (verification.success && verification.score > 0.5) {
      // Passed verification
    } else {
      return {
        success: false,
        message: t("recaptchaFailed"),
      };
    }

    // Call the API
    const result = await forgotPassword(validationResult.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message || t("requestFailed"),
        errors: result.errors,
      };
    }

    return {
      success: true,
      message: result.message || t("requestSubmitted"),
    };
  } catch (error) {
    console.error("Error in forgot password action:", error);

    return {
      success: false,
      message: t("unexpectedError"),
    };
  }
}