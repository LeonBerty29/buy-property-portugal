"use client";

import { PropertyMetadata } from "@/types/property";
import React, { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export const FooterPropertiesLink = () => {
  const t = useTranslations("footerPropertyLinks");

  const [regions, setRegions] = useState<PropertyMetadata["areas"]>([]);
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

        setRegions(data);
      } catch (err) {
        console.error("Error fetching regions:", err);
        setRegions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  if (loading) {
    return (
      <div className="2xl:container mx-auto px-6 sm:px-8 md:px-10 lg:px-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="w-full aspect-3/4" />
          <Skeleton className="w-full aspect-3/4" />
          <Skeleton className="w-full aspect-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="2xl:container mx-auto px-6 sm:px-8 md:px-10 lg:px-14">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regions.map((region, index) => (
          <div
            key={index}
            className="p-6 hover:border hover:border-primary hover:scale-105 transition-transform"
          >
            <h3 className="font-semibold text-xl text-primary mb-8">
              {region.name}
            </h3>
            <ul className="space-y-4">
              {region.municipalities.map((municipality, index) => (
                <li key={`Municipality--${index}`}>
                  <ul className="space-y-4">
                    {municipality.zones.map((zone, index) => (
                      <li
                        key={`Municipality--zones--${index}`}
                        className="text-gray-600"
                      >
                        <Link
                          href={{
                            pathname: "/properties",
                            query: { zone: zone.id },
                          }}
                          className="hover:underline"
                        >
                          {t("realEstateInText")} {zone.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
