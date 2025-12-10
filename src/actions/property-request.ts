"use server";

import { ZodIssue } from "zod";
import { getPropertyFormSchema } from "@/types/property-request";
import { submitPropertyFormWithDetailedErrors } from "@/data/property-request";
import { getTranslations } from "next-intl/server";

export interface PropertyFormActionResult {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] };
  fieldErrors?: { [key: string]: string };
}

export async function propertyFormAction(
  formData: FormData
): Promise<PropertyFormActionResult> {
  const t = await getTranslations("propertyRequestAction");
  const propertyFormSchemaTranslation = await getTranslations("propertyFormSchema");
  const propertyFormSchema = getPropertyFormSchema(propertyFormSchemaTranslation)
  try {
    // Extract data from FormData
    const rawData = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      property_types: formData.get("property_types") as string,
      budget_min: formData.get("budget_min") as string,
      budget_max: formData.get("budget_max") as string,
      location: (formData.get("location") as string) || undefined,
      bedrooms_min: formData.get("bedrooms_min")
        ? Number(formData.get("bedrooms_min"))
        : undefined,
      bedrooms_max: formData.get("bedrooms_max")
        ? Number(formData.get("bedrooms_max"))
        : undefined,
      bathrooms_min: formData.get("bathrooms_min")
        ? Number(formData.get("bathrooms_min"))
        : undefined,
      bathrooms_max: formData.get("bathrooms_max")
        ? Number(formData.get("bathrooms_max"))
        : undefined,
      with_pool: formData.get("with_pool") === "true",
      with_garage: formData.get("with_garage") === "true",
      additional_text: (formData.get("additional_text") as string) || undefined,
      source_url: (formData.get("source_url") as string) || undefined,
      consent: formData.get("consent") === "true",
    };

    const recaptchaToken = formData.get("recaptcha_token") as string;

    // Validate the data using Zod schema
    const validationResult = propertyFormSchema.safeParse(rawData);

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
    const result = await submitPropertyFormWithDetailedErrors(
      validationResult.data
    );

    if (!result.success) {
      return {
        success: false,
        message: result.error || t("failedToSubmitRequest"),
        errors: result.validationErrors,
      };
    }

    return {
      success: true,
      message:
        result.data?.message || t("propertyRequestSubmittedSuccessfully"),
    };
  } catch (error) {
    console.error("Property form action error:", error);

    return {
      success: false,
      message: t("unexpectedErrorOccurred"),
    };
  }
}