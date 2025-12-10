export interface Testimonial {
  name: string;
  content: string; // HTML content
  country: string;
  date: string; // Format: "Month, Year"
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// Pagination links
export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

// Meta link item
export interface MetaLink {
  url: string | null;
  label: string;
  active: boolean;
}

// Pagination meta information
export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: MetaLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

// Complete testimonials response
export interface TestimonialsResponse {
  data: Testimonial[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

// Query parameters for testimonials API
export interface TestimonialsQueryParams {
  sort_by?: "name" | "created_at" | "updated_at";
  sort_direction?: "asc" | "desc";
  per_page?: number;
  page?: number;
}
