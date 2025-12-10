import { Link } from "@/i18n/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "../ui/button";
import FilterTags from "./filter-tags";
import { PropertiesFilter } from "./properties-filters";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Search } from "lucide-react";
import { SearchInput } from "./search-input";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import {
  ListBathroomsRangeSelect,
  ListBedroomsRangeSelect,
  ListPrices,
  ListPropertyTypes,
  ListRegionSelect,
} from "./listing-filters";
import { getTranslations } from "next-intl/server";

const SearchHeader = async() => {
  const t = await getTranslations("searchHeader");

  const propertiesCount = 3550;

  return (
    <>
      <div className="mb-5 2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto w-full">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/">{t("home")}</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-primary" />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("properties")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="bg-black py-5 text-white">
        <div className="2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto w-full flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
          <Button className="px-7 text-white text-xs sm:text-sm hidden lg:block">
            {t("allProperties")}
          </Button>

          <div className="flex-col items-center gap-2 sm:flex">
            <p className="text-sm lg:text-base text-center">
              <b>{propertiesCount}</b> {t("propertiesForSaleWith")}{" "}
              <span className="text-primary font-semibold">
                {t("exclusiveAlgarveVillas")}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div>
        <div>
          <PropertiesFilter />
        </div>
      </div>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Search className="w-4 h-4 mr-2" />
              {t("search")}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[90vh] p-5 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{t("search")}</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="relative">
                <SearchInput />
              </div>

              <div className="relative">
                <Suspense
                  // key={`${suspenseKey} --region-select`}
                  fallback={<Skeleton className="h-10 w-full" />}
                >
                  <ListRegionSelect />
                </Suspense>
              </div>

              <div className="relative">
                <Suspense
                  // key={`${suspenseKey} --property-types`}
                  fallback={<Skeleton className="h-10 w-full" />}
                >
                  <ListPropertyTypes />
                </Suspense>
              </div>

              <div className="relative">
                <Suspense
                  // key={`${suspenseKey} --price-slider`}
                  fallback={<Skeleton className="h-10 w-full" />}
                >
                  <ListPrices />
                </Suspense>
              </div>

              <div className="relative">
                <Suspense
                  // key={`${suspenseKey} --bedrooms-slider`}
                  fallback={<Skeleton className="h-10 w-full" />}
                >
                  <ListBedroomsRangeSelect />
                </Suspense>
              </div>

              <div className="relative">
                <Suspense
                  // key={`${suspenseKey} --bathrooms-slider`}
                  fallback={<Skeleton className="h-10 w-full" />}
                >
                  <ListBathroomsRangeSelect />
                </Suspense>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="mt-6 flex gap-5 2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto py-0">
        <div className="hidden sm:flex items-center gap-5 flex-wrap">
          <FilterTags />
        </div>
      </div>
    </>
  );
};

export default SearchHeader;
