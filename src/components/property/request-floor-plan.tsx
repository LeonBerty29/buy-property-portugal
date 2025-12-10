"use client";
import React, { useState, useTransition, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import * as z from "zod";
import { CheckCircle, NotebookPen } from "lucide-react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { getRequestFloorPlanSchema } from "@/types/schema.request-floor-plan";
import { requestFloorPlanAction } from "@/actions/request-floor-plan-action";

export const RequestFloorPlan = ({
  propertyReference,
}: {
  propertyReference: string;
}) => {
  const t = useTranslations("RequestFloorPlanForm");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            className="text-sm font-semibold rounded-none bg-primary text-white !px-6 hover:text-white hover:bg-primary/80 transition-colors"
          >
            <NotebookPen className="h-3 w-3" />
            {t("buttonRequestFloorPlan")}
          </Button>
        </DialogTrigger>
        <DialogContent
          showCloseButton={true}
          closeButtonStyles="bg-white"
          className="border-primary overflow-y-auto sm:max-w-sm max-h-[90vh]"
        >
          <div>
            <DialogHeader>
              <DialogTitle className="font-medium my-5 leading-relaxed">
                {t("headingSendFloorPlan")}
              </DialogTitle>
            </DialogHeader>
            <div className="px-2 py-4">
              <RequestFloorPlanForm propertyReference={propertyReference} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

function RequestFloorPlanForm({
  propertyReference,
}: {
  propertyReference: string;
}) {
  const t = useTranslations("RequestFloorPlanForm");
  const requestFloorPlanSchemaTranslation = useTranslations(
    "requestFloorPlanSchema"
  );
  const FloorPlanSchema = getRequestFloorPlanSchema(
    requestFloorPlanSchemaTranslation
  );
  const [isPending, startTransition] = useTransition();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const { executeRecaptcha } = useGoogleReCaptcha();

  const sourceUrlRef = useRef<string>("");

  if (!sourceUrlRef.current && typeof window !== "undefined") {
    sourceUrlRef.current = window.location.href;
  }

  const form = useForm<z.infer<typeof FloorPlanSchema>>({
    resolver: zodResolver(FloorPlanSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    },
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof FloorPlanSchema>) => {
    if (!executeRecaptcha) {
      toast(t("toastReCaptchaError"), {
        description: t("toastReCaptchaUnavailable"),
        duration: 1500,
      });
      return;
    }

    setError("");

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("first_name", values.first_name);
    formDataToSubmit.append("last_name", values.last_name);
    formDataToSubmit.append("email", values.email);
    formDataToSubmit.append("phone", values.phone!);
    formDataToSubmit.append("property_reference", propertyReference);
    formDataToSubmit.append("source_url", sourceUrlRef.current);

    startTransition(async () => {
      const token = await executeRecaptcha("requestFloorPlan");
      formDataToSubmit.append("recaptcha_token", token || "");

      try {
        const result = await requestFloorPlanAction(formDataToSubmit);

        if (result.success) {
          setSuccessMessage(result.message || t("successTitle"));
          setShowSuccessDialog(true);

          form.reset({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
          });
        } else {
          if (result.fieldErrors) {
            Object.entries(result.fieldErrors).forEach(([key, message]) => {
              const fieldMapping: {
                [key: string]: keyof z.infer<typeof FloorPlanSchema>;
              } = {
                first_name: "first_name",
                last_name: "last_name",
                email: "email",
                phone: "phone",
              };

              const clientFieldName =
                fieldMapping[key] ||
                (key as keyof z.infer<typeof FloorPlanSchema>);
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
            setError(result.message || t("errorFailedSend"));
          }
        }
      } catch (e) {
        console.error("Submit error:", e);
        setError(t("errorUnexpected"));
      }
    });
  };

  return (
    <div className="w-full max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    className="indent-4 bg-gray-200 placeholder:text-gray-600 border-none rounded-none py-5 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary/80 placeholder:text-sm"
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
                    className="indent-4 bg-gray-200 placeholder:text-gray-600 border-none rounded-none py-5 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary/80 placeholder:text-sm"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    className="indent-4 bg-gray-200 placeholder:text-gray-600 border-none rounded-none py-5 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary/80 placeholder:text-sm"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder={t("placeholderPhone")}
                    className="indent-4 bg-gray-200 placeholder:text-gray-600 border-none rounded-none py-5 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary/80 placeholder:text-sm"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="additional_text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={t("placeholderAdditionalText")}
                    className="indent-4 bg-gray-200 placeholder:text-gray-600 border-none rounded-none py-5 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary/80 min-h-[120px]"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <Button
            type="submit"
            disabled={isPending}
            className={cn(
              "bg-primary hover:bg-primary/90 text-white font-medium py-5 px-8 rounded-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {t("buttonSend")}
          </Button>

          {error && (
            <div className="flex justify-center mt-2">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
        </form>
      </Form>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold">
              {t("successTitle")}
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
