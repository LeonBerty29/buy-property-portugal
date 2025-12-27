// import FeaturedProperties from "@/components/home/featured-properties";
import LatestNews from "@/components/home/latest-news";
// import HeroSection from "@/components/home/hero-section";
// import AwardsSection from "@/components/home/awards-section";
import RecentListing from "@/components/home/recent-listing";
// import MeetTheTeam from "@/components/home/meet-the-team";
// import HouseView from "@/components/home/house-view";
// import LifeStyle from "@/components/home/lifestyle";
import DiscoverSection from "@/components/home/discover-section";
import { Suspense } from "react";
import { RecentListingLoading } from "@/components/home/recent-listing-loading";
// import { getFeaturedProperties, getPremiumProperties } from "@/data/properties";
// import { Skeleton } from "@/components/ui/skeleton";
// import HeroSearch from "@/components/home/search-component";
// import { PropertiesFilter } from "@/components/search/properties-filters";
// import { HomepageSearchEngine } from "@/components/search/homepage-search-engine";
import { HomepageSearchResult } from "@/components/search/homepage-search-result";
import { PropertySearchParams } from "@/types/property";
import { FooterPropertiesLink } from "@/components/layout/footer-properties-link";
import {
  BASE_URL,
  EAV_TWITTER_CREATOR_HANDLE,
  GEO_POSITION,
  WEBSITE_NAME,
} from "@/config/constants";
import { routing } from "@/i18n/routing";
import { homeMetadata } from "@/seo-metadata/home-page";
import { Metadata } from "next";
import { SearchInput } from "@/components/search/search-input";
import MapSelection from "../../../components/home/map-selection";
// import { FilterComponents } from "@/components/search/filter-compoonent";
import { Link } from "@/i18n/navigation";
import { HomeFilterComponents } from "@/components/search/home-filter-components";
import { HomepageRegions } from "@/components/home/homepage-regions";

type Params = {
  [x: string]: string | string[];
};

interface PageProps {
  params?: Promise<Params>;
  searchParams: Promise<PropertySearchParams>;
}

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Get localized metadata
  const metadata =
    homeMetadata[locale as keyof typeof homeMetadata] || homeMetadata.en;

  // Get the localized path for the homepage
  const homePath = routing.pathnames["/"];
  const localizedHomePath =
    typeof homePath === "string"
      ? homePath
      : homePath[locale as keyof typeof homePath];

  // Build canonical URL for current locale
  const canonicalUrl = `${BASE_URL}/${locale}${localizedHomePath}`;

  // Build alternate language URLs
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    const path =
      typeof homePath === "string"
        ? homePath
        : homePath[loc as keyof typeof homePath];

    languages[loc] = `${BASE_URL}/${loc}${path}`;
  });

  // Add x-default using default locale
  const defaultPath =
    typeof homePath === "string"
      ? homePath
      : homePath[routing.defaultLocale as keyof typeof homePath];
  languages["x-default"] = `${BASE_URL}/${routing.defaultLocale}${defaultPath}`;

  // ICBM coordinates
  const ICBM = `${GEO_POSITION.lat}, ${GEO_POSITION.lng}`;

  return {
    title: `${metadata.title} | ${WEBSITE_NAME}`,
    description: metadata.description,
    keywords: [...metadata.keywords],
    openGraph: {
      title: metadata.ogTitle,
      description: metadata.ogDescription,
      url: canonicalUrl,
      siteName: WEBSITE_NAME,
      locale: locale,
      type: "website",
      images: [
        {
          url: `${BASE_URL}/images/buyproperytyportugal-logo-dark.png`,
          secureUrl: `${BASE_URL}/images/buyproperytyportugal-logo-dark.png`,
          width: 1200,
          height: 630,
          alt: `${WEBSITE_NAME} - Luxury Real Estate Portugal`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.ogTitle,
      description: metadata.ogDescription,
      creator: EAV_TWITTER_CREATOR_HANDLE,
      images: [`${BASE_URL}/images/buyproperytyportugal-logo-dark.png`],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: languages,
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    other: {
      "geo.region": "PT-08", // Faro District (Portugal)
      "geo.placename": "Portugal",
      "geo.position": `${GEO_POSITION.lat};${GEO_POSITION.lng}`,
      ICBM: ICBM,
      classification: metadata.classification,
      category: metadata.category,
      "DC.title": metadata.dcTitle,
      "DC.subject": "Luxury Real Estate",
      "DC.language": locale,
      "DC.coverage": "Portugal, Portugal",
    },
  };
}

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;

  return (
    <div className="h-full mx-auto pt-24">
      <div className="hidden lg:block w-full px-6 lg:px-14">
        {searchParams && (
          <div className="2xl:container mx-auto">
            <h2 className="mb-6 font-semibold text-2xl">
              Quick Advance Search
            </h2>
            <div className="hidden lg:grid lg:grid-cols-5 gap-4">
              <HomeFilterComponents />
            </div>
          </div>
        )}
      </div>
      <HomepageSearchResult searchParams={searchParams} />

      <div className="from-slate-900 to-slate-800 p-4 md:p-8">
        <div className="2xl:container h-full mx-auto lg:pt-14">
          <div className="grid lg:grid-cols-5 items-start bg-gray-100 rounded-2xl mb-10">
            {/* Sticky Map Section with Custom Scrollbar */}
            <div
              className="lg:col-span-2 space-y-4 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-2
                                [&::-webkit-scrollbar]:w-1.5 
                                [&::-webkit-scrollbar-track]:bg-slate-100 
                                [&::-webkit-scrollbar-track]:rounded-full
                                [&::-webkit-scrollbar-thumb]:bg-slate-300 
                                [&::-webkit-scrollbar-thumb]:rounded-full
                                [&::-webkit-scrollbar-thumb]:hover:bg-slate-400"
            >
              <MapSelection />
              {/* <DistrictList /> */}
            </div>

            {/* Scrollable Properties Section */}
            <div className="lg:col-span-3 h-full p-6 lg:p-10 py-10">
              {/* <Suspense fallback={<PropertiesGridSkeleton />} key={suspenseKey}>
                    <PropertiesList apiParams={apiParams} />
                  </Suspense> */}
              <div className="h-full flex flex-col justify-center">
                <h1 className="text-4xl font-bold mb-6">
                  Find properties for sale in Portugal
                </h1>
                <p className="font-semibold text-base text-gray-600 mb-4">
                  Search for regions, cities or towns in Portugal
                  {/* <br />or use our map
                      to easily select a district of interest */}
                </p>
                <div className="">
                  <SearchInput
                    placeholder="Describe the property you are looking for"
                    className="placeholder:text-gray-500 text-gray-800 placeholder:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {!searchParams && (
            <div className="2xl:container mx-auto">
              <h2 className="mb-6 font-semibold text-2xl">
                Quick Advance Search
              </h2>
              <div className="hidden lg:grid lg:grid-cols-5 gap-4">
                <HomeFilterComponents />
              </div>
            </div>
          )}
          <div className="lg:hidden">
            <Link href={"/properties"}>Advance Search</Link>
          </div>
        </div>
      </div>

      {/* <div className="">
        <Suspense fallback={<FeaturedPropertiesLoading />}>
          <ListFeaturesProperties />
        </Suspense>
      </div> */}
      {/* <div className="bg-neutral-200">
        <AwardsSection />
      </div> */}
      {/* <div>
        <LifeStyle />
      </div> */}

      <div className="py-10">
        <HomepageRegions />
      </div>

      <div className="py-10">
        <FooterPropertiesLink />
      </div>

      <div className="bg-neutral-800">
        <Suspense fallback={<RecentListingLoading />}>
          <RecentListing />
        </Suspense>
      </div>

      {/* <div className="mt-8">
        <MeetTheTeam />
      </div> */}

      {/* <div>
        <Suspense fallback={<HouseViewLoading />}>
          <ListHouseView />
        </Suspense>
      </div> */}

      <div className="py-14">
        <LatestNews />
      </div>

      <div className="pt-10">
        <DiscoverSection />
      </div>
    </div>
  );
}

