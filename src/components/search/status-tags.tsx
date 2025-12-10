"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Star,
  // Video,
  // ShieldCheck,
  // ShoppingBag,
  // Clock,
  Check,
} from "lucide-react";

interface StatusTag {
  key: string;
  label: string;
  urlParam: string; // URL parameter name
  icon: React.ComponentType<{
    className?: string;
    color?: string;
    fill?: string;
  }>;
  fill?: boolean | undefined;
  fillColor?: string | undefined;
}

const StatusTags: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial values from URL params
  const getInitialCheckedItems = (): Record<string, boolean> => {
    const featuredParam = searchParams.get("featured");
    return {
      featured: featuredParam === "true",
    };
  };

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    getInitialCheckedItems
  );

  const properties: StatusTag[] = [
    {
      key: "featured",
      label: "Featured",
      urlParam: "featured",
      icon: Star,
      fill: true,
      fillColor: "#FFAB00",
    },
  ];

  // Update URL when status changes
  const updateURL = (propertyKey: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    const property = properties.find((p) => p.key === propertyKey);

    if (property) {
      if (checked) {
        params.set(property.urlParam, "true");
      } else {
        // Remove the parameter entirely when unchecked (false)
        params.delete(property.urlParam);
      }

      // Reset to first page when status changes
      params.delete("page");

      router.replace(`?${params.toString()}`, { scroll: false });
    }
  };

  const handleToggle = (propertyKey: string) => {
    const newChecked = !checkedItems[propertyKey];

    setCheckedItems((prev) => ({
      ...prev,
      [propertyKey]: newChecked,
    }));

    updateURL(propertyKey, newChecked);
  };

  // Sync with URL params when they change externally
  useEffect(() => {
    const featuredParam = searchParams.get("featured");
    setCheckedItems({
      featured: featuredParam === "true",
    });
  }, [searchParams]);

  return (
    <div className="w-full flex gap-3 flex-wrap">
      {properties.map((property) => {
        const isChecked = checkedItems[property.key];
        const IconComponent = property.icon;

        // Determine icon color based on state
        const iconColor = isChecked
          ? "white"
          : property.fill
          ? property.fillColor
          : "currentColor";

        // For icons that should be filled, use fill prop
        const iconFill =
          property.fill && !isChecked
            ? property.fillColor
            : isChecked
            ? "white"
            : "none";

        return (
          <div
            key={property.key}
            onClick={() => handleToggle(property.key)}
            className={`
              flex gap-2 items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out w-fit
              ${
                isChecked
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }
            `}
          >
            <div className="flex items-center gap-2 w-fit">
              <IconComponent
                className="w-4 h-4"
                color={iconColor}
                {...(property.fill && { fill: iconFill })}
              />
              <span
                className={`font-medium text-sm ${
                  isChecked ? "text-white" : "text-gray-800"
                }`}
              >
                {property.label}
              </span>
            </div>

            <Check
              className={`
                w-4 h-4 transition-opacity duration-200
                ${isChecked ? "opacity-100 text-white" : "opacity-0 text-black"}
              `}
            />
          </div>
        );
      })}
    </div>
  );
};

export default StatusTags;
