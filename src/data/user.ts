import { getTranslations } from "next-intl/server";

// Types for user-related API responses
export interface User {
  id: number;
  reference: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  newsletter?: boolean;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  newsletter?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  client: User;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    client: User;
    token: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: {
    client: User;
  };
}

export interface LogoutResponse {
  message: string;
}

interface ActivateResponse {
  success: boolean;
  message: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  errors?: { [key: string]: string[] };
  responseStatus?: number;
}

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

    // console.log({ apiRequestResponse: response });

    // Check if response is ok
    if (!response.ok) {
      return {
        ...(await response.json()),
        responseStatus: response.status,
      };
    }

    return response.json();
  } catch (error: unknown) {
    const errorStatus = getErrorStatus(error);

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
export const registerUser = async (
  userData: RegisterRequest
): Promise<RegisterResponse> => {
  const endpoint = `/v1/client/register`;

  try {
    return apiRequest<RegisterResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const endpoint = `/v1/auth/client/login`;

  return apiRequest<LoginResponse>(endpoint, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const getUserProfile = async (
  token: string
): Promise<ProfileResponse> => {
  const endpoint = `/v1/auth/client/profile`;

  return apiRequest<ProfileResponse>(
    endpoint,
    {
      method: "GET",
    },
    true,
    token
  );
};

export const activateUser = async (
  activationToken: string,
  email: string
): Promise<ActivateResponse> => {
  const t = await getTranslations("userData");
  const endpoint = `/v1/auth/client/activate`;

  // console.log({ endpoint });

  try {
    const res = await apiRequest<ActivateResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify({ token: activationToken, email }),
    });

    return res;
  } catch (error: unknown) {
    console.log("Error while activating user", error);

    return {
      success: false,
      message: t("errorActivatingAccount"),
    };
  }
};

export const resendActivationLink = async (
  email: string
): Promise<ActivateResponse> => {
  const t = await getTranslations("userData");
  const endpoint = `/v1/auth/client/resend-activation`;

  // console.log({ endpoint });

  try {
    const res = await apiRequest<ActivateResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    return res;
  } catch (error: unknown) {
    console.log("Error while activating user", error);

    return {
      success: false,
      message: t("errorActivatingAccount"),
    };
  }
};

export const forgotPassword = async ({
  email,
}: {
  email: string;
}): Promise<ForgotPasswordResponse> => {
  const t = await getTranslations("userData");
  const endpoint = `/v1/auth/client/forgot-password`;

  try {
    const res = await apiRequest<ForgotPasswordResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    return res;
  } catch (error: unknown) {
    console.log("Error while requesting new reset password link", error);

    return {
      success: false,
      message: t("errorRequestingPasswordLink"),
    };
  }
};

export const resetPassword = async ({
  email,
  password,
  password_confirmation,
  token,
}: {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}): Promise<ForgotPasswordResponse> => {
  const t = await getTranslations("userData");
  const endpoint = `/v1/auth/client/reset-password`;

  try {
    const res = await apiRequest<ForgotPasswordResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify({ email, password, password_confirmation, token }),
    });

    return res;
  } catch (error: unknown) {
    console.log("Error while resetting password", error);

    return {
      success: false,
      message: t("errorResettingPassword"),
    };
  }
};

export const logoutUser = async (token: string): Promise<LogoutResponse> => {
  const endpoint = `/v1/auth/client/logout`;

  return apiRequest<LogoutResponse>(
    endpoint,
    {
      method: "POST",
    },
    true,
    token
  );
};

// Client-side API functions (for use in components)
// Note: These functions should be called from client components that use useTranslations
export const createClientApi = (t: (key: string) => string) => ({
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || t("registrationFailed"));
    }

    return response.json();
  },

  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || t("loginFailed"));
    }

    return response.json();
  },

  logout: async (): Promise<void> => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(t("logoutFailed"));
    }
  },
});