"use client";
import React from "react";
import { Button } from "../ui/button";
import {
  Link,
  usePathname,
  // usePathname
} from "@/i18n/navigation";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export const AddNoteRedirectBtn = ({ propertyId }: { propertyId: number }) => {
  // const pathname = usePathname();
  const t = useTranslations("addNoteRedirectBtn");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = useParams();
  const paramsString = searchParams.toString();

  const url =
    pathname === "/properties/[slug]"
      ? `/properties/${params.propertyId}/?addNote=${propertyId}${
          paramsString ? `&${paramsString}` : ""
        }`
      : `/${pathname}/?addNote=${propertyId}${
          paramsString ? `&${paramsString}` : ""
        }`;
  return (
    <Button asChild className="bg-primary text-white">
      <Link
        href={{
          pathname: "/login",
          query: { callbackUrl: url },
        }}
      >
        {t("login")}
      </Link>
    </Button>
  );
};
