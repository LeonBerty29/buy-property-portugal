import React from "react"
import { Button } from "../ui/button"
import CarouselSliderVertical from "../carousel-slider-vertical"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"

const AwardsSection = async() => {
  const t = await getTranslations("awardsSection")

  return (
    <div className="flex flex-col lg:flex-row gap-4 container mx-auto px-6 sm:px-8 md:px-10 lg:px-12 sm:justify-between sm:items-center">
      <div className="py-24">
        <p className="text-xs font-medium mb-7">{t("weveMadeItForYou")}</p>
        <h2 className="text-4xl font-normal max-w-lg mb-12 text-primary">
          {t("theBestLuxuryLifestyleAgencyInAlgarve")}
        </h2>
        <Button asChild className="bg-black text-white rounded-none py-5 text-sm font-normal">
          <Link href="/contact">{t("contactUsNow")}</Link>
        </Button>
      </div>
      <div className="hidden lg:flex gap-4">
        <CarouselSliderVertical direction="down" />
        <CarouselSliderVertical />
      </div>
    </div>
  )
}

export default AwardsSection