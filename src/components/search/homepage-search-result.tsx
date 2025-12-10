import { ProductCard } from "@/components/product/product-card";
import { PropertiesPagination } from "@/components/property/properties-pagination";
// import SearchHeader from "@/components/search/search-header";
// import SideFilters from "@/components/search/side-filters";
import {
  // getPropertiesWithAll,
  getPropertiesWithAllPaginated,
} from "@/data/properties";
import { PropertySearchParams } from "@/types/property";
import { Suspense } from "react";
import { HOME_SEARCH_RESULT_ID, PROPERTIES_PER_PAGE } from "@/config/constants";
import {
  // PaginationSkeleton,
  PropertiesGridSkeleton,
  //   SearchHeaderSkeleton,
} from "@/components/property/loading-states";
import { auth } from "@/auth";
import { getFavorites } from "@/data/favourites";
// import { Building2, Search, FilterX, Home } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Link } from "@/i18n/navigation";
import { ListFilter } from "lucide-react";
import { SortBy } from "@/components/search/sort-by";
import { generateApiParams, generateSuspenseKey } from "@/lib/utils";
import { getNote } from "@/data/notes";
import { getTranslations } from "next-intl/server";
// import HeroSearch from "@/components/home/search-component";

// interface PropertiesPageProps {
//   searchParams: PropertySearchParams;
// }

export async function HomepageSearchResult({
  searchParams,
}: {
  searchParams: PropertySearchParams;
}) {
  const apiParams = generateApiParams(searchParams);

  // Create a key based on the search parameters that affect the data
  const suspenseKey = generateSuspenseKey(apiParams);

  if (!Object.keys(searchParams).length) {
    return null;
  }

  return (
    <>
      <Suspense
        key={`${suspenseKey} --properties`}
        fallback={<PropertiesGridSkeleton />}
      >
        <PropertieList apiParams={apiParams} />
      </Suspense>
    </>
  );
}

// Helper function to check if any filters are applied
// function hasActiveFilters(params: PropertySearchParams): boolean {
//   return !!(
//     params.search ||
//     params.location_area ||
//     params.municipality ||
//     params.zone ||
//     params.district ||
//     params.min_price ||
//     params.max_price ||
//     params.typology ||
//     params.min_bedrooms ||
//     params.max_bedrooms ||
//     params.min_bathrooms ||
//     params.max_bathrooms ||
//     params.min_area ||
//     params.max_area ||
//     params.min_plot_size ||
//     params.max_plot_size ||
//     params.construction_year_from ||
//     params.construction_year_to ||
//     params.energy_class ||
//     params.agency_id ||
//     params.featured ||
//     (params.show_price !== undefined && params.show_price !== null)
//   );
// }

async function PropertieList({
  apiParams,
}: {
  apiParams: PropertySearchParams;
}) {
  const session = await auth();
  const t = await getTranslations("homepageSearchResult");
  const token = session?.accessToken;

  // const hasFilters = hasActiveFilters(apiParams);

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

  if (properties.length === 0) {
    return <></>;
  }

  return (
    <div className="pt-24 w-full" id={HOME_SEARCH_RESULT_ID}>
      {/* <div className="w-full">
          <Suspense fallback={<SearchHeaderSkeleton />}>
            <SearchHeader
              suspenseKey={suspenseKey}
              // totalResults={propertiesResponse.meta.total}
              // currentPage={propertiesResponse.meta.current_page}
              // totalPages={propertiesResponse.meta.last_page}
            />
          </Suspense>
        </div> */}

      <div className="2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto">
        <div className="flex items-center gap-1 md:gap-4 justify-end">
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <ListFilter className="w-4 h-4 hidden sm:block" /> {t("sortBy")}
          </div>
          <SortBy />
        </div>
        <div className="max-w-[400px] mx-auto sm:max-w-full sm:mx-0 flex items-start flex-wrap pb-8">
          <div className="flex-1 md:min-w-[400px] mt-6">
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
                <></>
              )}
            </div>

            <PropertiesPagination apiParams={apiParams} />
          </div>
        </div>
      </div>
    </div>
  );
}
