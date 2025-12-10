"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FloorPlanTab } from "./floor-plan";
import { LocationTab } from "./location-tab";
import { PropertyFeatures } from "../property-details/property-features";
import { Property } from "@/types/property";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface ScrollableTabsProps {
  property: Property;
}

const ScrollableTabs = ({ property }: ScrollableTabsProps) => {
  const t = useTranslations("scrollableTabs");

  const [activeTab, setActiveTab] = useState<string>("desc");
  const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
  const [showRightArrow, setShowRightArrow] = useState<boolean>(true);
  const tabsListRef = useRef<HTMLDivElement>(null);

  // Check if scroll navigation is needed
  const checkScroll = useCallback(() => {
    if (tabsListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsListRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  useEffect(() => {
    // Initial check
    checkScroll();

    // Add event listener for scroll
    const tabsList = tabsListRef.current;
    if (tabsList) {
      tabsList.addEventListener("scroll", checkScroll);
      // Also check on window resize
      window.addEventListener("resize", checkScroll);

      return () => {
        tabsList.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [checkScroll]);

  // Scroll navigation functions
  const scrollLeft = useCallback(() => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  }, []);

  return (
    <>
      <div className="w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="relative w-full flex items-center">
            {/* Left scroll button - positioned outside TabsList */}
            <button
              onClick={scrollLeft}
              className={`flex-shrink-0 p-1 rounded-full shadow-md bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 z-10 mr-1 ${
                showLeftArrow ? "opacity-100" : "opacity-0 pointer-events-none"
              } transition-opacity duration-200`}
              aria-label={t("ariaLabelScrollLeft")}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* TabsList with full width */}
            <div className="flex-grow overflow-hidden">
              <TabsList
                ref={tabsListRef}
                className="w-full overflow-x-auto scrollbar-hide pl-1 pr-1 flex justify-start"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <TabsTrigger
                  value={"desc"}
                  className="whitespace-nowrap mx-1 first:ml-0 last:mr-0"
                >
                  {t("description")}
                </TabsTrigger>
                <TabsTrigger
                  value={"features"}
                  className="whitespace-nowrap mx-1 first:ml-0 last:mr-0"
                >
                  {t("features")}
                </TabsTrigger>
                {property.assets.images.floor_plans.length > 0 && (
                  <TabsTrigger
                    value={"fplan"}
                    className="whitespace-nowrap mx-1 first:ml-0 last:mr-0"
                  >
                    {t("floorPlan")}
                  </TabsTrigger>
                )}
                <Link
                  href={property.assets.pdf_brochure}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="text-xs rounded-none bg-black text-white px-6">
                    <Download className="size-4" /> {t("downloadBrochure")}
                  </Button>
                </Link>

                <TabsTrigger
                  value={"location"}
                  className="whitespace-nowrap mx-1 first:ml-0 last:mr-0"
                >
                  {t("location")}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Right scroll button - positioned outside TabsList */}
            <button
              onClick={scrollRight}
              className={`flex-shrink-0 p-1 rounded-full shadow-md bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 z-10 ml-1 ${
                showRightArrow ? "opacity-100" : "opacity-0 pointer-events-none"
              } transition-opacity duration-200`}
              aria-label={t("ariaLabelScrollRight")}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Tab contents */}
          <TabsContent
            value={"desc"}
            className="mt-4 p-4 border rounded-md px-2 md:px-4"
          >
            <div className="min-h-32 p-4 space-y-6">
              <DescriptionContent description={property.description} />
            </div>
          </TabsContent>
          <TabsContent
            value={"features"}
            className="mt-4 p-4 border rounded-md px-2 md:px-4"
          >
            <div className="min-h-32 p-4">
              <PropertyFeatures
                additionalFeatures={property.additional_features}
              />
            </div>
          </TabsContent>

          <TabsContent
            value={"fplan"}
            className="mt-4 p-4 border rounded-md px-2 md:px-4"
          >
            <div className="p-4">
              <FloorPlanTab
                propertyReference={property.reference}
                pdfBrochure={property.assets.pdf_brochure}
              />
            </div>
          </TabsContent>

          <TabsContent
            value={"location"}
            className="mt-4 p-4 border rounded-md px-2 md:px-4"
          >
            <div className="min-h-32 p-4">
              <LocationTab
                latitude={property.location.latitude}
                longitude={property.location.longitude}
                propertyReference={property.reference}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ScrollableTabs;

const DescriptionContent = ({ description }: { description: string }) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: description }}
      className="!text-sm prose prose-sm max-w-none"
    />
  );
};
