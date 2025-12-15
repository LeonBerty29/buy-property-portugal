"use client";

import { pathData } from "@/lib/data";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "@/i18n/navigation";

export default function MapSelection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  // Function to get custom district name positions
  const getDistrictNamePosition = (districtName: string, pathD: string) => {
    // Calculate the center of bounding box as fallback
    const numbers = pathD.match(/[\d.]+/g)?.map(Number) || [];
    if (numbers.length < 2) return { x: 0, y: 0 };

    const xCoords = numbers.filter((_, i) => i % 2 === 0);
    const yCoords = numbers.filter((_, i) => i % 2 === 1);

    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const minY = Math.min(...yCoords);
    const maxY = Math.max(...yCoords);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // Custom positions for specific districts
    // Adjust these offset values based on your map's needs
    const customPositions: {
      [key: string]: {
        offsetX?: number;
        offsetY?: number;
        positionY?: "top" | "bottom" | "center";
        positionX?: "left" | "right" | "center";
      };
    } = {
      "Viana do Castelo": { positionX: "left", offsetX: -10, positionY: "center", offsetY: -2 },
      Braga: { positionY: "center", positionX: "left", offsetX: -2 },
      Porto: { positionY: "center", positionX: "left", offsetX: -1 },
      "Vila Real": { positionY: "center" },
      Bragança: { positionY: "center", positionX: "right", offsetX: -1 },
      Aveiro: {
        positionX: "left",
        offsetX: -3,
        positionY: "center",
        offsetY: 3,
      },
      Viseu: { positionY: "center" },
      Guarda: { positionX: "right", offsetX: -3, positionY: "center" },
      Coimbra: { positionY: "center" },
      "Castelo Branco": {
        positionX: "right",
        offsetX: -3,
        positionY: "bottom",
        offsetY: -10,
      },
      Leiria: { positionY: "top", offsetY: 5 },
      Santarém: { positionY: "bottom", offsetY: -10 },
      Portalegre: {
        positionX: "right",
        offsetX: -3,
        positionY: "top",
        offsetY: 18,
      },
      Lisboa: { positionX: "left", offsetX: -3, positionY: "center" },
      Setúbal: { positionY: "bottom", offsetY: -10 },
      Évora: { positionY: "center" },
      Beja: { positionY: "center" },
      Faro: { positionY: "bottom", offsetY: -4 },
    };

    const config = customPositions[districtName] || {
      positionY: "center",
      positionX: "center",
    };
    let x = centerX;
    let y = centerY;

    // Apply X-axis position-based adjustments
    if (config.positionX === "left") {
      x = minX + 10 + (config.offsetX || 0);
    } else if (config.positionX === "right") {
      x = maxX - 10 + (config.offsetX || 0);
    } else {
      x = centerX + (config.offsetX || 0);
    }

    // Apply Y-axis position-based adjustments
    if (config.positionY === "top") {
      y = minY + 10 + (config.offsetY || 0);
    } else if (config.positionY === "bottom") {
      y = maxY - 10 + (config.offsetY || 0);
    } else {
      y = centerY + (config.offsetY || 0);
    }

    return { x, y };
  };

  useEffect(() => {
    const districtParam = searchParams.get("search");
    if (districtParam) {
      const districtsArray = districtParam.split(",").filter(Boolean);
      setSelectedDistricts(districtsArray);
    } else {
      setSelectedDistricts([]);
    }
  }, [searchParams]);

  const handleDistrictClick = (districtName: string) => {
    let newSelectedDistricts: string[];

    if (selectedDistricts.includes(districtName)) {
      newSelectedDistricts = selectedDistricts.filter(
        (name) => name !== districtName
      );
    } else {
      newSelectedDistricts = [...selectedDistricts, districtName];
    }

    if (newSelectedDistricts.length > 0) {
      router.push({
        pathname: `/properties`,
        query: {
          search: newSelectedDistricts.join(","),
        },
      });
    } else {
      router.push(`/properties`);
    }
  };

  const getDistrictStyle = (district: (typeof pathData)[0]) => {
    const isSelected = selectedDistricts.includes(district.name);
    const isHovered = hoveredDistrict === district.name;

    return {
      fill: district.fill,
      stroke: isSelected ? "#64b7bc" : isHovered ? "#64b7bc" : district.stroke,
      strokeWidth: isSelected ? 3 : isHovered ? 2.5 : district.strokeWidth,
      cursor: "pointer",
      transition: "all 0.2s ease",
      filter: isSelected ? "brightness(1.1)" : "none",
      opacity: isSelected || isHovered ? 1 : 0.8,
    };
  };

  const clearAllSelections = () => {
    router.push(`/properties`);
  };

  return (
    <div className="bg-white rounded-2xl p-4 border">
      <div className="relative">
        <TooltipProvider delayDuration={200}>
          <svg
            viewBox="0 0 180 366"
            className="w-full h-auto"
            style={{ minHeight: "180px", maxHeight: "466px" }}
          >
            <defs>
              <filter id="shadow">
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="3"
                  floodOpacity="0.3"
                />
              </filter>
              <filter id="selected-glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Render all paths first */}
            {pathData.map((district) => {
              const isSelected = selectedDistricts.includes(district.name);

              return (
                <Tooltip
                  key={district.name}
                  open={hoveredDistrict === district.name}
                >
                  <TooltipTrigger asChild>
                    <path
                      d={district.d}
                      style={getDistrictStyle(district)}
                      onMouseEnter={() => setHoveredDistrict(district.name)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                      onClick={() => handleDistrictClick(district.name)}
                      filter={
                        isSelected ? "url(#selected-glow)" : "url(#shadow)"
                      }
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">{district.name}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}

            {/* Render all text labels on top */}
            {pathData.map((district) => {
              const isSelected = selectedDistricts.includes(district.name);
              const labelPos = getDistrictNamePosition(
                district.name,
                district.d
              );

              return (
                <text
                  key={`label-${district.name}`}
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  className="text-[8px] font-normal pointer-events-none select-none"
                  fill={
                    isSelected || hoveredDistrict === district.name
                      ? "#ffffff"
                      : "#1e293b"
                  }
                  style={{
                    textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                    fontWeight: isSelected ? "bold" : "700",
                    letterSpacing: "0.5px",
                  }}
                >
                  {district.name}
                </text>
              );
            })}
          </svg>
        </TooltipProvider>
      </div>

      {selectedDistricts.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 mb-3">
                {selectedDistricts.length} District
                {selectedDistricts.length > 1 ? "s" : ""} Selected
              </p>
              <div className="flex flex-wrap gap-1">
                {selectedDistricts.map((districtName) => {
                  const district = pathData.find(
                    (d) => d.name === districtName
                  );
                  return (
                    <span
                      key={districtName}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-md text-xs font-medium text-slate-700 border border-slate-200"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: district?.fill }}
                      />
                      {districtName}
                    </span>
                  );
                })}
              </div>
            </div>
            <button
              onClick={clearAllSelections}
              className="ml-2 px-3 py-1.5 text-xs font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded-md transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {selectedDistricts.length > 0 && (
        <div className="mt-4 text-xs text-slate-500 text-center">
          💡 Tip: Click on districts to add or remove from your selection
        </div>
      )}
    </div>
  );
}
