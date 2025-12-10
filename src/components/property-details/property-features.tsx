"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Wifi } from "lucide-react";
import { LuCircleParking } from "react-icons/lu";
import { BsCameraVideo } from "react-icons/bs";
import { MdOutlinePets } from "react-icons/md";
import { PiWashingMachineThin } from "react-icons/pi";
import { TbAirConditioningDisabled } from "react-icons/tb";
import { AdditionalFeature } from "@/types/property";
import { featuresIcons } from "@/data/icons";
import { useTranslations } from "next-intl";

interface Amenity {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface PropertyFeaturesProps {
  additionalFeatures: AdditionalFeature[];
}

export const PropertyFeatures = ({ additionalFeatures }: PropertyFeaturesProps) => {
  const t = useTranslations("propertyFeatures");

  const extractedAmenities: Amenity[] = [];

  additionalFeatures.forEach((category) => {
    category.features.forEach((feature) => {
      const featureName = feature.feature_name.toLowerCase();
      if (featureName.includes("wifi") || featureName.includes("internet")) {
        extractedAmenities.push({ name: t("wifi"), icon: Wifi });
      }
      if (featureName.includes("parking") || featureName.includes("garage")) {
        extractedAmenities.push({
          name: t("parkingSpace"),
          icon: LuCircleParking,
        });
      }
      if (featureName.includes("security") || featureName.includes("camera")) {
        extractedAmenities.push({
          name: t("securityCameras"),
          icon: BsCameraVideo,
        });
      }
      if (featureName.includes("pet")) {
        extractedAmenities.push({ name: t("petsAllowed"), icon: MdOutlinePets });
      }
      if (featureName.includes("laundry") || featureName.includes("washing")) {
        extractedAmenities.push({
          name: t("laundry"),
          icon: PiWashingMachineThin,
        });
      }
      if (featureName.includes("air") || featureName.includes("conditioning")) {
        extractedAmenities.push({
          name: t("airConditioner"),
          icon: TbAirConditioningDisabled,
        });
      }
    });
  });

  const getIcon = (icon: string) => {
    if (featuresIcons[icon]) {
      const Icon = featuresIcons[icon];
      return <Icon className="h-6 w-6 text-gray-600" />;
    } else {
      const Icon = featuresIcons.default;
      return <Icon className="h-6 w-6 text-gray-600" />;
    }
  };

  return (
    <div className="pt-5 w-full max-w-full">
      <section className="mb-8">
        <p className="text-base font-bold text-primary mb-4">
          {t("propertyFeaturesHeading")}
        </p>
        {additionalFeatures.length > 0 ? (
          <div className="w-full max-w-full">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {additionalFeatures.map((additionalFeature, index) => (
                <div className="p-3 w-full bg-gray-100 h-full" key={`additionalFeature--${index}`}>
                  <Card className="border-none rounded-none shadow-none bg-transparent w-full">
                    <CardContent className="p-0">
                      <div className="text-center flex flex-col gap-1.5 items-center">
                        {getIcon(additionalFeature.category_icon)}
                        <p className="font-semibold text-sm uppercase">
                          {additionalFeature.category_name}
                        </p>
                        {additionalFeature.features.map((feature, featureIndex) => (
                          <React.Fragment key={`feature--${index}--${featureIndex}`}>
                            {feature.field_type === "select" ? (
                              <p className="text-xs text-gray-600 capitalize">
                                {feature.feature_name} - {feature.field_value}
                              </p>
                            ) : (
                              <p className="text-xs text-gray-600 capitalize">{feature.feature_name}</p>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">{t("noAdditionalFeatures")}</p>
        )}
      </section>
    </div>
  );
};

export default PropertyFeatures;
