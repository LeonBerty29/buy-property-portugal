"use client";
import React, { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { ZodError, ZodIssue } from "zod";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { ForgotPasswordSchema } from "@/schema/schema.forgot-password";
import { forgotPasswordAction } from "@/actions/forgot-password";
import { Link } from "@/i18n/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface FormData {
  email: string;
}

interface FormErrors {
  email?: string;
  message?: string;
}

type FormField = keyof FormData;

export const ForgotPasswordForm = () => {
  const t = useTranslations("forgotPasswordForm");
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<FormData>({
    email: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showDialogSuccessMessage, setShowSuccessDialogMessage] = useState("");

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleInputChange = <T extends FormField>(
    field: T,
    value: FormData[T]
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateClientForm = (): boolean => {
    try {
      ForgotPasswordSchema.parse(formData);
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
      toast(`${t("recaptchaErrorTitle")}`, {
        description: t("recaptchaErrorDescription"),
        duration: 1500,
      });
      return;
    }

    if (!validateClientForm()) {
      toast.error(t("toastFixFormErrorsBeforeSubmit"));
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("email", formData.email);

    startTransition(async () => {
      const token = await executeRecaptcha("forgotPasswordForm");
      formDataToSubmit.append("recaptcha_token", token || "");

      try {
        const result = await forgotPasswordAction(formDataToSubmit);

        if (result.success) {
          setShowSuccessDialogMessage(
            result.message || t("requestSubmittedSuccessfully")
          );

          setFormData({
            email: "",
          });
          setErrors({});
        } else {
          if (result.fieldErrors) {
            const newErrors: FormErrors = {};
            Object.entries(result.fieldErrors).forEach(([key, message]) => {
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
            toast.error(
              `${t("toastValidationErrorsPrefix")} ${errorMessages}`,
              {
                duration: 2000,
              }
            );
          } else {
            toast.error(result.message || t("toastFailedSubmitRetry"));
          }
        }
      } catch (error) {
        console.error("Submit error:", error);
        toast.error(t("toastUnexpectedError"), {
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-b border-gray-200 pb-10">
          <Input
            type="email"
            placeholder={t("emailPlaceholder")}
            value={formData.email}
            onChange={handleInputChangeEvent("email")}
            className={`py-5 bg-transparent border rounded-none text-gray-600 placeholder:text-gray-400 focus:!border-transparent focus-visible:ring-amber-100  ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isPending}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-4 flex-wrap">
          <Button
            type="button"
            className="w-fit bg-gray-200 text-black hover:bg-gray-300 rounded-none transition-colors"
            disabled={isPending}
            asChild
          >
            <Link href={"/login"}>{t("cancelButton")}</Link>
          </Button>
          <Button
            type="submit"
            className="w-fit bg-primary text-white hover:bg-primary/80 hover:text-white rounded-none transition colors"
            disabled={isPending}
          >
            <span>{isPending ? t("submittingButton") : t("submitButton")}</span>
          </Button>
        </div>
      </form>

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
              {t("dialogSuccessTitle")}
            </DialogTitle>
          </DialogHeader>

          <div className="text-center space-y-4">
            <p className="text-gray-600">{showDialogSuccessMessage}</p>
          </div>

          <div className="flex gap-4 justify-center pt-4 mb-2">
            <Button className="bg-primary text-white hover:bg-black transition-colors">
              <Link href={"/"}>{t("homeButton")}</Link>
            </Button>
            <Button
              className="bg-gray-200 text-black hover:bg-gray-300 transition-colors"
              asChild
            >
              <Link href={"/login"}>{t("loginButton")}</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
