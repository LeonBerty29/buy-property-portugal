import Image from "next/image";
import React from "react";
import DiscoverSection from "@/components/home/discover-section";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import AnimatedImagesSection from "@/components/shared/animated-image-section";
import { ContactForm } from "@/components/shared/contact-form";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { EAV_TWITTER_CREATOR_HANDLE, WEBSITE_NAME } from "@/config/constants";
import { becomeAVendorMetadata } from "@/seo-metadata/become-avendor";

interface Props {
  params: Promise<{ locale: string }>;
}

const BASE_URL =
  process.env.BASE_URL || "https://www.exclusivealgarvevillas.com";

// Geographic coordinates for Algarve
const GEO_POSITION = { lat: 37.245425, lng: -8.150925 };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Get localized metadata
  const metadata =
    becomeAVendorMetadata[locale as keyof typeof becomeAVendorMetadata] ||
    becomeAVendorMetadata.en;

  // Get the localized path for the become a vendor page
  const vendorPath = routing.pathnames["/become-a-vendor"];
  const localizedVendorPath =
    typeof vendorPath === "string"
      ? vendorPath
      : vendorPath[locale as keyof typeof vendorPath];

  // Build canonical URL for current locale
  const canonicalUrl = `${BASE_URL}/${locale}${localizedVendorPath}`;

  // Build alternate language URLs
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    const path =
      typeof vendorPath === "string"
        ? vendorPath
        : vendorPath[loc as keyof typeof vendorPath];

    languages[loc] = `${BASE_URL}/${loc}${path}`;
  });

  // Add x-default using default locale
  const defaultPath =
    typeof vendorPath === "string"
      ? vendorPath
      : vendorPath[routing.defaultLocale as keyof typeof vendorPath];
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
          url: `${BASE_URL}/images/become-a-vendor/documentation-order.png`,
          secureUrl: `${BASE_URL}/images/become-a-vendor/documentation-order.png`,
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

