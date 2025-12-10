import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";

const SimilarPropertiesSkeleton = () => {
  // Create an array of 6 skeleton items to simulate loading properties
  const skeletonItems = Array.from({ length: 6 }, (_, index) => index);

  return (
    <>
      <div className="2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto min-h-full py-14">
        <Carousel className="w-full flex gap-x-20 gap-y-8 flex-col lg:flex-row relative lg:pl-[220px]">
          <div className="flex gap-5 justify-between flex-col max-w-[180px] h-full lg:absolute lg:top-0 lg:left-0 lg:bottom-0">
            <div className="flex gap-3 items-center order-4 lg:order-1">
              <CarouselPrevious className="!static rounded-none !top-0 left-0! translate-x-0 translate-y-0 bg-primary text-white border-primary opacity-50" />
              <CarouselNext className="!static rounded-none !top-0 left-0! translate-x-0 translate-y-0 bg-primary text-white border-primary opacity-50" />
            </div>

            {/* Replace heading text with skeleton */}
            <div className="order-2 space-y-2">
              <div className="h-8 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>

            {/* Replace button text with skeleton */}
            <div className="order-3 w-full">
              <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
          </div>

          <CarouselContent className="-ml-1">
            {skeletonItems.map((index) => (
              <CarouselItem
                key={index}
                className="pl-1 sm:basis-1/2 xl:basis-1/3"
              >
                <div className="p-1 py-0 max-w-[400px] mx-auto sm:max-w-full">
                  <SkeletonProductCard />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </>
  );
};

const SkeletonProductCard = () => {
  return (
    <Card className="flex flex-col gap-0 rounded-none p-0 animate-pulse">
      <CardHeader className="p-0 relative w-full flex flex-col">
        {/* Image skeleton */}
        <div className="aspect-[4/3] bg-gray-200 w-full"></div>

        {/* Top overlay elements */}
        <div className="z-10 absolute top-2 left-2 right-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-[6px]">
            <div className="min-w-fit rounded-none bg-gray-300 h-6 w-16"></div>
            <div className="min-w-fit rounded-none bg-gray-300 h-6 w-12"></div>
          </div>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>

        {/* Exclusive banner skeleton */}
        <div className="bg-gray-300 h-6 absolute bottom-0 w-full"></div>
      </CardHeader>

      <CardContent className="p-3 space-y-3">
        {/* Price skeleton */}
        <div className="flex justify-between align-center flex-wrap gap-y-2 gap-x-5">
          <div className="h-6 bg-gray-200 rounded w-24"></div>
        </div>

        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>

        <Separator className="mt-2" />

        {/* Location and area info skeleton */}
        <div className="flex flex-wrap lg:flex-nowrap justify-between gap-2">
          <div className="w-[47%]">
            <div className="h-3 bg-gray-200 rounded w-12 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>

          <div className="w-[52%] max-w-[140px] min-w[128px] flex gap-2 justify-between">
            <div className="flex-1 max-w-fit">
              <div className="h-3 bg-gray-200 rounded w-12 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-8"></div>
            </div>
            <div className="flex-1 max-w-fit">
              <div className="h-3 bg-gray-200 rounded w-12 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-8"></div>
            </div>
          </div>
        </div>

        {/* Amenities skeleton */}
        <div className="flex flex-wrap lg:flex-nowrap justify-between pt-1 gap-2">
          <div className="w-[47%]">
            <div className="flex items-center gap-3 h-[40px]">
              <div className="flex items-center text-xs gap-[5px]">
                <div className="h-[18px] w-[18px] bg-gray-200 rounded"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </div>
              <div className="flex items-center text-xs gap-[5px]">
                <div className="h-[18px] w-[18px] bg-gray-200 rounded"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </div>
              <div className="flex items-center text-xs gap-[5px]">
                <div className="h-[18px] w-[18px] bg-gray-200 rounded"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimilarPropertiesSkeleton;
