"use client";

import { useRouter } from "@/i18n/navigation";
import { REGIONS } from "@/config/constants";

export const HomepageRegions = () => {
  const router = useRouter();

  const handleRegionClick = (districtIds: number[]) => {
    router.push({
      pathname: "/properties",
      query: {
        district: districtIds.join(","),
      },
    });
  };

  return (
    <section className="py-12 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
            Explore Portugal by Region
          </h2>
          <p className="text-slate-600 text-lg">
            Discover your dream property in Portugal&apos;s most sought-after regions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REGIONS.map((region) => (
            <div
              key={region.id}
              onClick={() => handleRegionClick(region.districtIds)}
              className="group relative w-full aspect-square rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Background Image with Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${region.imageUrl})`,
                }}
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-2xl font-bold mb-2">
                  {region.name}
                </h3>
                
                {/* Underline */}
                <div className="w-16 h-1 bg-white group-hover:bg-primary transition-colors duration-300 mb-3" />
                
                <p className="text-white/90 text-sm">
                  {region.properties_count.toLocaleString()} Properties
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};