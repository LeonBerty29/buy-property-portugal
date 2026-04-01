"use client";
import React, { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Property } from "@/types/property";
import { useLocale } from "next-intl";

interface GenerateBrochureProps {
  property: Property;
  buttonText?: string;
  className?: string;
}

export const GenerateBrochure: React.FC<GenerateBrochureProps> = ({
  property,
  buttonText = "Download Brochure",
  className = "text-xs rounded-none bg-black text-white px-6",
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const locale = useLocale();

  /**
   * Fetch image, resize and compress using canvas, return as base64
   */
  const urlToCompressedBase64 = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const imageBitmap = await createImageBitmap(blob);

      // Max dimensions — enough quality for PDF
      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 800;

      let width = imageBitmap.width;
      let height = imageBitmap.height;

      // Scale down proportionally if needed
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      // Draw onto canvas at reduced dimensions
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(imageBitmap, 0, 0, width, height);

      // Export as JPEG at 70% quality
      return canvas.toDataURL("image/jpeg", 0.7);
    } catch (error) {
      console.error(`Failed to process image ${url}:`, error);
      throw new Error(`Failed to load image: ${url}`);
    }
  };

  /**
   * Prepare exactly 11 compressed base64 images
   * - Duplicate existing images until we have at least 11
   * - Slice to exactly 11
   * - Compress and convert to base64
   */
  const prepareImagesBase64 = async (): Promise<string[]> => {
    const REQUIRED_IMAGES = 11;
    const galleryImages = property.assets?.images?.gallery || [];

    if (galleryImages.length === 0) {
      throw new Error("This property has no images");
    }

    // Get all available URLs
    const imageUrls = galleryImages.map((img) => img.url);

    // Duplicate by cycling until we have at least REQUIRED_IMAGES
    const paddedUrls: string[] = [];
    let i = 0;
    while (paddedUrls.length < REQUIRED_IMAGES) {
      paddedUrls.push(imageUrls[i % imageUrls.length]);
      i++;
    }

    // Slice to exactly 11
    const finalUrls = paddedUrls.slice(0, REQUIRED_IMAGES);

    // Compress and convert exactly 11 images in parallel
    const base64Images = await Promise.all(
      finalUrls.map((url) => urlToCompressedBase64(url)),
    );

    return base64Images;
  };

  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      const base64Images = await prepareImagesBase64();

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          property,
          images: base64Images,
          language: locale,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${property.reference}-brochure.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Brochure downloaded successfully");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error(
        `Failed to generate PDF: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button onClick={generatePDF} disabled={isGenerating} className={className}>
      {isGenerating ? (
        <>
          <svg
            className="animate-spin h-4 w-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Generating...
        </>
      ) : (
        <>
          <Download className="size-4 mr-2" />
          {buttonText}
        </>
      )}
    </Button>
  );
};
