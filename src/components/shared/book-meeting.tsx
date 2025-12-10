"use client";
import React, { useState, useTransition, useEffect } from "react";
import { Calendar, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { ZodIssue } from "zod";
import {
  Dialog,
  DialogContent,
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
import { bookMeetingAction } from "@/actions/book-meeting";
import {
  ClientBookMeetingFormData,
  getClientBookMeetingSchema,
} from "@/types/book-a-meeting";
import { cn } from "@/lib/utils";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useTranslations } from "next-intl";

interface FormErrors {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  meeting_date?: string;
  meeting_time?: string;
  meeting_location?: string;
  additional_text?: string;
  meeting_type?: string;
  accept_terms?: string;
  source_url?: string;
}

type FormField = keyof ClientBookMeetingFormData;

const BookMeetingDialog = ({ buttonStyle }: { buttonStyle?: string }) => {
  const t = useTranslations("bookMeeting");
  const clientBookingSchemaJson = useTranslations("clientBookMeetingSchema");
  const clientBookMeetingSchema = getClientBookMeetingSchema(
    clientBookingSchemaJson
  );
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Separate state for meeting type selection (onsite/virtual)
  const [meetingTypeSelection, setMeetingTypeSelection] = useState<
    "onsite" | "virtual" | ""
  >("");

  const [formData, setFormData] = useState<ClientBookMeetingFormData>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    meeting_date: undefined,
    meeting_time: "",
    additional_text: "",
    meeting_type: "",
    meeting_location: "",
    accept_terms: false,
    source_url: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFormData((prev) => ({
        ...prev,
        source_url: window.location.href,
      }));
    }
  }, []);

  const timeSlots: string[] = [
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const onsiteLocations: string[] = [
    "Vilamoura office",
    "Lagoa (carvoeiro) office",
    "Lagos office",
  ];

  const virtualPlatforms: string[] = ["Google meet", "Zoom"];

  const handleInputChange = <T extends FormField>(
    field: T,
    value: ClientBookMeetingFormData[T]
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
    const validationResult = clientBookMeetingSchema.safeParse(formData);
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
      toast.error(t("pleaseFixFormErrors"));
      return;
    }
    if (!executeRecaptcha) {
      toast(t("recaptchaNotAvailable"), { duration: 1500 });
      return;
    }

    const token = await executeRecaptcha("contactForm");
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("first_name", formData.first_name);
    formDataToSubmit.append("last_name", formData.last_name);
    formDataToSubmit.append("phone", formData.phone);
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append(
      "meeting_date",
      formData.meeting_date?.toISOString().split("T")[0] || ""
    );
    formDataToSubmit.append("meeting_time", formData.meeting_time);
    formDataToSubmit.append(
      "additional_text",
      formData.additional_text as string
    );
    formDataToSubmit.append("source_url", formData.source_url as string);
    formDataToSubmit.append("meeting_type", formData.meeting_type);
    formDataToSubmit.append("meeting_location", formData.meeting_location);
    formDataToSubmit.append("recaptcha_token", token || "");
    formDataToSubmit.append("accept_terms", formData.accept_terms.toString());

    startTransition(async () => {
      try {
        const result = await bookMeetingAction(formDataToSubmit);
        if (result.success) {
          setSuccessMessage(result.message || t("meetingBookedSuccessfully"));
          setFormData({
            first_name: "",
            last_name: "",
            phone: "",
            email: "",
            meeting_date: undefined,
            meeting_time: "",
            meeting_type: "",
            meeting_location: "",
            additional_text: "",
            accept_terms: false,
            source_url: formData.source_url,
          });
          setMeetingTypeSelection("onsite");
          setErrors({});
          setIsOpen(false);
          setShowSuccessDialog(true);
        } else {
          if (result.fieldErrors) {
            const newErrors: FormErrors = {};
            Object.entries(result.fieldErrors).forEach(([key, message]) => {
              const fieldMapping: { [key: string]: keyof FormErrors } = {
                first_name: "first_name",
                last_name: "last_name",
                phone: "phone",
                email: "email",
                meeting_date: "meeting_date",
                meeting_time: "meeting_time",
                meeting_type: "meeting_type",
                additional_text: "additional_text",
                source_url: "source_url",
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
            toast.error(`${t("validationErrors")}: ${errorMessages}`);
          } else {
            toast.error(result.message || t("failedToBookMeeting"));
          }
        }
      } catch (error) {
        console.error("Submit error:", error);
        toast.error(t("unexpectedErrorTryAgain"));
      }
    });
  };

  const handleInputChangeEvent =
    (field: FormField) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      handleInputChange(
        field,
        e.target.value as ClientBookMeetingFormData[typeof field]
      );
    };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    handleInputChange("accept_terms", e.target.checked);
  };

  const handleDateSelect = (date: Date | undefined): void => {
    handleInputChange("meeting_date", date || undefined);
    setIsDatePopoverOpen(false);
  };

  const handleTimeSelect = (value: string): void => {
    handleInputChange("meeting_time", value);
  };

  const handleMeetingTypeChange = (type: "onsite" | "virtual"): void => {
    setMeetingTypeSelection(type);
    // Reset meeting_type when switching
    handleInputChange("meeting_type", type);
  };

  const handleMeetingLocationSelect = (value: string): void => {
    handleInputChange("meeting_location", value);
  };

  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div>
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <DialogTitle className="text-xl text-center">
              {t("meetingBookedSuccessfullyTitle")}
            </DialogTitle>
          </DialogHeader>

          <div className="text-center space-y-4">
            <p className="text-gray-600">{successMessage}</p>
            <p className="text-sm text-gray-500">{t("weWillGetBack")}</p>
          </div>

          <div className="flex justify-center pt-4 mb-2">
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="bg-primary text-white hover:bg-black transition-colors"
            >
              {t("close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "rounded-none border-gray-300 bg-transparent hover:bg-gray-50 text-sm font-light",
              buttonStyle
            )}
          >
            {t("bookAMeeting")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
          <DialogHeader className="pb-5 flex-shrink-0">
            <DialogTitle>{t("bookAMeetingTitle")}</DialogTitle>
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
                    placeholder={t("firstNamePlaceholder")}
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
                    placeholder={t("lastNamePlaceholder")}
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
                  placeholder={t("phonePlaceholder")}
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
                  placeholder={t("emailPlaceholder")}
                  className={errors.email ? "border-red-500" : ""}
                  disabled={isPending}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label className="sr-only">{t("date")}</Label>
                <Popover
                  open={isDatePopoverOpen}
                  onOpenChange={setIsDatePopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !formData.meeting_date ? "text-gray-500" : ""
                      } ${errors.meeting_date ? "border-red-500" : ""}`}
                      disabled={isPending}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.meeting_date
                        ? formData.meeting_date.toLocaleDateString()
                        : t("pickADate")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={formData.meeting_date || undefined}
                      onSelect={handleDateSelect}
                      disabled={isDateDisabled}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.meeting_date && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.meeting_date}
                  </p>
                )}
              </div>

              <div>
                <Label className="sr-only" htmlFor="time">
                  {t("time")}
                </Label>
                <Select
                  value={formData.meeting_time}
                  onValueChange={handleTimeSelect}
                  disabled={isPending}
                >
                  <SelectTrigger
                    className={
                      errors.meeting_time ? "border-red-500 w-full" : "w-full"
                    }
                  >
                    <SelectValue placeholder={t("selectATime")} />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time: string) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.meeting_time && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.meeting_time}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">
                  {t("meetingType")}
                </Label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="meetingType"
                      value="onsite"
                      checked={meetingTypeSelection === "onsite"}
                      onChange={() => handleMeetingTypeChange("onsite")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={isPending}
                    />
                    <span className="text-sm">{t("onSiteMeeting")}</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="meetingType"
                      value="virtual"
                      checked={meetingTypeSelection === "virtual"}
                      onChange={() => handleMeetingTypeChange("virtual")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={isPending}
                    />
                    <span className="text-sm">{t("virtualMeeting")}</span>
                  </label>
                </div>
                {errors.meeting_type && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.meeting_type}
                  </p>
                )}
              </div>

              {meetingTypeSelection === "onsite" && (
                <div>
                  <Label className="sr-only" htmlFor="onsiteLocation">
                    {t("officeLocation")}
                  </Label>
                  <Select
                    value={onsiteLocations.includes(formData.meeting_location) ? formData.meeting_location : ""}
                    onValueChange={handleMeetingLocationSelect}
                    disabled={isPending}
                  >
                    <SelectTrigger
                      className={
                        errors.meeting_location ? "border-red-500 w-full" : "w-full"
                      }
                    >
                      <SelectValue placeholder={t("selectOfficeLocation")} />
                    </SelectTrigger>
                    <SelectContent>
                      {onsiteLocations.map((location: string) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.meeting_type && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.meeting_location}
                    </p>
                  )}
                </div>
              )}

              {meetingTypeSelection === "virtual" && (
                <div>
                  <Label className="sr-only" htmlFor="virtualPlatform">
                    {t("virtualPlatform")}
                  </Label>
                  <Select
                    value={virtualPlatforms.includes(formData.meeting_location) ? formData.meeting_location : ""}
                    onValueChange={handleMeetingLocationSelect}
                    disabled={isPending}
                  >
                    <SelectTrigger
                      className={
                        errors.meeting_type ? "border-red-500 w-full" : "w-full"
                      }
                    >
                      <SelectValue placeholder={t("selectVirtualPlatform")} />
                    </SelectTrigger>
                    <SelectContent>
                      {virtualPlatforms.map((platform: string) => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.meeting_type && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.meeting_type}
                    </p>
                  )}
                </div>
              )}

              <div>
                <Label className="sr-only" htmlFor="message">
                  {t("message")}
                </Label>
                <Textarea
                  id="message"
                  value={formData.additional_text}
                  onChange={handleInputChangeEvent("additional_text")}
                  placeholder={t("additionalInfoPlaceholder")}
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
                  {t("dataUseAuthorization")}
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
    </div>
  );
};

export default BookMeetingDialog;
