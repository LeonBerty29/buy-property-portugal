import {  PropertyResponse } from "@/types/property";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

function createBasicAuthHeader(): string {
  const credentials = btoa(
    `${process.env.API_USERNAME}:${process.env.API_PASSWORD}`
  );
  return `Basic ${credentials}`;
}

/**
 * Generic fetch wrapper with Basic Auth
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const t = await getTranslations("propertyData");
  const url = `${process.env.API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    Authorization: createBasicAuthHeader(),
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // Helper function to get error status from Response
  const getErrorStatus = (error: unknown): number | undefined => {
    if (error instanceof Error && error.cause instanceof Response) {
      return error.cause.status;
    }
    return undefined;
  };

  try {
    const response: Response = await fetch(url, config);

    // Check for 404 specifically
    if (response.status === 404) {
      // console.log(response.status);
      throw new Error(
        `${t("apiError")} ${response.status} ${response.statusText}`,
        {
          cause: response,
        }
      );
    }

    // Check if response is ok
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `${t("apiError")} ${response.status} ${
          response.statusText
        } - ${errorText}`,
        {
          cause: response,
        }
      );
    }

    return response.json();
  } catch (error: unknown) {
    const errorStatus = getErrorStatus(error);

    // console.log({ errorStatus });

    if (errorStatus === 404) {
      notFound();
    }

    console.error(error);
    // Re-throw the error with proper typing
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(`${t("failedToFetchFromApi")} ${String(error)}`);
    }
  }
}

export const getExclusiveProperty = async (
  slug: string,
  hash: string
): Promise<PropertyResponse> => {
  const locale = await getLocale();
  const endpoint = `/v1/property-secret-listings/${hash}/properties/${slug}/?language=${locale}`

  return apiRequest<PropertyResponse>(endpoint);
};
