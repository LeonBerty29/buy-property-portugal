"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useTranslations } from "next-intl";

interface CollapsibleFiltersProps {
  children: React.ReactNode;
  visibleCount?: number;
}

export const CollapsibleFilters = ({
  children,
  visibleCount = 4,
}: CollapsibleFiltersProps) => {
  const t = useTranslations("collapsibleFilters");
  const [showAll, setShowAll] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [originalTop, setOriginalTop] = useState<number>(0);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const childrenArray = React.Children.toArray(children);

  // Determine visible count based on screen size
  const getVisibleCount = () => {
    if (isMobile) return 0; // Mobile uses sheet, so no visible filters in main layout
    if (isTablet) return 2; // md breakpoint shows 2
    return visibleCount; // lg+ breakpoint shows 4 (or custom visibleCount)
  };

  const currentVisibleCount = getVisibleCount();
  const visibleFilters = childrenArray.slice(0, currentVisibleCount);
  const hiddenFilters = childrenArray.slice(currentVisibleCount);

  // Click handler to toggle showing all filters
  const handleToggleFilters = () => {
    if (!isMobile) {
      setShowAll(!showAll);
    }
  };

  // Mouse enter handler - wait 150ms then open menu
  const handleMouseEnter = () => {
    if (!isMobile && hiddenFilters.length > 0) {
      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      // Set new timeout to open menu after 150ms
      hoverTimeoutRef.current = setTimeout(() => {
        setShowAll(true);
      }, 150);
    }
  };

  // Mouse leave handler - immediately collapse menu
  const handleMouseLeave = () => {
    if (!isMobile) {
      // Clear the timeout if mouse leaves before 150ms
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }

      // Collapse the menu immediately
      setShowAll(false);
    }
  };

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768); // Below md breakpoint
      setIsTablet(width >= 768 && width < 1024); // md to lg breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || originalTop === 0 || isMobile) return;

      const scrollY = window.scrollY;
      const triggerPoint = originalTop - 64; // Point where it should become fixed

      const shouldBeFixed = scrollY >= triggerPoint;

      if (shouldBeFixed !== isFixed) {
        setIsFixed(shouldBeFixed);
      }
    };

    // Set initial position
    if (containerRef.current && originalTop === 0) {
      const rect = containerRef.current.getBoundingClientRect();
      setOriginalTop(rect.top + window.scrollY);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFixed, originalTop, isMobile]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Sticky Trigger Component (when hidden)
  const StickyTrigger = () => (
    <div className="fixed top-16 right-6 sm:right-8 md:right-10 lg:right-14 z-[12]">
      <button
        onClick={() => setIsHidden(false)}
        className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-50 rounded-md shadow-md hover:shadow-lg transition-all hover:bg-gray-50"
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">{t("filters")}</span>
      </button>
    </div>
  );

  // Desktop/Tablet Filter Layout
  const DesktopFilters = () => (
    <>
      {/* Show sticky trigger when hidden and fixed */}
      {isFixed && isHidden && !isMobile && <StickyTrigger />}

      {/* Placeholder div to maintain layout when fixed */}
      {isFixed && !isMobile && !isHidden && (
        <div
          className="2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto pt-6 bg-transparent"
          style={{ height: containerRef.current?.offsetHeight || "auto" }}
        />
      )}

      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          z-[11] 2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto pt-8 bg-amber-50 hidden md:block
          ${
            isFixed && !isMobile && !isHidden
              ? "fixed top-16 left-0 right-0"
              : ""
          }
          ${isFixed && isHidden ? "hidden" : ""}
        `}
      >
        {isFixed && !isMobile && !isHidden && (
          <div>
            {/* Hide button - only shown when fixed */}
            <div className="flex justify-start mb-4 absolute right-6 top-1.5 lg:top-2.5 ">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsHidden(true)}
                    className="flex items-center gap-2 px-1 py-1.5 text-xs font-bold text-gray-600 bg-transparent border-none hover:text-primary transition-colors"
                  >
                    <X className="w-4 h-4" strokeWidth={3} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-white bg-primary">
                  <p>{t("minimizeFilters")}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Content wrapper when fixed */}
            <div className="w-full">
              {/* Always visible filters */}
              <div
                className={`grid gap-4 ${
                  isTablet ? "grid-cols-2" : "lg:grid-cols-4"
                }`}
              >
                {visibleFilters}
              </div>

              {/* Conditionally visible filters */}
              {showAll && hiddenFilters.length > 0 && (
                <div
                  className={`grid gap-4 mt-4 ${
                    isTablet ? "grid-cols-2" : "lg:grid-cols-4"
                  }`}
                >
                  {hiddenFilters}
                </div>
              )}

              {/* Toggle button */}
              {hiddenFilters.length > 0 && (
                <div className="flex justify-center mt-2 pb-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleToggleFilters}
                        className="flex items-center gap-2 px-0 py-0 text-sm font-medium text-gray-700 bg-transparent border-none rounded-md transition-colors hover:text-gray-900"
                      >
                        {showAll ? (
                          <>
                            <ChevronUp className="w-6 h-6" />
                            {/* <span>{t("showLess")}</span> */}
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-6 h-6" />
                            {/* <span>{t("moreFilters")}</span> */}
                          </>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="text-white bg-primary">
                      <p>{showAll ? t("showLess") : t("moreFilters")}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        )}

        {!isFixed && (
          <>
            {/* Always visible filters */}
            <div
              className={`grid gap-4 ${
                isTablet ? "grid-cols-2" : "lg:grid-cols-4"
              }`}
            >
              {visibleFilters}
            </div>

            {/* Conditionally visible filters */}
            {showAll && hiddenFilters.length > 0 && (
              <div
                className={`grid gap-4 mt-4 ${
                  isTablet ? "grid-cols-2" : "lg:grid-cols-4"
                }`}
              >
                {hiddenFilters}
              </div>
            )}

            {/* Toggle button */}
            {hiddenFilters.length > 0 && (
              <div className="flex justify-center mt-2">
                <button
                  onClick={handleToggleFilters}
                  className="flex items-center gap-2 px-0 py-0 text-sm font-medium text-gray-700 bg-transparent border-none rounded-md transition-colors hover:text-gray-900"
                >
                  {showAll ? (
                    <>
                      <ChevronUp className="w-6 h-6" />
                      {/* <span>{t("showLess")}</span> */}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-6 h-6" />
                      {/* <span>{t("moreFilters")}</span> */}
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );

  return (
    <>
      <DesktopFilters />
    </>
  );
};