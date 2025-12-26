"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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

  const [selectedDistrictIds, setSelectedDistrictIds] = useState<number[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || "House Types"
  );
  const [selectedBedrooms, setSelectedBedrooms] = useState(
    searchParams.get("min_bedroom") || "Any"
  );
  const [selectedBathrooms, setSelectedBathrooms] = useState(
    searchParams.get("min_bathroom") || "Any"
  );

  // Initialize selected districts from URL
  useEffect(() => {
    const districtParam = searchParams.get("district");
    if (districtParam) {
      const ids = districtParam
        .split(",")
        .map(Number)
        .filter((id) => !isNaN(id));
      setSelectedDistrictIds(ids);
    } else {
      setSelectedDistrictIds([]);
    }

    // Initialize price ranges from URL
    const priceRangesParam = searchParams.getAll("price_ranges[]");
    if (priceRangesParam.length > 0) {
      setSelectedPriceRanges(priceRangesParam);
    } else {
      setSelectedPriceRanges([]);
    }
  }, [searchParams]);

  // Function to update URL params
  const updateURLParams = (
    updates: Record<string, string | string[] | null>
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (key === "price_ranges[]") {
        // Remove all existing price_ranges[] params
        const existingParams = Array.from(params.keys());
        existingParams.forEach((param) => {
          if (param === "price_ranges[]") {
            params.delete(param);
          }
        });

        // Add new price ranges
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((range) => {
            params.append("price_ranges[]", range);
          });
        }
      } else if (
        value &&
        value !== "Any" &&
        value !== "All Districts" &&
        value !== "House Types" &&
        value !== "Any Price"
      ) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    // Convert URLSearchParams to plain object
    const queryObject: Record<string, string | string[]> = {};
    const priceRanges: string[] = [];

    params.forEach((value, key) => {
      if (key === "price_ranges[]") {
        priceRanges.push(value);
      } else {
        queryObject[key] = value;
      }
    });

    if (priceRanges.length > 0) {
      queryObject["price_ranges[]"] = priceRanges;
    }

    router.replace({
      pathname: "/",
      query: queryObject,
    });
  };

  const handleDistrictToggle = (districtId: number) => {
    let newSelectedIds: number[];

    if (selectedDistrictIds.includes(districtId)) {
      newSelectedIds = selectedDistrictIds.filter((id) => id !== districtId);
    } else {
      newSelectedIds = [...selectedDistrictIds, districtId];
    }

    setSelectedDistrictIds(newSelectedIds);
    updateURLParams({
      district: newSelectedIds.length > 0 ? newSelectedIds.join(",") : null,
    });
  };

  const handlePriceRangeToggle = (rangeValue: string) => {
    let newSelectedRanges: string[];

    if (selectedPriceRanges.includes(rangeValue)) {
      newSelectedRanges = selectedPriceRanges.filter((r) => r !== rangeValue);
    } else {
      newSelectedRanges = [...selectedPriceRanges, rangeValue];
    }

    setSelectedPriceRanges(newSelectedRanges);
    updateURLParams({
      "price_ranges[]": newSelectedRanges.length > 0 ? newSelectedRanges : null,
    });
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    updateURLParams({ type: value });
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
      {/* District Multi-Select */}
      <div className="space-y-2">
        <Label className="lg:hidden">Districts</Label>
        <Select value={selectedDistrictIds.length > 0 ? "selected" : ""}>
          <SelectTrigger className="w-full">
            <span className="text-sm">
              {selectedDistrictIds.length === 0
                ? "All Districts"
                : `${selectedDistrictIds.length} District${
                    selectedDistrictIds.length > 1 ? "s" : ""
                  } Selected`}
            </span>
          </SelectTrigger>
          <SelectContent>
            <div className="max-h-[300px] overflow-y-auto">
              {DISTRICTS.map((district) => (
                <div
                  key={district.id}
                  className="flex items-center space-x-2 px-2 py-2 hover:bg-accent cursor-pointer"
                  onClick={() => handleDistrictToggle(district.id)}
                >
                  <Checkbox
                    checked={selectedDistrictIds.includes(district.id)}
                    onCheckedChange={() => handleDistrictToggle(district.id)}
                  />
                  <label className="text-sm cursor-pointer flex-1">
                    {district.name}
                  </label>
                </div>
              ))}
            </div>
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

      {/* Price Range Multi-Select */}
      <div className="space-y-2">
        <Label className="lg:hidden">Price Range</Label>
        <Select value={selectedPriceRanges.length > 0 ? "selected" : ""}>
          <SelectTrigger className="w-full">
            <span className="text-sm">
              {selectedPriceRanges.length === 0
                ? "Any Price"
                : `${selectedPriceRanges.length} Range${
                    selectedPriceRanges.length > 1 ? "s" : ""
                  } Selected`}
            </span>
          </SelectTrigger>
          <SelectContent>
            <div className="max-h-[300px] overflow-y-auto">
              {PRICE_RANGES.map((range) => (
                <div
                  key={range.value}
                  className="flex items-center space-x-2 px-2 py-2 hover:bg-accent cursor-pointer"
                  onClick={() => handlePriceRangeToggle(range.value)}
                >
                  <Checkbox
                    checked={selectedPriceRanges.includes(range.value)}
                    onCheckedChange={() => handlePriceRangeToggle(range.value)}
                  />
                  <label className="text-sm cursor-pointer flex-1">
                    {range.label}
                  </label>
                </div>
              ))}
            </div>
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
