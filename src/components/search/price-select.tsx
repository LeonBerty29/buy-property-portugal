"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Ranges } from "@/types/property";

interface PriceRange {
  min: number;
  max: number;
  label: string;
  value: string;
}

export function PriceSelect({
  priceRange,
  modal = true,
}: {
  priceRange: Ranges["price"];
  modal?: boolean;
}) {
  const t = useTranslations("priceSelect");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  // Generate price ranges based on min and max values
  const priceRanges = useMemo((): PriceRange[] => {
    const ranges: PriceRange[] = [];
    const { min, max } = priceRange;

    // Define standard range boundaries
    const standardRanges = [
      { min: 0, max: 500000, label: t("range0to500k") },
      { min: 500000, max: 1000000, label: t("range500kTo1m") },
      { min: 1000000, max: 2000000, label: t("range1mTo2m") },
      { min: 2000000, max: 3000000, label: t("range2mTo3m") },
      { min: 3000000, max: 4000000, label: t("range3mTo4m") },
      { min: 4000000, max: 5000000, label: t("range4mTo5m") },
    ];

    // Add standard ranges that overlap with your data
    standardRanges.forEach((range) => {
      if (range.min < max && range.max > min) {
        const adjustedMin = Math.max(range.min, min);
        const adjustedMax = Math.min(range.max, max);

        if (adjustedMax > adjustedMin) {
          ranges.push({
            min: adjustedMin,
            max: adjustedMax,
            label: range.label,
            value: `${adjustedMin}-${adjustedMax}`,
          });
        }
      }
    });

    // Handle ranges above 5M based on actual max price
    if (max > 5000000) {
      const finalRangeMin = Math.max(5000000, min);

      if (max <= 10000000) {
        // If max is 10M or less, create 5M-10M range
        ranges.push({
          min: finalRangeMin,
          max: 10000000,
          label: t("range5mTo10m"),
          value: `${finalRangeMin}-10000000`,
        });
      } else {
        // If max is greater than 10M, create both 5M-10M and 10M+ ranges
        ranges.push({
          min: finalRangeMin,
          max: 10000000,
          label: t("range5mTo10m"),
          value: `${finalRangeMin}-10000000`,
        });

        ranges.push({
          min: 10000000,
          max: max,
          label: t("range10mPlus"),
          value: `10000000-${max}`,
        });
      }
    }

    return ranges;
  }, [priceRange.min, priceRange.max, t]);

  // Determine current selected values based on URL params
  useEffect(() => {
    const priceRangeParams = searchParams.getAll("price_ranges[]");

    if (priceRangeParams.length === 0) {
      // Check for legacy min_price and max_price parameters
      const minPrice = searchParams.get("min_price");
      const maxPrice = searchParams.get("max_price");

      if (minPrice || maxPrice) {
        const currentMin = minPrice ? parseInt(minPrice) : priceRange.min;
        const currentMax = maxPrice ? parseInt(maxPrice) : priceRange.max;

        // Find matching range for legacy parameters
        const matchingRange = priceRanges.find(
          (range) => range.min === currentMin && range.max === currentMax
        );

        setSelectedValues(matchingRange ? [matchingRange.value] : []);
      } else {
        setSelectedValues([]);
      }
    } else {
      // Parse new price_ranges[] format
      const selectedRanges: string[] = [];

      priceRangeParams.forEach((param) => {
        const [min, max] = param.split(",").map(Number);
        if (!isNaN(min) && !isNaN(max)) {
          const matchingRange = priceRanges.find(
            (range) => range.min === min && range.max === max
          );
          if (matchingRange) {
            selectedRanges.push(matchingRange.value);
          }
        }
      });

      setSelectedValues(selectedRanges);
    }
  }, [searchParams, priceRange.min, priceRange.max, priceRanges]);

  const handleValueToggle = (value: string) => {
    let newSelectedValues: string[];

    if (selectedValues.includes(value)) {
      // Remove the value if already selected
      newSelectedValues = selectedValues.filter((v) => v !== value);
    } else {
      // Add the value if not selected
      newSelectedValues = [...selectedValues, value];
    }

    setSelectedValues(newSelectedValues);
    updateURL(newSelectedValues);
  };

  const updateURL = (values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    // Remove legacy price parameters
    params.delete("min_price");
    params.delete("max_price");

    // Remove existing price_ranges[] parameters
    params.delete("price_ranges[]");

    if (values.length === 0) {
      // No ranges selected, don't add any price parameters
    } else {
      // Add new price_ranges[] parameters
      values.forEach((value) => {
        const selectedRange = priceRanges.find(
          (range) => range.value === value
        );
        if (selectedRange) {
          params.append(
            "price_ranges[]",
            `${selectedRange.min},${selectedRange.max}`
          );
        }
      });
    }

    // Reset to first page when filter changes
    params.delete("page");

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const clearAllSelections = () => {
    setSelectedValues([]);
    updateURL([]);
    setOpen(false);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return t("priceRange");
    }

    if (selectedValues.length === 1) {
      const selectedRange = priceRanges.find(
        (range) => range.value === selectedValues[0]
      );
      return selectedRange?.label || t("priceRange");
    }

    return `${selectedValues.length} ${t("priceRangesSelected")}`;
  };

  return (
    <div className="space-y-4">
      <DropdownMenu modal={modal} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full min-h-[40px] justify-between text-left text-muted-foreground text-sm md:text-base font-normal"
          >
            {getDisplayText()}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 p-0" align="start">
          <Command>
            <CommandEmpty>{t("noPriceRangeFound")}</CommandEmpty>
            <CommandGroup>
              {selectedValues.length > 0 && (
                <CommandItem
                  onSelect={clearAllSelections}
                  className="cursor-pointer text-red-600 border-b border-gray-100 mb-1"
                >
                  {t("clearAllSelections")}
                </CommandItem>
              )}
              {priceRanges.map((range) => (
                <CommandItem
                  key={range.value}
                  value={range.value}
                  onSelect={() => handleValueToggle(range.value)}
                  className="cursor-pointer text-base"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selectedValues.includes(range.value)
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                  {range.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}