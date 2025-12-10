"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useTranslations } from "next-intl";

const sortOptions = [
  {
    value: "created_at_desc",
    labelKey: "mostRecent",
    sortBy: "created_at",
    sortDirection: "desc",
  },
  {
    value: "created_at_asc",
    labelKey: "oldest",
    sortBy: "created_at",
    sortDirection: "asc",
  },
  {
    value: "price_desc",
    labelKey: "priceHighToLow",
    sortBy: "price",
    sortDirection: "desc",
  },
  {
    value: "price_asc",
    labelKey: "priceLowToHigh",
    sortBy: "price",
    sortDirection: "asc",
  },
];

export const SortBy = () => {
  const t = useTranslations("sortBy");
  const router = useRouter();
  const searchParams = useSearchParams();

  const getInitialSort = (): string => {
    const sortBy = searchParams.get("sort_by") || "created_at";
    const sortDirection = searchParams.get("sort_direction") || "desc";
    return `${sortBy}_${sortDirection}`;
  };

  const [selectedSort, setSelectedSort] = useState<string>(getInitialSort);

  const updateURL = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());

    const selectedOption = sortOptions.find(
      (option) => option.value === sortValue
    );

    if (selectedOption) {
      if (
        selectedOption.sortBy !== "created_at" ||
        selectedOption.sortDirection !== "desc"
      ) {
        params.set("sort_by", selectedOption.sortBy);
        params.set("sort_direction", selectedOption.sortDirection);
      } else {
        params.delete("sort_by");
        params.delete("sort_direction");
      }
    }

    params.delete("page");

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    updateURL(value);
  };

  useEffect(() => {
    const currentSortBy = searchParams.get("sort_by") || "created_at";
    const currentSortDirection = searchParams.get("sort_direction") || "desc";
    const currentSort = `${currentSortBy}_${currentSortDirection}`;
    setSelectedSort(currentSort);
  }, [searchParams]);

  return (
    <Select value={selectedSort} onValueChange={handleSortChange}>
      <SelectTrigger
        className="w-[180px] data-[placeholder]:text-primary"
        iconColor="text-white"
      >
        <SelectValue placeholder={t("sortByPlaceholder")} />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {t(option.labelKey)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};