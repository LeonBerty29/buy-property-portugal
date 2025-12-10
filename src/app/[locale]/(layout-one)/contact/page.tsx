import DiscoverSection from "@/components/home/discover-section";
import BookMeeting from "@/components/shared/book-meeting";
import { ContactSection } from "@/components/shared/contact-section";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import React from "react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { routing } from "@/i18n/routing";
import {
  EAV_TWITTER_CREATOR_HANDLE,
  GEO_POSITION,
  WEBSITE_NAME,
} from "@/config/constants";
import { contactMetadata } from "@/seo-metadata/contact";

interface Props {
  params: Promise<{ locale: string }>;
}

const BASE_URL =
  process.env.BASE_URL || "https://www.exclusivealgarvevillas.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Get localized metadata
  const metadata =
    contactMetadata[locale as keyof typeof contactMetadata] ||
    contactMetadata.en;

  // Get the localized path for the contact page
  const contactPath = routing.pathnames["/contact"];
  const localizedContactPath =
    typeof contactPath === "string"
      ? contactPath
      : contactPath[locale as keyof typeof contactPath];

  // Build canonical URL for current locale
  const canonicalUrl = `${BASE_URL}/${locale}${localizedContactPath}`;

  // Build alternate language URLs
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    const path =
      typeof contactPath === "string"
        ? contactPath
        : contactPath[loc as keyof typeof contactPath];

    languages[loc] = `${BASE_URL}/${loc}${path}`;
  });

  // Add x-default using default locale
  const defaultPath =
    typeof contactPath === "string"
      ? contactPath
      : contactPath[routing.defaultLocale as keyof typeof contactPath];
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

const ContactPage = async () => {
  const t = await getTranslations("contactPage");

  return (
    <>
      <div className="pt-24">
        <ContactSection
          title={t("contactUs")}
          imageSrc=""
          theme="light"
          formTitle={false}
        />
      </div>

      <div className="lg:container mx-auto px-6 md:px-12 lg:px-14 py-14 xl:pb-20">
        <div className="flex items-center gap-y-5 justify-between py-5 md:py-8 flex-wrap">
          <div className="w-full md:w-[47%] 2xl:w-[44%]">
            <h1 className="text-2xl font-semibold mb-6">
              {t("bookAMeetingWithUs")}
            </h1>
            <p className="text-neutral-700 text-sm xl:text-base mb-7">
              {t("exclusiveAlgarveVillasDescription")}
            </p>

            <BookMeeting
              buttonStyle={
                "bg-primary border-primary text-white hover:bg-black hover:text-white transition-colors"
              }
            />
          </div>

          <Image
            priority
            src="/images/book-a-meeting.png"
            width={450}
            height={450}
            alt="about-us"
            className="object-cover w-full h-72 md:w-[50%] lg:w-[47%] 2xl:w-[44%] xl:h-[390px] md:h-auto"
          />
        </div>
      </div>

      <section className="lg:container mx-auto px-6 md:px-12 lg:px-14 py-14 xl:pb-20">
        <div className="flex flex-col items-center gap-3">
          <h4 className="uppercase font-bold text-2xl text-center text-primary">
            {t("requestAnAgentPartnership")}
          </h4>
          <Button
            asChild
            className="bg-black hover:bg-black/90 px-8 text-white transition-colors"
          >
            <Link href="/agent">{t("request")}</Link>
          </Button>
        </div>
      </section>

      <DiscoverSection />
    </>
  );
};

export default ContactPage;
