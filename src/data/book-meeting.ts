import {
  BookMeetingRequest,
  BookMeetingResponse,
  BookMeetingError,
} from "@/types/book-a-meeting";
import { getTranslations } from "next-intl/server";

export async function bookMeetingWithDetailedErrors(
  data: BookMeetingRequest
): Promise<{
  success: boolean;
  data?: BookMeetingResponse;
  error?: string;
  validationErrors?: { [key: string]: string[] };
}> {
  const t = await getTranslations("bookMeetingData");
  const endpoint = "/v1/forms/book-meeting";
  try {
    const username = process.env.BASIC_AUTH_USER;
    const password = process.env.BASIC_AUTH_PASSWORD;
    const basicAuth =
      "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

    const response = await fetch(`${process.env.API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "accept": "application/ld+json",
        "Content-Type": "application/json",
        "X-Internal-Token": process.env.BOOKING_INTERNAL_TOKEN || "",
        Authorization: basicAuth,
      },
      body: JSON.stringify(data),
    });

    // console.log({ response });

    if (!response.ok) {

      if (response.status == 401 || response.status == 404) {
        return {
          success: false,
          error: t("unauthorizedInvalidOrMissingInternalToken"),
        };
      }

      const errorData: BookMeetingError = await response.json();
      if (response.status == 422 && errorData.errors) {
        return {
          success: false,
          error: errorData.message || t("validationFailed"),
          validationErrors: errorData.errors,
        };
      }

      return {
        success: false,
        error:
          errorData.error ||
          errorData.message ||
          t("httpRequestFailed", { status: response.status }),
      };
    }

    const result: BookMeetingResponse = await response.json();
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.log(`Error while booking`, error);
    return {
      success: false,
      error: t("unExpectedError"),
    };
  }
}
