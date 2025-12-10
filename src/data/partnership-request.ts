import {
  PartnershipFormData,
  PartnershipFormResponse,
  PartnershipFormError,
} from "@/types/partnership-request";
import { getTranslations } from "next-intl/server";

interface DetailedResult {
  success: boolean;
  data?: PartnershipFormResponse;
  error?: string;
  validationErrors?: { [key: string]: string[] };
}

export async function submitPartnershipRequestWithDetailedErrors(
  data: PartnershipFormData,
): Promise<DetailedResult> {
    const t = await getTranslations("partnershipRequestData");
  
  try {
    const endpoint = "/v1/forms/agent-partnership-request";
    const response = await fetch(`${process.env.API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Token": process.env.BOOKING_INTERNAL_TOKEN || "",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      if (response.status === 422) {
        const errorData: PartnershipFormError = await response.json();
        return {
          success: false,
          error: errorData.message || t("validationFailed"),
          validationErrors: errorData.errors,
        };
      }
      if (response.status === 401) {
        return {
          success: false,
          error: t("unauthorizedTryAgain"),
        };
      }
      const errorText = await response.text();
      return {
        success: false,
        error: `${t("serverError")} ${response.status} ${errorText}`,
      };
    }
    const responseData: PartnershipFormResponse = await response.json();
    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    console.error("Contact agent form API error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : t("networkErrorOccurred"),
    };
  }
}