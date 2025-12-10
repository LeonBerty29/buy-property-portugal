"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PropertyMetadata } from "@/types/property";
import { useTranslations } from "next-intl";

export function PropertyTypes({
  typologies,
  modal = true
}: {
  typologies: PropertyMetadata["typologies"];
  modal?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const t = useTranslations("propertyTypes")

  // Get initial selected types from URL (comma-separated values)
  const getInitialTypes = (): string[] => {
    const typologyParam = searchParams.get("typology");
    if (!typologyParam) return [];
    return typologyParam.split(",").filter(Boolean);
  };

  const [selectedItems, setSelectedItems] = useState<string[]>(getInitialTypes);

  // Update URL when selection changes
  const updateURL = (newSelection: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newSelection.length > 0) {
      params.set("typology", newSelection.join(","));
    } else {
      params.delete("typology");
    }

    // Reset to first page when type changes
    params.delete("page");

    router.replace(`?${params.toString()}`);
  };

  const handleSelect = (typologyId: string) => {
    let newSelection: string[];

    if (selectedItems.includes(typologyId)) {
      // Remove from selection
      newSelection = selectedItems.filter((id) => id !== typologyId);
    } else {
      // Add to selection
      newSelection = [...selectedItems, typologyId];
    }

    setSelectedItems(newSelection);
    updateURL(newSelection);
  };

  // Sync with URL params when they change externally
  useEffect(() => {
    const typologyParam = searchParams.get("typology");
    const currentTypes = typologyParam
      ? typologyParam.split(",").filter(Boolean)
      : [];
    setSelectedItems(currentTypes);
  }, [searchParams]);

  return (
    <div className="space-y-4">
      <DropdownMenu modal={modal} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full min-h-[40px] justify-between text-left font-normal overflow-hidden text-muted-foreground text-sm md:text-base"
          >
            {selectedItems.length === 0 ? (
              "Select property types..."
            ) : (
              <span className="text-gray-900">
                {`${selectedItems.length} property type${
                  selectedItems.length === 1 ? "" : "s"
                } selected`}
              </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-80 p-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search property types..." />
            <CommandList>
              <CommandEmpty>{t("noProperties")}</CommandEmpty>
              <CommandGroup>
                {typologies.map((typology) => (
                  <CommandItem
                    key={typology.id}
                    value={typology.name}
                    onSelect={() => handleSelect(typology.id.toString())}
                    className="text-base"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedItems.includes(typology.id.toString())
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {typology.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
