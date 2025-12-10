import { getLocale, getTranslations } from "next-intl/server";
import // Calendar,
"lucide-react";
import ScrollableTabs from "@/components/property/scrollable-tabs";
import PropertyDetailsIcons from "@/components/property/property-details-icons";

import { ContactSection } from "@/components/shared/contact-section";
import DiscoverSection from "@/components/home/discover-section";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@/i18n/navigation";
import ShareButton from "@/components/property/share-property";
import { PropertyImageGrid } from "@/components/property-details/property-image-grid";
import SimilarProperties from "@/components/property-details/similar-properties";
import ContactAgentForm from "@/components/property-details/contact-agent-form";
import { getCurrencySymbol } from "@/components/shared/price-format";
// import { Metadata } from "next";
import BookVisitDialog from "@/components/shared/booking-dialog";
import { getProperty } from "@/data/property";
import { Suspense } from "react";
import SimilarPropertiesSkeleton from "@/components/property/similar-properties-skeleton";
import PropertyDetailsPageLoading from "@/components/property/property-details-page-loading";
import { getFavorites } from "@/data/favourites";
import { auth } from "@/auth";
import { AddToFavoriteButton } from "@/components/search/submit-buttons";
import { setRequestLocale } from "next-intl/server";
import { AddPropertyNote } from "@/components/product/add-property-notes";
import { getNote } from "@/data/notes";
import { Metadata } from "next";
import {
  BASE_URL,
  EAV_TWITTER_CREATOR_HANDLE,
  GEO_POSITION,
  WEBSITE_NAME,
} from "@/config/constants";
import { routing } from "@/i18n/routing";
import { propertyDetailsPageMetadata } from "@/seo-metadata/property-details-page";
import { ScrollToTopWrapper } from "@/components/scroll-to-top-wrapper";

interface Props {
  params: Promise<{ propertyId: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { propertyId, locale } = await params;
  const propertyResponse = await getProperty(propertyId);
  const property = propertyResponse.data;

  // Get metadata for current locale
  const metadata =
    propertyDetailsPageMetadata[
      locale as keyof typeof propertyDetailsPageMetadata
    ] || propertyDetailsPageMetadata.en;

  if (!property) {
    return {
      title: metadata.notFoundTitle,
      description: metadata.notFoundDescription,
    };
  }

  // Get the localized path for properties from routing config
  const propertiesPath = routing.pathnames["/properties/[slug]"];
  const localizedPropertiesPath =
    typeof propertiesPath === "string"
      ? propertiesPath
      : propertiesPath[locale as keyof typeof propertiesPath];

  // Get the slug for current locale from property.seo.slugs
  const currentSlug =
    property.seo.slugs[locale as keyof typeof property.seo.slugs];

  // Build the localized property path by replacing [slug] with actual slug
  const localizedPath = localizedPropertiesPath.replace("[slug]", currentSlug);

  // Build canonical URL for current locale (all locales are prefixed)
  const canonicalUrl = `${BASE_URL}/${locale}${localizedPath}`;

  // Build alternate language URLs using slugs from property.seo.slugs
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    const path =
      typeof propertiesPath === "string"
        ? propertiesPath
        : propertiesPath[loc as keyof typeof propertiesPath];

    // Get the slug for this locale
    const slug = property.seo.slugs[loc as keyof typeof property.seo.slugs];

    // Replace [slug] with actual localized slug
    const fullPath = path.replace("[slug]", slug);

    // All locales are prefixed
    languages[loc] = `${BASE_URL}/${loc}${fullPath}`;
  });

  // Add x-default using default locale
  const defaultPath =
    typeof propertiesPath === "string"
      ? propertiesPath
      : propertiesPath[routing.defaultLocale as keyof typeof propertiesPath];
  const defaultSlug =
    property.seo.slugs[
      routing.defaultLocale as keyof typeof property.seo.slugs
    ];
  languages["x-default"] = `${BASE_URL}/${
    routing.defaultLocale
  }${defaultPath.replace("[slug]", defaultSlug)}`;

  // ICBM coordinates
  const ICBM = `${GEO_POSITION.lat}, ${GEO_POSITION.lng}`;

  const primaryImage = property.assets.images.gallery[0];

  // Build enhanced title with property details
  const enhancedTitle = `${property.title} ${metadata.titleSuffix}`;

  return {
    title: `${enhancedTitle} | ${WEBSITE_NAME}`,
    description: property.seo.description,
    keywords: [
      ...property.seo.keywords,
      property.typology.name,
      property.location.municipality,
      property.location.zone,
    ],
    openGraph: {
      title: `${enhancedTitle} | ${WEBSITE_NAME}`,
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
      title: `${enhancedTitle} | ${WEBSITE_NAME}`,
      description: property.seo.description,
      creator: EAV_TWITTER_CREATOR_HANDLE,
      images: property.assets.images.gallery.map((image) => image.url),
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
      "DC.title": `${metadata.dcTitlePrefix} - ${property.title}, ${property.location.municipality}, ${property.location.zone}`,
      audience: metadata.audience,
      "article:section": metadata.articleSection,
      // Property-specific metadata
      "property:price": property.price?.toString(),
      "property:currency": property.currency,
      "property:bedrooms": property.features.bedrooms?.toString() as string,
      "property:bathrooms": property.features.bathrooms?.toString() as string,
      "property:area": property.features.private_area?.toString() as string,
      "property:plot": property.features.plot_size?.toString() as string,
      "property:type": property.typology.name,
      "property:location": `${property.location.municipality}, ${property.location.zone}`,
    },
  };
}

