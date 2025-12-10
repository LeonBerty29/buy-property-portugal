"use client";
import React, { useState, useTransition, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { newsletterFormAction } from "@/actions/newsletter";
import { CheckCircle } from "lucide-react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { getNewsletterFormSchema } from "@/types/newsletter";

interface NewsletterFormProps {
  className?: string;
}

export function NewsletterForm({ className = "" }: NewsletterFormProps) {
  const t = useTranslations("newsletterForm");
  const newsletterFormSchemaTranslation = useTranslations("newsletterFormSchema");
  const newsletterFormSchema = getNewsletterFormSchema(newsletterFormSchemaTranslation);
  const [isPending, startTransition] = useTransition();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState<string | undefined>("");

  const { executeRecaptcha } = useGoogleReCaptcha();

  const source_urlRef = useRef<string>("");

  if (!source_urlRef.current && typeof window !== "undefined") {
    source_urlRef.current = window.location.href;
  }

  const form = useForm<z.infer<typeof newsletterFormSchema>>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      email: "",
      source_url: source_urlRef.current,
    },
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof newsletterFormSchema>) => {
    if (!executeRecaptcha) {
      toast(t("toastReCaptchaError"), {
        description: t("toastReCaptchaDescription"),
        duration: 1500,
      });
      return;
    }

    setError("");

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("email", values.email);
    formDataToSubmit.append("source_url", values.source_url || "");

    startTransition(async () => {
      const token = await executeRecaptcha("contactForm");
      formDataToSubmit.append("recaptcha_token", token || "");
      try {
        const result = await newsletterFormAction(formDataToSubmit);

        if (result.success) {
          setSuccessMessage(result.message || t("successDialogTitle"));
          setShowSuccessDialog(true);

          form.reset({
            email: "",
            source_url: source_urlRef.current,
          });
        } else {
          if (result.fieldErrors) {
            Object.entries(result.fieldErrors).forEach(([key, message]) => {
              const fieldMapping: {
                [key: string]: keyof z.infer<typeof newsletterFormSchema>;
              } = {
                email: "email",
                source_url: "source_url",
              };

              const clientFieldName =
                fieldMapping[key] ||
                (key as keyof z.infer<typeof newsletterFormSchema>);
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
            setError(errorMessages);
          } else {
            setError(result.message || t("errorFailedSubscribe"));
          }
        }
      } catch (error) {
        console.error("Submit error:", error);
        setError(t("errorUnexpected"));
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && form.formState.isValid && !isPending) {
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex max-w-lg mx-auto items-stretch">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      className="indent-4 h-12 rounded-none bg-black text-white placeholder:text-gray-400 border-none placeholder:text-xs"
                      onKeyDown={handleKeyDown}
                      disabled={isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary hover:bg-primary/90 rounded-none text-white px-6 h-12 flex items-center justify-center"
            >
              {isPending ? t("buttonSubscribing") : t("buttonSubscribe")}
            </Button>
          </div>

          <div className="max-w-lg mx-auto">
            <FormField
              control={form.control}
              name="email"
              render={() => (
                <FormItem>
                  <div className="flex mt-2">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          {error && (
            <div className="flex mt-2">
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
        </form>
      </Form>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold">
              {t("successDialogTitle")}
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
              {t("buttonClose")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
