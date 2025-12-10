// actions/contact-agent.ts
"use server";

import { ZodIssue } from "zod";
import { getClientContactAgentSchema } from "@/types/contact-agent";
import { contactAgentWithDetailedErrors } from "@/data/contact-agent";
import { getTranslations } from "next-intl/server";

export interface ContactAgentActionResult {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] };
  fieldErrors?: { [key: string]: string };
}

export async function contactAgentAction(
  formData: FormData
): Promise<ContactAgentActionResult> {
  const t = await getTranslations("contactAgentAction");
  const translationSchema = await getTranslations("contactAgentSchema");
    const contactAgentSchema = getClientContactAgentSchema(translationSchema);

  try {
    // Extract data from FormData
    const rawData = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      message: (formData.get("message") as string),
      primary_contact_channel:
        (formData.get("primary_contact_channel") as string),
      source_url: (formData.get("source_url") as string),
      accept_terms: Boolean(formData.get("accept_terms")),
    };

    const recaptchaToken = formData.get("recaptcha_token") as string;

    // Validate the data using Zod schema
    const validationResult = contactAgentSchema.safeParse(rawData);

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
      // console.log({ success: true, score: verification.score });
    } else {
      return {
        success: false,
        message: t("recaptchaVerificationFailed"),
      };
    }

    // Call the API
    const result = await contactAgentWithDetailedErrors(validationResult.data);

    if (!result.success) {
      return {
        success: false,
        message: result.error || t("failedToSubmitRequest"),
        errors: result.validationErrors,
      };
    }

    return {
      success: true,
      message: result.data?.message || t("requestSubmittedSuccessfully"),
    };
  } catch (error) {
    console.error("Contact agent action error:", error);

    return {
      success: false,
      message: t("unexpectedErrorOccurred"),
    };
  }
}