export default async function page(props: Props) {
  const params = await props.params;
  const locale = params.locale;

  // Enable static rendering
  setRequestLocale(locale);

  return (
      <div className="py-14">
        <ScrollToTopWrapper>
          <Suspense fallback={<PropertyDetailsPageLoading />}>
            <PageContent {...props} />
          </Suspense>
        </ScrollToTopWrapper>
      </div>
  );
}

const PageContent = async (props: Props) => {
  const t = await getTranslations("propertyDetailsPage");
  const { propertyId } = await props.params;
  const locale = await getLocale();
  const session = await auth();
  const token = session?.accessToken;

  // Use Promise.all to fetch all data concurrently
  const [propertyResponse, favoritesResponse, notesResponse] =
    await Promise.all([
      getProperty(propertyId),
      token
        ? getFavorites(token)
        : Promise.resolve({ favorite_properties: [] }),
      token ? getNote() : Promise.resolve({ data: [] }),
    ]);

  const property = propertyResponse.data;
  const favorites = favoritesResponse.favorite_properties;
  const notes = notesResponse.data;
  const isFavourite = favorites.includes(property.id);

  const propertiesPath = routing.pathnames["/properties/[slug]"];
  const localizedPropertiesPath =
    typeof propertiesPath === "string"
      ? propertiesPath
      : propertiesPath[locale as keyof typeof propertiesPath];
  const currentSlug =
    property.seo.slugs[locale as keyof typeof property.seo.slugs];
  const localizedPath = localizedPropertiesPath.replace("[slug]", currentSlug);
  const propertyUrl = `${BASE_URL}/${locale}${localizedPath}`;

  // Enhanced Structured Data for Real Estate
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SingleFamilyResidence", // More specific than Product for real estate
    "@id": propertyUrl,
    name: property.title,
    description: property.description,
    url: propertyUrl,

    // Images - all gallery images
    image: property.assets.images.gallery.map((img) => img.url),

    // Address Information
    address: {
      "@type": "PostalAddress",
      streetAddress: property.location.zone,
      addressLocality: property.location.municipality,
      addressRegion: property.location.district,
      postalCode: property.location.zip_code,
      addressCountry: property.location.country,
    },

    // Geo Coordinates (critical for local SEO and maps)
    geo: {
      "@type": "GeoCoordinates",
      latitude: property.location.latitude,
      longitude: property.location.longitude,
    },

    // Property Features
    numberOfRooms: property.features.bedrooms,
    numberOfBedrooms: property.features.bedrooms,
    numberOfBathroomsTotal: property.features.bathrooms,

    // Floor Size
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.features.private_area,
      unitCode: "MTK", // Square meters
      unitText: "m²",
    },

    // Offer/Price Information
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: property.currency || "EUR",
      availability: "https://schema.org/InStock",
      url: propertyUrl,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: property.price,
        priceCurrency: property.currency || "EUR",
      },
      seller: {
        "@type": "RealEstateAgent",
        name: property.sales_consultant.name,
        image: property.sales_consultant.profile_picture,
      },
    },

    // Additional Property Details
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Property Type",
        value: property.typology.name,
      },
      {
        "@type": "PropertyValue",
        name: "Plot Size",
        value: `${property.features.plot_size} m²`,
      },
      {
        "@type": "PropertyValue",
        name: "Construction Area",
        value: `${property.features.construction_area} m²`,
      },
      {
        "@type": "PropertyValue",
        name: "Construction Year",
        value: property.features.construction_year,
      },
      {
        "@type": "PropertyValue",
        name: "Energy Class",
        value: property.features.energy_class,
      },
      {
        "@type": "PropertyValue",
        name: "Garage Spaces",
        value: property.features.garage?.toString() ?? "0",
      },
      {
        "@type": "PropertyValue",
        name: "Reference",
        value: property.reference,
      },
      // Add additional features if available
      // ...property.additional_features.map((feature) => ({
      //   "@type": "PropertyValue",
      //   name: feature.name,
      //   value: feature.value || "Yes",
      // })),
    ],

    // Organization (your company)
    provider: {
      "@type": "RealEstateAgent",
      name: WEBSITE_NAME,
      url: BASE_URL,
    },

    // Date information
    // datePosted: property.created_at,
    // dateModified: property.updated_at,
  };

  // Breadcrumb Structured Data (separate script tag)
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${BASE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Properties",
        item: `${BASE_URL}/${locale}${
          typeof routing.pathnames["/properties"] === "string"
            ? routing.pathnames["/properties"]
            : routing.pathnames["/properties"][
                locale as keyof (typeof routing.pathnames)["/properties"]
              ]
        }`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: property.title,
        item: propertyUrl,
      },
    ],
  };

  return (
    <>
      <div className="mb-5 2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto w-full mt-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Breadcrumb Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbStructuredData),
          }}
        />

        <div className="flex items-center gap-x-8 gap-y-3 justify-between flex-wrap mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link href="/">{t("home")}</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-primary" />
              <BreadcrumbItem>
                <Link href="/properties">{t("properties")}</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-primary" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">
                  {property.reference}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex gap-2 items-center">
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
          </div>
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

      {property.similar_properties.length > 0 && (
        <Suspense fallback={<SimilarPropertiesSkeleton />}>
          <div className="2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto min-h-full py-14 lg:py-24">
            <SimilarProperties
              similarPropertiesId={property.similar_properties}
            />
          </div>
        </Suspense>
      )}
      <DiscoverSection />
    </>
  );
};
