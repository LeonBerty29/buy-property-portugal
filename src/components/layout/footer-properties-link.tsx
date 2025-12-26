"use client";

import { PropertyMetadata } from "@/types/property";
import React, { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Link } from "@/i18n/navigation";
// import { useTranslations } from "next-intl";

type Zone =
  PropertyMetadata["areas"][number]["municipalities"][number]["zones"][number];

export const FooterPropertiesLink = () => {
  // const t = useTranslations("footerPropertyLinks");

  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch("/api/search/regions");

        if (!response.ok) {
          throw new Error("Failed to fetch regions");
        }

        const data = await response.json();

        // Check if there's an error in the response
        if (data.error) {
          throw new Error(data.details || data.error);
        }

        // Flatten all zones from regions
        const allZones = data.flatMap(
          (region: PropertyMetadata["areas"][number]) =>
            region.municipalities.flatMap((municipality) => municipality.zones)
        );

        setZones(allZones);
      } catch (err) {
        console.error("Error fetching regions:", err);
        setZones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-6 sm:px-8 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="w-full aspect-3/4" />
          <Skeleton className="w-full aspect-3/4" />
          <Skeleton className="w-full aspect-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 sm:px-8 md:px-8">
      <h2 className="font-semibold text-xl md:text-2xl lg:text-3xl text-primary mb-8">
        Top Locations in Portugal
      </h2>
      <div className="">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zones.map((zone) => (
            <li key={`zone-${zone.id}`} className="text-gray-600">
              <Link
                href={{
                  pathname: "/properties",
                  query: { zone: zone.id },
                }}
                className="hover:underline hover:text-primary block py-6 px-4 hover:bg-gray-100 border-b border-b-gray-200"
              >
                Properties in {zone.name} ({zone.property_count})
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
