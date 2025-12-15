"use client";

import { useState, useEffect, useRef } from "react";
import React from "react";
import { Filter, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

interface CollapsibleFiltersProps {
  children?: React.ReactNode;
}

const DISTRICTS = [
  "All Districts",
  "Aveiro",
  "Beja",
  "Braga",
  "Bragança",
  "Castelo Branco",
  "Coimbra",
  "Évora",
  "Faro",
  "Guarda",
  "Leiria",
  "Lisboa",
  "Portalegre",
  "Porto",
  "Santarém",
  "Setúbal",
  "Viana do Castelo",
  "Vila Real",
  "Viseu",
];

const PROPERTY_TYPES = [
  "House Types",
  "Apartment",
  "House",
  "Villa",
  "Townhouse",
  "Studio",
  "Penthouse",
  "Land",
];

const PRICE_RANGES = [
  "Any Price",
  "Under €100,000",
  "€100,000 - €200,000",
  "€200,000 - €300,000",
  "€300,000 - €500,000",
  "€500,000 - €1,000,000",
  "Over €1,000,000",
];

const BEDROOMS = ["Any", "1", "2", "3", "4", "5+"];
const BATHROOMS = ["Any", "1", "2", "3", "4+"];

export const CollapsibleFilters = ({ children }: CollapsibleFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
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

  const [isMobile, setIsMobile] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [originalTop, setOriginalTop] = useState<number>(0);

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
      pathname: "/properties",
      query: queryObject, // Now it's a plain object, not URLSearchParams
    });
  };

  const handleSearch = () => {
    updateURLParams({ search: searchQuery });
  };

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

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      if (!containerRef.current || originalTop === 0) return;

      const scrollY = window.scrollY;
      const triggerPoint = originalTop - 64;

      setIsFixed(scrollY >= triggerPoint);
    };

    if (containerRef.current && originalTop === 0) {
      const rect = containerRef.current.getBoundingClientRect();
      setOriginalTop(rect.top + window.scrollY);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [originalTop, isMobile]);

  // Mobile View
  if (isMobile) {
    return (
      <>
        {/* Filter Toggle Button */}
        <div className="fixed top-16 right-6 z-[20]">
          <Button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            variant="outline"
            size="sm"
            className="bg-blue-50 border-amber-200 shadow-md hover:shadow-lg"
          >
            {showMobileFilters ? (
              <X className="w-4 h-4 mr-2" />
            ) : (
              <Filter className="w-4 h-4 mr-2" />
            )}
            Filters
          </Button>
        </div>

        {/* Mobile Filters Drawer */}
        {showMobileFilters && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-[30]"
              onClick={() => setShowMobileFilters(false)}
            />

            {/* Filters Panel */}
            <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl z-[40] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button
                    onClick={() => setShowMobileFilters(false)}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Search Box */}
                  <div className="space-y-2">
                    <Label>Search</Label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search properties..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                        className="pr-10"
                      />
                      <Button
                        onClick={handleSearch}
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      >
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* District Select */}
                  <div className="space-y-2">
                    <Label>District</Label>
                    <Select
                      value={selectedDistrict}
                      onValueChange={handleDistrictChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
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
                    <Label>Property Type</Label>
                    <Select
                      value={selectedType}
                      onValueChange={handleTypeChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
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
                    <Label>Price Range</Label>
                    <Select
                      value={selectedPrice}
                      onValueChange={handlePriceChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
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
                    <Label>Bedrooms</Label>
                    <Select
                      value={selectedBedrooms}
                      onValueChange={handleBedroomsChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BEDROOMS.map((num) => (
                          <SelectItem key={num} value={num}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bathrooms */}
                  <div className="space-y-2">
                    <Label>Bathrooms</Label>
                    <Select
                      value={selectedBathrooms}
                      onValueChange={handleBathroomsChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BATHROOMS.map((num) => (
                          <SelectItem key={num} value={num}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {children}
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Desktop View - Becomes Fixed on Scroll
  return (
    <>
      {/* Placeholder to maintain layout when fixed */}
      {isFixed && (
        <div
          className="px-6 sm:px-8 md:px-10 lg:px-14 py-4 bg-transparent"
          style={{ height: containerRef.current?.offsetHeight || "auto" }}
        />
      )}

      <div
        ref={containerRef}
        className={`
          z-[50] px-6 sm:px-8 md:px-10 lg:px-14 py-4 bg-blue-50
          ${isFixed ? "fixed top-16 left-0 right-0" : ""}
        `}
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {/* Search Box */}
            <div className="relative lg:col-span-2">
              <Input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pr-10"
              />
              <Button
                onClick={handleSearch}
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {/* District Select */}
            <Select
              value={selectedDistrict}
              onValueChange={handleDistrictChange}
            >
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

            {/* Property Type */}
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

            {/* Price Range */}
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

            {/* Bedrooms */}
            <Select
              value={selectedBedrooms}
              onValueChange={handleBedroomsChange}
            >
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

            {/* Bathrooms */}
            <Select
              value={selectedBathrooms}
              onValueChange={handleBathroomsChange}
            >
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

          {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </>
  );
};
