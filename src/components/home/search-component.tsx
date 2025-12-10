"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function HeroSearch() {
  const t = useTranslations("searchComponent");

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedBedrooms, setSelectedBedrooms] = useState("");
  const [selectedBathrooms, setSelectedBathrooms] = useState("");
  const [selectedPool, setSelectedPool] = useState("");
  const [selectedGarage, setSelectedGarage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const regions = [
    t("regions.downtown"),
    t("regions.suburbs"),
    t("regions.waterfront"),
    t("regions.cityCenter"),
    t("regions.rural"),
  ];
  const types = [
    t("types.apartment"),
    t("types.house"),
    t("types.condo"),
    t("types.villa"),
    t("types.studio"),
  ];
  const priceRanges = [
    t("priceRanges.under100k"),
    t("priceRanges.from100kTo300k"),
    t("priceRanges.from300kTo500k"),
    t("priceRanges.from500kTo1m"),
    t("priceRanges.above1m"),
  ];
  const bedroomOptions = [
    t("bedrooms.bedroom1"),
    t("bedrooms.bedrooms2"),
    t("bedrooms.bedrooms3"),
    t("bedrooms.bedrooms4plus"),
  ];
  const bathroomOptions = [
    t("bathrooms.bathroom1"),
    t("bathrooms.bathrooms2"),
    t("bathrooms.bathrooms3"),
    t("bathrooms.bathrooms4plus"),
  ];
  const poolOptions = [t("pool.yes"), t("pool.no")];
  const garageOptions = [
    t("garage.noGarage"),
    t("garage.car1"),
    t("garage.cars2"),
    t("garage.cars3plus"),
  ];

  const handleClear = () => {
    setSelectedRegion("");
    setSelectedType("");
    setSelectedPriceRange("");
    setSelectedBedrooms("");
    setSelectedBathrooms("");
    setSelectedPool("");
    setSelectedGarage("");
    setSearchQuery("");
  };

  const handleSearch = () => {
    // Handle search logic here
  };

  const handleAdvancedToggle = () => {
    setShowAdvanced(!showAdvanced);
  };

  return (
    <>
      <h1 className="text-2xl sm:text-4xl lg:text-6xl leading-snug font-extralight text-white mb-6 text-center">
        {t("heading1")} <br />
        {t("heading2")}
      </h1>
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 bg-black/30 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <Select
                  value={selectedRegion}
                  onValueChange={setSelectedRegion}
                >
                  <SelectTrigger
                    color="text-primary"
                    className="text-white  data-[placeholder]:!text-white w-full bg-transparent border-0 border-b border-primary rounded-none px-0 py-3 h-auto focus:border-primary focus:ring-0"
                  >
                    <SelectValue
                      placeholder={t("placeholderRegion")}
                      className="text-left  data-[placeholder]:!text-white text-white"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger
                    color="text-primary"
                    className="text-white  data-[placeholder]:!text-white w-full bg-transparent border-0 border-b border-primary rounded-none px-0 py-3 h-auto focus:border-primary focus:ring-0"
                  >
                    <SelectValue
                      placeholder={t("placeholderType")}
                      className="text-left  data-[placeholder]:!text-white text-white"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Select
                  value={selectedPriceRange}
                  onValueChange={setSelectedPriceRange}
                >
                  <SelectTrigger
                    color="text-primary"
                    className="text-white  data-[placeholder]:!text-white w-full bg-transparent border-0 border-b border-primary rounded-none px-0 py-3 h-auto focus:border-primary focus:ring-0"
                  >
                    <SelectValue
                      placeholder={t("placeholderPriceRange")}
                      className="text-left  data-[placeholder]:!text-white text-white"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Select
                  value={selectedBedrooms}
                  onValueChange={setSelectedBedrooms}
                >
                  <SelectTrigger
                    color="text-primary"
                    className="text-white  data-[placeholder]:!text-white w-full bg-transparent border-0 border-b border-primary rounded-none px-0 py-3 h-auto focus:border-primary focus:ring-0"
                  >
                    <SelectValue
                      placeholder={t("placeholderBedrooms")}
                      className="text-left  data-[placeholder]:!text-white text-white"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {bedroomOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div
              className={`grid gap-4 items-end ${
                showAdvanced ? "grid-cols-1 lg:grid-cols-5" : "grid-cols-1"
              }`}
            >
              <div className={showAdvanced ? "lg:col-span-2" : "w-full"}>
                <Input
                  type="text"
                  placeholder={t("placeholderFreeSearchRefNumber")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-primary rounded-none px-0 py-3 placeholder:text-white focus:border-primary focus:ring-0"
                />
              </div>

              {showAdvanced && (
                <>
                  <div className="space-y-1">
                    <Select
                      value={selectedBathrooms}
                      onValueChange={setSelectedBathrooms}
                    >
                      <SelectTrigger
                        color="text-primary"
                        className="text-white  data-[placeholder]:!text-white w-full bg-transparent border-0 border-b border-primary rounded-none px-0 py-3 h-auto focus:border-primary focus:ring-0"
                      >
                        <SelectValue
                          placeholder={t("placeholderBathrooms")}
                          className="text-left  data-[placeholder]:!text-white text-white"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {bathroomOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Select
                      value={selectedPool}
                      onValueChange={setSelectedPool}
                    >
                      <SelectTrigger
                        color="text-primary"
                        className="text-white  data-[placeholder]:!text-white w-full bg-transparent border-0 border-b border-primary rounded-none px-0 py-3 h-auto focus:border-primary focus:ring-0"
                      >
                        <SelectValue
                          placeholder={t("placeholderPool")}
                          className="text-left  data-[placeholder]:!text-white text-white"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {poolOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Select
                      value={selectedGarage}
                      onValueChange={setSelectedGarage}
                    >
                      <SelectTrigger
                        color="text-primary"
                        className="text-white  data-[placeholder]:!text-white w-full bg-transparent border-0 border-b border-primary rounded-none px-0 py-3 h-auto focus:border-primary focus:ring-0"
                      >
                        <SelectValue
                          placeholder={t("placeholderGarage")}
                          className="text-left data-[placeholder]:!text-white  text-white"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {garageOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 justify-between lg:w-48">
            <div className="flex gap-2">
              <Button
                onClick={handleClear}
                className="flex-1 bg-neutral-800 rounded-none text-white"
              >
                {t("buttonCancel")}
              </Button>
              <Button
                onClick={handleSearch}
                className="flex-1 bg-primary rounded-none text-white"
              >
                {t("buttonSearch")}
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={handleAdvancedToggle}
              className={cn(
                "text-white w-full bg-transparent border border-white hover:bg-white hover:text-black rounded-none",
                showAdvanced &&
                  "bg-white text-black hover:bg-white/80 hover:border-white/80"
              )}
            >
              {showAdvanced
                ? t("buttonHideAdvanced")
                : t("buttonAdvancedSearch")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
