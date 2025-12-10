"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// Replace the existing div with 4 images in your BecomeAVendor component with:
// <AnimatedImagesSection />

const AnimatedImagesSection = () => {
  return (
    <div className="w-full aspect-video lg:w-[50%] order-2 lg:order-1 relative mt-5 lg:mt-0">
      {/* Blurred Circle Background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.1 }}
        className="absolute inset-0 flex items-center justify-center z-0"
      >
        <div 
          className="max-w-[400px] w-full aspect-square rounded-full bg-gradient-to-br from-primary/30 via-primary/30 to-primary/50"
          style={{
            filter: 'blur(40px)',
            transform: 'scale(1.2)'
          }}
        />
      </motion.div>

      {/* Container for the 2x2 grid */}
      <div className="relative w-full h-full z-10">
        {/* First Image - Top Left */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotate: 3 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute top-0 left-6.5 w-[48%] aspect-3/2 z-10"
        >
          <Image
            priority
            src="/images/become-a-vendor/maintenance-1.png"
            width={324}
            height={210}
            alt="about-us"
            className="object-cover w-full h-full rounded-lg"
          />
        </motion.div>

        {/* Second Image - Top Right */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="absolute top-0 right-6.5 w-[48%] aspect-3/2 z-20"
          style={{ transform: "translateX(-10%)" }}
        >
          <Image
            priority
            src="/images/become-a-vendor/maintenance-2.png"
            width={324}
            height={210}
            alt="about-us"
            className="object-cover w-full h-full rounded-lg"
          />
        </motion.div>

        {/* Third Image - Bottom Left */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotate: 3 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="absolute -bottom-4 sm:-bottom-10 lg:-bottom-8 left-6.5 w-[48%] aspect-3/2 z-30"
          style={{ transform: "translateY(-10%)" }}
        >
          <Image
            priority
            src="/images/become-a-vendor/maintenance-3.png"
            width={324}
            height={210}
            alt="about-us"
            className="object-cover w-full h-full rounded-lg"
          />
        </motion.div>

        {/* Fourth Image - Bottom Right */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute -bottom-4 sm:-bottom-10 lg:-bottom-8 right-6.5 w-[48%] aspect-3/2 z-40"
          style={{ transform: "translate(-15%, -10%)" }}
        >
          <Image
            priority
            src="/images/become-a-vendor/maintenance-4.png"
            width={324}
            height={210}
            alt="about-us"
            className="object-cover w-full h-full rounded-lg"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedImagesSection;