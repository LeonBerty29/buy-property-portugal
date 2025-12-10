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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyImage } from "@/types/property";
import { getTranslations } from "next-intl/server";
import { RequestFloorPlan } from "../property/request-floor-plan";
import PropertyImageCarousel from "./images-carousel";

const PropertyImagesModal = async ({
  images,
  propertyReference,
}: {
  images: PropertyImage[];
  propertyReference: string;
}) => {
  const t = await getTranslations("propertyImagesModal");
  const totalImages = images.length;
  const remainingPhotos = totalImages - 3;

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer">
            <Button className="bg-black text-white hover:bg-gray-800 rounded-none px-6 py-3 flex items-center gap-2">
              <Camera className="w-4 h-4" />
              {remainingPhotos} {t("morePhotos")}
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="w-full mx-auto !max-w-full !top-0 !bottom-0 !left-0 !right-0 !translate-x-0 !translate-y-0 overflow-y-auto !bg-white p-0 pt-10 md:p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>{t("propertyImagesGallery")}</DialogTitle>
            <DialogDescription>
              {t("browseThroughAllPropertyImages")}
            </DialogDescription>
          </DialogHeader>

          {/* Desktop Tabs - Hidden on mobile */}
          <div className="hidden md:block">
            <Tabs defaultValue="images" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-white sticky top-0 z-10 h-auto p-0">
                <TabsTrigger
                  value="images"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black px-6 py-4"
                >
                  Images
                </TabsTrigger>
                <TabsTrigger
                  value="floorplan"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black px-6 py-4"
                >
                  Floor Plan
                </TabsTrigger>
                <TabsTrigger
                  value="brochure"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black px-6 py-4"
                >
                  Request Brochure
                </TabsTrigger>
              </TabsList>

              <DialogFooter className="sm:justify-start px-4 pb-4 pt-2">
                <DialogClose asChild>
                  <div className="w-fit ml-auto">
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full sm:w-auto"
                    >
                      {t("close")}
                    </Button>
                  </div>
                </DialogClose>
              </DialogFooter>

              <TabsContent value="images" className="mt-0">
                <PropertyImageCarousel images={images} />
              </TabsContent>

              <TabsContent value="floorplan" className="mt-0">
                <div className="flex items-center justify-center min-h-[60vh] p-8">
                  <RequestFloorPlan propertyReference={propertyReference} />
                </div>
              </TabsContent>

              <TabsContent value="brochure" className="mt-0">
                <div className="flex items-center justify-center min-h-[60vh] p-8">
                  <Button className="text-xs rounded-none bg-black text-white px-6">
                    Download Brochure
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Mobile Accordion - Hidden on desktop */}
          <div className="block md:hidden">
            <Accordion
              type="single"
              collapsible
              defaultValue="images"
              className="w-full"
            >
              <AccordionItem value="images" className="border-b">
                <AccordionTrigger className="px-4 py-4 hover:no-underline">
                  Images
                </AccordionTrigger>
                <AccordionContent className="px-0 pb-0">
                  <PropertyImageCarousel images={images} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="floorplan" className="border-b">
                <AccordionTrigger className="px-4 py-4 hover:no-underline">
                  Floor Plan
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="flex items-center justify-center min-h-[40vh]">
                    <RequestFloorPlan propertyReference={propertyReference} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="brochure" className="border-b-0">
                <AccordionTrigger className="px-4 py-4 hover:no-underline">
                  Request Brochure
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="flex items-center justify-center min-h-[40vh]">
                    <Button className="text-xs rounded-none bg-black text-white px-6">
                      Download Brochure
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <DialogFooter className="sm:justify-start px-4 pb-4 pt-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  {t("close")}
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyImagesModal;
