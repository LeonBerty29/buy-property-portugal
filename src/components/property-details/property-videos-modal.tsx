import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Play } from "lucide-react";
import PropertyVideoDetails from "../property/property-video-details";
import { PropertyVideo } from "@/types/property";
import { getTranslations } from "next-intl/server";

interface PropertyVideosModalProps {
  videos: PropertyVideo[];
}

export const PropertyVideosModal: React.FC<PropertyVideosModalProps> = async({
  videos,
}) => {
  const t = await getTranslations("propertyVideosModal");

  // Don't render the modal if no videos are available
  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center shadow-lg transition-all">
            <Play className="w-6 h-6 text-black ml-1" fill="black" />
          </Button>
        </DialogTrigger>
        <DialogContent className="mx-auto !max-w-full !top-16 !bottom-0 !left-0 !right-0 !translate-x-0 !translate-y-0 overflow-y-auto !bg-white">
          <DialogHeader>
            <DialogTitle className="sr-only">
              {t("propertyVideoPlayer")}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {t("playVideosOfProperty")}
            </DialogDescription>
          </DialogHeader>
          <div>
            <PropertyVideoDetails videos={videos} />
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                {t("close")}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};