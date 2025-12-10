"use client";

import React from "react";
import { Button } from "../ui/button";
import {
  Bed,
  Bath,
  Landmark,
  MapPin,
  X,
  Search,
  Calendar,
  Zap,
  Building,
  Home,
} from "lucide-react";
import { getCurrencySymbol } from "../shared/price-format";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";


const FilterTags = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("filterTags");

  // Function to remove a specific filter
  const removeFilter = (filterKey: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(filterKey);
    params.delete("page")
    router.replace(`/properties?${params.toString()}`);
  };

  // Function to clear all filters
  const clearAllFilters = () => {
    router.push("/properties");
  };

  // Function to get icon for filter type
  const getFilterIcon = (filterType: string) => {
    switch (filterType) {
      case "location":
      case "municipality":
      case "district":
        return <MapPin className="h-4 w-4 text-gray-600" />;
      case "type":
        return <Landmark className="h-4 w-4 text-gray-600" />;
      case "min_bedrooms":
      case "max_bedrooms":
        return <Bed className="h-4 w-4 text-gray-600" />;
      case "min_bathrooms":
      case "max_bathrooms":
        return <Bath className="h-4 w-4 text-gray-600" />;
      case "search":
        return <Search className="h-4 w-4 text-gray-600" />;
      case "construction_year_from":
      case "construction_year_to":
        return <Calendar className="h-4 w-4 text-gray-600" />;
      case "energy_class":
        return <Zap className="h-4 w-4 text-gray-600" />;
      case "agency_id":
        return <Building className="h-4 w-4 text-gray-600" />;
      default:
        return <Home className="h-4 w-4 text-gray-600" />;
    }
  };

  // Function to format filter value for display
  const formatFilterValue = (key: string, value: string | number) => {
    switch (key) {
      case "min_bedrooms":
        return `${value}+ Beds`;
      case "max_bedrooms":
        return `Up to ${value} Beds`;
      case "min_bathrooms":
        return `${value}+ Baths`;
      case "max_bathrooms":
        return `Up to ${value} Baths`;
      case "min_area":
        return `${value}+ m²`;
      case "max_area":
        return `Up to ${value} m²`;
      case "min_plot_size":
        return `${value}+ m² Plot`;
      case "max_plot_size":
        return `Up to ${value} m² Plot`;
      case "construction_year_from":
        return `From ${value}`;
      case "construction_year_to":
        return `To ${value}`;
      case "energy_class":
        return `Energy: ${value}`;
      case "type":
        return (
          value.toString().charAt(0).toUpperCase() + value.toString().slice(1)
        );
      default:
        return value;
    }
  };

  // Get active filters from URL search params
  const activeFilters = Array.from(searchParams.entries()).filter(
    ([key, value]) => {
      // Exclude pagination, sorting, and default values
      const excludeKeys = [
        "page",
        "per_page",
        "sort_by",
        "sort_direction",
        "language",
        "currency",
        "show_price",
      ];
      return (
        !excludeKeys.includes(key) &&
        value !== undefined &&
        value !== null &&
        value !== ""
      );
    }
  );

  // Check if we have price range
  const hasPriceRange =
    searchParams.get("min_price") || searchParams.get("max_price");

  return (
    <>
      {/* Price Range Filter */}
      {hasPriceRange && (
        <div className="text-sm bg-gray-200 font-semibold text-black flex items-center gap-2 px-4 py-2 rounded-md">
          <span className="text-gray-700">
            {getCurrencySymbol(searchParams.get("currency") || "EUR")}
          </span>
          <span>
            {searchParams.get("min_price") && searchParams.get("max_price")
              ? `${searchParams.get("min_price")} - ${searchParams.get(
                  "max_price"
                )}`
              : searchParams.get("min_price")
              ? `${searchParams.get("min_price")}+`
              : `<= ${searchParams.get("max_price")}`}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="text-gray-600 font-semibold hover:bg-inherit cursor-pointer p-1 h-auto"
            onClick={() => {
              removeFilter("min_price");
              removeFilter("max_price");
            }}
          >
            <X className="h-4 w-4 text-gray-600" strokeWidth={3} />
          </Button>
        </div>
      )}

      {/* Other Active Filters */}
      {activeFilters.map(([key, value], index) => {
        // Skip price filters as they're handled above
        if (key === "min_price" || key === "max_price") return null;

        return (
          <div
            key={`${key}-${index}`}
            className="text-sm bg-gray-200 font-semibold text-black flex items-center gap-2 px-4 py-2 rounded-md"
          >
            {getFilterIcon(key)}
            <span>{formatFilterValue(key, value)}</span>
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-600 font-semibold hover:bg-inherit cursor-pointer p-1 h-auto"
              onClick={() => removeFilter(key)}
            >
              <X className="h-4 w-4 text-gray-600" strokeWidth={3} />
            </Button>
          </div>
        );
      })}

      {/* Clear All Button - Only show if there are active filters */}
      {(activeFilters.length > 0 || hasPriceRange) && (
        <Button
          className="text-red-600 font-semibold"
          variant="ghost"
          onClick={clearAllFilters}
        >
          <X className="h-4 w-4" strokeWidth={3} /> {t("clearAll")}
        </Button>
      )}
    </>
  );
};

export default FilterTags;
