import { LiaEdit } from "react-icons/lia";
import Image from "next/image";
import { Button } from "../ui/button";
import PropertyImagesModal from "./property-images-modal";
import { Property } from "@/types/property";
import { RequestInformationDialog } from "./request-information";
import { PropertyVideosModal } from "./property-videos-modal";
import { getTranslations } from "next-intl/server";

interface PropertyImageGridProps {
  assets: Property["assets"];
  salesConsultant: Property["sales_consultant"];
  propertyReference: string;
}

export const PropertyImageGrid: React.FC<PropertyImageGridProps> = async ({
  assets,
  salesConsultant,
  propertyReference,
}) => {
  const t = await getTranslations("propertyImageGrid");

  const propertyImages = assets.images.gallery;
  const hasVideos = assets.videos && assets.videos.length > 0;
  const totalImages = propertyImages.length;

  return (
    <>
      <div className="gap-x-6 flex mb-8">
        <div className="w-full lg:flex-1">
          <div className="w-full h-[450px] xl:h-[550px] relative">
            {propertyImages[0] && (
              <Image
                src={propertyImages[0]?.url}
                alt={propertyImages[0]?.title || t("propertyImage")}
                fill
                className="object-cover"
              />
            )}
            <div className="absolute z-10 bottom-4 right-4 flex gap-3">
              <RequestInformationDialog salesConsultant={salesConsultant}>
                <Button
                  type="button"
                  className="text-sm font-semibold w-full rounded-none bg-white text-black !px-6 hover:text-white hover:bg-black transition-all"
                >
                  <LiaEdit className="h-3 w-3" />
                  {t("requestInformation")}
                </Button>
              </RequestInformationDialog>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex lg:w-[37%] xl:w-[30%] space-y-6 flex-col">
          <div className="relative w-full flex-1">
            {propertyImages[1] && (
              <Image
                src={propertyImages[1]?.url}
                alt={propertyImages[1].title || t("propertyImage")}
                fill
                className="object-cover"
              />
            )}
            {hasVideos && (
              <div className="absolute inset-0 flex items-center justify-center">
                <PropertyVideosModal videos={assets.videos || []} />
              </div>
            )}
          </div>

          <div className="relative w-full flex-1">
            {propertyImages[2] && (
              <Image
                src={propertyImages[2].url}
                alt={propertyImages[2].title || t("propertyImage")}
                fill
                className="object-cover"
              />
            )}
            {totalImages > 3 && (
              <PropertyImagesModal
                images={propertyImages}
                propertyReference={propertyReference}
                // floorPlans={assets.images.floor_plans}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex gap-6 lg:hidden min-h-[500px] sm:min-h-[unset] flex-wrap">
        <div className="relative w-full flex-1 min-w-full sm:min-w-[300px] sm:h-[400px]">
          {propertyImages[1] && (
            <Image
              src={propertyImages[1]?.url}
              alt={propertyImages[1].title || t("propertyImage")}
              fill
              className="object-cover"
            />
          )}
          {hasVideos && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <PropertyVideosModal videos={assets.videos || []} />
            </div>
          )}
        </div>

        <div className="relative w-full flex-1 min-w-full sm:min-w-[300px] sm:h-[400px]">
          {propertyImages[2] && (
            <Image
              src={propertyImages[2]?.url}
              alt={propertyImages[2].title || t("propertyImage")}
              fill
              className="object-cover"
            />
          )}
          {totalImages > 3 && (
            <PropertyImagesModal
              images={propertyImages}
              propertyReference={propertyReference}
              // floorPlans={assets.images.floor_plans}
            />
          )}
        </div>
      </div>
    </>
  );
};
