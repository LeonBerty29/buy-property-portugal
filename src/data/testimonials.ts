import {
  TestimonialsQueryParams,
  TestimonialsResponse,
} from "@/types/testimonial";
import { notFound } from "next/navigation";

function createBasicAuthHeader(): string {
  const credentials = btoa(
    `${process.env.API_USERNAME}:${process.env.API_PASSWORD}`
  );
  return `Basic ${credentials}`;
}

/**
 * Generic fetch wrapper with Basic Auth or Bearer Auth
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
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
      throw new Error(`API Error: ${response.status} ${response.statusText}`, {
        cause: response,
      });
    }

    // Check if response is ok
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API Error: ${response.status} ${response.statusText} - ${errorText}`,
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

    if (errorStatus === 401) {
      throw error;
    }

    // console.error(error);
    // Re-throw the error with proper typing
    // if (error instanceof Error) {
    //   throw error;
    // } else {
    //   throw new Error(`Failed to fetch from API: ${String(error)}`);
    // }

    throw error;
  }
}

// export const getTestimonials = async (

// //   params?: TestimonialsQueryParams
// ): Promise<TestimonialsResponse> => {
//   const endpoint = `v1/cms/testimonials`;

//   return apiRequest<TestimonialsResponse>(
//     endpoint,
//     {
//       method: "GET",
//     },
//   );
// };

export const getTestimonials = async (
  params: TestimonialsQueryParams = {}
): Promise<TestimonialsResponse> => {
  // Build query string from parameters
  const queryParams = new URLSearchParams();

  if (params.sort_by) {
    queryParams.append('sort_by', params.sort_by);
  }

  if (params.sort_direction) {
    queryParams.append('sort_direction', params.sort_direction);
  }

  if (params.per_page) {
    queryParams.append('per_page', params.per_page.toString());
  }

  if (params.page) {
    queryParams.append('page', params.page.toString());
  }

  const queryString = queryParams.toString();
  const endpoint = `/v1/cms/testimonials${queryString ? `?${queryString}` : ""}`;

  return apiRequest<TestimonialsResponse>(endpoint, {
    method: "GET",
  });
};
