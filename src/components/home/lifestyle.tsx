"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
}

const LifeStyle = () => {
  // Sample images - replace with your actual image data
  const [images] = useState<GalleryImage[]>([
    {
      id: "image1",
      src: "/images/lifestyle-img1.png",
      alt: "Gallery Image 1",
      title: "Beautiful Landscape",
    },
    {
      id: "image2",
      src: "/images/lifestyle/lifestyle-img-2.jpg",
      alt: "Gallery Image 2",
      title: "Urban Architecture",
    },
    {
      id: "image3",
      src: "/images/lifestyle/lifestyle-img-3.jpg",
      alt: "Gallery Image 3",
      title: "Nature Scene",
    },
    {
      id: "image4",
      src: "/images/lifestyle-img4.png",
      alt: "Gallery Image 4",
      title: "Ocean View",
    },
    {
      id: "image5",
      src: "/images/lifestyle/lifestyle-img-5.jpg",
      alt: "Gallery Image 5",
      title: "Mountain Range",
    },
    {
      id: "image6",
      src: "/images/lifestyle/lifestyle-img-6.jpg",
      alt: "Gallery Image 6",
      title: "City Lights",
    },
  ]);

  const t = useTranslations("lifestyle");

  // const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // const openLightbox = (image: GalleryImage) => {
  //   setSelectedImage(image);
  // };

  // const closeLightbox = () => {
  //   setSelectedImage(null);
  // };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-14 lg:py-16 xl:py-20">
      <h1 className="text-3xl font-normal text-center mb-8 lg:mb-12 text-neutral-800">
        {t("theAlgarvesLifestyle")}
      </h1>

      {/* Gallery Grid */}
      <div className="gallery-grid max-w-6xl mx-auto gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className={`gallery-item gallery-${image.id} relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group`}
            // onClick={() => openLightbox(image)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end">
              <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-semibold">{image.title}</h3>
              </div>
            </div> */}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {/* {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 text-2xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ×
            </button>
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={800}
              height={600}
              className="max-w-full h-auto object-contain"
            />
            <div className="absolute bottom-4 left-4 text-white bg-black/50 p-3">
              <h3 className="text-xl font-semibold">{selectedImage.title}</h3>
            </div>
          </div>
        </div>
      )} */}

      <style jsx>{`
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          grid-template-rows: repeat(3, 250px);
          grid-template-areas:
            "image1 image1 image2 image2 image3 image3"
            "image1 image1 image4 image4 image4 image4"
            "image5 image5 image5 image6 image6 image6";
        }

        .gallery-image1 {
          grid-area: image1;
        }
        .gallery-image2 {
          grid-area: image2;
        }
        .gallery-image3 {
          grid-area: image3;
        }
        .gallery-image4 {
          grid-area: image4;
        }
        .gallery-image5 {
          grid-area: image5;
        }
        .gallery-image6 {
          grid-area: image6;
        }

        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(6, 150px);
            grid-template-areas:
              "image1 image1"
              "image1 image1"
              "image2 image3"
              "image4 image4"
              "image5 image5"
              "image6 image6";
          }
        }

        @media (max-width: 480px) {
          .gallery-grid {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(6, 150px);
            grid-template-areas:
              "image1"
              "image2"
              "image3"
              "image4"
              "image5"
              "image6";
          }
        }
      `}</style>
    </div>
  );
};

export default LifeStyle;
