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

  // Function to get district abbreviations
  const getDistrictAbbreviation = (districtName: string): string => {
    const abbreviations: { [key: string]: string } = {
      "Viana do Castelo": "VC",
      Braga: "BRG",
      Porto: "PRT",
      "Vila Real": "VR",
      Bragança: "BRG",
      Aveiro: "AVR",
      Viseu: "VIS",
      Guarda: "GRD",
      Coimbra: "CBR",
      "Castelo Branco": "CB",
      Leiria: "LRA",
      Santarém: "STR",
      Portalegre: "PTL",
      Lisboa: "LSB",
      Setúbal: "STB",
      Évora: "EVR",
      Beja: "BJA",
      Faro: "FAO",
    };
    return (
      abbreviations[districtName] || districtName.substring(0, 3).toUpperCase()
    );
  };

  // Function to get label position (center of bounding box)
  const getLabelPosition = (pathD: string) => {
    // Simple approximation - extract numbers from path and find center
    const numbers = pathD.match(/[\d.]+/g)?.map(Number) || [];
    if (numbers.length < 2) return { x: 0, y: 0 };

    const xCoords = numbers.filter((_, i) => i % 2 === 0);
    const yCoords = numbers.filter((_, i) => i % 2 === 1);

    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const minY = Math.min(...yCoords);
    const maxY = Math.max(...yCoords);

    return {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
    };
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

            {pathData.map((district) => {
              const isSelected = selectedDistricts.includes(district.name);
              const labelPos = getLabelPosition(district.d);

              return (
                <g key={district.name}>
                  <Tooltip open={hoveredDistrict === district.name}>
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
                  <text
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
                    {getDistrictAbbreviation(district.name)}
                  </text>
                </g>
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
