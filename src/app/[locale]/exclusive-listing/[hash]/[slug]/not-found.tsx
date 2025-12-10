"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ExclusiveListingSearchInput } from "../exclusing-listing-search";
import { HashLanguageSwitcherDropdown } from "@/components/shared/hash-language-switcher-dropdown";

export default function NotFound() {
  const t = useTranslations("notFoundExlclusivePropertiesdetails");

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-indigo-50 flex flex-col items-center justify-center px-4">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <Link href="/">
            <Image
              src={"/images/buyproperytyportugal-logo-dark.png"}
              alt="Buy Property Portugal Logo"
              width={70}
              height={50}
              className="object-contain h-10 w-20 lg:h-15 lg:w-30"
            />
          </Link>

          <div className="">
            <HashLanguageSwitcherDropdown />
          </div>
        </div>
        <div className="max-w-md w-full text-center space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {t("propertyNotFoundHeading")}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t("propertyNotFoundDescription")}
            </p>
          </div>

          <ExclusiveListingSearchInput className="placeholder:text-gray-400 border text-gray-600" />
          <Link href="/properties">
            <Button className="mt-6 bg-black text-white hover:bg-primary hover:scale-105 transition-colors">
              {t("browseCatalogueButton")}
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
