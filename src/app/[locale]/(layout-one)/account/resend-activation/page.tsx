import { resendActivationLink } from "@/data/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, redirect } from "@/i18n/navigation";
import { Suspense } from "react";
import { ReloadBtn } from "@/components/shared/reload-btn";
import { getLocale, getTranslations } from "next-intl/server";
import { getResendActivatePageSearchParamsSchema } from "@/schema";
import { headers } from "next/headers";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { BASE_URL, GEO_POSITION, WEBSITE_NAME } from "@/config/constants";
import { accountResendActivationMetadata } from "@/seo-metadata/account-resend-activation";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token: string; email: string; callbackUrl: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Get localized metadata
  const metadata =
    accountResendActivationMetadata[
      locale as keyof typeof accountResendActivationMetadata
    ] || accountResendActivationMetadata.en;

  // Get the localized path for the resend activation page
  const resendActivationPath = routing.pathnames["/account/resend-activation"];
  const localizedResendActivationPath =
    typeof resendActivationPath === "string"
      ? resendActivationPath
      : resendActivationPath[locale as keyof typeof resendActivationPath];

  // Build canonical URL for current locale
  const canonicalUrl = `${BASE_URL}/${locale}${localizedResendActivationPath}`;

  // Build alternate language URLs
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    const path =
      typeof resendActivationPath === "string"
        ? resendActivationPath
        : resendActivationPath[loc as keyof typeof resendActivationPath];

    languages[loc] = `${BASE_URL}/${loc}${path}`;
  });

  // Add x-default using default locale
  const defaultPath =
    typeof resendActivationPath === "string"
      ? resendActivationPath
      : resendActivationPath[
          routing.defaultLocale as keyof typeof resendActivationPath
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

const AccountActivationPage = async (props: Props) => {
  const headersList = await headers();
  const locale = await getLocale();
  const schemaTranslations = await getTranslations("schemaTranslations");
  const ResendActivatePageSearchParamsSchema =
    getResendActivatePageSearchParamsSchema(schemaTranslations);
  const referer = headersList.get("referer") || "direct";

  const url = new URL(referer);
  const path = url.pathname;

  if (
    !(
      path ===
        `/${locale}${
          routing.pathnames["/login"][
            locale as keyof (typeof routing.pathnames)["/login"]
          ]
        }` ||
      path ===
        `/${locale}${
          routing.pathnames["/account/created"][
            locale as keyof (typeof routing.pathnames)["/account/created"]
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

  const validatePageParams = ResendActivatePageSearchParamsSchema.safeParse({
    email,
  });

  if (!validatePageParams.success) {
    redirect({
      href: "/login",
      locale,
    });
  }
  return (
    <div className="h-screen py-24 px-6 md:px-10 container flex flex-col items-center justify-center mx-auto">
      <Suspense fallback={<ActivateUserFallback />}>
        <ResendActivation email={email} callbackUrl={callbackUrl} />
      </Suspense>
    </div>
  );
};

export default AccountActivationPage;

async function ResendActivation({
  email,
  callbackUrl,
}: {
  email: string;
  callbackUrl: string;
}) {
  const t = await getTranslations("accountResendActivationPage");
  const response = await resendActivationLink(email);

  if (response.success) {
    return (
      <>
        <Dialog open={true}>
          <DialogContent
            showCloseButton={false}
            className="sm:max-w-md rounded-2xl"
          >
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <DialogTitle className="text-center text-xl font-semibold">
                {t("successTitle")}
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600 mt-2">
                {response.message || t("successMessage")}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center mt-6">
              <Button
                className="bg-primary hover:bg-primary/90 text-white px-8"
                asChild
              >
                <Link
                  href={{
                    pathname: "/login",
                    query: {
                      callbackUrl: callbackUrl,
                    },
                  }}
                >
                  {t("loginButton")}
                </Link>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  } else {
    return (
      <>
        <Dialog open={true}>
          <DialogContent
            showCloseButton={false}
            className="sm:max-w-md rounded-2xl"
          >
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-red-500" />
              </div>
              <DialogTitle className="text-center text-xl font-semibold text-red-500">
                {t("errorTitle")}
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600 mt-2">
                {response.message || t("errorMessage")}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center mt-6">
              <ReloadBtn text={t("tryAgainButton")} showHome={true} />
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

async function ActivateUserFallback() {
  const t = await getTranslations("accountResendActivationPage");
  return (
    <>
      <div className="h-full w-full flex flex-col align-center justify-center py-24 px-6 md:px-10 container mx-auto">
        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
        <div className="spacey-2 mt-6">
          <p className="text-center text-gray-600 mt-2 font-semibold text-xl">
            {t("sendingActivationEmail")}
          </p>
          <p className="text-gray-400 font-light text-sm text-center">
            {t("pleaseWaitMessage")}
          </p>
        </div>
      </div>
    </>
  );
}
