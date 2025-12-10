"use client";
import React from "react";
import {
  GoogleMap,
  MarkerF,
  OverlayView,
  OverlayViewF,
} from "@react-google-maps/api";

export const GoogleMapSection = ({
  latitude,
  longitude,
  propertyReference,
}: {
  latitude: number;
  longitude: number;
  propertyReference: string;
}) => {
  const containerStyle = {
    width: "100%",
    height: window.innerWidth * 0.5,
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: latitude, lng: longitude }}
      zoom={10}
    >
      <MarkerF
        position={{ lat: latitude, lng: longitude }}
        icon={{
          url: "/images/eav-map-pin.svg",
          scaledSize: new google.maps.Size(32, 32),
        }}
      >
        <OverlayViewF
          position={{
            lat: latitude,
            lng: longitude,
          }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div className="p-2 bg-white font-bold inline-block">
            <p className="text-black text-xs">{propertyReference}</p>
          </div>
        </OverlayViewF>
      </MarkerF>
    </GoogleMap>
  );
};
