import { getTranslations } from "next-intl/server";
import ScrollableTabs from "@/components/property/scrollable-tabs";
import PropertyDetailsIcons from "@/components/property/property-details-icons";
import { ContactSection } from "@/components/shared/contact-section";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@/i18n/navigation";
import { PropertyImageGrid } from "@/components/property-details/property-image-grid";
import ContactAgentForm from "@/components/property-details/contact-agent-form";
import { getCurrencySymbol } from "@/components/shared/price-format";
import BookVisitDialog from "@/components/shared/booking-dialog";
import { getProperty } from "@/data/property";
import { Suspense } from "react";
import PropertyDetailsPageLoading from "@/components/property/property-details-page-loading";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { HashSlugLocales } from "../hash-slug-language-switcher";
import { Metadata } from "next";
import {
  BASE_URL,
  EAV_TWITTER_CREATOR_HANDLE,
  WEBSITE_NAME,
} from "@/config/constants";
import { routing } from "@/i18n/routing";
import { ScrollToTopWrapper } from "@/components/scroll-to-top-wrapper";
import { exclusiveListingHashSlugMetadata } from "@/seo-metadata/exclusive-listing-hash-slug";

interface Props {
  params: Promise<{ slug: string; locale: string; hash: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale, hash } = await params;
  const propertyResponse = await getProperty(slug);
  const property = propertyResponse.data;

  if (!property) {
    return {
      title: "Property Not Found",
      description: "The requested property could not be found",
    };
  }

  // Get localized fallback metadata (used for robots and other static fields)
  const metadata =
    exclusiveListingHashSlugMetadata[
      locale as keyof typeof exclusiveListingHashSlugMetadata
    ] || exclusiveListingHashSlugMetadata.en;

  // Get the localized path for exclusive property details from routing config
  const exclusivePropertyPath =
    routing.pathnames["/exclusive-listing/[hash]/[slug]"];
  const localizedExclusivePropertyPath =
    typeof exclusivePropertyPath === "string"
      ? exclusivePropertyPath
      : exclusivePropertyPath[locale as keyof typeof exclusivePropertyPath];

  // Get the slug for current locale from property.seo.slugs
  const currentSlug =
    property.seo.slugs[locale as keyof typeof property.seo.slugs];

  // Build the localized property path by replacing [hash] and [slug]
  const localizedPath = localizedExclusivePropertyPath
    .replace("[hash]", hash)
    .replace("[slug]", currentSlug);

  // Build canonical URL for current locale (all locales are prefixed)
  const canonicalUrl = `${BASE_URL}/${locale}${localizedPath}`;

  // Build alternate language URLs using slugs from property.seo.slugs
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    const path =
      typeof exclusivePropertyPath === "string"
        ? exclusivePropertyPath
        : exclusivePropertyPath[loc as keyof typeof exclusivePropertyPath];

    // Get the slug for this locale
    const localeSlug =
      property.seo.slugs[loc as keyof typeof property.seo.slugs];

    // Replace [hash] and [slug] with actual values
    const fullPath = path.replace("[hash]", hash).replace("[slug]", localeSlug);

