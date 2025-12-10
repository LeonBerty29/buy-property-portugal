"use client";
import React, { useState, useTransition, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { PartnershipRequestFormAction } from "@/actions/partnership-requests";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { getPartnershipFormSchema } from "@/types/partnership-request";

export function PartnershipRequestForm() {
  const t = useTranslations("partnershipRequestForm");
  const partnershipSchemaTranslation = useTranslations("partnershipFormSchema")
  const PartnershipFormSchema = getPartnershipFormSchema(partnershipSchemaTranslation)

  const [isPending, startTransition] = useTransition();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);

  const { executeRecaptcha } = useGoogleReCaptcha();

  // Capture the source URL once when component mounts
  const sourceUrlRef = useRef<string>("");

  // Initialize sourceUrl on first render
  if (!sourceUrlRef.current && typeof window !== "undefined") {
    sourceUrlRef.current = window.location.href;
  }

  const timeSlots: string[] = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const form = useForm<z.infer<typeof PartnershipFormSchema>>({
    resolver: zodResolver(PartnershipFormSchema),
    defaultValues: {
      company_name: "",
      company_email: "",
      company_phone: "",
      contact_person: "",
      client_first_name: "",
      client_last_name: "",
      partial_client_email: "",
      partial_client_phone: "",
      interested_property: "",
      remarks: "",
      confirmed_visit_date: undefined,
      confirmed_visit_time: "",
      accept_terms: false,
      source_url: sourceUrlRef.current,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof PartnershipFormSchema>) => {
    if (!executeRecaptcha) {
      toast(t("recaptchaError"), {
        description: t("recaptchaErrorDescription"),
        duration: 1500,
      });
      return;
    }

    setError("");
    setHasAttemptedSubmit(true);

    // Manually trigger validation to show all errors
    form.trigger();

    // Check if form is valid before proceeding
    if (!form.formState.isValid) {
      setError(t("pleaseFillAllRequiredFieldsCorrectly"));
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("company_name", values.company_name);
    formDataToSubmit.append("company_email", values.company_email);
    formDataToSubmit.append("company_phone", values.company_phone);
    formDataToSubmit.append("contact_person", values.contact_person);
    formDataToSubmit.append("client_first_name", values.client_first_name);
    formDataToSubmit.append("client_last_name", values.client_last_name);
    formDataToSubmit.append(
      "partial_client_email",
      values.partial_client_email
    );
    formDataToSubmit.append(
      "partial_client_phone",
      values.partial_client_phone
    );
    formDataToSubmit.append(
      "interested_property",
      values.interested_property || ""
    );
    formDataToSubmit.append("remarks", values.remarks || "");

    // Format date as YYYY-MM-DD if provided
    if (values.confirmed_visit_date) {
      formDataToSubmit.append(
        "confirmed_visit_date",
        values.confirmed_visit_date.toISOString().split("T")[0]
      );
    }

    formDataToSubmit.append(
      "confirmed_visit_time",
      values.confirmed_visit_time || ""
    );
    formDataToSubmit.append("source_url", values.source_url || "");
    formDataToSubmit.append("accept_terms", JSON.stringify(values.accept_terms) );

    startTransition(async () => {
      const token = await executeRecaptcha("partnershipRequest");
      formDataToSubmit.append("recaptcha_token", token || "");

      try {
        const result = await PartnershipRequestFormAction(formDataToSubmit);

        if (result.success) {
          // Show success dialog
          setSuccessMessage(
            result.message || t("partnershipRequestSubmittedSuccessfully")
          );
          setShowSuccessDialog(true);

          // Reset form but keep sourceUrl
          form.reset({
            company_name: "",
            company_email: "",
            company_phone: "",
            contact_person: "",
            client_first_name: "",
            client_last_name: "",
            partial_client_email: "",
            partial_client_phone: "",
            interested_property: "",
            remarks: "",
            confirmed_visit_date: undefined,
            confirmed_visit_time: "",
            accept_terms: false,
            source_url: sourceUrlRef.current,
          });

          // Reset the attempted submit flag
          setHasAttemptedSubmit(false);
        } else {
          // Handle server validation errors
          if (result.fieldErrors) {
            Object.entries(result.fieldErrors).forEach(([key, message]) => {
              const fieldMapping: {
                [key: string]: keyof z.infer<typeof PartnershipFormSchema>;
              } = {
                company_name: "company_name",
                company_email: "company_email",
                company_phone: "company_phone",
                contact_person: "contact_person",
                client_first_name: "client_first_name",
                client_last_name: "client_last_name",
                partial_client_email: "partial_client_email",
                partial_client_phone: "partial_client_phone",
                interested_property: "interested_property",
                remarks: "remarks",
                confirmed_visit_date: "confirmed_visit_date",
                confirmed_visit_time: "confirmed_visit_time",
                source_url: "source_url",
              };

              const clientFieldName =
                fieldMapping[key] ||
                (key as keyof z.infer<typeof PartnershipFormSchema>);
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
            setError(`${t("validationErrors")}: ${errorMessages}`);
          } else {
            setError(result.message || t("failedToSubmitPartnershipRequest"));
          }
        }
      } catch (error) {
        console.error("Submit error:", error);
        setError(t("unexpectedErrorOccurred"));
      }
    });
  };

  // Custom submit handler that doesn't rely on form validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formValues = form.getValues();
    onSubmit(formValues);
  };

  const handleDateSelect = (date: Date | undefined): void => {
    form.setValue("confirmed_visit_date", date || undefined);
    setIsDatePopoverOpen(false);
  };

  const handleTimeSelect = (value: string): void => {
    form.setValue("confirmed_visit_time", value);
  };

  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company Information - 2 column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder={t("companyName")}
                      className="indent-4 bg-gray-100 text-black placeholder:text-gray-600 border-none rounded-none py-5 focus:ring-2 focus:ring-gray-400 placeholder:text-sm"
                      disabled={isPending}
                    />
                  </FormControl>
                  {(hasAttemptedSubmit ||
                    form.formState.touchedFields.company_name) && (
                    <FormMessage />
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company_email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder={t("companyEmail")}
                      className="indent-4 bg-gray-100 text-black placeholder:text-gray-600 border-none rounded-none py-5 focus:ring-2 focus:ring-gray-400 placeholder:text-sm"
                      disabled={isPending}
                    />
                  </FormControl>
                  {(hasAttemptedSubmit ||
                    form.formState.touchedFields.company_email) && (
                    <FormMessage />
                  )}
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="company_phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder={t("companyPhone")}
                      className="indent-4 bg-gray-100 text-black placeholder:text-gray-600 border-none rounded-none py-5 focus:ring-2 focus:ring-gray-400 placeholder:text-sm"
                      disabled={isPending}
                    />
                  </FormControl>
                  {(hasAttemptedSubmit ||
                    form.formState.touchedFields.company_phone) && (
                    <FormMessage />
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_person"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder={t("contactPerson")}
                      className="indent-4 bg-gray-100 text-black placeholder:text-gray-600 border-none rounded-none py-5 focus:ring-2 focus:ring-gray-400 placeholder:text-sm"
                      disabled={isPending}
                    />
                  </FormControl>
                  {(hasAttemptedSubmit ||
                    form.formState.touchedFields.contact_person) && (
                    <FormMessage />
                  )}
                </FormItem>
              )}
            />
          </div>

          {/* Client Details Section */}
          <h3 className="text-black text-lg font-semibold mb-4 mt-6">
            {t("clientDetails")}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="client_first_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder={t("clientFirstName")}
                      className="indent-4 bg-gray-100 text-black placeholder:text-gray-600 border-none rounded-none py-5 focus:ring-2 focus:ring-gray-400 placeholder:text-sm"
                      disabled={isPending}
                    />
                  </FormControl>
                  {(hasAttemptedSubmit ||
                    form.formState.touchedFields.client_first_name) && (
                    <FormMessage />
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="client_last_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder={t("clientLastName")}
                      className="indent-4 bg-gray-100 text-black placeholder:text-gray-600 border-none rounded-none py-5 focus:ring-2 focus:ring-gray-400 placeholder:text-sm"
                      disabled={isPending}
                    />
                  </FormControl>
                  {(hasAttemptedSubmit ||
                    form.formState.touchedFields.client_last_name) && (
                    <FormMessage />
                  )}
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="partial_client_email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder={t("partialClientEmail")}
                      className="indent-4 bg-gray-100 text-black placeholder:text-gray-600 border-none rounded-none py-5 focus:ring-2 focus:ring-gray-400 placeholder:text-sm"
                      disabled={isPending}
                    />
                  </FormControl>
                  {(hasAttemptedSubmit ||
                    form.formState.touchedFields.partial_client_email) && (
                    <FormMessage />
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="partial_client_phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder={t("partialClientPhone")}
                      className="indent-4 bg-gray-100 text-black placeholder:text-gray-600 border-none rounded-none py-5 focus:ring-2 focus:ring-gray-400 placeholder:text-sm"
                      disabled={isPending}
                    />
                  </FormControl>
                  {(hasAttemptedSubmit ||
                    form.formState.touchedFields.partial_client_phone) && (
                    <FormMessage />
                  )}
                </FormItem>
              )}
            />
          </div>

          {/* Property Interest Textarea */}
          <FormField
            control={form.control}
            name="interested_property"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={t("interestedProperty")}
                    className="indent-4 bg-gray-100 text-black placeholder:text-gray-600 border-none rounded-none py-5 focus:ring-2 focus:ring-gray-400 min-h-[120px] w-full"
                    disabled={isPending}
                  />
                </FormControl>
                {(hasAttemptedSubmit ||
                  form.formState.touchedFields.interested_property) && (
                  <FormMessage />
                )}
              </FormItem>
            )}
          />

          {/* Remarks Textarea */}
          <FormField
            control={form.control}
            name="remarks"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={t("remarks")}
                    className="indent-4 bg-gray-100 text-black placeholder:text-gray-600 border-none rounded-none py-5 focus:ring-2 focus:ring-gray-400 min-h-[120px] w-full"
                    disabled={isPending}
                  />
                </FormControl>
                {(hasAttemptedSubmit ||
                  form.formState.touchedFields.remarks) && <FormMessage />}
              </FormItem>
            )}
          />

          {/* Visit Date and Time Section */}
          <h3 className="text-black text-lg font-semibold mb-4 mt-6">
            {t("confirmedVisitOptional")}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="confirmed_visit_date"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Popover
                      open={isDatePopoverOpen}
                      onOpenChange={setIsDatePopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal indent-4 bg-gray-100 text-black placeholder:text-gray-600 border-none rounded-none py-5 focus:ring-2 focus:ring-gray-400 ${
                            !field.value ? "text-gray-600" : "text-black"
                          }`}
                          disabled={isPending}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {field.value
                            ? field.value.toLocaleDateString()
                            : t("confirmedVisitDate")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={handleDateSelect}
                          disabled={isDateDisabled}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  {(hasAttemptedSubmit ||
                    form.formState.touchedFields.confirmed_visit_date) && (
                    <FormMessage />
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmed_visit_time"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={handleTimeSelect}
                      disabled={isPending}
                    >
                      <SelectTrigger className="w-full indent-4 bg-gray-100 text-black placeholder:text-gray-600 border-none rounded-none py-5 focus:ring-2 focus:ring-gray-400">
                        <SelectValue placeholder={t("confirmedVisitTime")} />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time: string) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {(hasAttemptedSubmit ||
                    form.formState.touchedFields.confirmed_visit_time) && (
                    <FormMessage />
                  )}
                </FormItem>
              )}
            />
          </div>

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
                <label className="text-black text-xs">
                  {t("acceptTermsText")}
                </label>
                {(hasAttemptedSubmit ||
                  form.formState.touchedFields.accept_terms) && <FormMessage />}
              </FormItem>
            )}
          />

          {/* Show general error message */}
          {error && (
            <div className="flex justify-center mt-2">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

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

          <div className="mt-8">
            <Button
              type="submit"
              disabled={isPending}
              className={cn(
                "bg-primary hover:bg-primary/90 text-white font-medium py-5 px-14 rounded-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isPending ? t("submitting") : t("submit")}
            </Button>
          </div>
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
              {t("partnershipRequestSubmittedTitle")}
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
