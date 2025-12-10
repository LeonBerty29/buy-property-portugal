"use client";

import React from "react";
import { FaBed } from "react-icons/fa";
import { MdAreaChart, MdBathtub, MdOutlineTimeline } from "react-icons/md";
import { LiaExpandArrowsAltSolid } from "react-icons/lia";
import { Home } from "lucide-react";
import { Property } from "@/types/property";
import { BiArea } from "react-icons/bi";
import { GiElectric } from "react-icons/gi";
import { useTranslations } from "next-intl";

const PropertyDetailsIcons = ({
  features,
  propertyType,
}: {
  features: Property["features"];
  propertyType: string;
}) => {
  const t = useTranslations("propertyDetailsIcons");

  return (
    <div className="items-center flex flex-wrap sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mt-5 mb-14">
      {(features.bedrooms || features.bedrooms === 0) && (
        <div className="flex gap-3 items-center mr-auto sm:mr-0">
          <div className="flex items-center gap-3 justify-center border border-gray-500 bg-gray-200 p-3">
            <FaBed className="h-6 w-6 text-gray-500" />
          </div>
          <div className="space-y-2">
            <span className="font-semibold text-lg">{features.bedrooms}</span>
            <p className="text-xs text-gray-700">{t("bedrooms")}</p>
          </div>
        </div>
      )}

      {(features.bathrooms || features.bathrooms === 0) && (
        <div className="flex gap-3 items-center mr-auto sm:mr-0">
          <div className="flex items-center gap-3 justify-center border border-gray-500 bg-gray-200 p-3">
            <MdBathtub className="h-6 w-6 text-gray-500" />
          </div>
          <div className="space-y-2">
            <span className="font-semibold text-lg">{features.bathrooms}</span>
            <p className="text-xs text-gray-700">{t("bathrooms")}</p>
          </div>
        </div>
      )}

      {(features.construction_year || features.construction_year === "0") && (
        <div className="flex gap-3 items-center mr-auto sm:mr-0">
          <div className="flex items-center gap-3 justify-center border border-gray-500 bg-gray-200 p-3">
            <MdOutlineTimeline className="h-6 w-6 text-gray-500" />
          </div>
          <div className="space-y-2">
            <span className="font-semibold text-lg">{features.construction_year}</span>
            <p className="text-xs text-gray-700">{t("builtYear")}</p>
          </div>
        </div>
      )}

      {(features.private_area || features.private_area === 0) && (
        <div className="flex gap-3 items-center mr-auto sm:mr-0">
          <div className="flex items-center gap-3 justify-center border border-gray-500 bg-gray-200 p-3">
            <BiArea className="h-6 w-6 text-gray-500" />
          </div>
          <div className="space-y-2">
            <span className="font-semibold text-lg">
              {features.private_area}m<sup>2</sup>
            </span>
            <p className="text-xs text-gray-700">{t("privateArea")}</p>
          </div>
        </div>
      )}

      {(features.plot_size || features.plot_size === 0) && (
        <div className="flex gap-3 items-center mr-auto sm:mr-0">
          <div className="flex items-center gap-3 justify-center border border-gray-500 bg-gray-200 p-3">
            <LiaExpandArrowsAltSolid className="h-6 w-6 text-gray-500" />
          </div>
          <div className="space-y-2">
            <span className="font-semibold text-lg">
              {features.plot_size}m<sup>2</sup>
            </span>
            <p className="text-xs text-gray-700">{t("plotSize")}</p>
          </div>
        </div>
      )}

      {(features.construction_area || features.construction_area === 0) && (
        <div className="flex gap-3 items-center mr-auto sm:mr-0">
          <div className="flex items-center gap-3 justify-center border border-gray-500 bg-gray-200 p-3">
            <MdAreaChart className="h-6 w-6 text-gray-500" />
          </div>
          <div className="space-y-2">
            <span className="font-semibold text-lg">
              {features.construction_area}m<sup>2</sup>
            </span>
            <p className="text-xs text-gray-700">{t("constructionArea")}</p>
          </div>
        </div>
      )}

      {features.energy_class && (
        <div className="flex gap-3 items-center mr-auto sm:mr-0">
          <div className="flex items-center gap-3 justify-center border border-gray-500 bg-gray-200 p-3">
            <GiElectric className="h-6 w-6 text-gray-500" />
          </div>
          <div className="space-y-2">
            <span className="font-semibold text-lg">{features.energy_class}</span>
            <p className="text-xs text-gray-700">{t("energyClass")}</p>
          </div>
        </div>
      )}

      {propertyType && (
        <div className="flex gap-3 items-center mr-auto sm:mr-0">
          <div className="flex items-center gap-3 justify-center border border-gray-500 bg-gray-200 p-3">
            <Home className="h-6 w-6 text-gray-500" />
          </div>
          <div className="space-y-2">
            <span className="font-semibold text-lg">{propertyType}</span>
            <p className="text-xs text-gray-700">{t("propertyType")}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailsIcons;
