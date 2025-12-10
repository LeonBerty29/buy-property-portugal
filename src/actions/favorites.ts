"use server";

import { auth, signOut } from "@/auth";
import { AddToFavorites } from "@/data/favourites";
import { getTranslations } from "next-intl/server";
import { ValidateToken } from "@/data/token";

type ActionState = {
  success?: string;
  error?: string;
  authenticated?: string;
  timestamp?: number;
};

export async function addToFavorite(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  let token = session?.accessToken;
  const t = await getTranslations("favoritesAction");

  // Validate token and handle logout
  const { valid, logout } = await ValidateToken(token as string);

  if (logout) {
    // Redirect happens at the Server Action level
    await signOut({
      redirect: false,
    });

    token = undefined;
  }

  if (logout || !token) {
    return {
      authenticated: t("mustBeLoggedInToAdd"),
      timestamp: Date.now(),
    };
  }

  const propertyId = formData.get("propertyId") as string;
  const reference = formData.get("reference") as string;

  if (!valid) {
    return {
      error: `${t("failedToAdd")} ${reference} ${t("toFavorites")}`,
      timestamp: Date.now(),
    };
  }

  try {
    if (!propertyId) {
      return {
        error: t("propertyIdRequired"),
        timestamp: Date.now(),
      };
    }

    if (!token) {
      return {
        authenticated: t("mustBeLoggedInToAdd"),
        timestamp: Date.now(),
      };
    }

    await AddToFavorites(Number(propertyId), token);

    return {
      success: `${reference} ${t("successfullyAdded")}`,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error(t("addToFavoritesError"), error);

    return {
      error: `${t("failedToAdd")} ${reference} ${t("toFavorites")}`,
      timestamp: Date.now(),
    };
  }
}
