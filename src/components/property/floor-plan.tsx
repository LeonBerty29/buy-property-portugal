"use client";

import React from "react";
// import { ArrowDownToLine } from "lucide-react";
// import { Button } from "../ui/button";
// import { useTranslations } from "next-intl";
import { RequestFloorPlan } from "./request-floor-plan";

export const FloorPlanTab = ({
  propertyReference,
}: {
  propertyReference: string;
  pdfBrochure: string;
}) => {

  return (
    <div>
      <RequestFloorPlan propertyReference={propertyReference} />
    </div>
  );
};
