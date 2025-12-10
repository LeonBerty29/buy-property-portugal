"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

export default function LogoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl");

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Sign out the user
        await signOut({ redirect: false });

        // Redirect to login with callback URL if provided
        const loginUrl = callbackUrl
          ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
          : "/login";

        // @ts-expect-error -- Typescript will validate only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks
        router.push(loginUrl);
      } catch (error) {
        console.error("Logout error:", error);
        // Fallback: redirect to login even if logout fails
        router.push("/login");
      }
    };

    handleLogout();
  }, [callbackUrl, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
        <div className="space-y-2">
          <p className="text-gray-600">
            Please wait a minute...
          </p>
        </div>
      </div>
    </div>
  );
}
