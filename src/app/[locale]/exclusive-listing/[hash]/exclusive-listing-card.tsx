import { PiCarLight } from "react-icons/pi";
import { MdOutlineShower } from "react-icons/md";
import { IoMdPricetag } from "react-icons/io";
import { MdOutlineLocalHotel } from "react-icons/md";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Property } from "@/types/property";
import { Link } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
// import { NoteObject } from "@/types";
// import { AddToFavoriteButton } from "@/components/search/submit-buttons";
// import { AddPropertyNote } from "@/components/product/add-property-notes";
import { PriceFormat } from "@/components/shared/price-format";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ExclusiveCardProductImageCarousel } from "./exclusive-listing-card-image-carousel";

interface Props {
  property: Property;
  //   favorites: number[];
  //   notes: NoteObject[];
  hash: string;
}

export const ExclusiveListingCard = async ({
  property,
  hash
}: //   favorites = [],
//   notes,

Props) => {
  const t = await getTranslations("productCard");

  // Extract image URLs from assets.images.gallery
  const imagePaths =
    property.assets?.images?.gallery?.map((img) => img.url) || [];

  // Compose location string
  const location = `${property.location.district}, ${property.location.municipality}, ${property.location.zone}`;

  // Hardcoded placeholders for missing fields (adjust as needed)
  //   const favorite = favorites.includes(property.id);
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

  const locale = await getLocale();

  return (
    <Card className="flex flex-col gap-0 rounded-none p-0 h-full">
      <CardHeader className="p-0 relative w-full flex flex-col">
        <ExclusiveCardProductImageCarousel imagePaths={imagePaths} property={property} hash={hash} />
        <div className="z-10 absolute top-2 left-2 right-2 flex items-center justify-between gap-3">
          <>
            <div className="flex items-center gap-[6px]">
              <div className="min-w-fit rounded-none bg-gray-200 text-black text-sm px-2 py-2 h-fit flex gap-2 items-center justify-center">
                <IoMdPricetag fill="none" strokeWidth={20} />
                {reference}
              </div>
            </div>
            {/* <div className="flex gap-2 items-center">
              <AddToFavoriteButton
                propertyId={property.id}
                reference={property.reference}
                isFavourite={favorite}
              />

              <AddPropertyNote
                propertyId={property.id}
                reference={property.reference}
                notes={notes || []}
              />
            </div> */}
          </>
        </div>

        {exclusive && (
          <div className="bg-primary h-6 text-center text-xs font-bold text-white absolute bottom-0 w-full flex items-center justify-center z-10">
            {t("exclusiveListingByEav")}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <Link
          href={{
            pathname: "/exclusive-listing/[hash]/[slug]",
            params: {
              hash: hash,
              slug: property.seo.slugs[
                locale as keyof typeof property.seo.slugs
              ],
            },
          }}
          className="flex flex-col gap-3 h-full justify-between"
        >
          <div>
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

            <h3 className="text-gray-500  text-sm md:text-base lg:text-lg line-clamp-2 mt-3">
              {property.title}
            </h3>
          </div>

          <div>
            <Separator className="mb-3" />

            <div className="flex flex-wrap justify-between gap-2">
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
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};
