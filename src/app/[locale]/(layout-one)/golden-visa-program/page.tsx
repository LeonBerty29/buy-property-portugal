import React from "react";
import { ContactForm } from "@/components/shared/contact-form";
import DiscoverSection from "@/components/home/discover-section";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { GoldenVisaProgramHeroSection } from "./hero-section";
import { Metadata } from "next";
import { routing } from "@/i18n/routing";
import {
  EAV_TWITTER_CREATOR_HANDLE,
  GEO_POSITION,
  WEBSITE_NAME,
} from "@/config/constants";
import { goldenVisaProgramMetadata } from "@/seo-metadata/golden-visa-program";

interface Props {
  params: Promise<{ locale: string }>;
}

const BASE_URL =
  process.env.BASE_URL || "https://www.exclusivealgarvevillas.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Get the localized path for the golden visa program page
  const goldenVisaPath = routing.pathnames["/golden-visa-program"];
  const localizedGoldenVisaPath =
    typeof goldenVisaPath === "string"
      ? goldenVisaPath
      : goldenVisaPath[locale as keyof typeof goldenVisaPath];

  // Build canonical URL for current locale
  const canonicalUrl = `${BASE_URL}/${locale}${localizedGoldenVisaPath}`;

  // Build alternate language URLs
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    const path =
      typeof goldenVisaPath === "string"
        ? goldenVisaPath
        : goldenVisaPath[loc as keyof typeof goldenVisaPath];

    languages[loc] = `${BASE_URL}/${loc}${path}`;
  });

  // Add x-default using default locale
  const defaultPath =
    typeof goldenVisaPath === "string"
      ? goldenVisaPath
      : goldenVisaPath[routing.defaultLocale as keyof typeof goldenVisaPath];
  languages["x-default"] = `${BASE_URL}/${routing.defaultLocale}${defaultPath}`;

  // ICBM coordinates
  const ICBM = `${GEO_POSITION.lat}, ${GEO_POSITION.lng}`;

  // Get metadata for current locale
  const metadata =
    goldenVisaProgramMetadata[
      locale as keyof typeof goldenVisaProgramMetadata
    ] || goldenVisaProgramMetadata.en;

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
          url: `${BASE_URL}/images/become-a-vendor/marketing.png`,
          secureUrl: `${BASE_URL}/images/become-a-vendor/marketing.png`,
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
      audience: metadata.audience,
      "article:section": metadata.articleSection,
    },
  };
}

const GoldenVisaProgram = async () => {
  const t = await getTranslations("goldenVisaProgramPage");

  return (
    <>
      <div className="min-h-[500px] h-[50vh] relative mt-20">
        <GoldenVisaProgramHeroSection />
      </div>

      <div className="lg:container mx-auto px-6 md:px-12 lg:px-14 py-14 xl:pb-20">
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-14">
          <h2 className="text-2xl font-semibold mb-7">{t("whatIsRequired")}</h2>

          <p className="text-sm font-semibold mb-7">
            {t("noteGoldenVisaCeized")}
          </p>
          <p className="text-sm mb-7">{t("rulesResidencePermitDescription")}</p>

          <ul className="text-neutral-500 list-disc ml-4 mb-7 text-sm sm:text-base">
            <li>{t("residenceVisaWaiver")}</li>
            <li>{t("livingWorkingPortugal")}</li>
            <li>{t("schengenVisaExemption")}</li>
            <li>{t("familyReunification")}</li>
            <li>{t("applyingPermanentResidence")}</li>
            <li>{t("applyingPortugueseCitizenship")}</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-7">
            {t("eligibilityWhoMayApply")}
          </h2>

          <p className="text-sm mb-7">{t("eligibilityDescription")}</p>

          <ul className="text-neutral-500 list-disc ml-4 mb-7 text-sm sm:text-base space-y-5">
            <li>{t("capitalTransfer1_5Million")}</li>
            <li>{t("create10JobPositions")}</li>
            <li>{t("capitalTransfer500kResearch")}</li>
            <li>{t("capitalTransfer250kArtsHeritage")}</li>
            <li>{t("capitalTransfer500kInvestmentFunds")}</li>
            <li>{t("capitalTransfer500kCommercialSociety")}</li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-100">
        <div className="lg:container mx-auto px-6 md:px-12 lg:px-14 py-14 xl:pb-20">
          <h3 className="text-center mb-5 max-w-md mx-auto font-semibold text-2xl">
            {t("mandatoryOnlinePreRegistration")}
          </h3>

          <Button className="bg-primary text-white px-12 font-light mx-auto flex">
            {t("applyHere")}
          </Button>
        </div>
      </div>

      <div className="lg:container mx-auto px-6 md:px-12 lg:px-14 py-14 xl:pb-20">
        <div className="max-w-[800px] mx-auto xl:py-8">
          <ContactForm
            theme="light"
            titleStyling="text-center"
            submitBtnStyling="flex mx-auto"
          />
        </div>
      </div>

      <DiscoverSection />
    </>
  );
};

export default GoldenVisaProgram;
