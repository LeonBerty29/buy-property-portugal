"use client";
import React, { useState, useTransition, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import * as z from "zod";
import { propertyFormAction } from "@/actions/property-request";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

// Mock data for property types
const mockPropertyTypes = [
  { id: "apartment", nameKey: "propertyTypeApartment" },
  { id: "house", nameKey: "propertyTypeHouse" },
  { id: "villa", nameKey: "propertyTypeVilla" },
  { id: "condo", nameKey: "propertyTypeCondo" },
  { id: "townhouse", nameKey: "propertyTypeTownhouse" },
  { id: "penthouse", nameKey: "propertyTypePenthouse" },
];

// Validation schemas for each step
const stepOneSchema = z.object({
  first_name: z.string().min(1, "firstNameRequired"),
  last_name: z.string().min(1, "lastNameRequired"),
  email: z.string().min(1, "emailRequired").email("emailInvalid"),
  phone: z.string().min(1, "phoneRequired"),
  consent: z.boolean().refine((val) => val === true, {
    message: "consentRequired",
  }),
});

// Base schema for form resolver (without refinements)
const stepTwoBaseSchema = z.object({
  property_types: z.array(z.string()).min(1, "propertyTypesRequired"),
  min_budget: z.string().min(1, "minBudgetRequired"),
  max_budget: z.string().min(1, "maxBudgetRequired"),
  location: z.string().min(1, "locationRequired"),
  min_bedrooms: z.string().min(1, "minBedroomsRequired"),
  max_bedrooms: z.string().min(1, "maxBedroomsRequired"),
  min_bathrooms: z.string().min(1, "minBathroomsRequired"),
  max_bathrooms: z.string().min(1, "maxBathroomsRequired"),
  has_pool: z.boolean(),
  has_garage: z.boolean(),
});

const stepThreeSchema = z.object({
  additional_info: z.string().optional(),
  source_url: z.string().min(1, "sourceUrlRequired"),
});

// Combined base schema for form data structure
const combinedBaseSchema = stepOneSchema
  .merge(stepTwoBaseSchema)
  .merge(stepThreeSchema);

// Validation function for min/max relationships
const validateMinMaxRelationships = (
  data: z.infer<typeof combinedBaseSchema>,
  t: (key: string) => string
) => {
  const errors: string[] = [];

  // Validate budget
  const minBudget = parseFloat(data.min_budget);
  const maxBudget = parseFloat(data.max_budget);
  if (!isNaN(minBudget) && !isNaN(maxBudget) && minBudget > maxBudget) {
    errors.push(t("budgetInvalid"));
  }

  // Validate bedrooms
  const minBedrooms = parseInt(data.min_bedrooms);
  const maxBedrooms = parseInt(data.max_bedrooms);
  if (!isNaN(minBedrooms) && !isNaN(maxBedrooms) && minBedrooms > maxBedrooms) {
    errors.push(t("bedroomsInvalid"));
  }

  // Validate bathrooms
  const minBathrooms = parseInt(data.min_bathrooms);
  const maxBathrooms = parseInt(data.max_bathrooms);
  if (
    !isNaN(minBathrooms) &&
    !isNaN(maxBathrooms) &&
    minBathrooms > maxBathrooms
  ) {
    errors.push(t("bathroomsInvalid"));
  }

  return errors;
};

type StepOneData = z.infer<typeof stepOneSchema>;
type StepTwoData = z.infer<typeof stepTwoBaseSchema>;
type StepThreeData = z.infer<typeof stepThreeSchema>;
type CombinedFormData = z.infer<typeof combinedBaseSchema>;

// Types
interface PropertyType {
  id: string;
  nameKey: string;
}

interface CheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

interface PropertyTypesProps {
  typologies: PropertyType[];
  selectedItems: string[];
  onSelectionChange: (selected: string[]) => void;
  t: (key: string) => string;
}

// Simple Checkbox component
const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked,
  onCheckedChange,
  className = "",
}) => {
  return (
    <div className="relative">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only"
      />
      <label
        htmlFor={id}
        className={`inline-flex items-center justify-center w-4 h-4 border-2 cursor-pointer transition-colors rounded-sm ${
          checked
            ? "bg-yellow-600 border-yellow-600"
            : "bg-gray-400/70 border-gray-400/70"
        } ${className}`}
      >
        {checked && (
          <svg
            className="w-3 h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </label>
    </div>
  );
};

// Property Types component
const PropertyTypes: React.FC<PropertyTypesProps> = ({
  typologies,
  selectedItems,
  onSelectionChange,
  t,
}) => {
  const handleCheckboxChange = (itemId: string, checked: boolean): void => {
    let newSelection: string[];

    if (checked) {
      newSelection = selectedItems.includes(itemId)
        ? selectedItems
        : [...selectedItems, itemId];
    } else {
      newSelection = selectedItems.filter((id) => id !== itemId);
    }

    onSelectionChange(newSelection);
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {typologies.map((typology, index) => (
        <div
          key={`${typology.id}-${index}`}
          className="flex justify-between items-center"
        >
          <div className="flex items-center space-x-3">
            <Checkbox
              id={`${typology.id}-${index}`}
              checked={selectedItems.includes(typology.id.toString())}
              onCheckedChange={(checked) =>
                handleCheckboxChange(typology.id.toString(), checked)
              }
            />
            <label
              htmlFor={`${typology.id}-${index}`}
              className={`text-sm font-normal text-neutral-500 cursor-pointer ${
                selectedItems.includes(typology.id.toString()) &&
                "font-bold text-yellow-600"
              }`}
            >
              {t(typology.nameKey)}
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

export const MultiStepPropertyForm = () => {
  const t = useTranslations("propertyRequestMultistepForm");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPending, startTransition] = useTransition();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [generalError, setGeneralError] = useState<string>("");

  const { executeRecaptcha } = useGoogleReCaptcha();

  // Capture the source URL once when component mounts
  const sourceUrlRef = useRef<string>("");
  if (!sourceUrlRef.current && typeof window !== "undefined") {
    sourceUrlRef.current = window.location.href;
  }

  const totalSteps: number = 3;

  // Form instances for each step
  const stepOneForm = useForm<StepOneData>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      consent: false,
    },
    mode: "onChange",
  });

  const stepTwoForm = useForm<StepTwoData>({
    resolver: zodResolver(stepTwoBaseSchema),
    defaultValues: {
      property_types: [],
      min_budget: "",
      max_budget: "",
      location: "",
      min_bedrooms: "",
      max_bedrooms: "",
      min_bathrooms: "",
      max_bathrooms: "",
      has_pool: false,
      has_garage: false,
    },
    mode: "onChange",
  });

  const stepThreeForm = useForm<StepThreeData>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: {
      additional_info: "",
      source_url: sourceUrlRef.current,
    },
    mode: "onChange",
  });

  const getCurrentForm = () => {
    switch (currentStep) {
      case 1:
        return stepOneForm;
      case 2:
        return stepTwoForm;
      case 3:
        return stepThreeForm;
      default:
        return stepOneForm;
    }
  };

  const canProceedToNextStep = (): boolean => {
    const form = getCurrentForm();
    return form.formState.isValid;
  };

  const nextStep = async (): Promise<void> => {
    const form = getCurrentForm();

    // Trigger validation
    const isValid = await form.trigger();

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Helper function to generate select options with disabled states
  const generateSelectOptions = (
    min: number,
    max: number,
    isMax: boolean = false,
    selectedMin?: string,
    selectedMax?: string
  ): React.JSX.Element[] => {
    const options: React.JSX.Element[] = [];
    const minValue = selectedMin ? parseInt(selectedMin) : undefined;
    const maxValue = selectedMax ? parseInt(selectedMax) : undefined;

    for (let i = min; i <= max; i++) {
      let isDisabled = false;

      if (isMax && minValue !== undefined) {
        // For max selects, disable options less than selected min
        isDisabled = i < minValue;
      } else if (!isMax && maxValue !== undefined) {
        // For min selects, disable options greater than selected max
        isDisabled = i > maxValue;
      }

      options.push(
        <option key={i} value={i.toString()} disabled={isDisabled}>
          {isMax && i === max ? `${i}+` : i}
        </option>
      );
    }
    return options;
  };

  // Watch form values for min/max validation
  const minBedrooms = stepTwoForm.watch("min_bedrooms");
  const maxBedrooms = stepTwoForm.watch("max_bedrooms");
  const minBathrooms = stepTwoForm.watch("min_bathrooms");
  const maxBathrooms = stepTwoForm.watch("max_bathrooms");
  const minBudget = stepTwoForm.watch("min_budget");
  const maxBudget = stepTwoForm.watch("max_budget");

  // Handle budget validation on change
  const handleBudgetChange = (
    field: "min_budget" | "max_budget",
    value: string
  ) => {
    stepTwoForm.setValue(field, value, { shouldValidate: true });

    // Perform manual validation for min/max relationships
    const currentValues = stepTwoForm.getValues();
    const updatedValues = { ...currentValues, [field]: value };

    // Validate budget range
    if (updatedValues.min_budget && updatedValues.max_budget) {
      const minBudget = parseFloat(updatedValues.min_budget);
      const maxBudget = parseFloat(updatedValues.max_budget);

      if (!isNaN(minBudget) && !isNaN(maxBudget)) {
        if (minBudget > maxBudget) {
          // Set errors when minimum is greater than maximum
          stepTwoForm.setError("min_budget", {
            type: "manual",
            message: "budgetInvalid",
          });
          stepTwoForm.setError("max_budget", {
            type: "manual",
            message: "budgetMaxInvalid",
          });
        } else {
          // Clear errors when the relationship is valid
          stepTwoForm.clearErrors(["min_budget", "max_budget"]);
        }
      }
    }
  };

  // Handle bedroom validation on change
  const handleBedroomChange = (
    field: "min_bedrooms" | "max_bedrooms",
    value: string
  ) => {
    stepTwoForm.setValue(field, value, { shouldValidate: true });

    const currentValues = stepTwoForm.getValues();
    const updatedValues = { ...currentValues, [field]: value };

    if (updatedValues.min_bedrooms && updatedValues.max_bedrooms) {
      const minBedrooms = parseInt(updatedValues.min_bedrooms);
      const maxBedrooms = parseInt(updatedValues.max_bedrooms);

      if (
        !isNaN(minBedrooms) &&
        !isNaN(maxBedrooms) &&
        minBedrooms > maxBedrooms
      ) {
        if (field === "min_bedrooms") {
          stepTwoForm.setError("min_bedrooms", {
            type: "manual",
            message: "bedroomsMinInvalid",
          });
        } else {
          stepTwoForm.setError("max_bedrooms", {
            type: "manual",
            message: "bedroomsMaxInvalid",
          });
        }
      } else {
        stepTwoForm.clearErrors(["min_bedrooms", "max_bedrooms"]);
      }
    }
  };

  // Handle bathroom validation on change
  const handleBathroomChange = (
    field: "min_bathrooms" | "max_bathrooms",
    value: string
  ) => {
    stepTwoForm.setValue(field, value, { shouldValidate: true });

    const currentValues = stepTwoForm.getValues();
    const updatedValues = { ...currentValues, [field]: value };

    if (updatedValues.min_bathrooms && updatedValues.max_bathrooms) {
      const minBathrooms = parseInt(updatedValues.min_bathrooms);
      const maxBathrooms = parseInt(updatedValues.max_bathrooms);

      if (
        !isNaN(minBathrooms) &&
        !isNaN(maxBathrooms) &&
        minBathrooms > maxBathrooms
      ) {
        if (field === "min_bathrooms") {
          stepTwoForm.setError("min_bathrooms", {
            type: "manual",
            message: "bathroomsMinInvalid",
          });
        } else {
          stepTwoForm.setError("max_bathrooms", {
            type: "manual",
            message: "bathroomsMaxInvalid",
          });
        }
      } else {
        stepTwoForm.clearErrors(["min_bathrooms", "max_bathrooms"]);
      }
    }
  };

  const handleFinalSubmit = async (): Promise<void> => {
    if (!executeRecaptcha) {
      toast(t("recaptchaErrorTitle"), {
        description: t("recaptchaErrorMessage"),
        duration: 1500,
      });
      return;
    }

    setGeneralError("");

    // Combine all form data
    const stepOneData = stepOneForm.getValues();
    const stepTwoData = stepTwoForm.getValues();
    const stepThreeData = stepThreeForm.getValues();

    const combinedData: CombinedFormData = {
      ...stepOneData,
      ...stepTwoData,
      ...stepThreeData,
    };

    // Validate the base schema first
    const baseValidationResult = combinedBaseSchema.safeParse(combinedData);
    if (!baseValidationResult.success) {
      setGeneralError(t("formValidationError"));
      return;
    }

    // Validate min/max relationships
    const relationshipErrors = validateMinMaxRelationships(combinedData, t);
    if (relationshipErrors.length > 0) {
      setGeneralError(relationshipErrors.join("; "));
      return;
    }

    // Create FormData for submission
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("first_name", combinedData.first_name);
    formDataToSubmit.append("last_name", combinedData.last_name);
    formDataToSubmit.append("email", combinedData.email);
    formDataToSubmit.append("phone", combinedData.phone);
    formDataToSubmit.append(
      "property_types",
      combinedData.property_types.join(",")
    );
    formDataToSubmit.append("budget_min", combinedData.min_budget);
    formDataToSubmit.append("budget_max", combinedData.max_budget);
    formDataToSubmit.append("location", combinedData.location);
    formDataToSubmit.append("bedrooms_min", combinedData.min_bedrooms);
    formDataToSubmit.append("bedrooms_max", combinedData.max_bedrooms);
    formDataToSubmit.append("bathrooms_min", combinedData.min_bathrooms);
    formDataToSubmit.append("bathrooms_max", combinedData.max_bathrooms);
    formDataToSubmit.append("with_pool", combinedData.has_pool.toString());
    formDataToSubmit.append("with_garage", combinedData.has_garage.toString());
    formDataToSubmit.append(
      "additional_text",
      combinedData.additional_info || ""
    );
    formDataToSubmit.append("source_url", combinedData.source_url);
    formDataToSubmit.append("consent", combinedData.consent.toString());

    startTransition(async () => {
      const token = await executeRecaptcha("propertyRequestForm");
      formDataToSubmit.append("recaptcha_token", token || "");

      try {
        const result = await propertyFormAction(formDataToSubmit);

        if (result.success) {
          // Show success dialog
          setSuccessMessage(result.message || t("successfulSubmissionTitle"));
          setShowSuccessDialog(true);

          // Reset all forms
          stepOneForm.reset({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            consent: false,
          });
          stepTwoForm.reset({
            property_types: [],
            min_budget: "",
            max_budget: "",
            location: "",
            min_bedrooms: "",
            max_bedrooms: "",
            min_bathrooms: "",
            max_bathrooms: "",
            has_pool: false,
            has_garage: false,
          });
          stepThreeForm.reset({
            additional_info: "",
            source_url: sourceUrlRef.current,
          });
          setCurrentStep(1);
        } else {
          // Handle server validation errors
          if (result.fieldErrors) {
            // Map server field names to client field names and set form errors
            Object.entries(result.fieldErrors).forEach(([key, message]) => {
              // Map server field names to client form fields
              const fieldMapping: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                [key: string]: { form: any; field: string };
              } = {
                first_name: { form: stepOneForm, field: "first_name" },
                last_name: { form: stepOneForm, field: "last_name" },
                email: { form: stepOneForm, field: "email" },
                phone: { form: stepOneForm, field: "phone" },
                consent: { form: stepOneForm, field: "consent" },
                property_types: { form: stepTwoForm, field: "property_types" },
                budget_min: { form: stepTwoForm, field: "min_budget" },
                budget_max: { form: stepTwoForm, field: "max_budget" },
                location: { form: stepTwoForm, field: "location" },
                bedrooms_min: { form: stepTwoForm, field: "min_bedrooms" },
                bedrooms_max: { form: stepTwoForm, field: "max_bedrooms" },
                bathrooms_min: { form: stepTwoForm, field: "min_bathrooms" },
                bathrooms_max: { form: stepTwoForm, field: "max_bathrooms" },
                additional_text: {
                  form: stepThreeForm,
                  field: "additional_info",
                },
                source_url: { form: stepThreeForm, field: "source_url" },
              };

              const mapping = fieldMapping[key];
              if (mapping) {
                mapping.form.setError(mapping.field, {
                  type: "server",
                  message: message,
                });

                // Navigate to the step containing the error
                if (
                  [
                    "first_name",
                    "last_name",
                    "email",
                    "phone",
                    "consent",
                  ].includes(key)
                ) {
                  setCurrentStep(1);
                } else if (
                  [
                    "property_types",
                    "budget_min",
                    "budget_max",
                    "location",
                    "bedrooms_min",
                    "bedrooms_max",
                    "bathrooms_min",
                    "bathrooms_max",
                  ].includes(key)
                ) {
                  setCurrentStep(2);
                } else if (["additional_text", "source_url"].includes(key)) {
                  setCurrentStep(3);
                }
              }
            });
          }

          if (result.errors) {
            // Handle detailed validation errors from API
            const errorMessages = Object.entries(result.errors)
              .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
              .join("; ");
            setGeneralError(`${t("validationErrorsPrefix")} ${errorMessages}`);
          } else {
            setGeneralError(result.message || t("submissionFailedMessage"));
          }
        }
      } catch (error) {
        console.error("Submit error:", error);
        setGeneralError(t("unexpectedErrorMessage"));
      }
    });
  };

  const StepIndicator = (): React.JSX.Element => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
              step <= currentStep
                ? "bg-yellow-600 text-white"
                : "bg-gray-300 text-gray-500"
            }`}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 mx-2 transition-all duration-300 ${
                step < currentStep ? "bg-yellow-600" : "bg-gray-300"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStepContent = (): React.JSX.Element | null | undefined => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-center text-black mb-8">
              {t("contactInfoHeading")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  {...stepOneForm.register("first_name")}
                  type="text"
                  placeholder={t("firstNamePlaceholder")}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-none text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
                {stepOneForm.formState.errors.first_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {t(
                      stepOneForm.formState.errors.first_name.message ||
                        "firstNameRequired"
                    )}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...stepOneForm.register("last_name")}
                  type="text"
                  placeholder={t("lastNamePlaceholder")}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-none text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
                {stepOneForm.formState.errors.last_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {t(
                      stepOneForm.formState.errors.last_name.message ||
                        "lastNameRequired"
                    )}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...stepOneForm.register("email")}
                  type="email"
                  placeholder={t("emailAddressPlaceholder")}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-none text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
                {stepOneForm.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {t(
                      stepOneForm.formState.errors.email.message ||
                        "emailRequired"
                    )}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...stepOneForm.register("phone")}
                  type="tel"
                  placeholder={t("phoneNumberPlaceholder")}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-none text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
                {stepOneForm.formState.errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {t(
                      stepOneForm.formState.errors.phone.message ||
                        "phoneRequired"
                    )}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <input
                {...stepOneForm.register("consent")}
                type="checkbox"
                className="text-yellow-600"
                id="consent"
              />
              <label htmlFor="consent">{t("consentLabel")}</label>
            </div>
            {stepOneForm.formState.errors.consent && (
              <p className="text-red-500 text-xs">
                {t(
                  stepOneForm.formState.errors.consent.message ||
                    "consentRequired"
                )}
              </p>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-center text-black mb-8">
              {t("propertyPreferencesHeading")}
            </h2>

            {/* Property Types */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {t("propertyTypesHeading")}
              </h3>
              <PropertyTypes
                typologies={mockPropertyTypes}
                selectedItems={stepTwoForm.watch("property_types")}
                onSelectionChange={(selected) =>
                  stepTwoForm.setValue("property_types", selected, {
                    shouldValidate: true,
                  })
                }
                t={t}
              />
              {stepTwoForm.formState.errors.property_types && (
                <p className="text-red-500 text-xs">
                  {t(
                    stepTwoForm.formState.errors.property_types.message ||
                      "propertyTypesRequired"
                  )}
                </p>
              )}
            </div>

            {/* Budget Range */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {t("budgetRangeHeading")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    placeholder={t("minBudgetPlaceholder")}
                    value={minBudget}
                    onChange={(e) =>
                      handleBudgetChange("min_budget", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-none text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  />
                  {stepTwoForm.formState.errors.min_budget && (
                    <p className="text-red-500 text-xs mt-1">
                      {t(
                        stepTwoForm.formState.errors.min_budget.message ||
                          "minBudgetRequired"
                      )}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    placeholder={t("maxBudgetPlaceholder")}
                    value={maxBudget}
                    onChange={(e) =>
                      handleBudgetChange("max_budget", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-none text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  />
                  {stepTwoForm.formState.errors.max_budget && (
                    <p className="text-red-500 text-xs mt-1">
                      {t(
                        stepTwoForm.formState.errors.max_budget.message ||
                          "maxBudgetRequired"
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <input
                {...stepTwoForm.register("location")}
                type="text"
                placeholder={t("preferredLocationPlaceholder")}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-none text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-600"
              />
              {stepTwoForm.formState.errors.location && (
                <p className="text-red-500 text-xs mt-1">
                  {t(
                    stepTwoForm.formState.errors.location.message ||
                      "locationRequired"
                  )}
                </p>
              )}
            </div>

            {/* Bedrooms */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {t("bedroomsHeading")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <select
                    value={minBedrooms}
                    onChange={(e) =>
                      handleBedroomChange("min_bedrooms", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-none text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  >
                    <option value="">{t("minBedroomsLabel")}</option>
                    {generateSelectOptions(
                      0,
                      10,
                      false,
                      undefined,
                      maxBedrooms
                    )}
                  </select>
                  {stepTwoForm.formState.errors.min_bedrooms && (
                    <p className="text-red-500 text-xs mt-1">
                      {t(
                        stepTwoForm.formState.errors.min_bedrooms.message ||
                          "minBedroomsRequired"
                      )}
                    </p>
                  )}
                </div>
                <div>
                  <select
                    value={maxBedrooms}
                    onChange={(e) =>
                      handleBedroomChange("max_bedrooms", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-none text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  >
                    <option value="">{t("maxBedroomsLabel")}</option>
                    {generateSelectOptions(0, 10, true, minBedrooms, undefined)}
                  </select>
                  {stepTwoForm.formState.errors.max_bedrooms && (
                    <p className="text-red-500 text-xs mt-1">
                      {t(
                        stepTwoForm.formState.errors.max_bedrooms.message ||
                          "maxBedroomsRequired"
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bathrooms */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {t("bathroomsHeading")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <select
                    value={minBathrooms}
                    onChange={(e) =>
                      handleBathroomChange("min_bathrooms", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-none text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  >
                    <option value="">{t("minBathroomsLabel")}</option>
                    {generateSelectOptions(
                      0,
                      10,
                      false,
                      undefined,
                      maxBathrooms
                    )}
                  </select>
                  {stepTwoForm.formState.errors.min_bathrooms && (
                    <p className="text-red-500 text-xs mt-1">
                      {t(
                        stepTwoForm.formState.errors.min_bathrooms.message ||
                          "minBathroomsRequired"
                      )}
                    </p>
                  )}
                </div>
                <div>
                  <select
                    value={maxBathrooms}
                    onChange={(e) =>
                      handleBathroomChange("max_bathrooms", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-none text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  >
                    <option value="">{t("maxBathroomsLabel")}</option>
                    {generateSelectOptions(
                      0,
                      10,
                      true,
                      minBathrooms,
                      undefined
                    )}
                  </select>
                  {stepTwoForm.formState.errors.max_bathrooms && (
                    <p className="text-red-500 text-xs mt-1">
                      {t(
                        stepTwoForm.formState.errors.max_bathrooms.message ||
                          "maxBathroomsRequired"
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {t("amenitiesHeading")}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    {...stepTwoForm.register("has_pool")}
                    type="checkbox"
                    id="hasPool"
                    className="w-4 h-4 text-yellow-600 focus:ring-yellow-600 border-gray-300 rounded"
                  />
                  <label htmlFor="hasPool" className="text-sm text-gray-700">
                    {t("hasPoolLabel")}
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    {...stepTwoForm.register("has_garage")}
                    type="checkbox"
                    id="hasGarage"
                    className="w-4 h-4 text-yellow-600 focus:ring-yellow-600 border-gray-300 rounded"
                  />
                  <label htmlFor="hasGarage" className="text-sm text-gray-700">
                    {t("hasGarageLabel")}
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-center text-black mb-8">
              {t("additionalInfoHeading")}
            </h2>
            <div className="space-y-4">
              <div>
                <textarea
                  {...stepThreeForm.register("additional_info")}
                  placeholder={t("additionalInfoPlaceholder")}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-none text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-600 resize-none"
                />
              </div>

              {/* Hidden source URL field */}
              <input {...stepThreeForm.register("source_url")} type="hidden" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="p-8">
          <h1 className="text-3xl font-semibold text-center text-black mb-10">
            {t("mainHeading")}
          </h1>

          <StepIndicator />

          <div>
            <div className="mb-8">{renderStepContent()}</div>

            {/* Show general error message */}
            {generalError && (
              <div className="flex justify-center mb-4">
                <p className="text-red-500 text-sm">{generalError}</p>
              </div>
            )}

            <div className="flex justify-between flex-wrap gap-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={isPending}
                  className="flex items-center px-6 py-3 bg-black text-white font-normal hover:bg-primary/80 transition-colors duration-200 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  {t("previousButtonText")}
                </button>
              )}

              <div className="flex-1" />

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceedToNextStep() || isPending}
                  className={`flex items-center px-8 py-3 font-semibold transition-colors duration-200 ${
                    canProceedToNextStep() && !isPending
                      ? "bg-yellow-600 text-white hover:bg-yellow-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {t("nextButtonText")}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={!canProceedToNextStep() || isPending}
                  className={`px-8 py-3 font-semibold transition-colors duration-200 ${
                    canProceedToNextStep() && !isPending
                      ? "bg-yellow-600 text-white hover:bg-yellow-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isPending
                    ? t("submittingButtonText")
                    : t("submitButtonText")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold">
              {t("successfulSubmissionTitle")}
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
              {t("closeButtonText")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
