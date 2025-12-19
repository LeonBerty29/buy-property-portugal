import { RegisterForm } from "@/components/auth/register-form";
import React from "react";
import { Metadata } from "next";
import { routing } from "@/i18n/routing";
import {
  EAV_TWITTER_CREATOR_HANDLE,
  GEO_POSITION,
  WEBSITE_NAME,
} from "@/config/constants";
import { registerMetadata } from "@/types/register";

interface SearchParams {
  callbackUrl: string;
}

interface RegisterPageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ locale: string }>;
}

const BASE_URL =
  process.env.BASE_URL || "https://www.exclusivePortugalvillas.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // Get the localized path for the register page
  const registerPath = routing.pathnames["/register"];
  const localizedRegisterPath =
    typeof registerPath === "string"
      ? registerPath
      : registerPath[locale as keyof typeof registerPath];

  // Build canonical URL for current locale
  const canonicalUrl = `${BASE_URL}/${locale}${localizedRegisterPath}`;

  // Build alternate language URLs
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    const path =
      typeof registerPath === "string"
        ? registerPath
        : registerPath[loc as keyof typeof registerPath];

    languages[loc] = `${BASE_URL}/${loc}${path}`;
  });

  // Add x-default using default locale
  const defaultPath =
    typeof registerPath === "string"
      ? registerPath
      : registerPath[routing.defaultLocale as keyof typeof registerPath];
  languages["x-default"] = `${BASE_URL}/${routing.defaultLocale}${defaultPath}`;

  // ICBM coordinates
  const ICBM = `${GEO_POSITION.lat}, ${GEO_POSITION.lng}`;

  // Get metadata for current locale
  const metadata =
    registerMetadata[locale as keyof typeof registerMetadata] ||
    registerMetadata.en;

  return {
    title: `${metadata.title} | ${WEBSITE_NAME}`,
    description: metadata.description,
    keywords: [...metadata.keywords],
    openGraph: {
      title: metadata.ogTitle,
      description: metadata.description,
      url: canonicalUrl,
      siteName: WEBSITE_NAME,
      locale: locale,
      type: "website",
      images: [
        {
          url: `${BASE_URL}/images/buyproperytyportugal-logo-dark.png`,
          secureUrl: `${BASE_URL}/images/buyproperytyportugal-logo-dark.png`,
          width: 1200,
          height: 630,
          alt: metadata.ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.ogTitle,
      description: metadata.description,
      creator: EAV_TWITTER_CREATOR_HANDLE,
    },
    robots: {
      index: false, // Registration pages should not be indexed
      follow: true,
      nocache: true,
      googleBot: {
        index: false,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
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
      audience: metadata.audience,
      "article:section": metadata.articleSection,
    },
  };
}

const RegisterPage = async ({ searchParams }: RegisterPageProps) => {
  const searchParamsData = await searchParams;
  const callbackUrl = searchParamsData.callbackUrl;

  return (
    <div className="flex items-center justify-center min-h-screen pt-24 pb-8">
      <RegisterForm callbackUrl={callbackUrl} />
    </div>
  );
};

export default RegisterPage;
