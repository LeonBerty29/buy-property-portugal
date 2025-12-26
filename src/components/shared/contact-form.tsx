"use client";
import React, { useState, useTransition, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import * as z from "zod";
import { contactFormAction } from "@/actions/contact-form";
import { getClientContactFormSchema } from "@/types/contact-form";
import { CheckCircle } from "lucide-react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { PhoneNumberInput, validatePhoneNumber } from "./phone-number-input";

interface ContactFormProps {
  theme?: "dark" | "light";
  formTitle?: boolean;
  titleStyling?: string;
  submitBtnStyling?: string;
}

export function ContactForm({
  theme = "dark",
  formTitle = true,
  titleStyling = "",
  submitBtnStyling = "",
}: ContactFormProps) {
  const t = useTranslations("contactForm");
  const translationSchema = useTranslations("contactFormSchema");
  const phoneNumberSchema = useTranslations("phoneNumberFormSchema");
  const contactFormSchema = getClientContactFormSchema(translationSchema);

  const [isPending, startTransition] = useTransition();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState<string | undefined>("");

  // Phone validation states
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);

  const { executeRecaptcha } = useGoogleReCaptcha();
  const sourceUrlRef = useRef<string>("");

  if (!sourceUrlRef.current && typeof window !== "undefined") {
    sourceUrlRef.current = window.location.href;
  }

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      message: "",
      accept_terms: false,
      source_url: sourceUrlRef.current,
    },
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof contactFormSchema>) => {
    // Validate phone number before submission
    const phoneValidation = validatePhoneNumber(phoneNumber, isPhoneValid, {
      phoneRequired: translationSchema("phoneRequired"),
      phoneInvalid: translationSchema("phoneInvalid"),
    });

    if (!phoneValidation.isValid) {
      form.setError("phone", {
        type: "manual",
        message: phoneValidation.message,
      });
      return;
    }

    values.phone = phoneNumber;

    if (!executeRecaptcha) {
      toast(`${t("recaptchaErrorTitle")}`, {
        description: `${t("recaptchaErrorDescription")}`,
        duration: 1500,
      });
      return;
    }

    setError("");

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("first_name", values.first_name);
    formDataToSubmit.append("last_name", values.last_name);
    formDataToSubmit.append("phone", values.phone);
    formDataToSubmit.append("email", values.email);
    formDataToSubmit.append("message", values.message || "");
    formDataToSubmit.append("source_url", values.source_url || "");
    formDataToSubmit.append(
      "accept_terms",
      values.accept_terms ? "true" : "false"
    );

    startTransition(async () => {
      const token = await executeRecaptcha("contactForm");
      formDataToSubmit.append("recaptcha_token", token || "");

      try {
        const result = await contactFormAction(formDataToSubmit);

        if (result.success) {
          setSuccessMessage(
            result.message || t("contactFormSubmittedSuccessfully")
          );
          setShowSuccessDialog(true);

          form.reset({
            first_name: "",
            last_name: "",
            phone: "",
            email: "",
            message: "",
            accept_terms: true,
            source_url: sourceUrlRef.current,
          });

          setPhoneNumber("");
          setIsPhoneValid(false);
        } else {
          if (result.fieldErrors) {
            Object.entries(result.fieldErrors).forEach(([key, message]) => {
              const fieldMapping: {
                [key: string]: keyof z.infer<typeof contactFormSchema>;
              } = {
                first_name: "first_name",
                last_name: "last_name",
                phone: "phone",
                email: "email",
                message: "message",
                source_url: "source_url",
                accept_terms: "accept_terms",
              };

              const clientFieldName =
                fieldMapping[key] ||
                (key as keyof z.infer<typeof contactFormSchema>);
              form.setError(clientFieldName, {
                type: "server",
                message: message,
              });
            });
          }

          if (result.errors) {
            const errorMessages = Object.entries(result.errors)
              .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
              .join("; ");
            setError(`${t("validationErrors")} ${errorMessages}`);
          } else {
            setError(result.message || t("failedToSubmitContactForm"));
          }
        }
      } catch (error) {
        console.error("Submit error:", error);
        setError(t("unexpectedError"));
      }
    });
  };

  const inputClasses =
    theme === "dark"
      ? "indent-4 bg-white text-black placeholder:text-gray-500 border-none rounded-none p-3 h-9 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 placeholder:text-sm"
      : "indent-4 bg-gray-100 text-black placeholder:text-gray-600 border-none rounded-none p-3 h-9 focus:ring-2 focus:ring-gray-400 placeholder:text-sm";

  const textareaClasses =
    theme === "dark"
      ? "indent-4 bg-white text-black placeholder:text-gray-500 border-none rounded-none p-3 h-9 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 min-h-[120px]"
      : "indent-4 bg-gray-100 text-black placeholder:text-gray-600 border-none rounded-none p-3 h-9 focus:ring-2 focus:ring-gray-400 min-h-[120px]";

  const checkboxLabelClasses =
    theme === "dark" ? "text-white text-xs" : "text-black text-xs";

  return (
    <div className="w-full">
      {formTitle && (
        <h2
          className={cn(
            "text-xl lg:text-2xl mb-6 font-semibold",
            theme === "dark" ? "text-white" : "text-black",
            titleStyling
          )}
        >
          {t("contactUs")}
        </h2>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder={t("firstNamePlaceholder")}
                      className={inputClasses}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder={t("lastNamePlaceholder")}
                      className={inputClasses}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder={t("emailAddressPlaceholder")}
                      className={inputClasses}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <PhoneNumberInput
                  field={field}
                  fieldState={fieldState}
                  disabled={isPending}
                  theme={theme}
                  onValidityChange={(isValid, number) => {
                    setIsPhoneValid(isValid);
                    setPhoneNumber(number);
                  }}
                  translations={{
                    phoneRequired: phoneNumberSchema("phoneRequired"),
                    phoneInvalid: phoneNumberSchema("phoneInvalid"),
                    invalidCountryCode: phoneNumberSchema("invalidCountryCode"),
                    tooShort: phoneNumberSchema("tooShort"),
                    tooLong: phoneNumberSchema("tooLong"),
                    invalidFormat: phoneNumberSchema("invalidFormat"),
                  }}
                />
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={t("messagePlaceholder")}
                    className={cn(textareaClasses, "w-full")}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accept_terms"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-3 mt-8">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="my-0 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    disabled={isPending}
                  />
                </FormControl>
                <label className={checkboxLabelClasses}>
                  {t("acceptTermsText")}
                </label>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <div className="flex justify-center mt-2">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <FormField
            control={form.control}
            name="source_url"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input {...field} type="hidden" />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="mt-8">
            <Button
              type="submit"
              disabled={isPending}
              className={cn(
                "bg-primary hover:bg-primary/90 text-white font-medium py-5 px-14 rounded-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                submitBtnStyling
              )}
            >
              {isPending ? t("submitting") : t("submit")}
            </Button>
          </div>
        </form>
      </Form>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold">
              {t("messageSentSuccessfully")}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 mt-2">
              {successMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="bg-primary hover:bg-primary/90 text-white px-8"
            >
              {t("close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
