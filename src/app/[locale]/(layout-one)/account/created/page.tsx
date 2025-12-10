import { Button } from "@/components/ui/button";
import { Link, redirect } from "@/i18n/navigation";
import { getCreatedPageSearchParamsSchema } from "@/schema";
import { CheckCircle } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import React from "react";
import { Metadata } from "next";
import { BASE_URL, GEO_POSITION, WEBSITE_NAME } from "@/config/constants";
import { routing } from "@/i18n/routing";
import { accountCreatedMetadata } from "@/seo-metadata/account-created";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ email: string; callbackUrl?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Get localized metadata
  const metadata =
    accountCreatedMetadata[
      locale as keyof typeof accountCreatedMetadata
    ] || accountCreatedMetadata.en;

  // Get the localized path for the account created page
  const createdPath = routing.pathnames["/account/created"];
  const localizedCreatedPath =
    typeof createdPath === "string"
      ? createdPath
      : createdPath[locale as keyof typeof createdPath];

  // Build canonical URL for current locale
  const canonicalUrl = `${BASE_URL}/${locale}${localizedCreatedPath}`;

  // Build alternate language URLs
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    const path =
      typeof createdPath === "string"
        ? createdPath
        : createdPath[loc as keyof typeof createdPath];

    languages[loc] = `${BASE_URL}/${loc}${path}`;
  });

  // Add x-default using default locale
  const defaultPath =
    typeof createdPath === "string"
      ? createdPath
      : createdPath[routing.defaultLocale as keyof typeof createdPath];
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
    },
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      googleBot: {
        index: false,
        follow: false,
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

const page = async (props: Props) => {
  const t = await getTranslations("accountCreatedPage");
  const schemaTranslations = await getTranslations("schemaTranslations");
  const CreatedPageSearchParamsSchema =
    getCreatedPageSearchParamsSchema(schemaTranslations);
  const headersList = await headers();
  const referer = headersList.get("referer") || "direct";
  const url = new URL(referer);
  const path = url.pathname;
  const locale = await getLocale();

  if (
    !(
      path ===
      `/${locale}${
        routing.pathnames["/register"][
          locale as keyof (typeof routing.pathnames)["/register"]
        ]
      }`
    )
  ) {
    return redirect({
      href: "/",
      locale: locale,
    });
  }

  const { email, callbackUrl } = await props.searchParams;
  const validatePageParams = CreatedPageSearchParamsSchema.safeParse({
    email,
  });
  if (!validatePageParams.success) {
    redirect({
      href: "/login",
      locale,
    });
  }

  return (
    <div className="h-screen w-full flex flex-col align-center justify-center py-24 px-6 md:px-10 container mx-auto">
      <CheckCircle className="h-10 w-10 text-green-500 animate-bounce mx-auto" />
      <div className="spacey-2 mt-5">
        <p className="text-center text-gray-600 mb-2 font-semibold text-3xl">
          {t("accountCreatedHeading")}
        </p>
        <p className="text-gray-400 font-light text-base text-center max-w-xl mx-auto">
          {t("accountCreatedDescription")}
        </p>
      </div>
      <div className="mt-5 flex justify-center w-full">
        <Button
          asChild
          className="bg-primary text-white hover:bg-primary/80 transition-colors"
        >
          <Link
            href={{
              pathname: "/account/resend-activation",
              query: {
                email,
                callbackUrl,
              },
            }}
          >
            {t("resendActivationLinkButton")}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default page;
