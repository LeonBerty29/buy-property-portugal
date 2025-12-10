export interface Property {
  id: number;
  reference: string;
  title: string;
  description: string;
  price: number;
  currency: "EUR" | "USD" | "GBP";
  show_price: boolean;
  agency: {
    id: number;
    name: string;
  };
  typology: {
    id: number;
    name: string;
  };
  is_featured_property: boolean;
  features: {
    bedrooms?: number;
    bathrooms?: number;
    construction_year?: string;
    private_area?: number;
    plot_size?: number;
    construction_area?: number;
    energy_class?: string;
    garage?: number;
  };
  additional_features: AdditionalFeature[];
  seo: {
    slugs: {
      de: string;
      en: string;
      fr: string;
      nl: string;
      pt: string;
      ru: string;
      se: string;
    };
    title: string;
    description: string;
    keywords: string[];
  };
  location: {
    country: string;
    district: string;
    municipality: string;
    zone: string;
    zip_code: string;
    latitude: number;
    longitude: number;
  };
  assets: {
    pdf_brochure: string;
    images: {
      gallery: PropertyImage[];
      floor_plans: PropertyImage[];
    };
    videos: PropertyVideo[] | null;
    virtual_tours: VirtualTour[];
  };
  sales_consultant: {
    name: string;
    profile_picture: string;
  };
  driving_distances: DrivingDistance[];
  similar_properties: number[];
  created_at: string;
  updated_at: string;
}

export interface DrivingDistance {
  label: string;
  value: number;
}

export interface AdditionalFeature {
  category_icon: string;
  category_id: number;
  category_name: string;
  features: FeatureItem[];
}

export interface FeatureItem {
  feature_id: number;
  feature_name: string;
  field_type: "bool" | "select" | "integer" | "text";
  field_value: boolean | string | number;
}

export interface PropertyImage {
  id: number;
  url: string;
  title: string;
  description: string | null;
  type: string;
}

export interface PropertyVideo {
  id: number;
  url: string;
  title: string;
  description: string | null;
  type: string;
  thumbnail?: string;
}

export interface VirtualTour {
  url: string;
  title?: string;
  description?: string;
}

export interface PropertyListResponse {
  data: Property[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface PropertyResponse {
  data: Property;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface PropertySearchParams {
  search?: string;
  location_area?: string;
  municipality?: string;
  zone?: string;
  district?: string;
  min_price?: number;
  max_price?: number;
  price_ranges?: string[];
  currency?: "EUR" | "USD" | "GBP";
  typology?: number;
  min_bedrooms?: number;
  max_bedrooms?: number;
  min_bathrooms?: number;
  max_bathrooms?: number;
  min_area?: number;
  max_area?: number;
  min_plot_size?: number;
  max_plot_size?: number;
  construction_year_from?: string;
  construction_year_to?: string;
  energy_class?: string[];
  agency_id?: number;
  featured?: boolean;
  show_price?: boolean;
  include?: string;
  sort_by?:
    | "created_at"
    | "updated_at"
    | "price"
    | "private_area"
    | "plot_size";
  sort_direction?: "asc" | "desc";
  per_page?: number;
  page?: number;
  language?: "en" | "pt" | "de" | "fr" | "nl" | "ru" | "se";
  premium?: boolean;
  "price_ranges[]"?: string[];
}

// Utility types for easier filtering and manipulation
export type PropertyTypology =
  | "Villa"
  | "Plot"
  | "Apartment"
  | "Townhouse"
  | "Commercial";

export type EnergyClass =
  | "A+"
  | "A"
  | "B+"
  | "B"
  | "B-"
  | "C"
  | "D"
  | "E"
  | "F"
  | "n/a";

export interface PropertyFilters {
  price_range?: [number, number];
  area_range?: [number, number];
  plot_size_range?: [number, number];
  bedrooms_range?: [number, number];
  bathrooms_range?: [number, number];
  construction_year_range?: [string, string];
  energy_classes?: EnergyClass[];
  typologies?: PropertyTypology[];
  agencies?: number[];
  locations?: {
    countries?: string[];
    districts?: string[];
    municipalities?: string[];
    zones?: string[];
  };
  features?: {
    has_pool?: boolean;
    has_garden?: boolean;
    has_garage?: boolean;
    has_air_conditioning?: boolean;
    has_heating?: boolean;
    has_fireplace?: boolean;
  };
}

// Helper interface for property summary/card views
export interface PropertySummary {
  id: number;
  reference: string;
  title: string;
  price: number;
  currency: string;
  show_price: boolean;
  typology: string;
  bedrooms: number;
  bathrooms: number;
  private_area: number;
  plot_size: number;
  location: {
    zone: string;
    municipality: string;
    district: string;
  };
  primary_image?: string;
  is_featured: boolean;
  agency_name: string;
  energy_class: string;
}

// For property comparison features
export interface PropertyComparison {
  properties: Property[];
  comparison_fields: {
    price: number[];
    area: number[];
    bedrooms: number[];
    bathrooms: number[];
    plot_size: number[];
    energy_class: string[];
    construction_year: string[];
    location: string[];
  };
}

export interface LocationArea {
  id: number;
  name: string;
  property_count: number;
  municipalities: Municipality[];
}

export interface Municipality {
  id: number;
  name: string;
  property_count: number;
  zones: Zone[];
}

export interface Zone {
  id: number;
  name: string;
  property_count: number;
}

export interface FeatureCategory {
  category_id: number;
  category_name: string;
  category_slug: string;
  icon: string;
  features: MetadataFeature[];
}

export interface MetadataFeature {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  type: "bool" | "select" | "integer" | "text" | "float";
  options: string[];
}

// Updated PropertyMetadata interface to match actual API response
export interface PropertyMetadata {
  typologies: { id: number; name: string }[];
  features: FeatureCategory[];
  areas: LocationArea[];
}

export interface PropertyMetadata {
  typologies: { id: number; name: string }[];
}

export interface Ranges {
  price: {
    min: number;
    max: number;
  };
  bedrooms: {
    min: number;
    max: number;
  };
  bathrooms: {
    min: number;
    max: number;
  };
  private_area: {
    min: number;
    max: number;
  };
}
