"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  BATHROOMS,
  BEDROOMS,
  DISTRICTS,
  PRICE_RANGES,
  PROPERTY_TYPES,
} from "@/config/constants";
import { useRouter } from "@/i18n/navigation";

export const HomeFilterComponents = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Function to update URL params
  const updateURLParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (
        value &&
        value !== "Any" &&
        value !== "All Districts" &&
        value !== "House Types" &&
        value !== "Any Price"
      ) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Convert URLSearchParams to plain object
    const queryObject: Record<string, string> = {};
    params.forEach((value, key) => {
      queryObject[key] = value;
    });

    router.replace({
      pathname: "/",
      query: queryObject,
    });
  };

  const [selectedDistrict, setSelectedDistrict] = useState(
    searchParams.get("district") || "All Districts"
  );
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || "House Types"
  );
  const [selectedPrice, setSelectedPrice] = useState(
    searchParams.get("price") || "Any Price"
  );
  const [selectedBedrooms, setSelectedBedrooms] = useState(
    searchParams.get("min_bedroom") || "Any"
  );
  const [selectedBathrooms, setSelectedBathrooms] = useState(
    searchParams.get("min_bathroom") || "Any"
  );

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    updateURLParams({ district: value });
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    updateURLParams({ type: value });
  };

  const handlePriceChange = (value: string) => {
    setSelectedPrice(value);
    updateURLParams({ price: value });
  };

  const handleBedroomsChange = (value: string) => {
    setSelectedBedrooms(value);
    updateURLParams({ min_bedrooms: value });
  };

  const handleBathroomsChange = (value: string) => {
    setSelectedBathrooms(value);
    updateURLParams({ min_bathrooms: value });
  };

  return (
    <>
      {/* District Select */}
      <div className="space-y-2">
        <Label className="lg:hidden">District</Label>
        <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="District" />
          </SelectTrigger>
          <SelectContent>
            {DISTRICTS.map((district) => (
              <SelectItem key={district} value={district}>
                {district}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Property Type */}
      <div className="space-y-2">
        <Label className="lg:hidden">Property Type</Label>
        <Select value={selectedType} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            {PROPERTY_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <Label className="lg:hidden">Price Range</Label>
        <Select value={selectedPrice} onValueChange={handlePriceChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            {PRICE_RANGES.map((range) => (
              <SelectItem key={range} value={range}>
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bedrooms */}
      <div className="space-y-2">
        <Label className="lg:hidden">Bedrooms</Label>
        <Select value={selectedBedrooms} onValueChange={handleBedroomsChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Bedrooms" />
          </SelectTrigger>
          <SelectContent>
            {BEDROOMS.map((num) => (
              <SelectItem key={num} value={num}>
                {num === "Any" ? "Any Bedrooms" : `${num} Bed`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bathrooms */}
      <div className="space-y-2">
        <Label className="lg:hidden">Bathrooms</Label>
        <Select value={selectedBathrooms} onValueChange={handleBathroomsChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Bathrooms" />
          </SelectTrigger>
          <SelectContent>
            {BATHROOMS.map((num) => (
              <SelectItem key={num} value={num}>
                {num === "Any" ? "Any Bathrooms" : `${num} Bath`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
