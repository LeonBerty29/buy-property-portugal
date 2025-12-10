import {
  PropertyMetadata,
  PropertySearchParams,
  Ranges,
} from "@/types/property";
import { cache } from "react";

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
    const errorText = await response.text();
    throw new Error(
      `API Error: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return response.json();
}

/**
 * Builds query string from search parameters
 */
function buildQueryString(params: PropertySearchParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString());
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export const getMetadata = cache(
  async (params?: PropertySearchParams): Promise<PropertyMetadata> => {
    const queryString = params ? buildQueryString(params) : "";
    const endpoint = `/v1/metadata${queryString}`;

    return apiRequest<PropertyMetadata>(endpoint);
  }
);

export const getRanges = cache(async (): Promise<Ranges> => {
  const endpoint = `/v1/metadata/ranges`;

  return apiRequest<Ranges>(endpoint);
});
