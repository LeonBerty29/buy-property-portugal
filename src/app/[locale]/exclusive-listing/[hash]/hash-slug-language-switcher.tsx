import { Skeleton } from "@/components/ui/skeleton";
import { getProperty } from "@/data/property";
import React, { Suspense } from "react";
import { HashSlugLanguageSwitcherDropdown } from "./hash-slug-language-switcher-dropdown";

interface Props {
  slug: string;
  locale: string;
  hash: string;
}

export const HashSlugLocales = (props: Props) => {
  return (
    <>
      <Suspense fallback={<Skeleton className="h-10 w-16" />}>
        <HashSlugLanguageSwitcher {...props} />
      </Suspense>
    </>
  );
};

async function HashSlugLanguageSwitcher(props: Props) {
  const { slug } = props;
  
    // Use Promise.all to fetch all data concurrently
    const [propertyResponse] = await Promise.all([
      getProperty(slug),
      //   token
      //     ? getFavorites(token)
      //     : Promise.resolve({ favorite_properties: [] }),
      //   token ? getNote() : Promise.resolve({ data: [] }),
    ]);
  
    const slugs = propertyResponse.data.seo.slugs;

  return (
    <>
      <HashSlugLanguageSwitcherDropdown slugs={slugs} />
    </>
  );
}
