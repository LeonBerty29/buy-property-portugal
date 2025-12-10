import { cn } from "@/lib/utils";
import React from "react";

// Function to get currency symbol from currency code
const getCurrencySymbol = (currencyCode = "USD") => {
  // Create a formatter just to extract the symbol
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
  });

  // Extract just the symbol
  const parts = formatter.formatToParts(0);
  // console.log({ parts })
  const currencySymbol =
    parts.find((part) => part.type === "currency")?.value || "$";

  return currencySymbol;
};

// Function to format just the amount with compact notation
const getFormattedAmount = (amount: number, options = {}) => {
  return new Number(amount).toLocaleString("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    notation: "compact",
    compactDisplay: "short",
    ...options,
  });
};

interface Props {
  amount: number;
  className?: string;
  currency?: string;
  amountStyle?: string;
  showSymbol?: boolean;
  showOnlySymbol?: boolean;
  showOnlyAmount?: boolean;
  formatAmount?: boolean;
  customSymbol?: string;
}

const PriceFormat = ({
  amount,
  className,
  currency = "USD",
  customSymbol,
  amountStyle,
  // showSymbol = true,
  showOnlySymbol = false,
  showOnlyAmount = false,
  formatAmount = true,
}: Props) => {
  const currencySymbol = getCurrencySymbol(currency);
  const formattedAmount = getFormattedAmount(amount);
  const formattedAmountTwo = new Number(amount).toLocaleString("en-US", {
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

  // console.log({ currencySymbol })
  // console.log({ formattedAmount })

  // If only showing the symbol
  if (showOnlySymbol) {
    return (
      <span className={cn("text-base font-semibold", className)}>
        {currencySymbol}
      </span>
    );
  }

  // If only showing the amount (no currency symbol)
  if (showOnlyAmount) {
    return (
      <span className={cn("text-base font-semibold", className)}>
        {formattedAmount}
      </span>
    );
  }

  // Format the full price (with or without the currency symbol)
  // const FormattedPrice = new Number(amount).toLocaleString('en-US', {
  //     style: showSymbol ? 'currency' : 'decimal',
  //     currency: currency,
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 1,
  //     notation: 'compact',
  //     compactDisplay: "short"
  // });

  return (
    <span
      className={cn(
        "text-base font-semibold flex items-center gap-[1px]",
        className
      )}
    >
      <span>{!customSymbol && currencySymbol}</span>{" "}
      <span className={cn(amountStyle)}>
        {formatAmount ? formattedAmount : formattedAmountTwo}
      </span>
      {/* <span>{customSymbol}</span> */}
    </span>
  );
};

// Export both the component and the utility functions
export { getCurrencySymbol, getFormattedAmount, PriceFormat };
