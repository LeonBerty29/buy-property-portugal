import { ForgotPasswordForm } from "@/components/forgot-password/forgot-password-form";
import React from "react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { BASE_URL, GEO_POSITION, WEBSITE_NAME } from "@/config/constants";
import { routing } from "@/i18n/routing";
import { accountForgotPasswordMetadata } from "@/seo-metadata/account-forgot-password";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Get localized metadata
  const metadata =
    accountForgotPasswordMetadata[
      locale as keyof typeof accountForgotPasswordMetadata
    ] || accountForgotPasswordMetadata.en;

  // Get the localized path for the forgot password page
  const forgotPasswordPath = routing.pathnames["/account/forgot-password"];
  const localizedForgotPasswordPath =
    typeof forgotPasswordPath === "string"
      ? forgotPasswordPath
      : forgotPasswordPath[locale as keyof typeof forgotPasswordPath];

  // Build canonical URL for current locale
  const canonicalUrl = `${BASE_URL}/${locale}${localizedForgotPasswordPath}`;

  // Build alternate language URLs
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    const path =
      typeof forgotPasswordPath === "string"
        ? forgotPasswordPath
        : forgotPasswordPath[loc as keyof typeof forgotPasswordPath];

    languages[loc] = `${BASE_URL}/${loc}${path}`;
  });

  // Add x-default using default locale
  const defaultPath =
    typeof forgotPasswordPath === "string"
      ? forgotPasswordPath
      : forgotPasswordPath[
          routing.defaultLocale as keyof typeof forgotPasswordPath
        ];
  languages["x-default"] = `${BASE_URL}/${routing.defaultLocale}${defaultPath}`;

  // ICBM coordinates
  const ICBM = `${GEO_POSITION.lat}, ${GEO_POSITION.lng}`;

  return {
    title: `${metadata.title} | ${WEBSITE_NAME}`,
    description: metadata.description,
    keywords: [...metadata.keywords],
    openGraph: {
      title: metadata.ogTitle,
      description: metadata.ogDescription,
      url: canonicalUrl,
      siteName: WEBSITE_NAME,
      locale: locale,
      type: "website",
    },
    robots: {
      index: false,
      follow: true,
      noarchive: true,
      nosnippet: true,
      googleBot: {
        index: false,
        follow: true,
      },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: languages,
    },
    other: {
      "geo.region": "PT",
      "geo.position": `${GEO_POSITION.lat};${GEO_POSITION.lng}`,
      ICBM: ICBM,
      classification: metadata.classification,
      category: metadata.category,
      "DC.title": metadata.dcTitle,
    },
  };
}

const page = async () => {
  const t = await getTranslations("accountForgotPasswordPage");

  return (
    <div className="h-screen w-full flex flex-col align-center justify-center py-24 px-6 md:px-10 container mx-auto">
      <div className="space-y-4 mt-5 shadow-2xl w-fit p-8 rounded-xl mx-auto border-gray-100">
        <div className="border-b pb-3">
          <p className="text-gray-600 mb-2 font-semibold text-xl">
            {t("forgotPasswordHeading")}
          </p>
        </div>
        <p className="text-gray-700 font-light text-base text-center max-w-xl mx-auto">
          {t("forgotPasswordDescription")}
        </p>

        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default page;
