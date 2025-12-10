import { auth } from "@/auth";
import { ProtectedRoute } from "@/components/protected/protected-route";
import { UserProfileDisplay } from "@/components/settings/user-profile-display";
import { getUserProfile } from "@/data/user";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import React from "react";
import { Metadata } from "next";
import { routing } from "@/i18n/routing";
import {
  EAV_TWITTER_CREATOR_HANDLE,
  GEO_POSITION,
  WEBSITE_NAME,
} from "@/config/constants";
import { settingsMetadata } from "@/seo-metadata/settings";

interface Props {
  params: Promise<{ locale: string }>;
}

const BASE_URL =
  process.env.BASE_URL || "https://www.exclusivealgarvevillas.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Get localized metadata
  const metadata =
    settingsMetadata[locale as keyof typeof settingsMetadata] ||
    settingsMetadata.en;

  // Get the localized path for the settings page
  const settingsPath = routing.pathnames["/settings"];
  const localizedSettingsPath =
    typeof settingsPath === "string"
      ? settingsPath
      : settingsPath[locale as keyof typeof settingsPath];

  // Build canonical URL for current locale
  const canonicalUrl = `${BASE_URL}/${locale}${localizedSettingsPath}`;

  // Build alternate language URLs
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    const path =
      typeof settingsPath === "string"
        ? settingsPath
        : settingsPath[loc as keyof typeof settingsPath];

    languages[loc] = `${BASE_URL}/${loc}${path}`;
  });

  // Add x-default using default locale
  const defaultPath =
    typeof settingsPath === "string"
      ? settingsPath
      : settingsPath[routing.defaultLocale as keyof typeof settingsPath];
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
      images: [
        {
          url: `${BASE_URL}/images/account/settings.png`,
          secureUrl: `${BASE_URL}/images/account/settings.png`,
          width: 1200,
          height: 630,
          alt: `${metadata.title} - ${WEBSITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.ogTitle,
      description: metadata.ogDescription,
      creator: EAV_TWITTER_CREATOR_HANDLE,
    },
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nocache: true,
      nosnippet: true,
      googleBot: {
        index: false,
        follow: false,
        noarchive: true,
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

const SettingsPage = async () => {
  const session = await auth();
  const locale = await getLocale();

  if (!session || !session?.user) {
    return redirect({
      href: { pathname: "/login", query: { callbackUrl: "/settings" } },
      locale: locale,
    });
  }

  const accessToken = session?.accessToken;
  const userProfileResponse = await getUserProfile(accessToken);
  const userProfile = userProfileResponse.data.client;

  return (
    <ProtectedRoute>
      <div className="pt-24 container mx-auto max-w-5xl px-4 min-h-screen flex justify-center">
        <div className="space-y-6 h-fit w-full my-auto">
          <UserProfileDisplay
            userProfile={{
              firstName: userProfile.first_name,
              lastName: userProfile.last_name,
              phoneNumber: userProfile.phone,
              newsletter: userProfile.newsletter,
            }}
            accessToken={accessToken}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SettingsPage;
