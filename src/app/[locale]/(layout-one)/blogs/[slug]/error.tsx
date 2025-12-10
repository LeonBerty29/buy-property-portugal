"use client";

import { useEffect, useTransition } from "react";
import { useTranslations } from "next-intl";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations("blogDetailsErrorPage");

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Page error:", error);
  }, [error]);

  const [pending, startTransition] = useTransition();
  
    const resetFn = () => {
      startTransition(() => {
        reset();
      });
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full rounded-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 
                1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 
                0L3.732 16.5c-.77.833.192 2.5 
                1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t("somethingWentWrong")}
          </h1>
          <p className="text-gray-600 mb-6">{t("errorDescription")}</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={resetFn}
            className="w-full bg-primary hover:bg-black/85 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            disabled={pending}
          >
            {t("tryAgain")}
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {t("goHome")}
          </button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              {t("errorDetailsDevOnly")}
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto text-red-600">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}