"use client";
import React, { useEffect, useMemo, useRef } from "react";
import { Button } from "../ui/button";
import { usePathname, Link } from "@/i18n/navigation";
import { useSession, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SignOutButton } from "./sign-out-button";
import { useTranslations } from "next-intl";
import { validateAndRefreshSessionClient } from "@/actions/token-validity";

const NavbarUserAuth = () => {
  const t = useTranslations("navbarUserAuth");
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isValidatingRef = useRef(false);

  // Create a combined key from pathname and search params
  const routeKey = useMemo(() => {
    return `${pathname}?${searchParams.toString()}`;
  }, [pathname, searchParams]);

  // Validate session with backend and update whenever the route changes
  useEffect(() => {
    const validateAndUpdate = async () => {
      // Prevent concurrent validations
      if (isValidatingRef.current || status === "loading") {
        return;
      }

      // Only validate if we have a session
      if (!session?.accessToken) {
        return;
      }

      isValidatingRef.current = true;

      try {
        const { valid, expired } = await validateAndRefreshSessionClient(
          session.accessToken
        );

        if (!valid && expired) {
          // Token expired (401) - sign out on client side
          // console.log("Session expired, signing out client");
          // Use client-side signOut to immediately clear the session
          await signOut({ redirect: false });
        }
      } catch (error) {
        console.error("Session validation error:", error);
        throw new Error("Session validation error: There was an error getting the user")
        // Optionally sign out on critical errors
        // await signOut({ redirect: false });
      } finally {
        isValidatingRef.current = false;
      }
    };

    validateAndUpdate();
  }, [routeKey, session?.accessToken, status]);

  if (status === "loading") {
    return null;
  }

  return (
    <>
      {session?.user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full bg-black hover:bg-black/90 text-white min-h-9 aspect-square text-lg font-light flex items-center justify-center uppercase cursor-pointer transition-colors">
              {session?.user?.email?.[0]}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                {t("settings")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/favorites" className="cursor-pointer">
                {t("favourites")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/annotations" className="cursor-pointer">
                {t("annotationsNotes")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <SignOutButton className="cursor-pointer w-full" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          className="rounded-none bg-black hover:bg-black/90 text-white px-6 text-sm font-light"
          asChild
        >
          <Link href="/login">{t("signIn")}</Link>
        </Button>
      )}
    </>
  );
};

export default NavbarUserAuth;
