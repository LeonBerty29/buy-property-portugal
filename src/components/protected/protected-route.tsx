"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import React from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  const router = useRouter()

  if (status !== "loading") {
    if (!session) {
      router.push("/login");
    }
  }

  return <>{children}</>;
};
