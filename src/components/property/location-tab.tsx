"use client";
import React from "react";
import { GoogleMapSection } from "../shared/google-maps-section";
import { NearbyPlacesList } from "../shared/nearby-places";

export const LocationTab = ({
  latitude,
  longitude,
  propertyReference,
}: {
  latitude: number;
  longitude: number;
  propertyReference: string;
}) => {

  return (
    <div>
      {/* <GoogleMap longitude={longitude} latitude={latitude} /> */}
        <GoogleMapSection
          latitude={latitude}
          longitude={longitude}
          propertyReference={propertyReference}
        />
        <NearbyPlacesList latitude={latitude} longitude={longitude} />
    </div>
  );
};
