import { ClientTestimonialCard } from "@/components/client-testimonials/client-testimonials-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BASE_URL,
  EAV_TWITTER_CREATOR_HANDLE,
  GEO_POSITION,
  WEBSITE_NAME,
} from "@/config/constants";
import { getTestimonials } from "@/data/testimonials";
import { routing } from "@/i18n/routing";
import { clientTestimonialsMetadata } from "@/seo-metadata/client-testimonials";
import { Metadata } from "next";
import { Suspense } from "react";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Get localized metadata
  const metadata =
    clientTestimonialsMetadata[
      locale as keyof typeof clientTestimonialsMetadata
    ] || clientTestimonialsMetadata.en;

  // Get the localized path for the client testimonials page
  const testimonialsPath = routing.pathnames["/about-eav/client-testimonials"];
  const localizedTestimonialsPath =
    typeof testimonialsPath === "string"
      ? testimonialsPath
      : testimonialsPath[locale as keyof typeof testimonialsPath];

  // Build canonical URL for current locale
  const canonicalUrl = `${BASE_URL}/${locale}${localizedTestimonialsPath}`;

  // Build alternate language URLs
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    const path =
      typeof testimonialsPath === "string"
        ? testimonialsPath
        : testimonialsPath[loc as keyof typeof testimonialsPath];

    languages[loc] = `${BASE_URL}/${loc}${path}`;
  });

  // Add x-default using default locale
  const defaultPath =
    typeof testimonialsPath === "string"
      ? testimonialsPath
      : testimonialsPath[
          routing.defaultLocale as keyof typeof testimonialsPath
        ];
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
          url: `${BASE_URL}/images/about/about-img-2.png`,
          secureUrl: `${BASE_URL}/images/about/about-img-2.png`,
          width: 1200,
          height: 630,
          alt: `${metadata.title} - ${WEBSITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.ogTitle,
      description: metadata.ogDescription,
      creator: EAV_TWITTER_CREATOR_HANDLE,
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
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
    other: {
      "geo.region": "PT",
      "geo.position": `${GEO_POSITION.lat};${GEO_POSITION.lng}`,
      ICBM: ICBM,
      classification: metadata.classification,
      category: metadata.category,
      "DC.title": metadata.dcTitle,
    },
  };
}

const Page = async () => {
  // console.log({ testimonials });

  return (
    <div className="2xl:container w-full mx-auto px-6 sm:px-8 md:px-10 lg:px-14 py-16">
      <Suspense fallback={<Fallback />}>
        <PageDetails />
      </Suspense>
    </div>
  );
};

export default Page;

async function PageDetails() {
  const testimonials = await getTestimonials();

  return (
    <>
      <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
        {testimonials.data.map((testimonial, index) => (
          <ClientTestimonialCard key={`${index}-${index}`} data={testimonial} />
        ))}
      </div>
    </>
  );
}

function Fallback() {
  return (
    <>
      <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
        {[1, 2, 3, 4].map((value) => (
          <Skeleton
            key={`fallback---${value}`}
            className="w-full aspect-video"
          />
        ))}
      </div>
    </>
  );
}
