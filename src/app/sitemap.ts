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

function createSitemapEntries(
  paths: string[],
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never",
  priority: number
): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Homepage (highest priority)
    ...createSitemapEntries(localizedPaths("/"), "monthly", 1),

    // Main sections (high priority)
    ...createSitemapEntries(localizedPaths("/properties"), "always", 1),
    ...createSitemapEntries(localizedPaths("/buy"), "monthly", 0.9),
    ...createSitemapEntries(localizedPaths("/sell"), "monthly", 0.9),
    ...createSitemapEntries(localizedPaths("/blogs"), "monthly", 0.8),

    // About pages
    ...createSitemapEntries(localizedPaths("/about-eav"), "monthly", 0.8),
    ...createSitemapEntries(localizedPaths("/about-eav/the-team"), "monthly", 0.7),
    ...createSitemapEntries(localizedPaths("/about-eav/client-testimonials"), "monthly", 0.7),

    // Important informational pages
    ...createSitemapEntries(localizedPaths("/buying-process"), "monthly", 0.8),
    ...createSitemapEntries(localizedPaths("/golden-visa-program"), "monthly", 0.8),
    ...createSitemapEntries(localizedPaths("/digital-nomad-visa"), "monthly", 0.8),
    ...createSitemapEntries(localizedPaths("/yearly-property-taxes"), "monthly", 0.7),

    // Vendor & Agent pages
    ...createSitemapEntries(localizedPaths("/become-a-vendor"), "monthly", 0.7),
    ...createSitemapEntries(localizedPaths("/agent"), "monthly", 0.7),

    // User account pages (medium priority)
    ...createSitemapEntries(localizedPaths("/login"), "yearly", 0.5),
    ...createSitemapEntries(localizedPaths("/register"), "yearly", 0.5),
    ...createSitemapEntries(localizedPaths("/account/forgot-password"), "yearly", 0.3),
    ...createSitemapEntries(localizedPaths("/account/resend-activation"), "yearly", 0.3),

    // Contact
    ...createSitemapEntries(localizedPaths("/contact"), "monthly", 0.8),

    // Favorites (user-specific, low priority)
    ...createSitemapEntries(localizedPaths("/favorites"), "never", 0.3),

    // Note: Dynamic routes like /properties/[slug], /buy/[slug], etc. 
    // should be generated dynamically based on your actual data
    // You may want to create a separate dynamic sitemap for those
  ];
}