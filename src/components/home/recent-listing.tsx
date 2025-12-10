import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getProperties } from "@/data/properties";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";

const RecentListing = async () => {
  const propertiresResponse = await getProperties({
    sort_by: "created_at",
    per_page: 5,
    sort_direction: "desc",
  });

  const locale = await getLocale();
  const t = await getTranslations("recentListing");

  const properties = propertiresResponse.data;

  return (
    <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-12 py-12 md:py-14 xl:py-20 pt-28 sm:!pt-28 lg:!pt-32 xl:!pt-36">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full relative"
      >
        <CarouselContent>
          {properties.map((property) => (
            <CarouselItem
              key={property.id}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <div className="">
                <Card className="p-0 bg-transparent border-none rounded-none">
                  <CardContent className="flex items-center justify-center w-full p-0">
                    <div className="w-full relative h-60 sm:h-54 xl:h-70 overflow-hidden">
                      <Link
                        href={{
                          pathname: "/properties/[slug]",
                          params: {
                            slug: property.seo.slugs[
                              locale as keyof typeof property.seo.slugs
                            ],
                          },
                        }}
                      >
                        <Image
                          src={property.assets.images.gallery[0].url}
                          alt={
                            property.assets.images.gallery[0].title ||
                            "Recent Listing"
                          }
                          fill
                          className="object-cover hover:scale-110 transition-all duration-300"
                        />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute -top-16 lg:-top-20 left-0 right-0 flex items-center justify-between gap-4 flex-wrap">
          <h2 className="flex-1 text-white text-2xl sm:text-3xl font-medium">
            {t("ourRecentListing")}
          </h2>
          <div className="flex gap-3">
            <CarouselPrevious className="static translate-y-0 rounded-none bg-primary/85 border-primary/85 hover:!bg-primary hover:border-primary" />
            <CarouselNext className="static translate-y-0 rounded-none bg-primary border-primary" />
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default RecentListing;
