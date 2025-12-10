import React, { Suspense } from "react";
import { SearchInput } from "./search-input";
import { Skeleton } from "../ui/skeleton";
import { PropertySearchParams } from "@/types/property";
import { Button } from "../ui/button";
import {
  generateApiParams,
  generateSuspenseKey,
  hasActiveFilters,
} from "@/lib/utils";
import { getPropertiesWithAllPaginated } from "@/data/properties";
import { ScrollToResultsButton } from "./show-result-client-btn";
import { Loader2 } from "lucide-react";
import { ClearHomeFilters } from "./clear-home-filters";
import {
  ListBathroomsRangeSelect,
  ListBedroomsRangeSelect,
  ListPrices,
  ListPropertyTypes,
  ListRegionSelect,
} from "./listing-filters";
import { getTranslations } from "next-intl/server";

export const HomepageSearchEngine = async ({
  searchParams,
}: {
  searchParams: PropertySearchParams;
}) => {
  const t = await getTranslations("homepageSearchEngine");
  const apiParams = generateApiParams(searchParams);
  const suspenseKey = generateSuspenseKey(apiParams);
  return (
    <>
      <h1 className="text-2xl sm:text-4xl lg:text-6xl leading-tight font-extralight text-white mb-6 text-center">
        {t("findYourDreamHome")} <br />
        {t("propertyInAlgarve")}
      </h1>
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 bg-black/30 shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
            <div className="relative">
              <SearchInput />
            </div>

            <div className="relative">
              <Suspense
                // key={`${suspenseKey} --region-select`}
                fallback={<Skeleton className="h-10 w-full" />}
              >
                <ListRegionSelect />
              </Suspense>
            </div>

            <div className="relative">
              <Suspense
                // key={`${suspenseKey} --property-types`}
                fallback={<Skeleton className="h-10 w-full" />}
              >
                <ListPropertyTypes />
              </Suspense>
            </div>

            <div className="relative">
              <Suspense
                // key={`${suspenseKey} --price-slider`}
                fallback={<Skeleton className="h-10 w-full" />}
              >
                <ListPrices />
              </Suspense>
            </div>

            {/* Additional filters that will be hidden initially */}
            <div className="relative">
              <Suspense
                // key={`${suspenseKey} --bedrooms-slider`}
                fallback={<Skeleton className="h-10 w-full" />}
              >
                <ListBedroomsRangeSelect />
              </Suspense>
            </div>

            <div className="relative">
              <Suspense
                // key={`${suspenseKey} --bathrooms-slider`}
                fallback={<Skeleton className="h-10 w-full" />}
              >
                <ListBathroomsRangeSelect />
              </Suspense>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Suspense
              key={`${suspenseKey} --show-results-button`}
              fallback={<ShowResultsButtonLoading />}
            >
              <ShowResultsButton apiParams={apiParams} />
            </Suspense>

            <ClearHomeFilters apiParams={apiParams} />
          </div>
        </div>
      </div>
    </>
  );
};

export async function ShowResultsButton({
  apiParams,
}: {
  apiParams: PropertySearchParams;
}) {
  const t = await getTranslations("homepageSearchEngine");
  const hasFilters = hasActiveFilters(apiParams);
  if (!hasFilters) {
    return (
      <Button
        className="bg-primary border border-primary hover:border-primary/80 text-white flex-1"
        disabled={true}
      >
        {t("showResult")}
      </Button>
    );
  }
  const response = await getPropertiesWithAllPaginated(apiParams, 12);
  const total = response.meta.total;
  return <ScrollToResultsButton total={total} hasFilters={hasFilters} />;
}

async function ShowResultsButtonLoading() {
  const t = await getTranslations("homepageSearchEngine");
  return (
    <Button
      className="bg-primary border border-primary hover:border-primary/80 text-white flex-1"
      disabled={true}
    >
      {t("showResult")} <Loader2 className="w-4 h-4 animate-spin" />
    </Button>
  );
}
