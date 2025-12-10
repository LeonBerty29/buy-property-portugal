"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface NearbyPlace {
  name: string;
  type: string;
  distance?: string;
  duration?: string;
}

const placeTypes = [
  { type: "restaurant", label: "restaurant" },
  { type: "beach", label: "beach" },
  { type: "bus_station", label: "busStation" },
  { type: "airport", label: "airport" },
  { type: "hospital", label: "hospital" },
];

export const NearbyPlacesList = ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => {
  const t = useTranslations("nearbyPlaces");

  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Create a hidden map for Places Service
  useEffect(() => {
    if (typeof window === "undefined" || !window.google) return;

    const mapDiv = document.createElement("div");
    const tempMap = new google.maps.Map(mapDiv, {
      center: { lat: latitude, lng: longitude },
      zoom: 12,
    });

    setMap(tempMap);
  }, [latitude, longitude]);

  // Search for nearby places - wrapped in useCallback
  const searchNearbyPlaces = useCallback(
    async (
      location: { lat: number; lng: number },
      placeType: string,
      labelKey: string
    ) => {
      if (!map) return null;

      const service = new google.maps.places.PlacesService(map);
      const distanceService = new google.maps.DistanceMatrixService();
      const origin = new google.maps.LatLng(location.lat, location.lng);

      try {
        // Search for nearby place
        const result = await new Promise<google.maps.places.PlaceResult | null>(
          (resolve) => {
            service.nearbySearch(
              {
                location: origin,
                radius: 5000, // 5km radius
                type: placeType,
              },
              (results, status) => {
                if (
                  status === google.maps.places.PlacesServiceStatus.OK &&
                  results &&
                  results.length > 0
                ) {
                  resolve(results[0]);
                } else {
                  resolve(null);
                }
              }
            );
          }
        );

        if (!result || !result.geometry?.location) return null;

        const destination = {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
        };

        // Get driving distance and time
        const distanceResult = await new Promise<{
          distance: string;
          duration: string;
        }>((resolve) => {
          distanceService.getDistanceMatrix(
            {
              origins: [origin],
              destinations: [
                new google.maps.LatLng(destination.lat, destination.lng),
              ],
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
              if (status === google.maps.DistanceMatrixStatus.OK && response) {
                const element = response.rows[0]?.elements[0];
                if (element?.status === "OK") {
                  resolve({
                    distance: element.distance?.text || "N/A",
                    duration: element.duration?.text || "N/A",
                  });
                  return;
                }
              }
              resolve({ distance: "N/A", duration: "N/A" });
            }
          );
        });

        const fallbackLabel = t(labelKey);

        return {
          name: result.name || fallbackLabel,
          type: fallbackLabel,
          distance: distanceResult.distance,
          duration: distanceResult.duration,
        };
      } catch (error) {
        console.error(`Error searching for ${t(labelKey)}:`, error);
        return null;
      }
    },
    [map, t]
  );

  useEffect(() => {
    if (!map) return;

    const fetchAllPlaces = async () => {
      setLoading(true);
      // console.log("\n🔍 Searching for nearby places...");

      const foundPlaces: NearbyPlace[] = [];

      for (const { type, label } of placeTypes) {
        const place = await searchNearbyPlaces(
          { lat: latitude, lng: longitude },
          type,
          label
        );

        if (place) {
          foundPlaces.push(place);
          // console.log(
          //   `✅ ${place.type}: ${place.name} - ${place.duration} (${place.distance})`
          // );
        } else {
          // console.log(`❌ ${label}: Not found`);
        }
      }

      setNearbyPlaces(foundPlaces);
      setLoading(false);
    };

    fetchAllPlaces();
  }, [map, latitude, longitude, searchNearbyPlaces]);

  return (
    <div className="bg-white p-4 mt-4">
      <h3 className="font-bold text-lg mb-3 text-primary">
        {t("nearbyPlacesDrivingDistances")}
      </h3>
      {loading ? (
        <p className="text-gray-500">{t("searchingForNearbyPlaces")}</p>
      ) : nearbyPlaces.length > 0 ? (
        <div className="space-y-2">
          {nearbyPlaces.map((place, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b pb-2 last:border-b-0"
            >
              <div>
                <p className="font-semibold">{place.type}</p>
                {/* <p className="text-sm text-gray-600">{place.name}</p> */}
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-700">{place.duration}</p>
                <p className="text-sm text-gray-400">{place.distance}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">{t("noPlacesFoundNearby")}</p>
      )}
    </div>
  );
};
