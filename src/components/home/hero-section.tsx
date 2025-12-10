"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";

const videos = [
  "/videos/hero-video-1.mp4",
  "/videos/hero-video-2.mp4",
  "/videos/hero-video-3.mp4",
];

export default function HeroSection({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [videosLoaded, setVideosLoaded] = useState(false);
  const t = useTranslations("heroSection");

  // Fix: Properly type the ref as an array of HTMLVideoElement refs
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    setIsClient(true);

    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Only load videos if not mobile
      if (!mobile && !videosLoaded) {
        setVideosLoaded(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [videosLoaded]);

  useEffect(() => {
    if (isPlaying && !isMobile && isClient && videosLoaded) {
      const timer = setInterval(() => {
        setCurrentVideo((prev) => (prev + 1) % videos.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, isMobile, isClient, videosLoaded]);

  // Show loading state until we know if it's mobile
  if (!isClient || isMobile === null) {
    return (
      <section className="relative w-full h-screen overflow-hidden bg-gray-900 pt-20">
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-full max-w-7xl -translate-x-1/2 px-4">
          <div className="glassmorphism rounded-xl p-6">{children}</div>
          <Button className="bg-primary text-white hover:bg-primary/80 transition-all !mx-auto block text-base lg:text-lg">
            <Link href="/properties">{t("allProperties")}</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Mobile: Single Image */}
      {isMobile ? (
        <div className="absolute inset-0">
          <div className="relative h-full w-full">
            <Image
              src="/images/eav-mobile-banner.jpg"
              alt="House view"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ) : (
        /* Desktop: Video Carousel - Only render if not mobile and videos should be loaded */
        <div className="absolute inset-0">
          {videosLoaded ? (
            videos.map((video, index) => (
              <div
                key={video}
                className={cn(
                  "absolute inset-0 transition-opacity duration-1000",
                  currentVideo === index ? "opacity-100" : "opacity-0"
                )}
              >
                <video
                  ref={(el) => {
                    // Fix: Proper ref callback that doesn't return anything
                    videoRefs.current[index] = el;
                  }}
                  src={video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata" // Only load metadata initially
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            ))
          ) : (
            // Fallback image while videos load
            <div className="absolute inset-0">
              <Image
                src="/images/house-view.png"
                alt="House view"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          )}
        </div>
      )}

      {/* Play/Pause Button - Only show on desktop */}
      {!isMobile && videosLoaded && (
        <motion.button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute left-10 bottom-10 flex items-center justify-center rounded-full bg-black/20 size-10 backdrop-blur-sm transition-all hover:bg-black/30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 text-[#fff]" fill="#fff" />
          ) : (
            <Play className="h-5 w-5 text-[#fff]" fill="#fff" />
          )}
        </motion.button>
      )}

      {/* Video Indicators - Only show on desktop */}
      {!isMobile && videosLoaded && (
        <div className="absolute right-10 bottom-10 flex gap-2">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentVideo(index)}
              className={cn(
                "h-[2px] w-12 rounded-none transition-all",
                currentVideo === index ? "bg-white w-20" : "bg-white/50"
              )}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 w-full max-w-7xl py-14 px-6 min-h-screen mx-auto flex flex-col justify-center">
        <div className="glassmorphism rounded-xl py-14">{children}</div>

        <Button
          asChild
          className="bg-white text-black hover:bg-black hover:text-white transition-all !mx-auto flex w-fit"
        >
          <Link href="/properties">{t("allProperties")}</Link>
        </Button>
      </div>
    </section>
  );
}
