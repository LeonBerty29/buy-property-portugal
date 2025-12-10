import { PropertyVideo } from "@/types/property";
import { PropertyVideoPlayer } from "./property-video-player";
import { getTranslations } from "next-intl/server";

interface PropertyVideoDetailsProps {
  videos: PropertyVideo[];
}

export default async function PropertyVideoDetails({
  videos,
}: PropertyVideoDetailsProps) {
  const t = await getTranslations("propertyVideoDetails");

  // If no videos provided, show message
  if (!videos || videos.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">
              {t("noVideosAvailable")}
            </h2>
            <p className="text-gray-600">{t("noVideosDescription")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Video Section */}
        <div className="mb-8">
          <PropertyVideoPlayer
            videos={videos}
            showPlaylist={true}
            className="mb-6"
          />
        </div>
      </div>
    </div>
  );
}
