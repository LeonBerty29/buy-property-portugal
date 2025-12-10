// "use client";
// import { useState, useEffect, useRef } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { RangeSlider } from "./slider-range";
// import { Ranges } from "@/types/property";
// import { AREA_SLIDER_STEP } from "@/config/constants";

// export function AreaSlider({ areaRange }: { areaRange: Ranges["private_area"] }) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const previousValuesRef = useRef<[number, number] | undefined>(undefined);

//   const [sliderValues, setSliderValues] = useState<[number, number]>(() => {
//     const minArea = searchParams.get("min_area");
//     const maxArea = searchParams.get("max_area");

//     return [
//       minArea ? parseInt(minArea) : areaRange.min,
//       maxArea ? parseInt(maxArea) : areaRange.max, // This is correct - initial max value
//     ];
//   });

//   const handleChange = (newValues: [number, number]): void => {
//     setSliderValues(newValues);
//   };

//   // Debounced URL update
//   useEffect(() => {
//     const updateURL = (newValues: [number, number]) => {
//       const params = new URLSearchParams(searchParams.toString());

//       // Only set params if they're different from defaults
//       if (newValues[0] !== areaRange.min) {
//         params.set("min_area", newValues[0].toString());
//       } else {
//         params.delete("min_area");
//       }

//       // FIXED: Compare against the initial default value, not areaRange.max
//       if (newValues[1] !== areaRange.max) {
//         params.set("max_area", newValues[1].toString());
//       } else {
//         params.delete("max_area");
//       }

//       // Only reset to first page when area VALUES actually change
//       const previousValues = previousValuesRef.current;
//       const valuesChanged =
//         !previousValues ||
//         previousValues[0] !== newValues[0] ||
//         previousValues[1] !== newValues[1];

//       if (valuesChanged && previousValues) {
//         params.delete("page");
//       }

//       // Update the ref with current values
//       previousValuesRef.current = newValues;

//       router.push(`?${params.toString()}`, { scroll: false });
//     };

//     const timeoutId = setTimeout(() => {
//       updateURL(sliderValues);
//     }, 500);

//     return () => clearTimeout(timeoutId);
//   }, [sliderValues, searchParams, router, areaRange.min, areaRange.max]);

//   // Sync with URL params when they change externally
//   useEffect(() => {
//     const minArea = searchParams.get("min_area");
//     const maxArea = searchParams.get("max_area");

//     const newValues: [number, number] = [
//       minArea ? parseInt(minArea) : areaRange.min,
//       maxArea ? parseInt(maxArea) : areaRange.max // FIXED: Use initial default value
//     ];

//     // Only update state if values actually changed
//     if (newValues[0] !== sliderValues[0] || newValues[1] !== sliderValues[1]) {
//       setSliderValues(newValues);
//     }
//   }, [searchParams, areaRange.min]); // Added areaRange.min to dependencies

//   return (
//     <div className="max-w-md mx-auto p-4">
//       <RangeSlider
//         defaultValue={sliderValues}
//         valueLabelDisplay="on"
//         label="Area Range"
//         onChange={handleChange}
//         min={areaRange.min}
//         max={areaRange.max} // This is correct - the slider can go up to areaRange.max
//         step={AREA_SLIDER_STEP}
//         customSymbol="m²"
//       />
//     </div>
//   );
// }
