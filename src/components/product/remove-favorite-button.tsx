"use client";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ValidateToken } from "@/data/token";
import { signOut, useSession } from "next-auth/react";

export function DeleteFromFavoriteButton({
  propertyId,
  reference,
  className,
}: {
  propertyId: number;
  className?: string;
  reference: string;
}) {
  const t = useTranslations("removeFavoriteButton");
  const [pending, setPending] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const handleDeleteFavorite = async () => {
    // Wait for session to load
    if (status === "loading") {
      return;
    }

    setPending(true);

    try {
      // Get token from session
      const token = session?.accessToken;

      // Only validate if token exists
      if (token) {
        // Validate token and handle logout
        const { logout } = await ValidateToken(token);

        if (logout) {
          // Sign out on client without redirect
          await signOut({ redirect: false });
          toast.error(
            t("sessionExpired") || "Session expired. Please log in again."
          );
          setPending(false);
          return;
        }
      } else {
        // No token means user is not logged in
        toast.error(
          t("mustBeLoggedIn") || "You must be logged in to remove favorites."
        );
        setPending(false);
        return;
      }

      const response = await fetch(
        `/api/favorites/${propertyId}?currentPath=${encodeURIComponent(
          pathname
        )}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        toast.error(
          `${t("errorDeletingFromFavorites")} ${reference} ${t(
            "fromFavorites"
          )}`
        );
        return;
      }

      // Handle 204 No Content (successful deletion)
      if (response.status === 204) {
        toast.success(
          `${t("successfullyRemovedFromFavorites")} ${reference} ${t(
            "fromFavorites"
          )}`
        );
        return;
      }

      // For other successful responses with content
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        toast.success(
          `${t("successfullyRemovedFromFavorites")} ${reference} ${t(
            "fromFavorites"
          )}`
        );
      } else {
        toast.success(
          `${t("successfullyRemovedFromFavorites")} ${reference} ${t(
            "fromFavorites"
          )}`
        );
      }
    } catch (error) {
      console.error("Error deleting favorite:", error);
      toast.error(
        `${t("errorDeletingFromFavorites")} ${reference} ${t("fromFavorites")}`
      );
    } finally {
      setPending(false);
    }
  };

  const isLoading = pending || status === "loading";

  return (
    <>
      {isLoading ? (
        <Button
          variant="outline"
          disabled
          className={cn(
            "bg-primary-foreground p-2 h-6 w-6 rounded-full",
            className
          )}
        >
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
        </Button>
      ) : (
        <Button
          variant="default"
          disabled={isLoading}
          className={cn(
            "bg-gray-200 p-2 h-6 w-6 rounded-full hover:bg-black",
            className
          )}
          onClick={handleDeleteFavorite}
        >
          <Heart
            className="size-4 text-[#E21C49]"
            fill="#E21C49"
            strokeWidth={1}
          />
        </Button>
      )}
    </>
  );
}
