import { getLocale, getTranslations } from "next-intl/server";
import { getResetPasswordPageSearchParamsSchema } from "@/schema";
import { redirect } from "@/i18n/navigation";
import { ResetPasswordForm } from "@/components/reset-password/reset-password-form";
import { Metadata } from "next";
import { BASE_URL, GEO_POSITION, WEBSITE_NAME } from "@/config/constants";
import { routing } from "@/i18n/routing";
import { resetPasswordMetadata } from "@/seo-metadata/reset-password";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token: string; email: string; callbackUrl: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const metadata =
    resetPasswordMetadata[locale as keyof typeof resetPasswordMetadata] ||
    resetPasswordMetadata.en;

  // Get the localized path for the reset password page
  const resetPasswordPath = routing.pathnames["/account/reset-password"];
  const localizedResetPasswordPath =
    typeof resetPasswordPath === "string"
      ? resetPasswordPath
      : resetPasswordPath[locale as keyof typeof resetPasswordPath];

  // Build canonical URL for current locale
  const canonicalUrl = `${BASE_URL}/${locale}${localizedResetPasswordPath}`;

  // Build alternate language URLs
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    const path =
      typeof resetPasswordPath === "string"
        ? resetPasswordPath
        : resetPasswordPath[loc as keyof typeof resetPasswordPath];

    languages[loc] = `${BASE_URL}/${loc}${path}`;
  });

  // Add x-default using default locale
  const defaultPath =
    typeof resetPasswordPath === "string"
      ? resetPasswordPath
      : resetPasswordPath[
          routing.defaultLocale as keyof typeof resetPasswordPath
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
      follow: true,
      noarchive: true,
      nosnippet: true,
      googleBot: {
        index: false,
        follow: true,
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

const ResetPasswordPage = async (props: Props) => {
  const { token, email, callbackUrl } = await props.searchParams;
  const locale = await getLocale();
  const t = await getTranslations("accountResetPasswordPage");
  const schemaTranslations = await getTranslations("schemaTranslations");
  const ResetPasswordPageSearchParamsSchema =
    getResetPasswordPageSearchParamsSchema(schemaTranslations);

  const validatePageParams = ResetPasswordPageSearchParamsSchema.safeParse({
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
      <div className="space-y-10 mt-5 shadow-xl p-8 rounded-3xl mx-auto border-gray-100 w-full max-w-2xl">
        <div className="">
          <p className="text-gray-600 mb-2 font-semibold text-xl">
            {t("resetPasswordHeading")}
          </p>
        </div>

        <ResetPasswordForm
          token={token}
          email={email}
          callbackUrl={callbackUrl}
        />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
