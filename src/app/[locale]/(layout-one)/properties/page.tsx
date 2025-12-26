import { ProductCard } from "@/components/product/product-card";
import { PropertiesPagination } from "@/components/property/properties-pagination";
import SearchHeader from "@/components/search/search-header";
import { getPropertiesWithAllPaginated } from "@/data/properties";
import { PropertySearchParams } from "@/types/property";
import { Suspense } from "react";
import {
  BASE_URL,
  EAV_TWITTER_CREATOR_HANDLE,
  GEO_POSITION,
  PROPERTIES_PER_PAGE,
  WEBSITE_NAME,
} from "@/config/constants";
import {
  PaginationSkeleton,
  PropertiesGridSkeleton,
  SearchHeaderSkeleton,
} from "@/components/property/loading-states";
import { auth } from "@/auth";
import { getFavorites } from "@/data/favourites";
import { Building2, Search, FilterX, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ListFilter } from "lucide-react";
import { SortBy } from "@/components/search/sort-by";
import { generateApiParams, hasActiveFilters } from "@/lib/utils";
import { getNote } from "@/data/notes";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { propertiesMetadata } from "@/seo-metadata/properties";
import { TokenValidity } from "@/actions/token-validity";

type Params = {
  [x: string]: string | string[];
};

interface PageProps {
  params?: Promise<Params>;
  searchParams: Promise<PropertySearchParams>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const awaitedParams = await params;
  const locale = awaitedParams?.locale as string;

  // Get the localized pathname for properties page
  const propertiesPath = routing.pathnames["/properties"];
  const localizedPath =
    typeof propertiesPath === "string"
      ? propertiesPath
      : propertiesPath[locale as keyof typeof propertiesPath];

  // Build canonical URL - ALL locales are prefixed (including default)
  const canonicalUrl = `${BASE_URL}/${locale}${localizedPath}`;

  // Build alternate language URLs - ALL locales are prefixed
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    const path =
      typeof propertiesPath === "string"
        ? propertiesPath
        : propertiesPath[loc as keyof typeof propertiesPath];

