import { LoginForm } from "@/components/auth/login-form";
import {
  EAV_TWITTER_CREATOR_HANDLE,
  GEO_POSITION,
  WEBSITE_NAME,
} from "@/config/constants";
import { routing } from "@/i18n/routing";
import { loginMetadata } from "@/seo-metadata/login";
import { Metadata } from "next";
import React from "react";

interface SearchParams {
  callbackUrl: string;
}

interface Props {
  params: Promise<{ locale: string }>;
}

interface LoginPageProps {
  searchParams: Promise<SearchParams>;
}

const BASE_URL =
  process.env.BASE_URL || "https://www.exclusivealgarvevillas.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Get the localized path for the login page
  const loginPath = routing.pathnames["/login"];
  const localizedLoginPath =
    typeof loginPath === "string"
      ? loginPath
      : loginPath[locale as keyof typeof loginPath];

  // Build canonical URL for current locale
  const canonicalUrl = `${BASE_URL}/${locale}${localizedLoginPath}`;

  // Build alternate language URLs
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    const path =
      typeof loginPath === "string"
        ? loginPath
        : loginPath[loc as keyof typeof loginPath];

    languages[loc] = `${BASE_URL}/${loc}${path}`;
  });

  // Add x-default using default locale
  const defaultPath =
    typeof loginPath === "string"
      ? loginPath
      : loginPath[routing.defaultLocale as keyof typeof loginPath];
  languages["x-default"] = `${BASE_URL}/${routing.defaultLocale}${defaultPath}`;

  // ICBM coordinates
  const ICBM = `${GEO_POSITION.lat}, ${GEO_POSITION.lng}`;

  // Get metadata for current locale
  const metadata =
    loginMetadata[locale as keyof typeof loginMetadata] || loginMetadata.en;

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
          url: `${BASE_URL}/images/eav-dark-logo`,
          secureUrl: `${BASE_URL}/images/eav-dark-logo`,
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
      index: false, // Login pages should not be indexed
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

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl;
  return (
    <div className="flex items-center justify-center min-h-screen pt-20 pb-8">
      <LoginForm callbackUrl={callbackUrl} />
    </div>
  );
};

export default LoginPage;
