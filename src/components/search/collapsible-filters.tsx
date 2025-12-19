"use client";

import { useState, useEffect, useRef } from "react";
import React from "react";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { FilterComponents } from "./filter-compoonent";

// interface CollapsibleFiltersProps {
//   children?: React.ReactNode;
// }


export const CollapsibleFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  

  const [isFixed, setIsFixed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
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
      query: queryObject,
    });
  };

  const handleSearch = () => {
    updateURLParams({ search: searchQuery });
  };

  

  useEffect(() => {
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
  }, [originalTop]);

  // Filter components for reuse
  

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
          {/* Mobile Filter Button (< lg) */}
          <div className="lg:hidden flex justify-center">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-none border-0 shadow-none"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter Properties
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[83%] sm:w-[83%] max-w-[83%] sm:max-w-[83%] overflow-y-auto"
              >
                <SheetHeader>
                  <SheetTitle>Filter Properties</SheetTitle>
                  <SheetDescription>
                    Refine your search with the filters below
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 px-4 space-y-6 scroll-y-auto">
                  {/* Search Box */}
                  <div className="space-y-2">
                    <Label className="hidden">Search</Label>
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
                  <FilterComponents />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Filters Grid (>= lg) */}
          <div className="hidden lg:grid lg:grid-cols-7 gap-4">
            {/* Search Box */}
            <div className="col-span-2 space-y-2">
              <Label className="lg:hidden">Search</Label>
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
            <FilterComponents />
          </div>

          {/* {children && <div className="hidden lg:block mt-4">{children}</div>} */}
        </div>
      </div>
    </>
  );
};
