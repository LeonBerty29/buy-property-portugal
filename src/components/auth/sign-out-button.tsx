"use client"

// import { signOut } from "@/auth";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import React from "react";
import { toast } from "sonner";

export const SignOutButton = ({ className }: { className?: string }) => {

  const t = useTranslations("signOutButton");

  async function handleSignOut() {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
    })

    const response = await res.json()

    if (response.success) {
      signOut({redirectTo:"/login"})
    } else {
      toast.error(response.message, {
        duration: 1000
      })
    }
  }

  return (
      <button type="submit" className={className} onClick={handleSignOut}>
        {t("signOut")}
      </button>
  );
};