// async function ListFeaturesProperties() {
//   const response = await getFeaturedProperties({ featured: true, per_page: 3 });
//   const properties = response.data;
//   // console.log({properties})
//   return <FeaturedProperties properties={properties} />;
// }

// async function ListHouseView() {
//   const response = await getPremiumProperties({ premium: true });
//   const properties = response.data;

//   if (!properties.length) {
//     return <></>;
//   }
//   const propertyIndex = Math.floor(Math.random() * properties.length);
//   const property = properties[propertyIndex];
//   return <HouseView property={property} />;
// }

// function FeaturedPropertiesLoading() {
//   return (
//     <div className="relative h-[300vh]">
//       {/* Create 3 skeleton items to match typical featured properties count */}
//       {Array.from({ length: 3 }).map((_, index) => (
//         <div key={index} className="sticky top-0 h-screen w-full">
//           <div className="relative h-full w-full">
//             {/* Background image skeleton */}
//             <Skeleton className="h-full w-full bg-black/80" />

//             {/* Content overlay skeleton */}
//             <div className="absolute left-0 top-1/2 -translate-y-1/2 text-white z-20 flex flex-col items-center w-full gap-9 px-5">
//               {/* Title skeleton */}
//               <Skeleton className="h-10 w-[850px] bg-white" />

//               {/* Location text skeleton */}
//               <Skeleton className="h-8 w-[550px] bg-white" />

//               {/* Button skeleton */}
//               <Skeleton className="h-10 w-32 bg-white" />
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// const HouseViewLoading = () => {
//   return (
//     <div className="min-h-screen relative">
//       <div className="absolute top-0 left-0 h-full w-full before:absolute before:inset-0 before:bg-black/60 before:bg-opacity-50 before:content-[''] before:z-10">
//         {/* Background image skeleton */}
//         <Skeleton className="h-full w-full bg-gray-800" />

//         <div className="absolute left-0 right-0 bottom-0 z-20 flex justify-center">
//           <div className="container px-6 sm:px-8 md:px-10 lg:px-12 py-12 md:py-14 xl:py-20 text-white z-22 flex flex-col sm:flex-row items-end w-full gap-9">
//             <div className="flex-1">
//               <div>
//                 {/* Title skeleton */}
//                 <Skeleton className="h-6 w-80 max-w-sm mb-8 bg-white/20" />

//                 {/* Description skeleton - multiple lines */}
//                 <div className="max-w-xl space-y-3 mb-6">
//                   <Skeleton className="h-4 w-full bg-white/20" />
//                   <Skeleton className="h-4 w-full bg-white/20" />
//                   <Skeleton className="h-4 w-3/4 bg-white/20" />
//                 </div>

//                 {/* Additional description skeleton */}
//                 <div className="max-w-xl space-y-2">
//                   <Skeleton className="h-4 w-full bg-white/20" />
//                   <Skeleton className="h-4 w-5/6 bg-white/20" />
//                   <Skeleton className="h-4 w-2/3 bg-white/20" />
//                 </div>
//               </div>
//             </div>

//             {/* Button skeleton */}
//             <Skeleton className="h-10 w-28 bg-white/20" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
