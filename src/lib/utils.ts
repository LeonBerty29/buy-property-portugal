import { PropertySearchParams } from "@/types/property";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to generate proxied image URL
export const getProxiedImageUrl = (originalUrl: string) => {
  // return `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`;
  return originalUrl;
};

export const generateApiParams = (searchParams: PropertySearchParams) => {
  let priceRanges: string[] | undefined;
  if (searchParams["price_ranges[]"]) {
    // Handle both single value and array of values
    if (Array.isArray(searchParams["price_ranges[]"])) {
      priceRanges = searchParams["price_ranges[]"] as string[];
    } else {
      priceRanges = [searchParams["price_ranges[]"] as string];
    }

  }
  const apiParams: PropertySearchParams = {
    search: searchParams.search,
    location_area: searchParams.location_area,
    municipality: searchParams.municipality,
    zone: searchParams.zone,
    district: searchParams.district,
    min_price: searchParams.min_price,
    max_price: searchParams.max_price,
    price_ranges: priceRanges || [],
    currency: searchParams.currency || "EUR",
    typology: searchParams.typology,
    min_bedrooms: searchParams.min_bedrooms,
    max_bedrooms: searchParams.max_bedrooms,
    min_bathrooms: searchParams.min_bathrooms,
    max_bathrooms: searchParams.max_bathrooms,
    min_area: searchParams.min_area,
    max_area: searchParams.max_area,
    min_plot_size: searchParams.min_plot_size,
    max_plot_size: searchParams.max_plot_size,
    construction_year_from: searchParams.construction_year_from,
    construction_year_to: searchParams.construction_year_to,
    energy_class: searchParams.energy_class,
    agency_id: searchParams.agency_id,
    featured: searchParams.featured,
    show_price: searchParams.show_price,
    sort_by: searchParams.sort_by || "created_at",
    sort_direction: searchParams.sort_direction || "desc",
    per_page: searchParams.per_page || 20,
    page: searchParams.page || 1,
    language: searchParams.language || "en",
  };

  return apiParams;
};

export const generateSuspenseKey = (apiParams: PropertySearchParams) => {
  // Create a key based on the search parameters that affect the data
  const suspenseKey = JSON.stringify({
    search: apiParams.search,
    location: apiParams.location_area,
    municipality: apiParams.municipality,
    zone: apiParams.zone,
    district: apiParams.district,
    min_price: apiParams.min_price,
    max_price: apiParams.max_price,
    price_ranges: apiParams.price_ranges,
    currency: apiParams.currency,
    typology: apiParams.typology,
    min_bedrooms: apiParams.min_bedrooms,
    max_bedrooms: apiParams.max_bedrooms,
    min_bathrooms: apiParams.min_bathrooms,
    max_bathrooms: apiParams.max_bathrooms,
    min_area: apiParams.min_area,
    max_area: apiParams.max_area,
    min_plot_size: apiParams.min_plot_size,
    max_plot_size: apiParams.max_plot_size,
    construction_year_from: apiParams.construction_year_from,
    construction_year_to: apiParams.construction_year_to,
    energy_class: apiParams.energy_class,
    agency_id: apiParams.agency_id,
    featured: apiParams.featured,
    show_price: apiParams.show_price,
    sort_by: apiParams.sort_by,
    sort_direction: apiParams.sort_direction,
    per_page: apiParams.per_page,
    page: apiParams.page,
  });

  return suspenseKey;
};

export const hasActiveFilters = (params: PropertySearchParams): boolean => {

  return !!(
    params.search ||
    params.location_area ||
    params.municipality ||
    params.zone ||
    params.district ||
    params.min_price ||
    params.max_price ||
    (params.price_ranges && params.price_ranges.length > 0) ||
    params.typology ||
    params.min_bedrooms ||
    params.max_bedrooms ||
    params.min_bathrooms ||
    params.max_bathrooms ||
    params.min_area ||
    params.max_area ||
    params.min_plot_size ||
    params.max_plot_size ||
    params.construction_year_from ||
    params.construction_year_to ||
    (params.energy_class && params.energy_class.length > 0) ||
    params.agency_id ||
    params.featured ||
    (params.show_price !== undefined && params.show_price !== null)
  );
};
