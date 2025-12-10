import { activateUser } from "@/data/user";
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
import { getActivatePageSearchParamsSchema } from "@/schema";
import { Metadata } from "next";
import { BASE_URL, GEO_POSITION, WEBSITE_NAME } from "@/config/constants";
import { routing } from "@/i18n/routing";
import { accountActivateMetadata } from "@/seo-metadata/account-activate-metadata";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token: string; email: string; callbackUrl: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Get localized metadata
  const metadata =
    accountActivateMetadata[
      locale as keyof typeof accountActivateMetadata
    ] || accountActivateMetadata.en;

  // Get the localized path for the activation page
  const activatePath = routing.pathnames["/account/activate"];
  const localizedActivatePath =
    typeof activatePath === "string"
      ? activatePath
      : activatePath[locale as keyof typeof activatePath];

  // Build canonical URL for current locale
  const canonicalUrl = `${BASE_URL}/${locale}${localizedActivatePath}`;

  // Build alternate language URLs
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    const path =
      typeof activatePath === "string"
        ? activatePath
        : activatePath[loc as keyof typeof activatePath];

    languages[loc] = `${BASE_URL}/${loc}${path}`;
  });

  // Add x-default using default locale
  const defaultPath =
    typeof activatePath === "string"
      ? activatePath
      : activatePath[routing.defaultLocale as keyof typeof activatePath];
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
  const { token, email, callbackUrl } = await props.searchParams;
  const locale = await getLocale();
  const schemaTranslations = await getTranslations("schemaTranslations");
  const ActivatePageSearchParamsSchema =
    getActivatePageSearchParamsSchema(schemaTranslations);

  const validatePageParams = ActivatePageSearchParamsSchema.safeParse({
    email,
    token,
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
        <ActivateUser token={token} email={email} callbackUrl={callbackUrl} />
      </Suspense>
    </div>
  );
};

export default AccountActivationPage;

async function ActivateUser({
  token,
  email,
  callbackUrl,
}: {
  token: string;
  email: string;
  callbackUrl: string;
}) {
  const t = await getTranslations("accountActivatePage");
  const response = await activateUser(token, email);

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
                {t("activationSuccessMessage")}
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
                {response.message || t("activationErrorMessage")}
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
  const t = await getTranslations("accountActivatePage");

  return (
    <>
      <div className="h-full w-full flex flex-col align-center justify-center py-24 px-6 md:px-10 container mx-auto">
        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
        <div className="spacey-2 mt-6">
          <p className="text-center text-gray-600 mt-2 font-semibold text-xl">
            {t("activatingAccountText")}
          </p>
          <p className="text-gray-400 font-light text-sm text-center">
            {t("pleaseWaitText")}
          </p>
        </div>
      </div>
    </>
  );
}
