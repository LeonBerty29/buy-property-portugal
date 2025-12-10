// "use client";
// import { useState, useRef, useEffect } from "react";
// import { getCurrencySymbol, PriceFormat } from "../shared/price-format";

// interface RangeSliderProps {
//   min?: number;
//   max?: number;
//   defaultValue?: [number, number];
//   value?: [number, number]; // Add controlled value prop
//   step?: number;
//   label?: string;
//   valueLabelDisplay?: "on" | "off";
//   onChange?: ((values: [number, number]) => void) | null;
//   className?: string;
//   currency?: string;
//   customSymbol?: string;
// }

// export const RangeSlider: React.FC<RangeSliderProps> = ({
//   min = 0,
//   max = 100,
//   defaultValue = [2000, 80000],
//   value, // Accept controlled value
//   step = 1,
//   label = "",
//   valueLabelDisplay = "on",
//   onChange = null,
//   className = "",
//   currency = "USD",
//   customSymbol,
// }) => {

//   // console.log("Rendering <RangeSlider/>")
//   const [values, setValues] = useState<[number, number]>(value || defaultValue);
//   const [inputValues, setInputValues] = useState<[string, string]>(["", ""]);
//   const [isEditing, setIsEditing] = useState<[boolean, boolean]>([
//     false,
//     false,
//   ]);
//   const [isDragging, setIsDragging] = useState<boolean>(false);
//   const [activeThumb, setActiveThumb] = useState<number>(0);
//   const trackRef = useRef<HTMLDivElement>(null);

//   // Sync with controlled value prop
//   useEffect(() => {
//     if (value) {
//       setValues(value);
//     }
//   }, [value]);

//   useEffect(() => {
//     setValues(defaultValue);
//   }, [defaultValue]);

//   // Format number to display format (e.g., 50000 -> "50k")
//   const formatDisplayValue = (value: number): string => {
//     if (value >= 1000000) {
//       return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`;
//     } else if (value >= 1000) {
//       return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
//     }
//     return value.toString();
//   };

//   // Parse display format back to number (e.g., "50k" -> 50000)
//   const parseDisplayValue = (value: string): number => {
//     const cleanValue = value.replace(/[^\d.kKmM]/g, "");
//     const numValue = parseFloat(cleanValue);

//     if (cleanValue.toLowerCase().includes("k")) {
//       return Math.round(numValue * 1000);
//     } else if (cleanValue.toLowerCase().includes("m")) {
//       return Math.round(numValue * 1000000);
//     }
//     return Math.round(numValue) || 0;
//   };

//   // Update input display values when slider values change and not editing
//   useEffect(() => {
//     if (!isEditing[0] && !isEditing[1]) {
//       setInputValues([
//         formatDisplayValue(values[0]),
//         formatDisplayValue(values[1]),
//       ]);
//     }
//   }, [values[0], values[1], isEditing[0], isEditing[1]]);

//   // Initialize input values on mount
//   useEffect(() => {
//     setInputValues([
//       formatDisplayValue(values[0]),
//       formatDisplayValue(values[1]),
//     ]);
//   }, []);

//   // Calculate thumb position based on value
//   const getThumbPosition = (index: number): string => {
//     const percentage = ((values[index] - min) / (max - min)) * 100;
//     return `${percentage}%`;
//   };

//   // Validate and update values ensuring min <= max
//   const updateValues = (newValues: [number, number]): void => {
//     let [val1, val2] = newValues;

//     // Ensure both values are within bounds
//     val1 = Math.min(max, Math.max(min, val1));
//     val2 = Math.min(max, Math.max(min, val2));

//     // Swap if needed to maintain min <= max order
//     if (val1 > val2) {
//       [val1, val2] = [val2, val1];
//     }

//     const validatedValues: [number, number] = [val1, val2];

//     // Only update internal state if not controlled
//     if (!value) {
//       setValues(validatedValues);
//     }

//     if (onChange) onChange(validatedValues);
//   };

//   // Handle input field focus (switch to numeric editing mode)
//   const handleInputFocus = (index: number): void => {
//     const newIsEditing: [boolean, boolean] = [...isEditing];
//     newIsEditing[index] = true;
//     setIsEditing(newIsEditing);

//     const newInputValues: [string, string] = [...inputValues];
//     newInputValues[index] = values[index].toString();
//     setInputValues(newInputValues);
//   };

//   // Handle input field changes
//   const handleInputChange = (index: number, value: string): void => {
//     const newInputValues: [string, string] = [...inputValues];
//     newInputValues[index] = value;
//     setInputValues(newInputValues);
//   };

//   // Handle input field blur (when user finishes editing)
//   const handleInputBlur = (index: number): void => {
//     const newIsEditing: [boolean, boolean] = [...isEditing];
//     newIsEditing[index] = false;
//     setIsEditing(newIsEditing);

//     const numValue = parseDisplayValue(inputValues[index]);
//     const newValues: [number, number] = [...values];
//     newValues[index] = numValue;
//     updateValues(newValues);
//   };

//   // Handle Enter key in input fields
//   const handleInputKeyPress = (
//     e: React.KeyboardEvent<HTMLInputElement>,
//     index: number
//   ): void => {
//     if (e.key === "Enter") {
//       handleInputBlur(index);
//       e.currentTarget.blur();
//     }
//   };

//   // Handle scroll wheel on input fields
//   const handleInputWheel = (
//     e: React.WheelEvent<HTMLInputElement>,
//     index: number
//   ): void => {
//     e.preventDefault();
//     const currentValue = values[index];
//     const delta = e.deltaY > 0 ? -step : step;
//     const newValue = Math.min(max, Math.max(min, currentValue + delta));

