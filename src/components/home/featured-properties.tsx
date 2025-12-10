"use client";

import { useRef } from "react";
import {
  motion,
  // useScroll, useTransform
} from "framer-motion";
import Image from "next/image";
import { Property } from "@/types/property";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function FeaturedProperties({
  properties,
}: {
  properties: Property[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // const { scrollYProgress } = useScroll({
  //     target: containerRef,
  //     offset: ["start start", "end end"]
  // });

  const language = useLocale() as keyof Property["seo"]["slugs"];
  const t = useTranslations("featuredProperties");

  return (
    <div ref={containerRef} className="relative h-[100vh]">
      {properties.slice(0, 1).map((property) => {
        // const opacity = useTransform(
        //     scrollYProgress,
        //     [index / 3, (index + 1) / 3],
        //     [1, 0]
        // );

        return (
          <motion.div
            key={property.id}
            className="sticky top-0 h-screen w-full"
            // style={{ opacity }}
          >
            <div className="relative h-full w-full before:absolute before:inset-0 before:bg-black/60 before:bg-opacity-50 before:content-[''] before:z-10">
              <Image
                src={property.assets.images.gallery[0].url}
                alt={property.title}
                width={1920}
                height={1080}
                className="h-full w-full object-cover"
              />

              <motion.div
                className="absolute left-[0] top-1/2 -translate-y-1/2 text-white z-20 flex flex-col items-center w-full gap-9 px-5"
                initial={{
                  y: 100,
                  opacity: 0,
                }}
                whileInView={{
                  y: 0,
                  opacity: 1,
                }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-center max-w-[850px] line-clamp-2 leading-snug">
                  {property.title}
                </h2>
                <p className="text-lg font-light max-w-[350px] text-center leading-tight">
                  {property.location.district}, {property.location.municipality}
                  , {property.location.zone},
                </p>
                {/* <p className="mb-6 text-3xl font-semibold">{property.price}</p>
                                <p className="mb-8 text-lg opacity-90">{property.specs}</p> */}

                <motion.button
                  className="group flex text-xs font-light items-center gap-2 rounded-none bg-transparent px-5 py-[10px] text-white border transition-colors hover:bg-primary hover:border-primary hover:text-white"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={{
                      pathname: "/properties/[slug]",
                      params: { slug: property.seo.slugs[language] },
                    }}
                  >
                    {t("cta")}
                  </Link>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
