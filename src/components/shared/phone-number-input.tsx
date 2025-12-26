"use client";
import React, { useState } from "react";
import { FormControl, FormItem, } from "@/components/ui/form";
import { ControllerRenderProps, FieldError } from "react-hook-form";
import IntlTelInput from "intl-tel-input/reactWithUtils";
import "intl-tel-input/build/css/intlTelInput.css";

interface PhoneNumberInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, any>;
  fieldState?: { error?: FieldError };
  disabled?: boolean;
  theme?: "dark" | "light";
  onValidityChange?: (isValid: boolean, phoneNumber: string) => void;
  translations?: {
    phoneRequired?: string;
    phoneInvalid?: string;
    invalidCountryCode?: string;
    tooShort?: string;
    tooLong?: string;
    invalidFormat?: string;
  };
  className?: string;
}

const ERROR_MESSAGES: { [key: number]: string } = {
  1: "invalidCountryCode",
  2: "tooShort",
  3: "tooLong",
  4: "invalidFormat",
};

export function PhoneNumberInput({
  field,
  fieldState,
  disabled = false,
  theme = "dark",
  onValidityChange,
  translations = {},
  className = "",
}: PhoneNumberInputProps) {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);
  const [phoneErrorCode, setPhoneErrorCode] = useState<number | null>(null);
  const [phoneValidationMessage, setPhoneValidationMessage] =
    useState<string>("");
  const [phoneFieldTouched, setPhoneFieldTouched] = useState<boolean>(false);

  const defaultTranslations = {
    phoneRequired: "Phone number is required",
    phoneInvalid: "Please enter a valid phone number",
    invalidCountryCode: "Invalid country code",
    tooShort: "Phone number is too short",
    tooLong: "Phone number is too long",
    invalidFormat: "Invalid phone number format",
    ...translations,
  };

  const phoneInputClasses =
    theme === "dark"
      ? "indent-4 bg-white text-black placeholder:text-gray-500 border-none rounded-none p-3 h-9 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 placeholder:text-sm w-full"
      : "indent-4 bg-gray-100 text-black placeholder:text-gray-600 border-none rounded-none p-3 h-9 focus:ring-2 focus:ring-gray-400 placeholder:text-sm w-full";

  const handleNumberChange = (number: string | undefined) => {
    const validNumber = number || "";
    setPhoneNumber(validNumber);
    field.onChange(validNumber);
  };

  const handleValidityChange = (isValid: boolean) => {
    setIsPhoneValid(isValid);
    if (onValidityChange) {
      onValidityChange(isValid, phoneNumber);
    }
  };

  const handleBlur = () => {
    setPhoneFieldTouched(true);

    if (phoneNumber && !isPhoneValid) {
      const errorKey = phoneErrorCode ? ERROR_MESSAGES[phoneErrorCode] : null;
      const message = errorKey
        ? defaultTranslations[errorKey as keyof typeof defaultTranslations] ||
          defaultTranslations.phoneInvalid
        : defaultTranslations.phoneInvalid;

      setPhoneValidationMessage(message);
    } else if (!phoneNumber || phoneNumber.trim() === "") {
      setPhoneValidationMessage(defaultTranslations.phoneRequired);
    } else {
      setPhoneValidationMessage("");
    }
  };

  const handleFocus = () => {
    if (phoneFieldTouched) {
      setPhoneValidationMessage("");
    }
  };

  return (
    <FormItem>
      <FormControl>
        <div className="relative">
          <IntlTelInput
            onChangeNumber={handleNumberChange}
            onChangeValidity={handleValidityChange}
            onChangeErrorCode={setPhoneErrorCode}
            initOptions={{
              initialCountry: "auto",
              nationalMode: true,
              separateDialCode: true,
              placeholderNumberType: "MOBILE",
              autoPlaceholder: "aggressive",
              geoIpLookup: (callback) => {
                fetch("https://ipapi.co/json")
                  .then((res) => res.json())
                  .then((data) => callback(data.country_code))
                  .catch(() => callback("us"));
              },
            }}
            inputProps={{
              className: className || phoneInputClasses,
              disabled: disabled,
              onBlur: handleBlur,
              onFocus: handleFocus,
            }}
          />
        </div>
      </FormControl>
      {(fieldState?.error || (phoneFieldTouched && phoneValidationMessage)) && (
        <p className="text-sm text-red-500 mt-1">
          {fieldState?.error?.message || phoneValidationMessage}
        </p>
      )}
    </FormItem>
  );
}

// Export validation utilities
export const validatePhoneNumber = (
  phoneNumber: string,
  isValid: boolean,
  translations?: {
    phoneRequired?: string;
    phoneInvalid?: string;
  }
) => {
  const defaultTranslations = {
    phoneRequired: "Phone number is required",
    phoneInvalid: "Please enter a valid phone number",
    ...translations,
  };

  if (!phoneNumber || phoneNumber.trim() === "") {
    return {
      isValid: false,
      message: defaultTranslations.phoneRequired,
    };
  }

  if (!isValid) {
    return {
      isValid: false,
      message: defaultTranslations.phoneInvalid,
    };
  }

  return {
    isValid: true,
    message: "",
  };
};
