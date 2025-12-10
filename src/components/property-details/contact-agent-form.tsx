"use client";
import React, { useState, useTransition, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { ZodIssue } from "zod";
import { contactAgentAction } from "@/actions/contact-agent";
import {
  ContactAgentFormData,
  getClientContactAgentSchema,
} from "@/types/contact-agent";
import { Property } from "@/types/property";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FormErrors {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  message?: string;
  primary_contact_channel?: string;
  accept_terms?: string;
  source_url?: string;
}

type FormField = keyof ContactAgentFormData;

type ContactAgentFormProps = {
  salesConsultant: Property["sales_consultant"];
  onSuccess?: () => void;
};

const ContactAgentForm = ({
  salesConsultant,
  onSuccess,
}: ContactAgentFormProps) => {
  const t = useTranslations("contactAgentForm");
  const translationSchema = useTranslations("contactAgentSchema");
  const contactAgentSchema = getClientContactAgentSchema(translationSchema);
  const [isPending, startTransition] = useTransition();
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Use useRef to capture the source URL once
  const sourceUrlRef = useRef<string>(
    typeof window !== "undefined" ? window.location.href : ""
  );

  const [formData, setFormData] = useState<ContactAgentFormData>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    message: "",
    primary_contact_channel: "Email",
    accept_terms: false,
    source_url: sourceUrlRef.current,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const { executeRecaptcha } = useGoogleReCaptcha();

  const contactChannels = ["Email", "Phone", "Whatsapp", "SMS"];

  const handleInputChange = <T extends FormField>(
    field: T,
    value: ContactAgentFormData[T]
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
    const validationResult = contactAgentSchema.safeParse(formData);
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

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!executeRecaptcha) {
      toast(t("recaptchaError"), {
        description: t("recaptchaErrorDescription"),
        duration: 1500,
      });
      return;
    }

    if (!validateClientForm()) {
      toast.error(t("fixFormErrors"));
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("first_name", formData.first_name);
    formDataToSubmit.append("last_name", formData.last_name);
    formDataToSubmit.append("phone", formData.phone);
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("message", formData.message as string);
    formDataToSubmit.append(
      "primary_contact_channel",
      formData.primary_contact_channel as string
    );
    formDataToSubmit.append("source_url", sourceUrlRef.current);
    formDataToSubmit.append("accept_terms", formData.accept_terms.toString());

    startTransition(async () => {
      const token = await executeRecaptcha("contactAgentForm");
      formDataToSubmit.append("recaptcha_token", token || "");

      try {
        const result = await contactAgentAction(formDataToSubmit);

        if (result.success) {
          setSuccessMessage(result.message || t("submitSuccess"));

          setFormData({
            first_name: "",
            last_name: "",
            phone: "",
            email: "",
            message: "",
            primary_contact_channel: "Email",
            accept_terms: false,
            source_url: sourceUrlRef.current,
          });
          setErrors({});
          setIsSuccessDialogOpen(true);
          if (onSuccess) onSuccess();
        } else {
          if (result.fieldErrors) {
            const newErrors: FormErrors = {};
            Object.entries(result.fieldErrors).forEach(([key, message]) => {
              const fieldMapping: { [key: string]: keyof FormErrors } = {
                first_name: "first_name",
                last_name: "last_name",
                phone: "phone",
                email: "email",
                message: "message",
                primary_contact_channel: "primary_contact_channel",
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
            toast.error(`${t("validationErrorsPrefix")} ${errorMessages}`);
          } else {
            toast.error(result.message || t("submitFailed"));
          }
        }
      } catch (error) {
        console.error("Submit error:", error);
        toast.error(t("unexpectedError"));
      }
    });
  };

  const handleInputChangeEvent =
    (field: FormField) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      handleInputChange(
        field,
        e.target.value as ContactAgentFormData[typeof field]
      );
    };

  const handleCheckboxChange = (checked: boolean): void => {
    handleInputChange("accept_terms", checked);
  };

  const handleContactChannelSelect = (value: string): void => {
    handleInputChange(
      "primary_contact_channel",
      value as ContactAgentFormData["primary_contact_channel"]
    );
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
          {salesConsultant.profile_picture && (
            <Image
              src={salesConsultant.profile_picture}
              alt={salesConsultant.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">
            {salesConsultant.name}
          </h3>
          <p className="text-sm text-gray-300">{t("requestMoreInformation")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Input
              type="text"
              placeholder={t("firstNamePlaceholder")}
              value={formData.first_name}
              onChange={handleInputChangeEvent("first_name")}
              className={`bg-transparent border-0 border-b rounded-none text-white placeholder:text-white/70 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 px-0 pb-2 ${
                errors.first_name ? "border-red-500" : "border-primary"
              }`}
              disabled={isPending}
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
            )}
          </div>
          <div>
            <Input
              type="text"
              placeholder={t("lastNamePlaceholder")}
              value={formData.last_name}
              onChange={handleInputChangeEvent("last_name")}
              className={`bg-transparent border-0 border-b rounded-none text-white placeholder:text-white/70 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 px-0 pb-2 ${
                errors.last_name ? "border-red-500" : "border-primary"
              }`}
              disabled={isPending}
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
            )}
          </div>
        </div>

        <div>
          <Input
            type="tel"
            placeholder={t("phoneNumberPlaceholder")}
            value={formData.phone}
            onChange={handleInputChangeEvent("phone")}
            className={`bg-transparent border-0 border-b rounded-none text-white placeholder:text-white/70 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 px-0 pb-2 ${
              errors.phone ? "border-red-500" : "border-primary"
            }`}
            disabled={isPending}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <Input
            type="email"
            placeholder={t("emailAddressPlaceholder")}
            value={formData.email}
            onChange={handleInputChangeEvent("email")}
            className={`bg-transparent border-0 border-b rounded-none text-white placeholder:text-white/70 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 px-0 pb-2 ${
              errors.email ? "border-red-500" : "border-primary"
            }`}
            disabled={isPending}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <Textarea
            placeholder={t("messagePlaceholder")}
            rows={4}
            value={formData.message}
            onChange={handleInputChangeEvent("message")}
            className={`bg-transparent border-0 border-b rounded-none text-white placeholder:text-white/70 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 px-0 pb-2 resize-none ${
              errors.message ? "border-red-500" : "border-primary"
            }`}
            disabled={isPending}
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
        </div>

        <div>
          <Select
            value={formData.primary_contact_channel}
            onValueChange={handleContactChannelSelect}
            disabled={isPending}
          >
            <SelectTrigger
              className={`w-full bg-transparent border-0 border-b rounded-none text-white focus:border-primary focus:ring-0 focus:ring-offset-0 px-0 pb-2 [&>svg]:text-white ${
                errors.primary_contact_channel
                  ? "border-red-500"
                  : "border-primary"
              }`}
            >
              <SelectValue
                placeholder={t("primaryContactChannelPlaceholder")}
                className="text-white/70"
              />
            </SelectTrigger>
            <SelectContent className="bg-black border-primary">
              {contactChannels.map((channel) => (
                <SelectItem
                  key={channel}
                  value={channel}
                  className="text-white hover:bg-gray-800"
                >
                  {channel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.primary_contact_channel && (
            <p className="text-red-500 text-sm mt-1">
              {errors.primary_contact_channel}
            </p>
          )}
        </div>

        <div className="flex flex-col space-x-2 pt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              className="border-primary data-[state=checked]:bg-white data-[state=checked]:text-black"
              checked={formData.accept_terms}
              onCheckedChange={handleCheckboxChange}
              disabled={isPending}
            />
            <label
              htmlFor="terms"
              className="text-sm text-white/90 cursor-pointer"
            >
              {t("termsAndConditions")}
            </label>
          </div>
          {errors.accept_terms && (
            <p className="text-red-500 text-sm mt-1">{errors.accept_terms}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-white text-black hover:bg-primary hover:text-white rounded-none py-3 mt-6 relative flex items-center justify-center border border-primary"
          disabled={isPending}
        >
          <span className="absolute left-1/2 transform -translate-x-1/2 font-semibold">
            {isPending ? t("submitting") : t("requestInformation")}
          </span>
          <Send className="w-4 h-4 absolute right-4" />
        </Button>
      </form>

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
    </>
  );
};

export default ContactAgentForm;