    // All locales are prefixed
    languages[loc] = `${BASE_URL}/${loc}${fullPath}`;
  });

  // Add x-default using default locale
  const defaultPath =
    typeof exclusivePropertyPath === "string"
      ? exclusivePropertyPath
      : exclusivePropertyPath[
          routing.defaultLocale as keyof typeof exclusivePropertyPath
        ];
  const defaultSlug =
    property.seo.slugs[
      routing.defaultLocale as keyof typeof property.seo.slugs
    ];
  languages["x-default"] = `${BASE_URL}/${routing.defaultLocale}${defaultPath
    .replace("[hash]", hash)
    .replace("[slug]", defaultSlug)}`;

  const primaryImage = property.assets.images.gallery[0];

  return {
    title: `${property.title} - Exclusive Selection | ${WEBSITE_NAME}`,
    description: property.seo.description,
    keywords: [...metadata.keywords], // Use localized keywords from metadata
    openGraph: {
      title: `${property.title} - Exclusive Property`,
      description: property.seo.description,
      url: canonicalUrl,
      siteName: WEBSITE_NAME,
      images: [
        {
          url: primaryImage.url,
          secureUrl: primaryImage.url,
          type: "image/jpeg",
          width: 1200,
          height: 630,
          alt: primaryImage.title || `${property.title}`,
        },
      ],
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${property.title} - Exclusive Property`,
      description: property.seo.description,
      creator: EAV_TWITTER_CREATOR_HANDLE,
      images: property.assets.images.gallery.map((image) => image.url),
    },
    robots: {
      index: false, // Don't index exclusive/private listings
      follow: false, // Don't follow links (private content)
      noarchive: true, // Don't cache this page
      nocache: true, // Don't cache
      noimageindex: true, // Don't index images
      nosnippet: true, // Don't show snippets
      googleBot: {
        index: false,
        follow: false,
        noarchive: true,
        nocache: true,
        noimageindex: true,
        "max-snippet": 0, // No snippets
        "max-image-preview": "none", // No image previews
        "max-video-preview": 0,
      },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: languages,
    },
    other: {
      "X-Robots-Tag": "noindex, nofollow, noarchive, nocache",
      referrer: "no-referrer", // Don't leak referrer information
      classification: metadata.classification,
      category: metadata.category,
      "DC.title": metadata.dcTitle,
    },
  };
}

export default async function page(props: Props) {
  const t = await getTranslations("propertyDetailsPage");
  const { slug, hash } = await props.params;
  const params = await props.params;
  const locale = params.locale;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <>
      <div className="2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto bg-inherit z-20">
        <div className="flex items-center justify-between gap-6 flex-wrap py-6">
          <Link href="/">
            <Image
              src={"/images/buyproperytyportugal-logo-dark.png"}
              alt="Buy Property Portugal Logo"
              width={70}
              height={50}
              className="object-contain h-20 w-35 hidden lg:block"
            />
            <Image
              src={"/images/buyproperytyportugal-logo-dark.png"}
              alt="Buy Property Portugal Logo"
              width={70}
              height={50}
              className="object-contain h-15 w-20 lg:hidden"
            />
          </Link>

          {/* <div className="">Agent Details Goes Here</div> */}

          <div className="">
            <HashSlugLocales slug={slug} hash={hash} locale={locale} />
          </div>
        </div>
      </div>
      <div className="pt-6">
        <ScrollToTopWrapper>
          <Suspense fallback={<PropertyDetailsPageLoading />}>
            <PageContent {...props} />
            <div className="py-8 w-full bg-black">
              <div className="2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto flex items-center justify-center gap-4">
                <p className="text-white text-sm">{t("poweredBy")}</p>
                <Link href="/">
                  <Image
                    src={"/images/buyproperytyportugal-logo.png"}
                    alt="Buy Property Portugal Logo"
                    width={70}
                    height={50}
                    className="object-contain h-10 w-20"
                  />
                </Link>
              </div>
            </div>
          </Suspense>
        </ScrollToTopWrapper>
      </div>
    </>
  );
}

const PageContent = async (props: Props) => {
  const t = await getTranslations("propertyDetailsPage");
  const { hash, slug } = await props.params;
  //   const session = await auth();
  //   const token = session?.accessToken;

  // Use Promise.all to fetch all data concurrently
  const [propertyResponse] = await Promise.all([
    getProperty(slug),
    //   token
    //     ? getFavorites(token)
    //     : Promise.resolve({ favorite_properties: [] }),
    //   token ? getNote() : Promise.resolve({ data: [] }),
  ]);

  const property = propertyResponse.data;
  //   const favorites = favoritesResponse.favorite_properties;
  //   const notes = notesResponse.data;
  //   const isFavourite = favorites.includes(property.id);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: property.title,
    description: property.description,
    image: property.assets.images.gallery[0].url,
    brand: {
      "@type": "Brand",
      name: "Buy Property Portugal",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: property.currency,
      price: property.price,
      availability: "InStock",
    },
    seller: {
      "@type": "Organization",
      name: "Buy Property Portugal",
    },
  };

  return (
    <>
      <div className="mb-5 2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto w-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <div className="flex items-center gap-x-8 gap-y-3 justify-between flex-wrap mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbSeparator className="text-primary" />
              <BreadcrumbItem>
                <Link
                  href={{
                    pathname: "/exclusive-listing/[hash]",
                    params: {
                      hash: hash,
                    },
                  }}
                >
                  {t("properties")}
                </Link>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* <div className="flex gap-2 items-center">
            <AddToFavoriteButton
              className="size-8 bg-hray-200"
              propertyId={property.id}
              reference={property.reference}
              isFavourite={isFavourite}
            />
            <AddPropertyNote
              propertyId={property.id}
              reference={property.reference}
              notes={notes || []}
              styleClassname="!text-gray-800 size-4"
            />
            <ShareButton />
          </div> */}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-x-9 gap-y-4">
          <div className="flex items-center gap-x-16 gap-y-4 flex-wrap">
            <h1 className="font-medium max-w-2xl lg:text-2xl">
              {property.title}
            </h1>

            <p className="font-medium text-primary text-2xl">
              {getCurrencySymbol(property.currency)}{" "}
              {property.price.toLocaleString()}
            </p>
          </div>

          <BookVisitDialog propertyReference={property.reference} />
        </div>
      </div>

      <div className="mt-10">
        <div className="2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto min-h-full">
          <PropertyImageGrid
            assets={property.assets}
            salesConsultant={property.sales_consultant}
            propertyReference={property.reference}
          />

          <div className="gap-x-6 flex flex-col lg:flex-row mb-8">
            <div className="w-full lg:flex-1 pt-4">
              <PropertyDetailsIcons
                features={property.features}
                propertyType={property.typology.name}
              />
              <ScrollableTabs property={property} />
            </div>

            <div className="w-full lg:flex lg:w-[37%] xl:w-[30%] flex-col pt-4">
              <div className="bg-black text-white w-full p-6">
                <ContactAgentForm salesConsultant={property.sales_consultant} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactSection />

      {/* {property.similar_properties.length > 0 && (
        <Suspense fallback={<SimilarPropertiesSkeleton />}>
          <div className="2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto min-h-full py-14 lg:py-24">
            <SimilarProperties
              similarPropertiesId={property.similar_properties}
            />
          </div>
        </Suspense>
      )} */}
      {/* <DiscoverSection /> */}
    </>
  );
};