const BecomeAVendor = async () => {
  const t = await getTranslations("becomeAVendorPage");

  return (
    <>
      <div className="lg:container mx-auto px-6 md:px-12 lg:px-14 pt-24 pb-12">
        <div className="flex items-start gap-y-5 justify-between py-5 md:py-8 flex-wrap">
          <div className="w-full lg:w-[50%] md:pr-8 lg:pr-14">
            <p className="text-primary font-light text-sm mb-2">
              {t("becomeAVendor")}
            </p>
            <h1 className="text-2xl lg:text-3xl font-semibold sm:max-w-70 mb-6">
              {t("sellMyPropertyInTheAlgarve")}
            </h1>

            <p className="text-black font-medium mb-4 text-sm xl:text-base">
              {t("youDecidedToSellYourPropertyInTheAlgarve")}
            </p>
            <div className="space-y-4">
              <p className="text-black/75 text-sm xl:text-base">
                {t("vendorsOftenFeelOverwhelmedWithBureaucracy")}
              </p>
              <p className="text-black/75 text-sm xl:text-base">
                {t("observeYourPropertyPriorToMarket")}
              </p>
              <p className="text-black/75 text-sm xl:text-base">
                {t("youGuessItRight")}
              </p>
            </div>
          </div>

          {/* 4-Box Layout */}
          <div className="w-full lg:w-[50%] relative flex justify-center lg:justify-end">
            <ol className="ml-auto grid sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0 list-none">
              {/* Box 1 */}
              <li className="bg-gray-100 p-6 shadow-md">
                <div className="w-8 h-8 bg-primary text-white flex items-center justify-center text-lg font-medium mb-4">
                  1
                </div>
                <h3 className="text-primary font-semibold mb-3 text-sm">
                  {t("stageYourProperty")}
                </h3>
                <p className="text-black/75 text-xs leading-relaxed">
                  {t("observeYourPropertyPriorToMarket")}
                </p>
              </li>

              {/* Box 2 - Offset down */}
              <li className="bg-black text-white p-6 shadow-md sm:translate-y-12">
                <div className="w-8 h-8 bg-primary text-white flex items-center justify-center text-lg font-medium mb-4">
                  2
                </div>
                <h3 className="text-white font-semibold mb-3 text-sm">
                  {t("propertyDocumentation")}
                </h3>
                <p className="text-white/75 text-xs leading-relaxed">
                  {t("importantPropertyDocumentsInOrder")}
                </p>
              </li>

              {/* Box 3 */}
              <li className="bg-primary text-white p-6 shadow-md">
                <div className="w-8 h-8 bg-white text-primary flex items-center justify-center text-lg font-medium mb-4">
                  3
                </div>
                <h3 className="text-white font-semibold mb-3 text-sm">
                  {t("readyToSell")}
                </h3>
                <p className="text-white/90 text-xs leading-relaxed">
                  {t("propertyLookingBestAndSignedContract")}
                </p>
              </li>

              {/* Box 4 - Offset down */}
              <li className="bg-gray-100 p-6 shadow-md sm:translate-y-12">
                <div className="w-8 h-8 bg-primary text-white flex items-center justify-center text-lg font-medium mb-4">
                  4
                </div>
                <h3 className="text-primary font-semibold mb-3 text-sm">
                  {t("marketing")}
                </h3>
                <p className="text-black/75 text-xs leading-relaxed">
                  {t("propertyDisplayedWideNetwork")}
                </p>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 text-primary py-18">
        <h2 className="text-center text-2xl lg:text-3xl font-semibold mb-4 px-4">
          {t("isMyPropertyMaintenanceAllDoneLine1")}
          <br /> {t("isMyPropertyMaintenanceAllDoneLine2")}
        </h2>
        <div className="lg:container mx-auto px-6 md:px-12 lg:px-14">
          <div className="flex items-center gap-y-5 justify-between py-5 md:py-8 flex-wrap">
            <AnimatedImagesSection />

            <div className="w-full lg:w-[50%] lg:min-w-[unset] lg:pl-14 order-1 lg:order-2">
              <div className="space-y-4">
                <p className="text-white/75 text-sm xl:text-base">
                  {t("stagingYourPropertyIsEssential")}
                </p>
                <p className="text-white/75 text-sm xl:text-base">
                  {t("presentYourPropertyWellMaintained")}
                </p>
                <p className="text-white/75 text-sm xl:text-base">
                  {t("takeCareOfRepairsBeforeMarket")}
                </p>

                <Button className="text-white bg-primary hover:bg-black transition-colors mt-4">
                  {t("becomeAVendor")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:container mx-auto px-6 md:px-12 lg:px-14">
        <div className="flex items-center gap-y-5 justify-between flex-wrap pt-12 lg:pt-0">
          <div className="w-full lg:w-[50%] md:pr-8 lg:pr-14">
            <h2 className="text-2xl lg:text-3xl font-semibold mb-6">
              {t("isMyPropertyDocumentationInOrder")}
            </h2>
            <p className="text-neutral-700 text-sm xl:text-base mb-5 md:mb-0">
              {t("importantDocumentsBeforeListing")}
            </p>
          </div>

          <Image
            priority
            src="/images/become-a-vendor/documentation-order.png"
            width={746}
            height={460}
            alt="about-us"
            className="object-cover w-full h-72 lg:w-[50%]  lg:h-[480px] md:h-auto"
          />
        </div>
      </div>

      <RealEstateChecklist t={t} />

      <div className="lg:container mx-auto px-6 md:px-12 lg:px-14 py-12">
        <div className="flex items-center gap-y-5 justify-between py-5 md:py-8 flex-wrap">
          <Image
            priority
            src="/images/become-a-vendor/no-contract-sell.png"
            width={746}
            height={460}
            alt="about-us"
            className="object-cover w-full h-72 lg:w-[50%]  lg:h-[480px] md:h-auto order-2 lg:order-1"
          />

          <div className="w-full lg:w-[50%] lg:min-w-[unset] lg:pl-14 order-1 lg:order-2">
            <h3 className="text-2xl lg:text-3xl font-semibold sm:max-w-70 mb-6">
              {t("noContractNoSale")}
            </h3>
            <div className="space-y-3">
              <p className="text-neutral-700 text-sm xl:text-base">
                {t("licensedRealEstateAgency")}
              </p>
              <p className="text-neutral-700 text-sm xl:text-base">
                <>{t("signedContractRequiredForListing")}</>
              </p>
              <p className="text-neutral-700 text-sm xl:text-base">
                {t("mediationContractsValidSixMonths")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-y-5 justify-between py-5 md:py-8 flex-wrap">
          <div className="w-full lg:w-[50%] md:pr-8 lg:pr-14">
            <h3 className="text-2xl lg:text-3xl font-semibold sm:max-w-70 mb-6">
              {t("readyToSell")}
            </h3>

            <div className="space-y-3">
              <p className="text-neutral-700 text-sm xl:text-base">
                {t("propertyLookingBestDocumentsInOrder")}
              </p>
              <p className="text-neutral-700 text-sm xl:text-base">
                {t("professionalTeamMarketsProperty")}
              </p>
              <p className="text-neutral-700 text-sm xl:text-base">
                {t("highEndLuxuryRealEstateServices")}
              </p>
            </div>
          </div>

          <Image
            priority
            src="/images/become-a-vendor/ready-to-sell.png"
            width={746}
            height={460}
            alt="about-us"
            className="object-cover w-full h-72 lg:w-[50%]  lg:h-[480px] md:h-auto"
          />
        </div>

        <div className="flex items-center gap-y-5 justify-between py-5 md:py-8 flex-wrap">
          <Image
            priority
            src="/images/become-a-vendor/marketing.png"
            width={746}
            height={460}
            alt="about-us"
            className="object-cover w-full h-72 lg:w-[50%]  lg:h-[480px] md:h-auto order-2 lg:order-1"
          />

          <div className="w-full lg:w-[50%] lg:min-w-[unset] lg:pl-14 order-1 lg:order-2">
            <h3 className="text-2xl lg:text-3xl font-semibold sm:max-w-70 mb-6">
              {t("marketing")}
            </h3>
            <div className="space-y-3">
              <p className="text-neutral-700 text-sm xl:text-base">
                {t("propertyDisplayedWideNetwork")}
              </p>
              <p className="text-neutral-700 text-sm xl:text-base">
                <Link
                  href={"/phone-contact1"}
                  className="text-primary hover:underline"
                >
                  +351 282 353 019
                </Link>{" "}
                {t("or")}{" "}
                <Link href="/email" className="text-primary hover:underline">
                  info@eavillas.com
                </Link>{" "}
                {t("happyToAssistYou")}
              </p>
              <p className="text-neutral-700 text-sm xl:text-base">
                {t("useWebformBelow")}
              </p>
              <p className="text-neutral-700 text-sm xl:text-base">
                {t("thankYouForTrust")}
              </p>

              <Button className="text-white bg-primary hover:bg-black transition-colors mt-4">
                {t("discoverOurStrategy")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:container mx-auto px-6 md:px-12 lg:px-14 py-14 xl:pb-20">
        <div className="max-w-[800px] mx-auto">
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

export default BecomeAVendor;

function RealEstateChecklist({ t }: { t: (key: string) => string }) {
  const checklistItems = [
    t("passportOrOtherIdOfSeller"),
    t("copyOfFiscalIdNumber"),
    t("companySellingPropertyShareCertificates"),
    t("cadernetaPredialFinancas"),
    t("certidaoDeTeorConservatoria"),
    t("licencaDeHabitacaoCamara"),
    t("fichaTecnicaCamara"),
    t("energyCertificate"),
    t("floorPlansFinalVersion"),
    t("boreholeRegistrationIfApplicable"),
    t("septicTankRegistrationIfApplicable"),
  ];

  return (
    <div className="mt-5">
      <div className="relative flex items-start gap-y-5 justify-between flex-wrap">
        <div className="w-full">
          <div className="bg-gray-200">
            <div className="lg:container mx-auto px-6 md:px-12 lg:px-14 py-10 md:py-24">
              <h3 className="text-2xl lg:text-3xl font-semibold uppercase w-full md:w-1/2 pr-5 lg:max-w-[450px]">
                {t("quickChecklistTitle")}
              </h3>
            </div>
          </div>
          <div className="lg:container mx-auto px-6 md:px-12 lg:px-14 py-10 md:py-24">
            <p className="w-full md:w-1/2 max-w-[650px]  pr-5 text-neutral-700 text-sm xl:text-base md:mb-0">
              {t("checklistPurposeDescription")}
            </p>
          </div>
        </div>

        <div className="max-w-[650px] space-y-3 bg-white shadow-lg rounded-lg p-10 border border-gray-100 md:absolute md:left-1/2 md:top-24">
          {checklistItems.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="size-5 border border-gray-500"></div>
              <span className="flex-1 text-neutral-700 text-sm xl:text-base leading-relaxed">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
