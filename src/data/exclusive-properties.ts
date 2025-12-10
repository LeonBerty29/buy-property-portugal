import { PropertyListResponse, PropertySearchParams } from "@/types/property";
import { cache } from "react";
import { getLocale } from "next-intl/server";
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
async function apiRequest<T>(endpoint: string): Promise<T> {
  const url = `${process.env.API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    Authorization: createBasicAuthHeader(),
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const config: RequestInit = {
    headers: {
      ...defaultHeaders,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    if (response.status === 404) {
      return notFound();
    }

    const errorText = await response.text();
    throw new Error(
      `API Error: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return response.json();
}

/**
 * Builds query string from search parameters with support for array parameters
 */
function buildQueryString(params: PropertySearchParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      // Handle array parameters (like price_ranges, energy_class)
      if (Array.isArray(value)) {
        if (value.length > 0) {
          // For price_ranges, we need to use the bracket notation
          if (key === "price_ranges") {
            value.forEach((item) => {
              searchParams.append("price_ranges[]", item.toString());
            });
          } else if (key === "price_ranges[]") {
            // value.forEach((item) => {
            // searchParams.append("price_ranges[]", item.toString());
            // });
          }
          // For energy_class and other arrays, use bracket notation as well
          else if (key === "energy_class") {
            value.forEach((item) => {
              searchParams.append("energy_class[]", item.toString());
            });
          }
          // For any other arrays, use bracket notation
          else {
            value.forEach((item) => {
              searchParams.append(`${key}[]`, item.toString());
            });
          }
        }
      } else {
        // Handle non-array parameters
        searchParams.append(key, value.toString());
      }
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
}

/**
 * Fetches a paginated list of properties with optional filtering and sorting
 */
export const getExclusiveProperties = cache(
  async (
    params: PropertySearchParams = {},
    hash: string
  ): Promise<PropertyListResponse> => {
    const queryString = buildQueryString(params);
    const locale = await getLocale();
    const endpoint = `/v1/property-secret-listings/${hash}${queryString}&language=${locale}`;

    return apiRequest<PropertyListResponse>(endpoint);
  }
);

export async function getExclusivePropertiesWithAllPaginated(
  params: PropertySearchParams = {},
  perPage: number = 15,
  hash: string
): Promise<PropertyListResponse> {
  return getExclusiveProperties(
    {
      ...params,
      include: "media,features",
      per_page: perPage,
    },
    hash
  );
}
