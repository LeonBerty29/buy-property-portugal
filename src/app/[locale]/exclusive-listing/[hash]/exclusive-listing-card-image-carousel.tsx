"use client";

import React, { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "@/i18n/navigation";
import { Property } from "@/types/property";
import { useLocale } from "next-intl";

interface ProductImageCarouselProps {
  imagePaths: string[];
  property?: Property;
  hash: string
}

export const ExclusiveCardProductImageCarousel: React.FC<ProductImageCarouselProps> = ({
  imagePaths,
  property,
  hash
}) => {
  // ref for the carousel container
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  const plugin = useRef(
    Autoplay({
      delay: 4000,
      stopOnMouseEnter: true,
    })
  );

  const handleMouseLeave = () => {
    if (plugin.current) {
      plugin.current.play();
    }
  };

  const handleMouseEnter = () => {
    if (plugin.current) {
      plugin.current.stop();
    }
  };


  return (
    <div ref={carouselContainerRef} className="relative w-full h-full">
      <Carousel
        className="w-full"
        opts={{ loop: true }}
        plugins={[plugin.current]}
      >
        <CarouselContent
          className="ml-0"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {imagePaths?.slice(0, 3).map((item: string, index: number) => (
            <CarouselItem key={`${item}--${index}`} className="p-0">
              <div className="relative w-full h-full">
                {/* Image layer */}
                {property ? (
                  <Link
                    href={{
                      pathname: "/exclusive-listing/[hash]/[slug]",
                      params: {
                        slug: property.seo.slugs[
                          locale as keyof typeof property.seo.slugs
                        ],
                        hash: hash,
                      },
                    }}
                    className="relative w-full aspect-4/3 overflow-hidden block"
                  >
                    <Image
                      src={item}
                      alt="Image of our property"
                      fill
                      className="w-full h-full object-cover"
                    />
                  </Link>
                ) : (
                  <div className="relative w-full aspect-4/3 overflow-hidden">
                    <Image
                      src={item}
                      alt="Image of our property"
                      fill
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Control buttons */}
        <CarouselPrevious className="size-8 lg:size-9 absolute left-0 top-1/2 -translate-y-1/2 hover:bg-gray-300 backdrop-blur-sm z-[10] rounded-none bg-gray-300/75 border-gray-300/75 hover:border-gray-300 " />
        <CarouselNext className="size-8 lg:size-9 absolute right-0 top-1/2 -translate-y-1/2 hover:bg-gray-300 backdrop-blur-sm z-[10] rounded-none bg-gray-300/75 border-gray-300/75 hover:border-gray-300 " />
      </Carousel>
    </div>
  );
};
