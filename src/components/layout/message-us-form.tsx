"use client";
import React, { useState, useTransition, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { messageFormAction } from "@/actions/message-us";
import { CheckCircle } from "lucide-react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { getMessageFormSchema } from "@/types/message-us";

export function MessageForm() {
  const t = useTranslations("messageUsForm");
  const messageFormSchemaTranslation = useTranslations("messageFormSchema");
  const messageFormSchema = getMessageFormSchema(messageFormSchemaTranslation);
  const [isPending, startTransition] = useTransition();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const { executeRecaptcha } = useGoogleReCaptcha();

  // Capture the source URL once when component mounts
  const sourceUrlRef = useRef<string>("");

  // Initialize source_url on first render
  if (!sourceUrlRef.current && typeof window !== "undefined") {
    sourceUrlRef.current = window.location.href;
  }

  const form = useForm<z.infer<typeof messageFormSchema>>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      message: "",
      source_url: sourceUrlRef.current,
    },
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof messageFormSchema>) => {
    if (!executeRecaptcha) {
      toast(`${t("toastReCaptchaErrorTitle")}`, {
        description: t("toastReCaptchaErrorDescription"),
        duration: 1500,
      });
      return;
    }

    setError("");

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("first_name", values.first_name);
    formDataToSubmit.append("last_name", values.last_name);
    formDataToSubmit.append("email", values.email);
    formDataToSubmit.append("message", values.message);
    formDataToSubmit.append("source_url", values.source_url || "");

    startTransition(async () => {
      const token = await executeRecaptcha("messageUsForm");
      formDataToSubmit.append("recaptcha_token", token || "");

      try {
        const result = await messageFormAction(formDataToSubmit);

        if (result.success) {
          // Show success dialog
          setSuccessMessage(result.message || t("successMessageDefault"));
          setShowSuccessDialog(true);

          // Reset form but keep sourceUrl
          form.reset({
            first_name: "",
            last_name: "",
            email: "",
            message: "",
            source_url: sourceUrlRef.current,
          });
        } else {
          // Handle server validation errors
          if (result.fieldErrors) {
            Object.entries(result.fieldErrors).forEach(([key, message]) => {
              const fieldMapping: {
                [key: string]: keyof z.infer<typeof messageFormSchema>;
              } = {
                first_name: "first_name",
                last_name: "last_name",
                email: "email",
                message: "message",
                source_url: "source_url",
              };

              const clientFieldName =
                fieldMapping[key] ||
                (key as keyof z.infer<typeof messageFormSchema>);
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
            setError(`${t("errorValidationPrefix")} ${errorMessages}`);
          } else {
            setError(result.message || t("errorMessageGeneric"));
          }
        }
      } catch (error) {
        console.error("Submit error:", error);
        setError(t("errorMessageUnexpected"));
      }
    });
  };

  return (
    <div className="w-full max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name and Last Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder={t("placeholderFirstName")}
                      className="indent-4 bg-black text-white placeholder:text-gray-400 border-none rounded-none py-5 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black placeholder:text-sm"
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
                      placeholder={t("placeholderLastName")}
                      className="indent-4 bg-black text-white placeholder:text-gray-400 border-none rounded-none py-5 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black placeholder:text-sm"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder={t("placeholderEmail")}
                    className="indent-4 bg-black text-white placeholder:text-gray-400 border-none rounded-none py-5 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black placeholder:text-sm"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Message Textarea */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={t("placeholderMessage")}
                    className="indent-4 bg-black text-white placeholder:text-gray-400 border-none rounded-none py-5 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black min-h-[120px]"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hidden sourceUrl field */}
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

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending}
            className={cn(
              "bg-primary hover:bg-primary/90 text-white font-medium py-5 px-8 rounded-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isPending ? t("buttonSending") : t("buttonSendMessage")}
          </Button>

          {/* Show general error message */}
          {error && (
            <div className="flex justify-center mt-2">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
        </form>
      </Form>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold">
              {t("dialogTitleSuccess")}
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
