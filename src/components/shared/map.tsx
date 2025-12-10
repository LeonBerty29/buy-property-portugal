/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
// import { useCountries } from "../lib/getCountries";
import { icon } from "leaflet";

const ICON = icon({
  iconUrl: "/marker.png",
  iconSize: [50, 50],
});

export default function MapComponent({
  locationValue,
}: {
  locationValue: [number, number];
}) {
  //   const { getCountryByValue } = useCountries();

  const latLang = locationValue;

  const [MapContainer, setMapContainer] = useState<any>(null);
  const [TileLayer, setTileLayer] = useState<any>(null);
  const [Marker, setMarker] = useState<any>(null);

  useEffect(() => {
    import("react-leaflet").then((mod) => {
      setMapContainer(() => mod.MapContainer);
      setTileLayer(() => mod.TileLayer);
      setMarker(() => mod.Marker);
    });
  }, []);

  if (!MapContainer || !TileLayer || !Marker) {
    return null;
  }

  return (
    <MapContainer
      center={latLang ?? [51.505, -0.09]}
      zoom={15}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={latLang ?? [51.505, -0.09]} icon={ICON} />
    </MapContainer>
  );
}
