import React, { Suspense } from "react";
// import { PriceSlider } from "@/components/search/price-slider-2";
import { SearchInput } from "./search-input";
import { Skeleton } from "../ui/skeleton";
import { CollapsibleFilters } from "./collapsible-filters";
import { ListBathroomsRangeSelectDesktop, ListBedroomsRangeSelectDesktop, ListPricesDesktop, ListPropertyTypesDesktop, ListRegionSelectDesktop } from "./listing-filters-desktop";

export const PropertiesFilter = () => {
  return (
    <CollapsibleFilters visibleCount={4}>
      <div className="relative">
        <SearchInput className="text-gray-700 placeholder:text-gray-700" />
      </div>

      <div className="relative">
        <Suspense
          // key={`${suspenseKey} --region-select`}
          fallback={<Skeleton className="h-10 w-full" />}
        >
          <ListRegionSelectDesktop />
        </Suspense>
      </div>

      <div className="relative">
        <Suspense
          // key={`${suspenseKey} --property-types`}
          fallback={<Skeleton className="h-10 w-full" />}
        >
          <ListPropertyTypesDesktop />
        </Suspense>
      </div>

      <div className="relative">
        <Suspense
          // key={`${suspenseKey} --price-slider`}
          fallback={<Skeleton className="h-10 w-full" />}
        >
          <ListPricesDesktop />
        </Suspense>
      </div>

      {/* Additional filters that will be hidden initially */}
      <div className="relative">
        <Suspense
          // key={`${suspenseKey} --bedrooms-slider`}
          fallback={<Skeleton className="h-10 w-full" />}
        >
          <ListBedroomsRangeSelectDesktop />
        </Suspense>
      </div>

      <div className="relative">
        <Suspense
          // key={`${suspenseKey} --bathrooms-slider`}
          fallback={<Skeleton className="h-10 w-full" />}
        >
          <ListBathroomsRangeSelectDesktop />
        </Suspense>
      </div>

    </CollapsibleFilters>
  );
};
