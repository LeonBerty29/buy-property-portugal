import {
  Property,
  PropertyListResponse,
  PropertySearchParams,
} from "@/types/property";
import { cache } from "react";
import { getLocale } from "next-intl/server";

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
): Promise<T> {
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
export const getProperties = cache(
  async (params: PropertySearchParams = {}): Promise<PropertyListResponse> => {
    const queryString = buildQueryString(params);
    const locale = await getLocale();
    const endpoint = `/v1/properties${queryString}&language=${locale}`;

    return apiRequest<PropertyListResponse>(endpoint);
  }
);

export const getFeaturedProperties = cache(
  async (params: PropertySearchParams = {}): Promise<PropertyListResponse> => {
    return await getProperties(params);
  }
);

export const getPremiumProperties = cache(
  async (params: PropertySearchParams = {}): Promise<PropertyListResponse> => {
    return await getProperties(params);
  }
);

/**
 * Fetches a single property by ID
 */
export async function getPropertyById(
  id: number,
  language: "en" | "pt" = "en",
  include?: string
): Promise<Property> {
  const params: PropertySearchParams = { language };
  if (include) params.include = include;
  const locale = await getLocale();

  const queryString = buildQueryString(params);
  const endpoint = `/v1/properties/${id}${queryString}&language=${locale}`;

  return apiRequest<Property>(endpoint);
}

/**
 * Fetches a single property by slug
 */
export async function getPropertyBySlug(
  slug: string,
  language: "en" | "pt" = "en",
  include?: string
): Promise<Property> {
  const params: PropertySearchParams = { language };
  if (include) params.include = include;
  const locale = await getLocale();

  const queryString = buildQueryString(params);
  const endpoint = `/v1/properties/${slug}${queryString}&language=${locale}`;

  return apiRequest<Property>(endpoint);
}

/**
 * Fetches properties with media included
 */
export async function getPropertiesWithMedia(
  params: PropertySearchParams = {}
): Promise<PropertyListResponse> {
  return getProperties({
    ...params,
    include: params.include ? `${params.include},media` : "media",
  });
}

/**
 * Fetches properties with features included
 */
export async function getPropertiesWithFeatures(
  params: PropertySearchParams = {}
): Promise<PropertyListResponse> {
  return getProperties({
    ...params,
    include: params.include ? `${params.include},features` : "features",
  });
}

/**
 * Fetches properties with both media and features included
 */
export async function getPropertiesWithAll(
  params: PropertySearchParams = {}
): Promise<PropertyListResponse> {
  return getProperties({
    ...params,
    include: "media,features",
  });
}

/**
 * Search properties by location
 */
export async function searchPropertiesByLocation(
  location: string,
  additionalParams: PropertySearchParams = {}
): Promise<PropertyListResponse> {
  return getProperties({
    ...additionalParams,
    location_area: location,
  });
}

/**
 * Search properties by price range (legacy single range)
 */
export async function searchPropertiesByPriceRange(
  minPrice: number,
  maxPrice: number,
  additionalParams: PropertySearchParams = {}
): Promise<PropertyListResponse> {
  return getProperties({
    ...additionalParams,
    min_price: minPrice,
    max_price: maxPrice,
  });
}

/**
 * Search properties by multiple price ranges (new method)
 */
export async function searchPropertiesByMultiplePriceRanges(
  priceRanges: string[], // Array of "min,max" strings
  additionalParams: PropertySearchParams = {}
): Promise<PropertyListResponse> {
  return getProperties({
    ...additionalParams,
    price_ranges: priceRanges,
  });
}

/**
 * Search properties by type
 */
export async function searchPropertiesByType(
  type: string,
  additionalParams: PropertySearchParams = {}
): Promise<PropertyListResponse> {
  return getProperties({
    ...additionalParams,
    // type
  });
}

export async function getPropertiesWithPagination(
  params: PropertySearchParams = {},
  perPage: number = 15
): Promise<PropertyListResponse> {
  return getProperties({
    ...params,
    per_page: perPage,
  });
}

/**
 * Fetches properties with media included and specific pagination
 */
export async function getPropertiesWithMediaPaginated(
  params: PropertySearchParams = {},
  perPage: number = 15
): Promise<PropertyListResponse> {
  return getProperties({
    ...params,
    include: params.include ? `${params.include},media` : "media",
    per_page: perPage,
  });
}

/**
 * Fetches properties with both media and features included and specific pagination
 */
export async function getPropertiesWithAllPaginated(
  params: PropertySearchParams = {},
  perPage: number = 15
): Promise<PropertyListResponse> {
  return getProperties({
    ...params,
    include: "media,features",
    per_page: perPage,
  });
}
