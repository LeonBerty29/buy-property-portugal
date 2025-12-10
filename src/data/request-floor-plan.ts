import { getTranslations } from "next-intl/server";
import { RequestFloorPlanData, RequestFloorPlanError, RequestFloorPlanResponse } from "@/types/schema.request-floor-plan";

interface DetailedResult {
  success: boolean;
  message?: string;
  data?: RequestFloorPlanData;
  error?: string;
  validationErrors?: { [key: string]: string[] };
}

export async function submitFloorPlanRequestWithDetailedErrors(
  data: RequestFloorPlanData
): Promise<DetailedResult> {
  const t = await getTranslations("messageUsData");
  try {
    const endpoint = "/v1/forms/request-floor-plans";
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
        // Validation errors
        const errorData: RequestFloorPlanError = await response.json();
        return {
          success: false,
          error: errorData.message || t("validationFailedError"),
          validationErrors: errorData.errors,
        };
      }
      if (response.status === 401) {
        return {
          success: false,
          error: t("unauthorizedError"),
        };
      }
      // Other HTTP errors
      const errorText = await response.text();
      return {
        success: false,
        error: `${t("serverErrorPrefix")} ${response.status} ${errorText}`,
      };
    }
    const responseData: RequestFloorPlanResponse = await response.json();
    return {
      success: true,
      message: responseData.message,
      data: responseData.data,
    };
  } catch (error) {
    console.error("Message form API error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : t("networkError"),
    };
  }
}