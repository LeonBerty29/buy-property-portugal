import { MetadataRoute } from "next";
import { routing } from "../i18n/routing";
import { BASE_URL } from "../config/constants";

// Set this based on your next-intl localePrefix config.
// If default locale is served WITHOUT a /en prefix, set to true.
const DEFAULT_LOCALE_UNPREFIXED = true;

function localizedPaths(key: keyof typeof routing.pathnames) {
  return routing.locales.flatMap((lng) => {
    const pathname = routing.pathnames[key];
    
    // Type guard: check if pathname is a string or an object
    const slug = typeof pathname === "string" ? pathname : pathname[lng];
    
    const prefixed = `/${lng}${slug}`;
    if (DEFAULT_LOCALE_UNPREFIXED && lng === routing.defaultLocale) {
      // Add both prefixed and unprefixed variants for default locale
      return [prefixed, slug];
    }
    return [prefixed];
  });
}

export default function robots(): MetadataRoute.Robots {
  // If you have privacy/cookies pages, either add them to routing.pathnames
  // or hardcode slugs here (and translate if needed).
//   const privacy = routing.locales.flatMap((lng) => {
//     const base = "/privacy";
//     const prefixed = `/${lng}${base}`;
//     return (DEFAULT_LOCALE_UNPREFIXED && lng === routing.defaultLocale)
//       ? [prefixed, base]
//       : [prefixed];
//   });

//   const cookies = routing.locales.flatMap((lng) => {
//     const base = "/cookies";
//     const prefixed = `/${lng}${base}`;
//     return (DEFAULT_LOCALE_UNPREFIXED && lng === routing.defaultLocale)
//       ? [prefixed, base]
//       : [prefixed];
//   });

  const disallow = [
    // Translated routes from routing.pathnames
    ...localizedPaths("/annotations"),
    ...localizedPaths("/settings"),
    ...localizedPaths("/terms-and-conditions"),
    ...localizedPaths("/favorites"),
    // Add these only if they exist (and ideally add to routing.pathnames)
    // ...privacy,
    // ...cookies,
    // Non-localized resources
    "/api/",
  ];

  return {
    rules: [
        {
      userAgent: "*",
      allow: "/",
      disallow,
    },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`
  };
}