"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("blogDetailsNotFoundPage");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full rounded-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m6 5.172a4 4 0 01-5.656 0L12 12.828 9.172 10a4 4 0 015.656 0l2.172 2.172z"
              />
            </svg>
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-2">
            {t("errorCode404")}
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {t("blogNotFound")}
          </h2>
          <p className="text-gray-600 mb-6">{t("blogNotFoundDescription")}</p>
        </div>

        <div className="space-y-4">
          <Link
            href="/blogs"
            className="inline-block w-full bg-primary hover:bg-black text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {t("browseAllBlogs")}
          </Link>

          <Link
            href="/"
            className="inline-block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {t("goToHomepage")}
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            {t("errorTip")}{" "}
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