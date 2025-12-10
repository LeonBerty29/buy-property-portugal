"use client";
import React, { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { ZodError, ZodIssue } from "zod";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Link } from "@/i18n/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { ResetPasswordFormSchema } from "@/schema/schema.reset-password";
import { ResetPasswordAction } from "@/actions/reset-password";
import { PiWarningCircle } from "react-icons/pi";
import { useTranslations } from "next-intl";

// Client-side form data interface
interface FormData {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}

interface FormErrors {
  email?: string;
  message?: string;
  password?: string;
  password_confirmation?: string;
  token?: string;
}

type FormField = keyof FormData;

export const ResetPasswordForm = ({
  token,
  email,
  callbackUrl,
}: {
  token: string;
  email: string;
  callbackUrl: string;
}) => {
  const t = useTranslations("resetPasswordForm");

  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<FormData>({
    email: email,
    password: "",
    password_confirmation: "",
    token: token,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showDialogSuccessMessage, setShowSuccessDialogMessage] = useState("");
  const [responseError, setResponseError] = useState<{
    message: string;
    responseStatus: number | undefined;
  }>({
    message: "",
    responseStatus: undefined,
  });

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleInputChange = <T extends FormField>(
    field: T,
    value: FormData[T]
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateClientForm = (): boolean => {
    try {
      ResetPasswordFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      const newErrors: FormErrors = {};

      if (error instanceof ZodError) {
        error.errors.forEach((err: ZodIssue) => {
          const fieldName = err.path[0] as keyof FormErrors;
          if (fieldName && typeof fieldName === "string") {
            newErrors[fieldName] = err.message;
          }
        });
      }

      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!executeRecaptcha) {
      toast(t("recaptchaErrorTitle"), {
        description: t("recaptchaErrorDescription"),
        duration: 1500,
      });
      return;
    }

    // Client-side validation first
    if (!validateClientForm()) {
      toast.error(t("fixFormErrors"));
      return;
    }

    const formDataToSubmit = new FormData();

    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("password", formData.password);
    formDataToSubmit.append(
      "password_confirmation",
      formData.password_confirmation
    );
    formDataToSubmit.append("token", token);

    startTransition(async () => {
      const token = await executeRecaptcha("resetPasswordForm");
      formDataToSubmit.append("recaptcha_token", token || "");

      try {
        const result = await ResetPasswordAction(formDataToSubmit);

        if (result.success) {
          setShowSuccessDialogMessage(
            result.message || t("requestSubmittedSuccessfully")
          );

          // Reset form
          setFormData({
            email: "",
            password: "",
            password_confirmation: "",
            token: "",
          });
          setErrors({});
        } else {
          // Handle server validation errors
          if (result.responseStatus === 410 || result.responseStatus == 404) {
            setResponseError({
              message: result.message as string,
              responseStatus: result.responseStatus,
            });
          }

          if (result.fieldErrors) {
            const newErrors: FormErrors = {};
            Object.entries(result.fieldErrors).forEach(([key, message]) => {
              // Map server field names to client field names
              const fieldMapping: { [key: string]: keyof FormErrors } = {
                email: "email",
                message: "message",
              };

              const clientFieldName =
                fieldMapping[key] || (key as keyof FormErrors);
              newErrors[clientFieldName] = message;
            });
            setErrors(newErrors);
          }

          if (result.errors) {
            const errorMessages = Object.entries(result.errors)
              .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
              .join("; ");
            toast.error(`${t("validationErrors")} ${errorMessages}`, {
              duration: 2000,
            });
          } else {
            toast.error(result.message || t("failedSubmitRequest"));
          }
        }
      } catch (error) {
        console.error("Submit error:", error);
        toast.error(t("unexpectedError"), {
          duration: 2000,
        });
      }
    });
  };

  const handleInputChangeEvent =
    (field: FormField) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      handleInputChange(field, e.target.value as FormData[typeof field]);
    };

  return (
    <>
      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div className="border-b border-gray-200">
          <Input
            type="email"
            placeholder={t("emailPlaceholder")}
            value={formData.email}
            onChange={handleInputChangeEvent("email")}
            className={`py-5 bg-transparent border rounded-none text-gray-600 placeholder:text-gray-400 focus:!border-transparent focus-visible:ring-amber-100  ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            disabled={true}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div className="border-b border-gray-200">
          <Input
            type="password"
            placeholder={t("newPasswordPlaceholder")}
            value={formData.password}
            onChange={handleInputChangeEvent("password")}
            className={`py-5 bg-transparent border rounded-none text-gray-600 placeholder:text-gray-400 focus:!border-transparent focus-visible:ring-amber-100  ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isPending}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
        <div className="border-b border-gray-200">
          <Input
            type="password"
            placeholder={t("confirmPasswordPlaceholder")}
            value={formData.password_confirmation}
            onChange={handleInputChangeEvent("password_confirmation")}
            className={`py-5 bg-transparent border rounded-none text-gray-600 placeholder:text-gray-400 focus:!border-transparent focus-visible:ring-amber-100  ${
              errors.password_confirmation
                ? "border-red-500"
                : "border-gray-300"
            }`}
            disabled={isPending}
          />
          {errors.password_confirmation && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password_confirmation}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-4 flex-wrap !mt-8">
          <Button
            type="submit"
            className="w-fit bg-primary text-white hover:bg-primary/80 hover:text-white rounded-none transition colors"
            disabled={isPending}
          >
            <span className="">
              {isPending ? t("submitting") : t("submit")}
            </span>
          </Button>
        </div>
      </form>

      {/* Success Dialog */}
      <Dialog open={!!showDialogSuccessMessage}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-md rounded-2xl"
        >
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <DialogTitle className="text-xl text-center">
              {t("successTitle")}
            </DialogTitle>
          </DialogHeader>

          <div className="text-center space-y-4">
            <p className="text-gray-600">{showDialogSuccessMessage}</p>
          </div>

          <div className="flex gap-4 justify-center pt-4 mb-2">
            <Button className="bg-primary text-white hover:bg-black transition-colors">
              <Link href={"/"}>{t("home")}</Link>
            </Button>
            <Button
              className="bg-gray-200 text-black hover:bg-gray-300 transition-colors"
              asChild
            >
              <Link href={"/login"}>{t("login")}</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Dialog - Token expired / 410 response */}
      <Dialog
        open={
          responseError.responseStatus == 410 ||
          responseError.responseStatus === 404
        }
      >
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-md rounded-2xl"
        >
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <PiWarningCircle className="h-16 w-16 text-orange-500" />
            </div>
            <DialogTitle className="text-xl text-center">
              {t("alertTitle")}
            </DialogTitle>
          </DialogHeader>

          <div className="text-center space-y-4">
            <p className="text-gray-600">{responseError.message}</p>
          </div>

          <Link
            href={{
              pathname: "/account/forgot-password",
              query: {
                callbackUrl: callbackUrl,
              },
            }}
            className="block mx-auto text-center underline text-orange-500"
          >
            {t("requestNewResetLink")}
          </Link>

          <div className="flex gap-4 justify-center pt-4 mb-2">
            <Button className="bg-primary text-white hover:bg-black transition-colors">
              <Link href={"/"}>{t("home")}</Link>
            </Button>
            <Button
              className="bg-gray-200 text-black hover:bg-gray-300 transition-colors"
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
                {t("login")}
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};