//     const newValues: [number, number] = [...values];
//     newValues[index] = newValue;
//     updateValues(newValues);

//     // Update input value if in editing mode
//     if (isEditing[index]) {
//       const newInputValues: [string, string] = [...inputValues];
//       newInputValues[index] = newValue.toString();
//       setInputValues(newInputValues);
//     }
//   };

//   // Handle click on track to update nearest thumb
//   const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>): void => {
//     if (!trackRef.current) return;

//     const rect = trackRef.current.getBoundingClientRect();
//     const percentage = (e.clientX - rect.left) / rect.width;
//     const rawValue = percentage * (max - min) + min;
//     const newValue = Math.min(
//       max,
//       Math.max(min, Math.round(rawValue / step) * step)
//     );

//     // Find the closest thumb and update its value
//     const thumb0Distance = Math.abs(values[0] - newValue);
//     const thumb1Distance = Math.abs(values[1] - newValue);

//     const newValues: [number, number] = [...values];

//     if (thumb0Distance <= thumb1Distance) {
//       newValues[0] = newValue;
//     } else {
//       newValues[1] = newValue;
//     }

//     updateValues(newValues);
//   };

//   // Handle thumb drag operation
//   const handleThumbMouseDown = (
//     e: React.MouseEvent<HTMLDivElement>,
//     index: number
//   ): void => {
//     e.stopPropagation();
//     setIsDragging(true);
//     setActiveThumb(index);

//     const handleMouseMove = (e: MouseEvent): void => {
//       if (!trackRef.current) return;

//       const rect = trackRef.current.getBoundingClientRect();
//       const percentage = Math.min(
//         1,
//         Math.max(0, (e.clientX - rect.left) / rect.width)
//       );
//       const rawValue = percentage * (max - min) + min;
//       const newValue = Math.min(
//         max,
//         Math.max(min, Math.round(rawValue / step) * step)
//       );

//       const newValues: [number, number] = [...values];
//       newValues[index] = newValue;
//       updateValues(newValues);
//     };

//     const handleMouseUp = (): void => {
//       setIsDragging(false);
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     };

//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);
//   };

//   return (
//     <div className={`w-full ${className}`}>
//       {label && (
//         <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
//       )}
//       <div
//         className="relative pt-6 pb-6 cursor-pointer"
//         onClick={handleTrackClick}
//         ref={trackRef}
//       >
//         {/* Track background */}
//         <div className="w-full h-1 bg-gray-200 rounded-full shadow-inner">
//           {/* Colored rail */}
//           <div
//             className="absolute h-1 bg-black rounded-full"
//             style={{
//               left: getThumbPosition(0),
//               width: `calc(${getThumbPosition(1)} - ${getThumbPosition(0)})`,
//             }}
//           />
//         </div>

//         {/* Left Thumb (Min Price) */}
//         <div
//           className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-md border border-gray-200 cursor-grab ${
//             isDragging && activeThumb === 0
//               ? "ring-2 ring-blue-300 cursor-grabbing"
//               : ""
//           }`}
//           style={{ left: getThumbPosition(0) }}
//           onMouseDown={(e) => handleThumbMouseDown(e, 0)}
//         >
//           {valueLabelDisplay === "on" && (
//             <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded flex items-center gap-[2px] font-medium">
//               <PriceFormat
//                 amount={values[0]}
//                 currency={currency}
//                 className="font-normal text-xs"
//                 customSymbol={customSymbol}
//               />
//             </span>
//           )}
//         </div>

//         {/* Right Thumb (Max Price) */}
//         <div
//           className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-md border border-gray-200 cursor-grab ${
//             isDragging && activeThumb === 1
//               ? "ring-2 ring-blue-300 cursor-grabbing"
//               : ""
//           }`}
//           style={{ left: getThumbPosition(1) }}
//           onMouseDown={(e) => handleThumbMouseDown(e, 1)}
//         >
//           {valueLabelDisplay === "on" && (
//             <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded flex items-center gap-[2px] font-medium">
//               <PriceFormat
//                 amount={values[1]}
//                 currency={currency}
//                 className="font-normal text-xs"
//                 customSymbol={customSymbol}
//               />
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Input Fields */}
//       <div className="mt-6 flex items-center justify-center gap-4">
//         <div className="flex items-center">
//           <input
//             type="text"
//             value={inputValues[0]}
//             onChange={(e) => handleInputChange(0, e.target.value)}
//             onFocus={() => handleInputFocus(0)}
//             onBlur={() => handleInputBlur(0)}
//             onKeyPress={(e) => handleInputKeyPress(e, 0)}
//             onWheel={(e) => handleInputWheel(e, 0)}
//             className="w-20 px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
//             min={min}
//             max={max}
//           />
//           <span className="ml-2 text-sm text-gray-500">
//             {customSymbol || getCurrencySymbol(currency)}
//           </span>
//         </div>

//         <span className="text-gray-400">—</span>

//         <div className="flex items-center">
//           <input
//             type="text"
//             value={inputValues[1]}
//             onChange={(e) => handleInputChange(1, e.target.value)}
//             onFocus={() => handleInputFocus(1)}
//             onBlur={() => handleInputBlur(1)}
//             onKeyPress={(e) => handleInputKeyPress(e, 1)}
//             onWheel={(e) => handleInputWheel(e, 1)}
//             className="w-20 px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
//             min={min}
//             max={max}
//           />
//           <span className="ml-2 text-sm text-gray-500">
//             {customSymbol || getCurrencySymbol(currency)}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };
