"use client"
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export const DigitalNomadVisaHeroSection = () => {
    const t = useTranslations("digitalNomadVisaPage");
  return (
    <>
      <div className="absolute top-0 left-0 h-full w-full before:absolute before:inset-0 before:bg-black/60 before:bg-opacity-50 before:content-[''] before:z-10">
        <Image
          src="/images/house-view.png"
          alt={t("algarveHomeAlt")}
          width={1920}
          height={1080}
          className=" h-full w-full object-cover"
        />
        <div className="absolute left-0 right-0 bottom-0 top-0 z-20 flex justify-center">
          <motion.div
            className="container px-6 sm:px-8 md:px-10 lg:px-12 py-12 md:py-14 xl:py-20  text-white z-22 flex justify-center items-center w-full gap-9"
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div>
              <h1 className="text-center text-[45px] sm:text-[100px] lg:text-[140px] leading-none font-extrabold">
                <span className="text-[22px] sm:text-[50px] lg:text-[72px]">
                  {t("digitalNomad")}
                </span>
                <br />
                {t("portugal")}
              </h1>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};
