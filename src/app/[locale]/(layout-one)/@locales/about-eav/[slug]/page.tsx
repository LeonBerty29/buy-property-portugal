import { AboutUsResourcesLanguageSwitcherDropdown } from "@/components/shared/about-us-resources-language-switcher-dropdown";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAboutUsResourcePage } from "@/data/resources";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import React, { Suspense } from "react";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

const AboutUsResourceLocales = (props: Props) => {
  return (
    <>
      <Suspense fallback={<Skeleton className="h-10 w-16" />}>
        <AboutUsResourceLanguageSwitcher {...props} />
      </Suspense>
    </>
  );
};

export default AboutUsResourceLocales;

async function AboutUsResourceLanguageSwitcher(props: Props) {
  const { slug } = await props.params;
  const { locale } = await props.params;
  setRequestLocale(locale as string);
  const story = await fetchAboutUsResourcePage(slug);

  //   console.log({ storyContent: story.content });

  const locales = routing.locales;

  const slugs: { [key: string]: string } = {};

  locales.forEach((locale) => {
    const fullUrl = story.content[locale]?.cached_url;
    const url = fullUrl ? fullUrl.split("/").pop() : "";
    slugs[locale] = url as string;
  });

  return (
    <>
      <AboutUsResourcesLanguageSwitcherDropdown slugs={slugs} />
    </>
  );
}
