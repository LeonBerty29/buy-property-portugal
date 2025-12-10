import { auth } from "@/auth";
import { AnnotationPropertyCard } from "@/components/product/annotation-property-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getFavorites } from "@/data/favourites";
import { getListOfProperties } from "@/data/property";
import { Link } from "@/i18n/navigation";
import { redirect } from "@/i18n/navigation";
import React, { Suspense } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getNote } from "@/data/notes";
import { getLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { BASE_URL, GEO_POSITION, WEBSITE_NAME } from "@/config/constants";
import { routing } from "@/i18n/routing";
import { annotationsMetadata } from "@/seo-metadata/annotations";
import { ValidateToken } from "@/data/token";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ [x: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Get localized metadata
  const metadata =
    annotationsMetadata[locale as keyof typeof annotationsMetadata] ||
    annotationsMetadata.en;

  // Get the localized path for the annotations page
  const annotationsPath = routing.pathnames["/annotations"];
  const localizedAnnotationsPath =
    typeof annotationsPath === "string"
      ? annotationsPath
      : annotationsPath[locale as keyof typeof annotationsPath];

  // Build canonical URL for current locale
  const canonicalUrl = `${BASE_URL}/${locale}${localizedAnnotationsPath}`;

  // Build alternate language URLs
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    const path =
      typeof annotationsPath === "string"
        ? annotationsPath
        : annotationsPath[loc as keyof typeof annotationsPath];

    languages[loc] = `${BASE_URL}/${loc}${path}`;
  });

  // Add x-default using default locale
  const defaultPath =
    typeof annotationsPath === "string"
      ? annotationsPath
      : annotationsPath[routing.defaultLocale as keyof typeof annotationsPath];
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
    },
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      googleBot: {
        index: false,
        follow: false,
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

const page = async (props: Props) => {
  const t = await getTranslations("annotationsPage");
  const searchParams = await props.searchParams;
  const currentPage = parseInt((searchParams?.page as string) || "1", 10);

  return (
    <div className="xl:container mx-auto px-6 md:px-12 lg:px-14 pt-24 pb-12">
      <h1 className="text-3xl font-bold mb-6">
        {t("yourPropertyAnnotations")}
      </h1>
      <Suspense
        fallback={
          <Skeleton className="w-full h-full aspect-video rounded-none" />
        }
      >
        <ListAnnotations currentPage={currentPage} />
      </Suspense>
    </div>
  );
};

export default page;

async function PaginationControls({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
}: {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}) {
  const t = await getTranslations("annotationsPage");

  return (
    <div className="flex items-center justify-between mt-8">
      <div className="text-sm text-gray-600">
        {t("page")} {currentPage} {t("of")} {totalPages}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          asChild={hasPrev}
          disabled={!hasPrev}
          className={!hasPrev ? "opacity-50 cursor-not-allowed" : ""}
        >
          {hasPrev ? (
            <Link
              href={{
                pathname: "/annotations",
                search: `?page=${currentPage - 1}`,
              }}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              {t("previous")}
            </Link>
          ) : (
            <span className="flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />
              {t("previous")}
            </span>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          asChild={hasNext}
          disabled={!hasNext}
          className={!hasNext ? "opacity-50 cursor-not-allowed" : ""}
        >
          {hasNext ? (
            <Link
              href={{
                pathname: "/annotations",
                search: `?page=${currentPage + 1}`,
              }}
              className="flex items-center gap-1"
            >
              {t("next")}
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="flex items-center gap-1">
              {t("next")}
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}

async function EmptyAnnotationsState() {
  const t = await getTranslations("annotationsPage");

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
          <Search className="w-12 h-12 text-gray-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
          <Search className="w-3 h-3 text-blue-400 fill-current" />
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
        {t("noPropertyAnnotationsYet")}
      </h2>

      <p className="text-gray-600 text-center max-w-md mb-8 leading-relaxed">
        {t("startExploringProperties")}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="bg-primary hover:bg-black text-white">
          <Link href="/properties" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            {t("browseProperties")}
          </Link>
        </Button>
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg max-w-lg">
        <h3 className="font-medium text-primary mb-2 flex items-center gap-2">
          <Search className="w-4 h-4" />
          {t("proTip")}
        </h3>
        <p className="text-gray-600 text-sm">
          {t("addDetailedAnnotationsTip")}
        </p>
      </div>
    </div>
  );
}

async function InvalidPageState({ totalPages }: { totalPages: number }) {
  const t = await getTranslations("annotationsPage");

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
          <Search className="w-12 h-12 text-gray-400" />
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
        {t("pageNotFound")}
      </h2>

      <p className="text-gray-600 text-center max-w-md mb-8 leading-relaxed">
        {t("pageNotFoundDescriptionPart1")}{" "}
        {totalPages === 1 ? t("is") : t("are")}{" "}
        <span className="font-semibold">
          {totalPages} {totalPages !== 1 ? t("pages") : t("page")}
        </span>{" "}
        {t("pageNotFoundDescriptionPart2")}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="bg-primary hover:bg-black text-white">
          <Link
            href={{ pathname: "/annotations", search: "?page=1" }}
            className="flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            {t("goToFirstPage")}
          </Link>
        </Button>

        <Button asChild variant="outline">
          <Link href="/properties" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            {t("browseAllProperties")}
          </Link>
        </Button>
      </div>
    </div>
  );
}

async function ListAnnotations({ currentPage }: { currentPage: number }) {
  const session = await auth();
  const token = session?.accessToken;
  const locale = await getLocale();

  if (!token || !session) {
    return redirect({
      href: { pathname: "/login", query: { callbackUrl: "/annotations" } },
      locale: locale,
    });
  }

  // Validate token before proceeding
  const { logout } = await ValidateToken(token);

  if (logout) {
    // Redirect to logout page with callback URL
    return redirect({
      href: {
        pathname: "/logout",
        query: { callbackUrl: "/annotations" },
      },
      locale: locale,
    });
  }

  const notesResponse = await getNote();
  const notes = notesResponse.data;

  const propertyIds = notes.map((note) => note.property_id);
  const favoritesResponse = await getFavorites(token);
  const favorites = favoritesResponse.favorite_properties;

  if (notes.length === 0) {
    return <EmptyAnnotationsState />;
  }

  const itemsPerPage = 7;
  const totalItems = propertyIds.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const isValidPage = currentPage >= 1 && currentPage <= totalPages;

  if (!isValidPage) {
    return (
      <>
        <InvalidPageState totalPages={totalPages} />
        {totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            hasNext={currentPage < totalPages}
            hasPrev={currentPage > 1}
          />
        )}
      </>
    );
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPropertIds = propertyIds.slice(startIndex, endIndex);

  const [propertiesResponse] = await Promise.all([
    getListOfProperties(paginatedPropertIds),
  ]);

  const properties = propertiesResponse.data;
  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-6">
        {properties.map((property) => (
          <div key={property.id} className="">
            <AnnotationPropertyCard
              property={property}
              favorites={favorites}
              notes={notes}
            />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          hasNext={hasNext}
          hasPrev={hasPrev}
        />
      )}
    </>
  );
}
