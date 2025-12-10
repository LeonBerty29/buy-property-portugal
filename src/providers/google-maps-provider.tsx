"use client";
import type { ReactNode } from "react";
import { LoadScript } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

export function GoogleMapsProvider({ children }: { children: ReactNode }) {
  return (
    <LoadScript
      libraries={["places", "geometry"]}
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
      loadingElement={<Loader />}
    >
      {children}
    </LoadScript>
  );
}

const Loader = () => {
  return (
    <div className="min-h-screen flex w-full h-full items-center justify-center">
      <Loader2 className="size-4 animate-spin" />
    </div>
  );
};
