"use client";
import { addToFavorite } from "@/actions/favorites";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart, Loader2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";

export function AddToFavoriteButton({
  className,
  propertyId,
  reference,
  isFavourite: initialIsFavourite,
}: {
  className?: string;
  propertyId: number;
  reference: string;
  isFavourite: boolean;
}) {
  const t_add = useTranslations("submitButtons");
  const t_del = useTranslations("removeFavoriteButton");
  const [state, formAction, isPending] = useActionState(addToFavorite, {});
  const { status } = useSession();

  // Local state management
  const [isFavourite, setIsFavourite] = useState(initialIsFavourite);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle add to favorites success
  useEffect(() => {
    if (state.success) {
      toast.success(`${state.success}`);
      setIsFavourite(true); // Update local state on success
    }
    if (state.error) {
      toast.error(`${state.error}`);
    }
    if (state.authenticated) {
      toast.error(`${state.authenticated}`, {
        duration: 2000,
        action: (
          <Button asChild className="bg-primary text-white hover:bg-black">
            <Link href={"/login"}>{t_add("login")}</Link>
          </Button>
        ),
      });
    }
  }, [state.success, state.error, state.authenticated, state.timestamp, t_add]);

  // Handle delete from favorites
  const handleDeleteFavorite = async () => {
    if (status === "loading") {
      return;
    }

    setIsDeleting(true);

    try {
      // Validate token using the API route wrapper
      const validateResponse = await fetch("/api/validate-token");

      if (!validateResponse.ok) {
        const validateData = await validateResponse.json();

        if (validateData.logout) {
          await signOut({ redirect: false });
          toast.error(
            t_del("sessionExpired") || "Session expired. Please log in again."
          );
        } else {
          toast.error(
            t_del("mustBeLoggedIn") ||
              "You must be logged in to remove favorites."
          );
        }
        setIsDeleting(false);
        return;
      }

      const validateData = await validateResponse.json();

      if (!validateData.valid) {
        if (validateData.logout) {
          await signOut({ redirect: false });
          toast.error(
            t_del("sessionExpired") || "Session expired. Please log in again."
          );
        } else {
          toast.error(
            t_del("mustBeLoggedIn") ||
              "You must be logged in to remove favorites."
          );
        }
        setIsDeleting(false);
        return;
      }

      // Proceed with delete after successful validation
      const response = await fetch(`/api/favorites/${propertyId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast.error(
          `${t_del("errorDeletingFromFavorites")} ${reference} ${t_del(
            "fromFavorites"
          )}`
        );
        return;
      }

      // Update local state on successful deletion
      setIsFavourite(false);

      toast.success(
        `${t_del("successfullyRemovedFromFavorites")} ${reference} ${t_del(
          "fromFavorites"
        )}`
      );
    } catch (error) {
      console.error("Error deleting favorite:", error);
      toast.error(
        `${t_del("errorDeletingFromFavorites")} ${reference} ${t_del(
          "fromFavorites"
        )}`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const isLoading = isPending || isDeleting || status === "loading";

  return (
    <>
      {isFavourite && (
        <>
          {isDeleting ? (
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
      )}

      {!isFavourite && (
        <form action={formAction}>
          <input type="hidden" name="propertyId" value={propertyId} />
          <input type="hidden" name="reference" value={reference} />

          {isPending ? (
            <Button
              variant="outline"
              size="icon"
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
              className={cn(
                "bg-white p-2 h-6 w-6 rounded-full hover:bg-gray-200",
                className
              )}
            >
              <Heart className="size-4 text-black" />
            </Button>
          )}
        </form>
      )}
    </>
  );
}
