import { Timer } from "lucide-react";
import Image from "next/image";
import React from "react";
import { renderRichText, StoryblokRichTextNode } from "@storyblok/react";
import { getTranslations } from "next-intl/server";


export const Blog = async (props: {
  blok: {
    title: string;
    banner_image: {
      filename: string;
      alt: string;
    };
    read_time_in_minutes: number;
    body: StoryblokRichTextNode<string | TrustedHTML>;
  };
}) => {

  const t = await getTranslations("blog");
  
  return (
    <>
      <div className="relative w-full h-96">
        <Image
          src={props.blok.banner_image.filename}
          alt={props.blok.banner_image.alt || props.blok.title || "banner"}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex items-start justify-between gap-4 mt-5 mb-12 lg:gap-x-14 xl:gap-x-32">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl">{props.blok.title}</h1>
        </div>
        <div className="flex items-center gap-1 flex-nowrap w-fit">
          <Timer className="h-4 w-4 text-primary" />
          <p className="text-xs text-primary">
            {props.blok.read_time_in_minutes} {t("minRead")}
          </p>
        </div>
      </div>

      <div
        className="prose md:prose-sm mt-16 max-w-none"
        dangerouslySetInnerHTML={{
          __html: renderRichText(props?.blok?.body)!,
        }}
      ></div>
    </>
  );
};
