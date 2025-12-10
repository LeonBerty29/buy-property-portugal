import React from "react";
import { PropertySearchParams } from "@/types/property";
import { CustomPagination } from "../shared/custom-pagination";
import { getPropertiesWithAllPaginated } from "@/data/properties";
import { PROPERTIES_PER_PAGE } from "@/config/constants";

export const PropertiesPagination = async ({
  apiParams,
}: {
  apiParams: PropertySearchParams;
}) => {
  const propertiesResponse = await getPropertiesWithAllPaginated(
    apiParams,
    PROPERTIES_PER_PAGE
  );

  const { meta } = propertiesResponse;
  const totalPages = meta.last_page;

  // Define styles for the pagination component
  const paginationStyles = {
    paginationRoot: "flex justify-center items-center space-x-2 mt-8",
    paginationPrevious:
      "px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
    paginationNext:
      "px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
    paginationLink:
      "px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-black hover:text-white",
    paginationLinkActive:
      "px-3 py-2 text-sm font-medium text-white bg-primary border border-primary rounded-md disabled:opacity-50 disabled:cursor-not-allowed",
  };

  // Only show pagination if there are multiple pages
  if (totalPages <= 1) {
    return null;
  }

  return (
    <CustomPagination
      baseURL="/properties" // Adjust this to your actual properties page URL
      totalPages={totalPages}
      maxVisiblePages={5}
      styles={paginationStyles}
    />
  );
};