    // All locales get prefixed, including default
    languages[loc] = `${BASE_URL}/${loc}${path}`;
  });

  // Add x-default for international targeting (use default locale)
  const defaultPath =
    typeof propertiesPath === "string"
      ? propertiesPath
      : propertiesPath[routing.defaultLocale as keyof typeof propertiesPath];
  languages["x-default"] = `${BASE_URL}/${routing.defaultLocale}${defaultPath}`;

  // ICBM coordinates
  const ICBM = `${GEO_POSITION.lat}, ${GEO_POSITION.lng}`;

  // Get metadata for current locale
  const metadata =
    propertiesMetadata[locale as keyof typeof propertiesMetadata] ||
    propertiesMetadata.en;

  return {
    title: `${metadata.title} | ${WEBSITE_NAME}`,
    description: metadata.description,
    keywords: [...metadata.keywords],
    openGraph: {
      title: metadata.ogTitle,
      description: metadata.ogDescription,
      url: canonicalUrl,
      siteName: WEBSITE_NAME,
      images: [
        {
          url: `${BASE_URL}/images/buyproperytyportugal-logo-dark.png`,
          secureUrl: `${BASE_URL}/images/buyproperytyportugal-logo-dark.png`,
          width: 1200,
          height: 800,
          alt: "Buy Property Portugal Logo",
        },
      ],
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.ogTitle,
      description: metadata.ogDescription,
      creator: EAV_TWITTER_CREATOR_HANDLE,
      images: [`${BASE_URL}/images/buyproperytyportugal-logo-dark.png`],
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

export default async function PropertiesPage(props: PageProps) {
  const t = await getTranslations("propertiesPage");

  // Convert searchParams to the format expected by your API
  const searchParams = await props.searchParams;

  // Handle price_ranges parameter - it comes from URL as price_ranges[]
  let priceRanges: string[] | undefined;
  if (searchParams["price_ranges[]"]) {
    if (Array.isArray(searchParams["price_ranges[]"])) {
      priceRanges = searchParams["price_ranges[]"] as string[];
    } else {
      priceRanges = [searchParams["price_ranges[]"] as string];
    }
    console.log({ priceRanges });
  }

  const apiParams: PropertySearchParams = generateApiParams(searchParams);

  // Create a key based on the search parameters that affect the data
  const suspenseKey = JSON.stringify({
    search: apiParams.search,
    location: apiParams.location_area,
    municipality: apiParams.municipality,
    zone: apiParams.zone,
    district: apiParams.district,
    min_price: apiParams.min_price,
    max_price: apiParams.max_price,
    price_ranges: apiParams.price_ranges,
    currency: apiParams.currency,
    typology: apiParams.typology,
    min_bedrooms: apiParams.min_bedrooms,
    max_bedrooms: apiParams.max_bedrooms,
    min_bathrooms: apiParams.min_bathrooms,
    max_bathrooms: apiParams.max_bathrooms,
    min_area: apiParams.min_area,
    max_area: apiParams.max_area,
    min_plot_size: apiParams.min_plot_size,
    max_plot_size: apiParams.max_plot_size,
    construction_year_from: apiParams.construction_year_from,
    construction_year_to: apiParams.construction_year_to,
    energy_class: apiParams.energy_class,
    agency_id: apiParams.agency_id,
    featured: apiParams.featured,
    show_price: apiParams.show_price,
    sort_by: apiParams.sort_by,
    sort_direction: apiParams.sort_direction,
    per_page: apiParams.per_page,
    page: apiParams.page,
  });

  return (
    <>
      <div className="pt-24 w-full">
        <div className="w-full">
          <Suspense fallback={<SearchHeaderSkeleton />}>
            <SearchHeader
            // totalResults={propertiesResponse.meta.total}
            // currentPage={propertiesResponse.meta.current_page}
            // totalPages={propertiesResponse.meta.last_page}
            />
          </Suspense>
        </div>

        <div className="2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto">
          <div className="flex items-center gap-1 md:gap-4 justify-end">
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <ListFilter className="w-4 h-4 hidden sm:block" /> {t("sortBy")}
            </div>
            <SortBy />
          </div>
          <div className="mx-auto sm:max-w-full sm:mx-0 flex items-start flex-wrap pb-8">
            <div className="flex-1 md:min-w-[400px] mt-6">
              <Suspense
                key={`${suspenseKey} --properties`}
                fallback={<PropertiesGridSkeleton />}
              >
                {/* <SessionValidator> */}
                  <PropertieList apiParams={apiParams} />
                {/* </SessionValidator> */}
              </Suspense>
              <Suspense
                key={`${suspenseKey} --pagination`}
                fallback={<PaginationSkeleton />}
              >
                <PropertiesPagination apiParams={apiParams} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

async function PropertieList({
  apiParams,
}: {
  apiParams: PropertySearchParams;
}) {

  // console.log({apiParams})
  const t = await getTranslations("propertiesPage");
  const session = await auth();
  let token = session?.accessToken;

  // Validate token on the server before fetching
  if (token) {
    const { valid } = await TokenValidity(token); // Use the helper function
    if (!valid) {
      token = undefined; // Don't use invalid token
    }
  }

  // Fetch all data concurrently using Promise.all
  const [propertiesResponse, favoritesResponse, notesResponse] =
    await Promise.all([
      getPropertiesWithAllPaginated(apiParams, PROPERTIES_PER_PAGE),
      token
        ? getFavorites(token)
        : Promise.resolve({ favorite_properties: [] }),
      token ? getNote() : Promise.resolve({ data: [] }),
    ]);

  const properties = propertiesResponse.data;
  const favorites = favoritesResponse.favorite_properties;
  const notes = notesResponse.data;
  const hasFilters = hasActiveFilters(apiParams);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
      {properties.length > 0 ? (
        properties.map((property) => (
          <div key={property.id} className="">
            <ProductCard
              property={property}
              favorites={favorites}
              notes={notes}
            />
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <div className="flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
              {/* Icon with glow effect */}
              <div className="mb-8 relative">
                <div className="w-24 h-24 mx-auto relative">
                  <div className="relative bg-gradient-to-r from-purple-500 to-primary rounded-2xl w-full h-full flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-white animate-pulse" />
                  </div>
                </div>
                <Search
                  className="absolute -top-2 -right-4 w-8 h-8 text-black animate-spin"
                  style={{ animationDuration: "3s" }}
                />
              </div>

              {/* Error Message */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {t("noPropertiesFound")}
                </h1>
                <p className="text-gray-600 text-lg">
                  {t("noPropertiesMatchSearch")}
                </p>
              </div>

              {/* Conditional Action Buttons */}
              {hasFilters ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 mb-4">
                    {t("tryClearingFilters")}
                  </p>
                  <Button
                    asChild
                    className="bg-primary hover:bg-black border-primary hover:border-black text-white font-semibold py-3 px-8 rounded-lg border transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-center gap-2 mx-auto"
                  >
                    <Link href="/properties">
                      <FilterX className="w-5 h-5" />
                      {t("clearAllFilters")}
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 mb-4">
                    {t("noPropertiesAvailable")}
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      asChild
                      className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg border border-gray-200 transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                    >
                      <Link href="/">
                        <Home className="w-5 h-5" />
                        {t("home")}
                      </Link>
                    </Button>

                    <Button
                      asChild
                      className="bg-primary hover:bg-black border-primary hover:border-black text-white font-semibold py-3 px-6 rounded-lg border transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                    >
                      <Link href="/properties">
                        <Search className="w-5 h-5" />
                        {t("browseProperties")}
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
