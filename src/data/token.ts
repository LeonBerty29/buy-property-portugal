 import { cache } from "react";

export interface User {
  id: number;
  reference: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  newsletter?: boolean;
}

export interface ProfileResponse {
  success: boolean;
  data: {
    client: User;
  };
}

function createBearerAuthHeader(token: string): string {
  return `Bearer ${token}`;
}

export interface ProfileFetchResult {
  valid: boolean;
  logout: boolean;
  profile?: User;
  data?: ProfileResponse;
}

/**
 * Cached function to fetch user profile
 * This will be called once per request and cached across the entire request lifecycle
 */
export const fetchUserProfile = cache(
  async (token: string): Promise<ProfileFetchResult> => {
    const endpoint = `/v1/auth/client/profile`;
    const url = `${process.env.API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: createBearerAuthHeader(token),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    });


    if (!response.ok) {
      // If 401, set logout flag to true
      if (response.status === 401) {
        return {
          valid: false,
          logout: true,
        };
      }
      
      // For other errors, throw
      throw new Error(`${response.status}: Profile fetch failed`);
    }

    const data = await response.json();
    
    return {
      valid: true,
      logout: false,
      profile: data.data.client,
      data: data,
    };
  }
);

/**
 * Validates if a token is still valid by attempting to fetch the profile
 * Returns the profile data if valid, logout flag for 401 errors
 */
export const ValidateToken = cache(
  async (token: string): Promise<{ valid: boolean; logout: boolean; profile?: User }> => {
    try {
      const profileResponse = await fetchUserProfile(token);
      return {
        valid: true,
        logout: false,
        profile: profileResponse.data?.data.client,
      };
    } catch (error) {
      console.log("Token validation error:", error);
      
      return { 
        valid: false, 
        logout: false
      };
    }
  }
);