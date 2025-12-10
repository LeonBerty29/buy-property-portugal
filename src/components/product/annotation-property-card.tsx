import { PiCarLight } from "react-icons/pi";
import { MdOutlineShower } from "react-icons/md";
import { IoMdPricetag } from "react-icons/io";
import { MdOutlineLocalHotel } from "react-icons/md";
import { Card, CardContent, CardHeader } from "../ui/card";
import { ProductImageCarousel } from "./product-image-carousel";
import { AddToFavoriteButton } from "../search/submit-buttons";
import { Separator } from "../ui/separator";
import { PriceFormat } from "../shared/price-format";
import { Property } from "@/types/property";
import { Link } from "@/i18n/navigation";
import { NoteObject } from "@/types";
import { AddPropertyNote } from "./add-property-notes";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

interface Props {
  property: Property;
  favorites: number[];
  notes: NoteObject[];
}

export const AnnotationPropertyCard = async ({
  property,
  favorites,
  notes,
}: Props) => {
  const t = await getTranslations("annotationPropertyCard");
  const locale = await getLocale();

  // Extract image URLs from assets.images.gallery
  const imagePaths =
    property.assets?.images?.gallery?.map((img) => img.url) || [];

  // Compose location string
  const location = `${property.location.district}, ${property.location.municipality}, ${property.location.zone}`;

  // Hardcoded placeholders for missing fields (adjust as needed)
  const favorite = favorites.includes(property.id);
  const reference = property.reference;
  const exclusive = property.agency.name === "EAV";
  const grossArea = property.features.private_area;
  const plotSize = property.features.plot_size;
  const amenities = {
    bedrooms: property.features.bedrooms,
    bathrooms: property.features.bathrooms,
    garage: property.features.garage || 0,
  };
  // Use property.currency for price formatting
  const currency = property.currency || "EUR";

  // Show price only if show_price is true, else display "Contact for price"
  const showPrice = property.show_price;

  return (
    <Card className="flex lg:!flex-row gap-0 rounded-none p-0">
      <CardHeader className="w-full lg:w-[50%] xl:w-[44%]  p-0 relative flex flex-col">
        <ProductImageCarousel imagePaths={imagePaths} property={property} />
        <div className="z-10 absolute top-2 left-2 right-2 flex items-center justify-between gap-3">
          <>
            <div className="flex items-center gap-[6px]">
              <div className="min-w-fit rounded-none bg-gray-200 text-black text-sm px-2 py-2 h-fit flex gap-2 items-center justify-center">
                <IoMdPricetag fill="none" strokeWidth={20} />
                {reference}
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <AddToFavoriteButton
                propertyId={property.id}
                reference={property.reference}
                isFavourite={favorite}
              />
            </div>
          </>
        </div>

        {exclusive && (
          <div className="bg-primary h-6 text-center text-xs font-bold text-white absolute bottom-0 w-full flex items-center justify-center z-10">
            {t("exclusiveListingByEav")}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-3 lg:flex-1 lg:p-6 lg:space-y-3 lg:flex lg:flex-col lg:justify-center">
        <div className="pb-5 flex justify-end">
          <AddPropertyNote
            propertyId={property.id}
            reference={property.reference}
            notes={notes || []}
          >
            <Button
              className="bg-black/85 text-white hover:bg-black transition colors shadow-2xl"
              type="button"
            >
              {t("annotationNote")}
              <Pencil className="size-4 text-primary shadow-2xl" />
            </Button>
          </AddPropertyNote>
        </div>
        <Link
          href={{
            pathname: "/properties/[slug]",
            params: {
              slug: property.seo.slugs[
                locale as keyof typeof property.seo.slugs
              ],
            },
          }}
          className="block space-y-3"
        >
          <div className="flex justify-between align-center flex-wrap gap-y-2 gap-x-5">
            {showPrice ? (
              <PriceFormat
                amount={property.price}
                currency={currency}
                amountStyle="text-primary"
                formatAmount={false}
                className="gap-1 text-primary text-xl"
              />
            ) : (
              <span className="text-xl font-semibold flex items-center gap-1 text-primary">
                {t("contactForPrice")}
              </span>
            )}
          </div>

          <div
            dangerouslySetInnerHTML={{ __html: property.description }}
            className="text-neutral prose lg:prose-base line-clamp-2"
          />

          <Separator className="mt-2" />

          <div className="flex flex-wrap lg:flex-nowrap justify-between gap-4">
            <div className="max-w-[47%]">
              <div>
                <p className="text-sm font-light text-gray-400 mb-3">
                  {t("location")}
                </p>
                <p className="text-sm font-semibold text-black line-clamp-1">
                  {location}
                </p>
              </div>
            </div>

            <div className="max-w-[52%] min-w-fit flex gap-2">
              <div className="flex-1 max-w-fit">
                <p className="text-sm font-light text-gray-400 mb-3">
                  {t("grossArea")}
                </p>
                <p className="text-sm text-black font-semibold">
                  {grossArea} m<sup>2</sup>
                </p>
              </div>
              <div className="flex-1 max-w-fit">
                <p className="text-sm font-light text-gray-400 mb-3">
                  {t("plotSize")}
                </p>
                <p className="text-sm font-semibold text-black">
                  {plotSize} m<sup>2</sup>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-nowrap justify-between pt-1 gap-2">
            <div className="w-[47%]">
              <div className="flex items-center gap-4 h-[40px]">
                <div className="flex items-center text-sm gap-2">
                  <MdOutlineLocalHotel className="h-6 w-6 text-gray-500" />
                  <span className="font-semibold">{amenities.bedrooms}</span>
                </div>
                <div className="flex items-center text-sm gap-2">
                  <MdOutlineShower className="h-6 w-6 text-gray-500" />
                  <span className="font-semibold">{amenities.bathrooms}</span>
                </div>
                <div className="flex items-center text-sm gap-2">
                  <PiCarLight
                    className="h-6 w-6 fill-none text-gray-800"
                    strokeWidth={6}
                  />
                  <span className="font-semibold">{amenities.garage}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};
