"use server";

import { ZodIssue } from "zod";
import { getTranslations } from "next-intl/server";
import { submitNewsletterFormWithDetailedErrors } from "@/data/newsletter";
import { getMessageFormSchema } from "@/types/message-us";

export interface NewsletterFormActionResult {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] };
  fieldErrors?: { [key: string]: string };
}

export async function newsletterFormAction(
  formData: FormData
): Promise<NewsletterFormActionResult> {
  const t = await getTranslations("newsletterAction");
  const newsletterFormSchemaTranslation = await getTranslations(
    "newsletterFormSchema"
  );
  const newsletterFormSchema = getMessageFormSchema(
    newsletterFormSchemaTranslation
  );

  try {
    // Extract data from FormData
    const rawData = {
      email: formData.get("email") as string,
      source_url: (formData.get("source_url") as string) || undefined,
    };

    const recaptchaToken = formData.get("recaptcha_token") as string;

    // Validate the data using Zod schema
    const validationResult = newsletterFormSchema.safeParse(rawData);

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
        message: t("checkFormForErrors"),
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
      // console.log({ success: true, score: verification.score });
    } else {
      // console.log({
      //   success: false,
      //   score: verification.score,
      //   errorCodes: verification["error-codes"],
      // });
      return {
        success: false,
        message: t("recaptchaVerificationFailed"),
      };
    }

    // Call the API
    const result = await submitNewsletterFormWithDetailedErrors(
      validationResult.data
    );

    if (!result.success) {
      return {
        success: false,
        message: result.error || t("failedToSubscribe"),
        errors: result.validationErrors,
      };
    }

    return {
      success: true,
      message: result.data?.message || t("successfullySubscribed"),
    };
  } catch (error) {
    console.error("Newsletter form action error:", error);

    return {
      success: false,
      message: t("unexpectedError"),
    };
  }
}
