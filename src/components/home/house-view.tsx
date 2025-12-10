"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Property } from "@/types/property";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

const HouseView = ({ property }: { property: Property }) => {
  const locale = useLocale();
  const t = useTranslations("houseView");

  if (!property) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute top-0 left-0 h-full w-full before:absolute before:inset-0 before:bg-black/60 before:bg-opacity-50 before:content-[''] before:z-10">
        {property.assets.images.gallery[0].url ? (
          <div className="h-full w-full relative">
            <Image
              src={property.assets.images.gallery[0].url}
              alt={property.title}
              className="h-full w-full object-cover"
              fill
            />
          </div>
        ) : (
          <Image
            src="/images/house-view.png"
            alt="Algarve home"
            className=" h-full w-full object-cover"
            fill
          />
        )}

        <div className="absolute left-0 right-0 bottom-0 z-20 flex justify-center">
          {property && (
            <motion.div
              className="container px-6 sm:px-8 md:px-10 lg:px-12 py-12 md:py-14 xl:py-20  text-white z-22 flex flex-col sm:flex-row items-end w-full gap-9"
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
              <div className="flex-1">
                <div>
                  <h2 className="text-3xl md:text-4xl font-normal mb-8 max-w-3xl uppercase line-clamp-3">
                    {property.title}
                  </h2>

                  <div
                    dangerouslySetInnerHTML={{ __html: property.description }}
                    className="prose text-base line-clamp-3 font-light leading-relaxed !max-w-xl text-white/80"
                  />
                </div>
              </div>
              {/* <p className="mb-6 text-3xl font-semibold">{property.price}</p>
                                <p className="mb-8 text-lg opacity-90">{property.specs}</p> */}

              <motion.div
                className="group flex text-xs font-light items-center gap-2 rounded-none bg-[#fff] px-5 py-[10px] text-[#000] border transition-colors hover:bg-primary hover:border-primary hover:text-white w-fit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
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
                  {" "}
                  {t("cta")}
                </Link>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HouseView;
