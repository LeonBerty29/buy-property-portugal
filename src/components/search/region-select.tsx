"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { CommandItem } from "@/components/ui/command-two";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PropertyMetadata,
  LocationArea,
  Municipality,
  Zone,
} from "@/types/property";
import { useTranslations } from "next-intl";

interface LocationOption {
  id: number;
  name: string;
  type: "area" | "zone";
  displayName: string;
  areaId?: number; // For zones to track their area
}

interface RegionSelectProps {
  metadata: PropertyMetadata;
  modal?: boolean;
}

export default function RegionSelect({
  metadata,
  modal = true,
}: RegionSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const t = useTranslations("regionSelect");

  // Build flattened location options from metadata (areas and zones only)
  const buildLocationOptions = (): LocationOption[] => {
    const options: LocationOption[] = [];

    metadata.areas?.forEach((area: LocationArea) => {
      // Add area
      options.push({
        id: area.id,
        name: area.name,
        type: "area",
        displayName: `${area.name} (${area.property_count})`,
      });

      // Add zones from all municipalities
      area.municipalities?.forEach((municipality: Municipality) => {
        municipality.zones?.forEach((zone: Zone) => {
          options.push({
            id: zone.id,
            name: zone.name,
            type: "zone",
            displayName: `  ${zone.name} (${zone.property_count})`,
            areaId: area.id,
          });
        });
      });
    });

    return options;
  };

  const locationOptions = buildLocationOptions();

  // Get initial selected locations from URL
  const getInitialSelections = (): {
    areas: number[];
    zones: number[];
  } => {
    const areas =
      searchParams
        .get("location_area")
        ?.split(",")
        .map(Number)
        .filter(Boolean) || [];
    const zones =
      searchParams.get("zone")?.split(",").map(Number).filter(Boolean) || [];

    return { areas, zones };
  };

  const [selectedLocations, setSelectedLocations] =
    useState(getInitialSelections);

  // Get all zones for an area
  const getAreaZones = (areaId: number): LocationOption[] => {
    return locationOptions.filter(
      (option) => option.type === "zone" && option.areaId === areaId
    );
  };

  // Check if all zones in an area are selected
  const areAllZonesSelected = (areaId: number): boolean => {
    const zones = getAreaZones(areaId);
    return (
      zones.length > 0 &&
      zones.every((zone) => selectedLocations.zones.includes(zone.id))
    );
  };

  // Check if a location should appear selected
  const isLocationEffectivelySelected = (option: LocationOption): boolean => {
    switch (option.type) {
      case "area":
        return (
          selectedLocations.areas.includes(option.id) ||
          areAllZonesSelected(option.id)
        );
      case "zone":
        return (
          selectedLocations.zones.includes(option.id) ||
          (option.areaId !== undefined &&
            selectedLocations.areas.includes(option.areaId))
        );
      default:
        return false;
    }
  };

  // Optimize selections by consolidating zones into areas when all are selected
  const optimizeSelections = (selections: {
    areas: number[];
    zones: number[];
  }): { areas: number[]; zones: number[] } => {
    const optimized = { ...selections };

    // Check each area - if all zones are selected, consolidate to area
    metadata.areas?.forEach((area) => {
      const zones = getAreaZones(area.id);
      if (
        zones.length > 0 &&
        zones.every((zone) => optimized.zones.includes(zone.id)) &&
        !optimized.areas.includes(area.id)
      ) {
        // All zones selected, consolidate to area
        optimized.areas = [...optimized.areas, area.id];
        optimized.zones = optimized.zones.filter(
          (id) => !zones.some((zone) => zone.id === id)
        );
      }
    });

    return optimized;
  };

  // Update URL with optimized selections
  const updateURL = (newSelections: { areas: number[]; zones: number[] }) => {
    const optimizedSelections = optimizeSelections(newSelections);
    const params = new URLSearchParams(searchParams.toString());

    // Update location_area parameter
    if (optimizedSelections.areas.length > 0) {
      params.set("location_area", optimizedSelections.areas.join(","));
    } else {
      params.delete("location_area");
    }

    // Update zone parameter
    if (optimizedSelections.zones.length > 0) {
      params.set("zone", optimizedSelections.zones.join(","));
    } else {
      params.delete("zone");
    }

    // Remove municipality parameter as we're no longer using it
    params.delete("municipality");

    // Reset to first page when location changes
    params.delete("page");

    router.replace(`?${params.toString()}`);
  };

  // Handle location selection/deselection
  const handleLocationSelect = (option: LocationOption): void => {
    const newSelections = { ...selectedLocations };
    const isCurrentlySelected = isLocationEffectivelySelected(option);

    if (isCurrentlySelected) {
      // Deselecting
      switch (option.type) {
        case "area":
          // Remove area
          newSelections.areas = newSelections.areas.filter(
            (id) => id !== option.id
          );
          // Remove all zones from this area
          const zones = getAreaZones(option.id);
          newSelections.zones = newSelections.zones.filter(
            (id) => !zones.some((zone) => zone.id === id)
          );
          break;

        case "zone":
          const parentArea = option.areaId;

          if (
            parentArea !== undefined &&
            selectedLocations.areas.includes(parentArea)
          ) {
            // Parent area is selected, need to break it down
            newSelections.areas = newSelections.areas.filter(
              (id) => id !== parentArea
            );

            // Add all zones from this area except the one being deselected
            const areaZones = getAreaZones(parentArea);
            areaZones.forEach((zone) => {
              if (zone.id !== option.id) {
                newSelections.zones.push(zone.id);
              }
            });
          } else {
            // Just remove the zone
            newSelections.zones = newSelections.zones.filter(
              (id) => id !== option.id
            );
          }
          break;
      }
    } else {
      // Selecting
      switch (option.type) {
        case "area":
          newSelections.areas = [...newSelections.areas, option.id];
          // Remove any individual zones from this area
          const zones = getAreaZones(option.id);
          zones.forEach((zone) => {
            newSelections.zones = newSelections.zones.filter(
              (id) => id !== zone.id
            );
          });
          break;
        case "zone":
          newSelections.zones = [...newSelections.zones, option.id];
          break;
      }
    }

    setSelectedLocations(newSelections);
    updateURL(newSelections);
  };

  // Get selected items for display
  const getSelectedItems = (): LocationOption[] => {
    const selected: LocationOption[] = [];

    selectedLocations.areas.forEach((areaId) => {
      const area = locationOptions.find(
        (option) => option.type === "area" && option.id === areaId
      );
      if (area) selected.push(area);
    });

    selectedLocations.zones.forEach((zoneId) => {
      const zone = locationOptions.find(
        (option) => option.type === "zone" && option.id === zoneId
      );
      if (zone) selected.push(zone);
    });

    return selected;
  };

  // Sync with URL params when they change externally
  useEffect(() => {
    setSelectedLocations(getInitialSelections());
  }, [searchParams]);

  const selectedItems = getSelectedItems();

  return (
    <div className="w-full">
      <DropdownMenu modal={modal} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between min-h-[40px] h-auto"
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedItems.length === 0 ? (
                <span className="text-muted-foreground text-sm md:text-base font-normal">
                  {t("selectLocations")}
                </span>
              ) : (
                <span className="text-sm md:text-base font-normal">
                  {t("selectedLocations")}
                </span>
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-80 p-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search locations..." />
            <CommandList>
              <CommandEmpty>{t("noLocations")}</CommandEmpty>
              <CommandGroup>
                {locationOptions.map((option) => {
                  const optionKey = `${option.type}-${option.id}`;
                  const isSelected = isLocationEffectivelySelected(option);

                  return (
                    <CommandItem
                      key={optionKey}
                      value={optionKey}
                      onSelect={() => {
                        handleLocationSelect(option);
                      }}
                      className={cn(
                        "flex items-center justify-between cursor-pointer",
                        isSelected && "font-medium"
                      )}
                    >
                      <span className="whitespace-pre">
                        {option.displayName}
                      </span>
                      {isSelected && (
                        <Check className="ml-2 h-4 w-4 text-primary" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
