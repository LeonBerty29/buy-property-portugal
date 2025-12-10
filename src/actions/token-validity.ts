// actions/check-token-validity.ts
"use server";

import { signOut } from "@/auth";
import { fetchUserProfile } from "@/data/token";
import { logoutUser } from "@/data/user";

interface ValidationResult {
  valid: boolean;
  expired: boolean;
  logout: boolean;
}

/**
 * Server Action: Validates token and handles session cleanup on expiration
 * Used in server components
 */
export async function validateAndRefreshSession(
  token: string
): Promise<ValidationResult> {
  const result = await fetchUserProfile(token);

  if (result.logout) {
    console.log("Token expired - clearing session");

    // Logout from your API
    try {
      await logoutUser(token);
    } catch (logoutError) {
      console.error("Error during API logout:", logoutError);
    }

    // Clear the server-side session
    await signOut({ redirect: false });

    return { valid: false, expired: true, logout: true };
  }

  if (!result.valid) {
    // Some other error occurred
    throw new Error("Session validation failed");
  }

  return { valid: true, expired: false, logout: false };
}

/**
 * Server Action: Validates token for client-side components
 * Returns logout flag for 401 errors without throwing
 */
export async function validateAndRefreshSessionClient(
  token: string
): Promise<ValidationResult> {
  const result = await fetchUserProfile(token);

  if (result.logout) {
    return { valid: false, expired: true, logout: true };
  }

  if (!result.valid) {
    // Some other error occurred, throw it
    throw new Error("Session validation failed");
  }

  return { valid: true, expired: false, logout: false };
}

/**
 * Helper function: Token validation without session cleanup
 * Used in server components that just need to check validity
 */
export async function TokenValidity(token: string): Promise<ValidationResult> {
  const result = await fetchUserProfile(token);

  if (result.logout) {
    // console.log("Token expired");

    // Logout from your API (don't throw on error)
    try {
      await logoutUser(token);
    } catch (logoutError) {
      console.error("Error during API logout:", logoutError);
    }

    return { valid: false, expired: true, logout: false };
  }

  if (!result.valid) {
    console.error("Token validation error");
    return { valid: false, expired: false, logout: false };
  }

  return { valid: true, expired: false, logout: false };
}