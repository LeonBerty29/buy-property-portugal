import { getTranslations } from "next-intl/server";
import { BookVisitFormData } from "@/types/book-a-visit";

export interface BookVisitResponse {
  success: true;
  message: string;
  data: BookVisitFormData;
}

export interface BookVisitError {
  error?: string;
  message?: string;
  errors?: {
    [key: string]: string[];
  };
}

export async function bookVisitWithDetailedErrors(
  data: BookVisitFormData
): Promise<{
  success: boolean;
  data?: BookVisitResponse;
  error?: string;
  validationErrors?: { [key: string]: string[] };
}> {
  const t = await getTranslations("bookVisitData");
  const endpoint = "/v1/forms/book-visit";
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
      const errorData: BookVisitError = await response.json();

      if (response.status === 401) {
        return {
          success: false,
          error: t("unauthorizedError"),
        };
      }

      if (response.status === 422 && errorData.errors) {
        return {
          success: false,
          error: errorData.message || t("validationFailedError"),
          validationErrors: errorData.errors,
        };
      }

      return {
        success: false,
        error:
          errorData.error ||
          errorData.message ||
          `${t("httpErrorPrefix")} ${response.status}: ${t(
            "requestFailedSuffix"
          )}`,
      };
    }

    const result: BookVisitResponse = await response.json();
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : t("networkError"),
    };
  }
}