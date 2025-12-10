import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "../ui/button";
import { getListOfProperties } from "@/data/property";
import { ProductCard } from "../product/product-card";
import { Link } from "@/i18n/navigation";
import { getNote } from "@/data/notes";
import { auth } from "@/auth";
import { getFavorites } from "@/data/favourites";
import { getTranslations } from "next-intl/server";

const SimilarProperties = async ({
  similarPropertiesId,
}: {
  similarPropertiesId: number[];
}) => {
  const t = await getTranslations("similarProperties");
  const session = await auth();
  const token = session?.accessToken;

  // Fetch all data concurrently using Promise.all
  const [propertiesResponse, favoritesResponse, notesResponse] =
    await Promise.all([
      await getListOfProperties(similarPropertiesId),
      token ? getFavorites(token) : Promise.resolve({ favorite_properties: [] }),
      token ? getNote() : Promise.resolve({ data: [] }),
    ]);

  const properties = propertiesResponse.data;
  const favorites = favoritesResponse.favorite_properties;
  const notes = notesResponse.data;

  return (
    <>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full flex gap-x-20 gap-y-8 flex-col relative"
      >
        <div className="flex flex-col sm:flex-row gap-5 justify-between sm:items-end w-full px-4 md:px-10">
          <h3 className="text-3xl font-medium">
            {t("similar")} <span className="text-primary">{t("properties")}</span> {t("of")}{" "}
            <span className="text-primary">{t("interest")}</span>
          </h3>

          <Button
            asChild
            className="bg-black text-white hover:opacity-85 text-xs order-3 hidden sm:flex"
          >
            <Link href="/properties">{t("viewAllProperties")}</Link>
          </Button>
        </div>

        <div className="relative px-2 sm:px-10 py-10 sm:py-0">
          <div className="flex justify-between gap-3 items-center z-10 absolute -top-0 sm:top-4 left-0 right-0">
            <CarouselPrevious
              hideOnDisable={true}
              className="!static rounded-none !top-0 left-0! translate-x-0 translate-y-0 bg-primary text-white border-primary"
            />
            <CarouselNext
              hideOnDisable={true}
              className="ml-auto !static rounded-none !top-0 left-0! translate-x-0 translate-y-0 bg-primary text-white border-primary"
            />
          </div>
          <CarouselContent className="-ml-1 flex-1 w-full">
            {properties.map((property, index) => (
              <CarouselItem key={index} className="pl-1 md:basis-1/2 h-full">
                <div className="p-1 py-0 max-w-[400px] mx-auto sm:max-w-full block h-full">
                  <ProductCard
                    property={property}
                    notes={notes || []}
                    favorites={favorites || []}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="w-full flex justify-center sm:hidden pt-2">
            <Button asChild className="bg-black text-white hover:opacity-85 text-xs order-3">
              <Link href="/properties">{t("viewAllProperties")}</Link>
            </Button>
          </div>
        </div>
      </Carousel>
    </>
  );
};

export default SimilarProperties;
