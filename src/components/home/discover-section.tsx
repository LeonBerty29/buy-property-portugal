import React from "react";
import { Button } from "../ui/button";
import { CarouselSlider } from "../carousel-slider";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

const DiscoverSection = async() => {
  const t = await getTranslations("discoverSection");

  return (
    <div className="pb-14 relative bg-gradient-to-t from-white via-white/80 to-white/20">
      <CarouselSlider />
      <CarouselSlider direction="right" />

      {/*  overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-white/40 pointer-events-none z-10"></div>

      <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center z-20">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-light text-primary mb-6 leading-tight">
            {t("discoverTheBest")} <br />
            {t("propertiesInAlgarve")}
          </h1>
          <p className="text-base text-black mb-8 max-w-md mx-auto">
            {t("discoverAmazingFeatures")}
          </p>
          <Button
            asChild
            className="bg-black hover:bg-black/85 text-xs py-5 px-5 text-white font-light rounded-none transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <Link href="/properties">{t("discoverLuxury")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiscoverSection;
