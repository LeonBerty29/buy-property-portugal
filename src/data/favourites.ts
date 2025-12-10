// import { redirect } from "@/i18n/navigation";
import { FavoritesResponse } from "@/types";
// import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
// import { ValidateToken } from "./token";
// import { isRedirectError } from "next/dist/client/components/redirect-error";


function createBasicAuthHeader(): string {
  const credentials = btoa(
    `${process.env.API_USERNAME}:${process.env.API_PASSWORD}`
  );
  return `Basic ${credentials}`;
}

function createBearerAuthHeader(token: string): string {
  return `Bearer ${token}`;
}

/**
 * Generic fetch wrapper with Basic Auth or Bearer Auth
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  useBearer = false,
  token?: string
): Promise<T> {
  const url = `${process.env.API_BASE_URL}${endpoint}`;
  const authHeader =
    useBearer && token
      ? createBearerAuthHeader(token)
      : createBasicAuthHeader();

  const defaultHeaders = {
    Authorization: authHeader,
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

// User API functions
// export const RemoveFromFavorite = async (
//   propertyId: number,
//   token: string
// ): Promise<FavoritesResponse> => {
//   const endpoint = `/client/favorites/${propertyId}`;

//   try {
//     return apiRequest<FavoritesResponse>(endpoint, {
//       method: "DELETE",
//     },
//     true,
//     token
//   );
//   } catch (error) {
//     throw error;
//   }
// };

export const AddToFavorites = async (
  propertyId: number,
  token: string
): Promise<FavoritesResponse> => {
  const endpoint = `/v1/client/favorites?property_id=${propertyId}`;

  return apiRequest<FavoritesResponse>(
    endpoint,
    {
      method: "POST",
    },
    true,
    token
  );
};

export const getFavorites = async (
  token: string
): Promise<FavoritesResponse> => {
  const endpoint = `/v1/client/favorites`;

  // const locale = await getLocale();

  // const isTokenValid = await verifyTokenValidity()

  // redirect({
  //   href: "/login",
  //   locale: locale,
  // });

  return apiRequest<FavoritesResponse>(
    endpoint,
    {
      method: "GET",
    },
    true,
    token
  );
};
export const RemoveFavorite = async (
  propertyId: number,
  token: string
): Promise<FavoritesResponse> => {
  const endpoint = `/v1/client/favorites/${propertyId}`;

  return apiRequest<FavoritesResponse>(
    endpoint,
    {
      method: "DELETE",
    },
    true,
    token
  );
};
