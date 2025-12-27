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
  const [selectedDistrictIds, setSelectedDistrictIds] = useState<number[]>([]);
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
    const customPositions: {
      [key: string]: {
        offsetX?: number;
        offsetY?: number;
        positionY?: "top" | "bottom" | "center";
        positionX?: "left" | "right" | "center";
      };
    } = {
      "Viana do Castelo": {
        positionX: "left",
        offsetX: -10,
        positionY: "center",
        offsetY: -2,
      },
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
      Madeira: {
        positionY: "top",
        positionX: "left",
        offsetY: -2,
        offsetX: -4,
      },
      Açores: {
        positionY: "bottom",
        positionX: "center",
        offsetY: 0,
      },
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
    const districtParam = searchParams.get("district");
    if (districtParam) {
      const districtIdsArray = districtParam
        .split(",")
        .filter(Boolean)
        .map(Number)
        .filter((id) => !isNaN(id));
      setSelectedDistrictIds(districtIdsArray);
    } else {
      setSelectedDistrictIds([]);
    }
  }, [searchParams]);

  const handleDistrictClick = (districtId: number) => {
    let newSelectedDistrictIds: number[];

    if (selectedDistrictIds.includes(districtId)) {
      newSelectedDistrictIds = selectedDistrictIds.filter(
        (id) => id !== districtId
      );
    } else {
      newSelectedDistrictIds = [...selectedDistrictIds, districtId];
    }

    if (newSelectedDistrictIds.length > 0) {
      router.push({
        pathname: `/properties`,
        query: {
          district: newSelectedDistrictIds.join(","),
        },
      });
    } else {
      router.push(`/properties`);
    }
  };

  const getDistrictStyle = (district: (typeof pathData)[0]) => {
    const isSelected = selectedDistrictIds.includes(district.id);
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

  // Separate mainland and islands
  const mainlandDistricts = pathData.filter((d) => d.id <= 18);
  const islands = pathData.filter((d) => d.id > 18);

  return (
    <div className="bg-white rounded-2xl p-4 border">
      <div className="relative">
        <TooltipProvider delayDuration={200}>
          <svg
            viewBox="0 0 180 370"
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

            {/* Render mainland districts */}
            {mainlandDistricts.map((district) => {
              const isSelected = selectedDistrictIds.includes(district.id);

              return (
                <Tooltip
                  key={district.id}
                  open={hoveredDistrict === district.name}
                >
                  <TooltipTrigger asChild>
                    <path
                      d={district.d}
                      style={getDistrictStyle(district)}
                      onMouseEnter={() => setHoveredDistrict(district.name)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                      onClick={() => handleDistrictClick(district.id)}
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

            {/* Render mainland text labels */}
            {mainlandDistricts.map((district) => {
              const isSelected = selectedDistrictIds.includes(district.id);
              const labelPos = getDistrictNamePosition(
                district.name,
                district.d
              );

              return (
                <text
                  key={`label-${district.id}`}
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

            {/* Render islands group - positioned at bottom right */}
            <g transform="translate(-60, -13) scale(1)">
              {islands.map((district) => {
                const isSelected = selectedDistrictIds.includes(district.id);

                return (
                  <Tooltip
                    key={district.id}
                    open={hoveredDistrict === district.name}
                  >
                    <TooltipTrigger asChild>
                      <path
                        d={district.d}
                        style={getDistrictStyle(district)}
                        onMouseEnter={() => setHoveredDistrict(district.name)}
                        onMouseLeave={() => setHoveredDistrict(null)}
                        onClick={() => handleDistrictClick(district.id)}
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

              {/* Island labels */}
              {islands.map((district) => {
                const isSelected = selectedDistrictIds.includes(district.id);
                const labelPos = getDistrictNamePosition(
                  district.name,
                  district.d
                );

                return (
                  <text
                    key={`label-${district.id}`}
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
            </g>
          </svg>
        </TooltipProvider>
      </div>
    </div>
  );
}
