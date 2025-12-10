import { BlogLanguageSwitcherDropdown } from "@/components/shared/blog-language-switcher-dropdown";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchBlogPage } from "@/data/blogs";
import { routing } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import React, { Suspense } from "react";

interface Props {
  params: Promise<{ slug: string }>;
}

const BlogLocales = (props: Props) => {
  return (
    <>
      <Suspense fallback={<Skeleton className="h-10 w-16" />}>
        <BlogLanguageSwitcher {...props} />
      </Suspense>
    </>
  );
};

export default BlogLocales;

async function BlogLanguageSwitcher(props: Props) {
  const { slug } = await props.params;
  const locale = await getLocale();
  const story = await fetchBlogPage(slug, locale);
  const locales = routing.locales;

  const slugs: { [key: string]: string } = {};

  locales.forEach((locale) => {
    const fullUrl = story.content[locale]?.cached_url;
    const url = fullUrl ? fullUrl.split("/").pop() : "";
    slugs[locale] = url as string;
  });

  return (
    <>
      <BlogLanguageSwitcherDropdown slugs={slugs} />
    </>
  );
}
