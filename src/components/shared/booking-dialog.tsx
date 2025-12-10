"use client";
import React, { useState, useTransition, useRef } from "react";
import { Calendar, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { ZodIssue } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { bookVisitAction } from "@/actions/book-visit";
import { BookVisitFormData, getClientBookVisitSchema } from "@/types/book-a-visit";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useTranslations } from "next-intl";

interface FormErrors {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  visit_date?: string;
  visit_time?: string;
  additional_text?: string;
  accept_terms?: string;
  source_url?: string;
}

type FormField = keyof BookVisitFormData;

const BookVisitDialog = ({
  propertyReference,
}: {
  propertyReference: string;
}) => {
  const t = useTranslations("bookVisitDialog");
  const schemaTranslation = useTranslations("bookVisitSchema");
  const bookVisitSchema = getClientBookVisitSchema(schemaTranslation);

  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const today = new Date();

  // Use useRef to capture the source URL once
  const sourceUrlRef = useRef(
    typeof window !== "undefined" ? window.location.href : ""
  );

  const [formData, setFormData] = useState<BookVisitFormData>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    visit_date: today,
    visit_time: "",
    additional_text: "",
    accept_terms: false,
    source_url: sourceUrlRef.current,
    property_reference: propertyReference,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);

  const { executeRecaptcha } = useGoogleReCaptcha();

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

  const handleInputChange = <T extends FormField>(
    field: T,
    value: BookVisitFormData[T]
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateClientForm = (): boolean => {
    const validationResult = bookVisitSchema.safeParse(formData);
    setErrors({});

    if (validationResult.success) return true;
    const newErrors: FormErrors = {};

    validationResult.error.errors.forEach((err: ZodIssue) => {
      const fieldName = err.path[0] as keyof FormErrors;
      if (fieldName && typeof fieldName === "string") {
        newErrors[fieldName] = err.message;
      }
    });
    setErrors(newErrors);
    return false;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateClientForm()) {
      toast.error(t("pleaseFixFormErrorsBeforeSubmitting"));
      return;
    }

    if (!formData.visit_date) {
      toast.error(t("pleaseSelectVisitDate"));
      return;
    }

    if (!executeRecaptcha) {
      toast(t("recaptchaErrorTitle"), {
        description: t("recaptchaErrorDescription"),
        duration: 1500,
      });
      return;
    }

    const token = await executeRecaptcha("contactForm");

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("first_name", formData.first_name);
    formDataToSubmit.append("last_name", formData.last_name);
    formDataToSubmit.append("phone", formData.phone);
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append(
      "visit_date",
      formData.visit_date.toISOString().split("T")[0]
    );
    formDataToSubmit.append("visit_time", formData.visit_time);
    formDataToSubmit.append(
      "additional_text",
      formData.additional_text as string
    );
    formDataToSubmit.append("source_url", sourceUrlRef.current);
    formDataToSubmit.append("recaptcha_token", token || "");
    formDataToSubmit.append("property_reference", propertyReference);
    formDataToSubmit.append("accept_terms", JSON.stringify(formData.accept_terms));

    startTransition(async () => {
      try {
        const result = await bookVisitAction(formDataToSubmit);

        if (result.success) {
          setSuccessMessage(result.message || t("visitBookedSuccessfully"));

          setFormData({
            first_name: "",
            last_name: "",
            phone: "",
            email: "",
            visit_date: today,
            visit_time: "",
            additional_text: "",
            accept_terms: false,
            source_url: sourceUrlRef.current,
            property_reference: propertyReference,
          });
          setErrors({});
          setIsOpen(false);
          setIsSuccessDialogOpen(true);
        } else {
          if (result.fieldErrors) {
            const newErrors: FormErrors = {};
            Object.entries(result.fieldErrors).forEach(([key, message]) => {
              const fieldName = key as keyof FormErrors;
              newErrors[fieldName] = message;
            });
            setErrors(newErrors);
          }

          if (result.errors) {
            const errorMessages = Object.entries(result.errors)
              .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
              .join("; ");
            toast.error(`${t("validationErrors")}: ${errorMessages}`);
          } else {
            toast.error(result.message || t("failedToBookVisitPleaseTryAgain"));
          }
        }
      } catch (error) {
        console.error("Submit error:", error);
        toast.error(t("unexpectedErrorPleaseTryAgain"));
      }
    });
  };

  const handleInputChangeEvent =
    (field: FormField) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      handleInputChange(
        field,
        e.target.value as BookVisitFormData[typeof field]
      );
    };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    handleInputChange("accept_terms", e.target.checked);
  };

  const handleDateSelect = (date: Date | undefined): void => {
    handleInputChange("visit_date", date || today);
    setIsDatePopoverOpen(false);
  };

  const handleTimeSelect = (value: string): void => {
    handleInputChange("visit_time", value);
  };

  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-primary text-lg px-8 py-5 text-white hover:bg-black/85 transition-all">
            {t("bookVisit")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
          <DialogHeader className="pb-5 flex-shrink-0">
            <DialogTitle>{t("bookVisit")}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4 pr-2">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="sr-only" htmlFor="first_name">
                    {t("firstName")}
                  </Label>
                  <Input
                    id="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleInputChangeEvent("first_name")}
                    placeholder={`${t("firstName")}*`}
                    className={errors.first_name ? "border-red-500" : ""}
                    disabled={isPending}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.first_name}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="sr-only" htmlFor="last_name">
                    {t("lastName")}
                  </Label>
                  <Input
                    id="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleInputChangeEvent("last_name")}
                    placeholder={`${t("lastName")}*`}
                    className={errors.last_name ? "border-red-500" : ""}
                    disabled={isPending}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.last_name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label className="sr-only" htmlFor="phone">
                  {t("phone")}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChangeEvent("phone")}
                  placeholder={`${t("phone")}*`}
                  className={errors.phone ? "border-red-500" : ""}
                  disabled={isPending}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <Label className="sr-only" htmlFor="email">
                  {t("email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChangeEvent("email")}
                  placeholder={`${t("email")}*`}
                  className={errors.email ? "border-red-500" : ""}
                  disabled={isPending}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label className="sr-only">{t("dateRequired")}</Label>
                <Popover
                  open={isDatePopoverOpen}
                  onOpenChange={setIsDatePopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !formData.visit_date ? "text-gray-500" : ""
                      } ${errors.visit_date ? "border-red-500" : ""}`}
                      disabled={isPending}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.visit_date
                        ? formData.visit_date.toLocaleDateString()
                        : t("pickADateRequired")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={formData.visit_date || undefined}
                      onSelect={handleDateSelect}
                      disabled={isDateDisabled}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.visit_date && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.visit_date}
                  </p>
                )}
              </div>

              <div>
                <Label className="sr-only" htmlFor="visit_time">
                  {t("timeRequired")}
                </Label>
                <Select
                  value={formData.visit_time}
                  onValueChange={handleTimeSelect}
                  disabled={isPending}
                >
                  <SelectTrigger
                    className={
                      errors.visit_time ? "border-red-500 w-full" : "w-full"
                    }
                  >
                    <SelectValue placeholder={t("selectATimeRequired")} />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time: string) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.visit_time && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.visit_time}
                  </p>
                )}
              </div>

              <div>
                <Label className="sr-only" htmlFor="additional_text">
                  {t("message")}
                </Label>
                <Textarea
                  id="additional_text"
                  value={formData.additional_text}
                  onChange={handleInputChangeEvent("additional_text")}
                  placeholder={t("enterAdditionalInformation")}
                  rows={3}
                  disabled={isPending}
                />
              </div>

              <div className="flex space-x-2">
                <input
                  type="checkbox"
                  id="accept_terms"
                  checked={formData.accept_terms}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isPending}
                />
                <Label
                  htmlFor="accept_terms"
                  className="text-sm text-gray-500 font-light"
                >
                  {t("authorizationText")}
                </Label>
              </div>
              {errors.accept_terms && (
                <p className="text-red-500 text-sm">{errors.accept_terms}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 flex-shrink-0 border-t mt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              {t("cancel")}
            </Button>
            <Button
              className="bg-primary text-white hover:bg-black/85 transition-all"
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? t("submitting") : t("submit")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold">
              {t("success")}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 mt-2">
              {successMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => setIsSuccessDialogOpen(false)}
              className="bg-primary hover:bg-primary/90 text-white px-8"
            >
              {t("close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookVisitDialog;