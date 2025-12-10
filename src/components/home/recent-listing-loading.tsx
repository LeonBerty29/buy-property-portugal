import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

export const RecentListingLoading = () => {
  return (
    <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-12 py-12 md:py-14 xl:py-20 pt-28 sm:!pt-28 lg:!pt-32 xl:!pt-36">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full relative"
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <div className="">
                <Card className="p-0 bg-transparent border-none rounded-none">
                  <CardContent className="flex items-center justify-center w-full p-0">
                    <div className="w-full relative h-60 sm:h-54 xl:h-70">
                      <Skeleton className="w-full h-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute -top-16 lg:-top-20 left-0 right-0 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <Skeleton className="h-8 sm:h-9 w-64" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="w-10 h-10" />
            <Skeleton className="w-10 h-10" />
          </div>
        </div>
      </Carousel>
    </div>
  );
};