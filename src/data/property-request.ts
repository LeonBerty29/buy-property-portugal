import {
  PropertyFormData,
  PropertyFormResponse,
  PropertyFormError,
} from "@/types/property-request";
import { getTranslations } from "next-intl/server";

interface DetailedResult {
  success: boolean;
  data?: PropertyFormResponse;
  error?: string;
  validationErrors?: { [key: string]: string[] };
}

export async function submitPropertyFormWithDetailedErrors(
  data: PropertyFormData
): Promise<DetailedResult> {
  const endpoint = "/v1/forms/request-for-property";
    const t = await getTranslations("propertyRequestData");
  
  try {
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
        const errorData: PropertyFormError = await response.json();
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

    const responseData: PropertyFormResponse = await response.json();
    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    console.error("Property form API error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : t("networkErrorOccurred"),
    };
  }
}
