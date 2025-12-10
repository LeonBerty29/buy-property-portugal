"use client";

import { Button } from "@/components/ui/button";
import { Home, Search, Building2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("propertyDetailsNotFoundPage");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon with glow effect */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto relative">
            <div className="relative bg-gradient-to-r from-purple-500 to-primary rounded-2xl w-full h-full flex items-center justify-center">
              <Building2 className="w-12 h-12 text-white animate-pulse" />
            </div>
          </div>
          <Search
            className="absolute -top-2 -right-4 w-8 h-8 text-black animate-spin"
            style={{ animationDuration: "3s" }}
          />
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("propertyNotFound")}
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            {t("vanishedIntoThinAir")}
          </p>
          <p className="text-sm text-gray-500">
            {t("soldRemovedOrIncorrectLink")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <Button
              asChild
              className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg border border-gray-200 transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
            >
              <Link href="/">
                <Home className="w-5 h-5" />
                {t("home")}
              </Link>
            </Button>

            <Button
              asChild
              className="flex-1 bg-primary hover:bg-black border-primary hover:border-black text-white font-semibold py-3 px-6 rounded-lg border transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
            >
              <Link href="/properties">
                <Search className="w-5 h-5" />
                {t("browseProperties")}
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            {t("believeError")}&nbsp;
            <Link
              href="/contact"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {t("contactUs")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
