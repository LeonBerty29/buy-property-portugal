"use client"


import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"


import { cn } from "@/lib/utils"


// Extended props interface to include customization options
interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
    checkColor?: string;
    checkIconColor?: string;
    alwaysShowCheck?: boolean;
}


const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    CheckboxProps
>(({ className, checkIconColor = "black", alwaysShowCheck = false, ...props }, ref) => {
    // Create CSS variables for custom styling
    // const customStyles = {
    //   ...(checkColor ? { "--checkbox-bg": checkColor } : {}),
    //   ...(checkIconColor ? { "--check-icon-color": checkIconColor } : {})
    // };


    // const checkIconCol = `text-${checkIconColor}`;


    return (
        <div className="relative">
            {/* Main Checkbox */}
            <CheckboxPrimitive.Root
                ref={ref}
                className={cn(
                    "peer h-4 w-4 shrink-0 rounded-sm border border-neutral-200 border-neutral-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-neutral-900 data-[state=checked]:text-neutral-50 dark:border-neutral-800 dark:border-neutral-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 dark:data-[state=checked]:bg-neutral-50 dark:data-[state=checked]:text-neutral-900",
                    className
                )}
                {...props}
            >
                {/* This indicator only shows when checked (default behavior) */}
                {!alwaysShowCheck && (
                    <CheckboxPrimitive.Indicator
                        className={cn(
                            "flex items-center justify-center",
                            checkIconColor ? "!text-[var(--check-icon-color)]" : "text-current"
                        )}
                    >
                        <Check className="h-4 w-4" />
                    </CheckboxPrimitive.Indicator>
                )}
            </CheckboxPrimitive.Root>

            {/* Always visible check icon when alwaysShowCheck is true */}
            {alwaysShowCheck && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Check
                        className={cn(
                            "h-[12px] w-[12px] mb-1 rounded-[1px]",
                            "dark:text-neutral-50"
                        )}


                        color={checkIconColor}
                    />
                </div>
            )}
        </div>
    )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName


export { Checkbox }