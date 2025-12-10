"use server";

import { getTranslations } from "next-intl/server";
import { ZodIssue } from "zod";
import { bookVisitWithDetailedErrors } from "@/data/book-visit";
import { getClientBookVisitSchema } from "@/types/book-a-visit";

export interface BookVisitActionResult {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] };
  fieldErrors?: { [key: string]: string };
}

export async function bookVisitAction(
  formData: FormData
): Promise<BookVisitActionResult> {
  const t = await getTranslations("bookVisitAction");
  const schemaTranslation = await getTranslations("bookVisitSchema");
  const bookVisitSchema = getClientBookVisitSchema(schemaTranslation);

  try {
    // Extract data from FormData
    const rawData = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      visit_date: new Date(formData.get("visit_date") as string),
      visit_time: formData.get("visit_time") as string,
      additional_text: (formData.get("additional_text") as string) || undefined,
      source_url: (formData.get("source_url") as string) || undefined,
      property_reference: formData.get("property_reference") as string,
      accept_terms: Boolean(formData.get("accept_terms") as string),
    };

    const recaptchaToken = formData.get("recaptcha_token") as string;

    // console.log("Raw form data:", rawData); // Debug log

    // Validate the data using Zod schema
    const validationResult = bookVisitSchema.safeParse(rawData);

    if (!validationResult.success) {
      // console.log("Validation errors:", validationResult.error.errors); // Debug log

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
        message: t("formError"),
        fieldErrors,
      };
    }

    if (!recaptchaToken) {
      return {
        success: false,
        message: t("recaptchaMissing"),
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
        message: t("recaptchaFailed"),
      };
    }

    // Call the API
    const result = await bookVisitWithDetailedErrors(validationResult.data);

    if (!result.success) {
      return {
        success: false,
        message: result.error || t("apiGenericFailure"),
        errors: result.validationErrors,
      };
    }

    return {
      success: true,
      message: result.data?.message || t("success"),
    };
  } catch (error) {
    console.error("Book visit action error:", error);

    return {
      success: false,
      message: t("unexpectedError"),
    };
  }
}
