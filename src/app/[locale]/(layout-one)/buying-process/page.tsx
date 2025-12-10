import { MultiStepPropertyForm } from "@/components/buying-process/property-request-multistep-form";
import Image from "next/image";
import React from "react";
import { TbBulbFilled } from "react-icons/tb";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { routing } from "@/i18n/routing";
import {
  EAV_TWITTER_CREATOR_HANDLE,
  GEO_POSITION,
  WEBSITE_NAME,
} from "@/config/constants";
import { buyingProcessMetadata } from "@/seo-metadata/buying-process";

interface Props {
  params: Promise<{ locale: string }>;
}

const BASE_URL =
  process.env.BASE_URL || "https://www.exclusivealgarvevillas.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Get metadata for the current locale
  const metadata =
    buyingProcessMetadata[locale as keyof typeof buyingProcessMetadata] ||
    buyingProcessMetadata.en;

  // Get the localized path for the buying process page
  const buyingProcessPath = routing.pathnames["/buying-process"];
  const localizedBuyingProcessPath =
    typeof buyingProcessPath === "string"
      ? buyingProcessPath
      : buyingProcessPath[locale as keyof typeof buyingProcessPath];

  // Build canonical URL for current locale
  const canonicalUrl = `${BASE_URL}/${locale}${localizedBuyingProcessPath}`;

  // Build alternate language URLs
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    const path =
      typeof buyingProcessPath === "string"
        ? buyingProcessPath
        : buyingProcessPath[loc as keyof typeof buyingProcessPath];

    languages[loc] = `${BASE_URL}/${loc}${path}`;
  });

  // Add x-default using default locale
  const defaultPath =
    typeof buyingProcessPath === "string"
      ? buyingProcessPath
      : buyingProcessPath[
          routing.defaultLocale as keyof typeof buyingProcessPath
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
      images: [
        {
          url: `${BASE_URL}/images/buying-process/buying-process-finalize.png`,
          secureUrl: `${BASE_URL}/images/buying-process/buying-process-finalize.png`,
          width: 1200,
          height: 630,
          alt: "Buying Process - Algarve Property Purchase Guide",
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

const BuyingProcessPage = async () => {
  const t = await getTranslations("buyingProcessPage");

  return (
    <>
      <div className="2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto pt-24">
        <div className="flex gap-y-5 justify-between py-5 md:py-8 flex-wrap">
          <div className="w-full lg:w-[40%] lg:min-w-[unset]">
            <h1 className="text-2xl lg:text-3xl max-w-70 mb-6 font-semibold">
              {t("buyingProcessInTheAlgarve")}
            </h1>
            <div className="pr-12 lg:px-0">
              <Image
                priority
                src="/images/buying-process/buying-process-1.png"
                width={459}
                height={250}
                alt="about-us"
                className="object-cover w-full aspect-video"
              />
              <Image
                priority
                src="/images/buying-process/buying-process-2.png"
                width={450}
                height={450}
                alt="about-us"
                className="object-cover w-full aspect-video -translate-1/2 translate-x-12"
              />
            </div>
          </div>

          <div className="w-full lg:w-[58%] lg:min-w-[unset] md:pl-8 lg:pl-14 order-1 md:order-2">
            <p className="text-black text-sm font-medium mb-7">
              {t("buyingIntroductionParagraph1")}
            </p>
            <div className="space-y-4">
              <p className="text-neutral-700 text-sm">
                {t("buyingIntroductionParagraph2")}
              </p>
              <p className="text-neutral-700 text-sm">
                {t("buyingIntroductionParagraph3")}
              </p>
              <p className="text-neutral-700 text-sm">
                {t("buyingIntroductionParagraph4")}
              </p>
              <p className="text-neutral-700 text-sm">
                {t("buyingIntroductionParagraph5")}
              </p>
              <p className="text-neutral-700 text-sm">
                {t("buyingIntroductionParagraph6")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Steps section */}
      <div className="2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto pb-16">
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-4">
          <li>
            <div className="bg-gray-100">
              <div className="w-full relative">
                <Image
                  width={646}
                  height={236}
                  src={"/images/buying-process/buying-process-search.png"}
                  alt="a compass and a house"
                  className="object-cover h-auto w-full"
                />
                <p className="absolute bottom-5 left-3 font-bold text-5xl bg-gradient-to-b from-white via-white/20 to-transparent bg-clip-text text-transparent">
                  {t("step1Search")}
                </p>
              </div>
              <div className="p-6 lg:p-10 space-y-3">
                <h3 className="text-primary font-semibold text-lg lg:text-2xl">
                  {t("searchHeading")}
                </h3>
                <p className="text-sm">{t("searchDescription")}</p>
              </div>
            </div>
          </li>
          <li>
            <div className="bg-gray-100">
              <div className="w-full relative">
                <Image
                  width={646}
                  height={236}
                  src={"/images/buying-process/buying-process-find.png"}
                  alt="a compass and a house"
                  className="object-cover h-auto w-full"
                />
                <p className="absolute bottom-5 left-3 font-bold text-5xl bg-gradient-to-b from-white via-white/20 to-transparent bg-clip-text text-transparent">
                  {t("step2Find")}
                </p>
              </div>
              <div className="p-6 lg:p-10 space-y-3">
                <h3 className="text-primary font-semibold text-lg lg:text-2xl">
                  {t("findHeading")}
                </h3>
                <p className="text-sm">{t("findDescription")}</p>
              </div>
            </div>
          </li>
          <li>
            <div className="bg-gray-100">
              <div className="w-full relative">
                <Image
                  width={646}
                  height={236}
                  src={"/images/buying-process/buying-process-buy.png"}
                  alt="a compass and a house"
                  className="object-cover h-auto w-full"
                />
                <p className="absolute bottom-5 left-3 font-bold text-5xl bg-gradient-to-b from-white via-white/20 to-transparent bg-clip-text text-transparent">
                  {t("step3Buy")}
                </p>
              </div>
              <div className="p-6 lg:p-10 space-y-3">
                <h3 className="text-primary font-semibold text-lg lg:text-2xl">
                  {t("buyHeading")}
                </h3>
                <p className="text-sm">{t("buyDescription")}</p>
              </div>
            </div>
          </li>
          <li>
            <div className="bg-gray-100">
              <div className="w-full relative">
                <Image
                  width={646}
                  height={236}
                  src={"/images/buying-process/buying-process-finalize.png"}
                  alt="a compass and a house"
                  className="object-cover h-auto w-full"
                />
                <p className="absolute bottom-5 left-3 font-bold text-5xl bg-gradient-to-b from-white via-white/20 to-transparent bg-clip-text text-transparent">
                  {t("step4BuyFinalize")}
                </p>
              </div>
              <div className="p-6 lg:p-10 space-y-3">
                <h3 className="text-primary font-semibold text-lg lg:text-2xl">
                  {t("buyFinalizeHeading")}
                </h3>
                <p className="text-sm">{t("buyFinalizeDescription")}</p>
              </div>
            </div>
          </li>
        </ol>
      </div>

      {/* Purchase steps outline */}
      <div className="2xl:container pt-0 pb-6 px-6 sm:px-8 md:px-10 lg:px-14 mx-auto py-14">
        <div className="flex items-center gap-y-5 justify-between pt-0 pb-6 md:py-8 flex-wrap">
          <div className="w-full md:w-[60%] lg:w-[48%] lg:min-w-[unset]">
            <h2 className="text-2xl lg:text-3xl font-semibold max-w-70 mb-6">
              {t("purchaseStepsOutline")}
            </h2>

            <div className="space-y-4">
              <p className="text-neutral-700 text-sm">
                {t("powerOfAttorneyDescription")}
              </p>
              <p className="text-neutral-700 text-sm">
                {t("lawyerAndCpcvDescription")}
              </p>
              <p className="text-neutral-700 text-sm">
                {t("contractSigningDescription")}
              </p>
            </div>
          </div>

          <div className="w-full hidden md:block md:w-[38%] lg:min-w-[unset] md:pl-8 lg:pl-14">
            <Image
              priority
              src="/images/buying-process/purchase-step.png"
              width={344}
              height={100}
              alt="about-us"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Buy & own section */}
      <div className="2xl:container pt-0 px-6 sm:px-8 md:px-10 lg:px-14 mx-auto py-14">
        <div className="flex flex-col md:flex-row gap-y-5 gap-x-12 lg:gap-x-24 pt-0 pb-6 md:py-8">
          <p className="text-7xl font-semibold text-primary tracking-tighter opacity-50">
            {t("buyAndOwnNumber")}
          </p>
          <div className="w-full">
            <h2 className="text-lg lg:text-xl font-semibold max-w-70 mb-6">
              {t("buyAndOwnHeading")}
            </h2>

            <div className="space-y-4 max-w-[750px]">
              <p className="text-neutral-700 text-sm">
                {t("buyAndOwnParagraph1")}
              </p>
              <p className="text-neutral-700 text-sm">
                {t("buyAndOwnParagraph2")}
              </p>
              <p className="text-neutral-700 text-sm">
                {t("buyAndOwnParagraph3")}
              </p>
              <p className="text-neutral-700 text-sm">
                {t("buyAndOwnParagraph4")}
              </p>

              <div className="bg-black/90 text-white p-3 flex items-center gap-6 flex-nowrap w-fit mt-10">
                <div className="p-3 bg-neutral-800/75 w-fit">
                  <TbBulbFilled className="h-5 w-5 fill-primary" />
                </div>

                <div>
                  <h4 className="text-primary font-semibold text-base">
                    {t("tipsTitle")}
                  </h4>
                  <p className="text-sm text-white/75">
                    {t("tipsDescription")}
                  </p>
                </div>
              </div>
            </div>

            {/* Registration of property section */}
            <div className="flex flex-col md:flex-row gap-y-5 gap-x-12 lg:gap-x-24 pt-0 pb-6 md:py-8 mt-5 md:mt-14 lg:mt-24">
              <p className="text-7xl font-semibold text-primary tracking-tighter opacity-50">
                {t("registrationOfPropertyNumber")}
              </p>
              <div className="w-full">
                <h2 className="text-lg lg:text-xl font-semibold max-w-70 mb-6">
                  {t("registrationOfPropertyHeading")}
                </h2>

                <div className="space-y-4 max-w-[750px]">
                  <p className="text-neutral-700 text-sm">
                    {t("registrationDescription1")}
                  </p>
                  <p className="text-neutral-700 text-sm">
                    {t("registrationDescription2")}
                  </p>
                  <p className="text-neutral-700 text-sm">
                    {t("registrationDescription3")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="2xl:container pt-0 px-6 sm:px-8 md:px-10 lg:px-14 mx-auto py-14">
        <MultiStepPropertyForm />
      </div>
    </>
  );
};

export default BuyingProcessPage;
