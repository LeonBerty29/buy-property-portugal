import { PartnershipRequestForm } from "@/components/partnership-request/partnership-request-form";
import { getTranslations } from "next-intl/server";
import React from "react";
import { Metadata } from "next";
import {
  BASE_URL,
  GEO_POSITION,
  WEBSITE_NAME,
  EAV_TWITTER_CREATOR_HANDLE,
} from "@/config/constants";
import { routing } from "@/i18n/routing";
import { agentMetadata } from "@/seo-metadata/agent";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Get localized metadata
  const metadata =
    agentMetadata[locale as keyof typeof agentMetadata] || agentMetadata.en;

  // Get the localized path for the partnership request page
  const partnershipPath = routing.pathnames["/agent"];
  const localizedPartnershipPath =
    typeof partnershipPath === "string"
      ? partnershipPath
      : partnershipPath[locale as keyof typeof partnershipPath];

  // Build canonical URL for current locale
  const canonicalUrl = `${BASE_URL}/${locale}${localizedPartnershipPath}`;

  // Build alternate language URLs
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    const path =
      typeof partnershipPath === "string"
        ? partnershipPath
        : partnershipPath[loc as keyof typeof partnershipPath];

    languages[loc] = `${BASE_URL}/${loc}${path}`;
  });

  // Add x-default using default locale
  const defaultPath =
    typeof partnershipPath === "string"
      ? partnershipPath
      : partnershipPath[routing.defaultLocale as keyof typeof partnershipPath];
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
          url: `${BASE_URL}/images/about/about-img-2.png`,
          secureUrl: `${BASE_URL}/images/about/about-img-2.png`,
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
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
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
    },
  };
}

const page = async () => {
  const t = await getTranslations("agentPage");
  return (
    <>
      <section className="2xl:container w-full mx-auto px-6 sm:px-8 md:px-10 lg:px-14 pt-24 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-primary">
            {t("agentHeading")}
          </h1>
          <PartnershipRequestForm />
        </div>
      </section>
    </>
  );
};

export default page;
