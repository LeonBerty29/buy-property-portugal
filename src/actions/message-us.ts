"use server";

import { ZodIssue } from "zod";
import { getTranslations } from "next-intl/server";
import { submitMessageFormWithDetailedErrors } from "@/data/message-us";
import { getMessageFormSchema } from "@/types/message-us";

export interface MessageFormActionResult {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] };
  fieldErrors?: { [key: string]: string };
}

export async function messageFormAction(
  formData: FormData
): Promise<MessageFormActionResult> {
  const t = await getTranslations("messageUsAction");
  const messageFormSchemaTranslation = await getTranslations("messageFormSchema");
    const messageFormSchema = getMessageFormSchema(messageFormSchemaTranslation);
  try {
    // Extract data from FormData
    const rawData = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
      source_url: (formData.get("source_url") as string) || undefined,
    };

    const recaptchaToken = formData.get("recaptcha_token") as string;

    // Validate the data using Zod schema
    const validationResult = messageFormSchema.safeParse(rawData);

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
        message: t("pleaseCheckFormForErrors"),
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
        message: t("recaptchaVerificationFailed"),
      };
    }

    // Call the API
    const result = await submitMessageFormWithDetailedErrors(
      validationResult.data
    );

    if (!result.success) {
      return {
        success: false,
        message: result.error || t("failedToSubmitMessage"),
        errors: result.validationErrors,
      };
    }

    return {
      success: true,
      message: result.data?.message || t("messageSubmittedSuccessfully"),
    };
  } catch (error) {
    console.error("Message form action error:", error);

    return {
      success: false,
      message: t("unexpectedErrorOccurred"),
    };
  }
}