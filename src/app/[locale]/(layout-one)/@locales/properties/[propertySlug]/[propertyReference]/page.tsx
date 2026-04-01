import { PropertiesLanguageSwitcherDropdown } from "@/components/shared/properties-language-switcher-dropdown";
import { Skeleton } from "@/components/ui/skeleton";
import { getProperty } from "@/data/property";
import React, { Suspense } from "react";

interface Props {
  params: Promise<{ propertySlug: string; propertyReference: string }>;
}

const PropertyIdLocales = (props: Props) => {
  return (
    <>
      <Suspense fallback={<Skeleton className="h-10 w-16" />}>
        <PropertiesLanguageSwitcher {...props} />
      </Suspense>
    </>
  );
};

export default PropertyIdLocales;

async function PropertiesLanguageSwitcher(props: Props) {
  const { propertySlug, propertyReference } = await props.params;
  const response = await getProperty(propertySlug, propertyReference);
  
  // Handle slug redirect
  if ("redirect" in response && response.redirect) {
    return null;
  }
  
  const slugs = response.data!.seo.slugs;

  return (
    <>
      <PropertiesLanguageSwitcherDropdown
        slugs={slugs}
        propertyReference={propertyReference}
      />
    </>
  );
}
