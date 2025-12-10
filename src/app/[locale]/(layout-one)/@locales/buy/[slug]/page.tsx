import { BuyResourcesLanguageSwitcherDropdown } from "@/components/shared/buy-resources-language-switcher-dropdown";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchBuyResourcePage } from "@/data/resources";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import React, { Suspense } from "react";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

const BuyResourceLocales = (props: Props) => {
  return (
    <>
      <Suspense fallback={<Skeleton className="h-10 w-16" />}>
        <BuyResourceLanguageSwitcher {...props} />
      </Suspense>
    </>
  );
};

export default BuyResourceLocales;

async function BuyResourceLanguageSwitcher(props: Props) {
  const { slug } = await props.params;
  const { locale } = await props.params;
  setRequestLocale(locale as string);
  const story = await fetchBuyResourcePage(slug);

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
      <BuyResourcesLanguageSwitcherDropdown slugs={slugs} />
    </>
  );
}
