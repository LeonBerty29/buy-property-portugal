"use client";

import { useRouter } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { hasActiveFilters } from "@/lib/utils";
import { PropertySearchParams } from "@/types/property";
import { useTranslations } from "next-intl";

export const ClearHomeFilters = ({
  apiParams,
}: {
  apiParams: PropertySearchParams;
}) => {
  const router = useRouter();
  const t = useTranslations("clearHomeFilters")
  const clearAllFilters = () => {
    router.push("/");
  };
  const hasFilters = hasActiveFilters(apiParams);
  return (
    <Button
      className="bg-transparent border border-white text-white hover:bg-white hover:text-black transition-colors flex-1"
      onClick={clearAllFilters}
      disabled={!hasFilters}
    >
      {t("reset")}
    </Button>
  );
};
