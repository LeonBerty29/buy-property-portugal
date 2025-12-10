"use server";

import { getTranslations } from "next-intl/server";
import { ZodIssue } from "zod";
import {
  getPartnershipFormSchema,
  PartnershipFormData,
} from "@/types/partnership-request";
import { submitPartnershipRequestWithDetailedErrors } from "@/data/partnership-request";

export interface PartnershipFormActionResult {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] };
  fieldErrors?: { [key: string]: string };
}

export async function PartnershipRequestFormAction(
  formData: FormData
): Promise<PartnershipFormActionResult> {
  const t = await getTranslations("partnershipRequestAction");
  const partnershipSchemaTranslation = await getTranslations("partnershipFormSchema");
  const PartnershipFormSchema = getPartnershipFormSchema(
    partnershipSchemaTranslation
  );
  try {
    // Extract data from FormData with the correct field names that match the API
    const rawData: PartnershipFormData = {
      company_name: formData.get("company_name") as string,
      company_email: formData.get("company_email") as string,
      company_phone: formData.get("company_phone") as string,
      contact_person: formData.get("contact_person") as string,
      client_first_name: formData.get("client_first_name") as string,
      client_last_name: formData.get("client_last_name") as string,
      partial_client_email: formData.get("partial_client_email") as string,
      partial_client_phone: formData.get("partial_client_phone") as string,
      interested_property:
        (formData.get("interested_property") as string) || undefined,
      remarks: (formData.get("remarks") as string) || undefined,
      confirmed_visit_date: new Date(
        formData.get("confirmed_visit_date") as string
      ),
      confirmed_visit_time:
        (formData.get("confirmed_visit_time") as string) || undefined,
      source_url: (formData.get("source_url") as string) || undefined,
      accept_terms: Boolean(formData.get("accept_terms")),
    };

    const recaptchaToken = formData.get("recaptcha_token") as string;

    // Validate the data using Zod schema
    const validationResult = PartnershipFormSchema.safeParse(rawData);

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
        message: t("formValidationFailed"),
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
        message: t("recaptchaVerificationFailed"),
      };
    }

    // Call the API
    const result = await submitPartnershipRequestWithDetailedErrors(
      validationResult.data
    );

    if (!result.success) {
      return {
        success: false,
        message: result.error || t("requestSubmissionFailed"),
        errors: result.validationErrors,
      };
    }

    return {
      success: true,
      message: result.data?.message || t("requestSubmissionSuccessful"),
    };
  } catch (error) {
    console.error("Partnership request action error:", error);

    return {
      success: false,
      message: t("unexpectedErrorOccurred"),
    };
  }
}
