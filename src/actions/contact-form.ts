"use server";

import { ZodIssue } from "zod";
import { getClientContactFormSchema } from "@/types/contact-form";
import { submitContactFormWithDetailedErrors } from "@/data/contact-form";
import { getTranslations } from "next-intl/server";

export interface ContactFormActionResult {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] };
  fieldErrors?: { [key: string]: string };
}

export async function contactFormAction(
  formData: FormData
): Promise<ContactFormActionResult> {
  const t = await getTranslations("contactFormAction");
  const translationSchema = await getTranslations("contactFormSchema");
    const contactFormSchema = getClientContactFormSchema(translationSchema);

  try {
    // Extract data from FormData
    const rawData = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
      source_url: (formData.get("source_url") as string) || undefined,
      accept_terms: Boolean(formData.get("accept_terms")),
    };

    const recaptchaToken = formData.get("recaptcha_token") as string;

    // Validate the data using Zod schema
    const validationResult = contactFormSchema.safeParse(rawData);

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
    const result = await submitContactFormWithDetailedErrors(
      validationResult.data
    );

    if (!result.success) {
      return {
        success: false,
        message: result.error || t("submitFailed"),
        errors: result.validationErrors,
      };
    }

    return {
      success: true,
      message: result.data?.message || t("submitSuccess"),
    };
  } catch (error) {
    console.error("Contact form action error:", error);

    return {
      success: false,
      message: t("unexpectedError"),
    };
  }
}
