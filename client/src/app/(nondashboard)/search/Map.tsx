"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAppSelector } from "@/state/redux";
import { useGetPropertiesQuery } from "@/state/api";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";

maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY ?? "";

/* ---------------- Types ---------------- */

interface PropertyLocation {
  coordinates?: {
    longitude: number;
    latitude: number;
  };
}

interface PropertyMapItem {
  id: number;
  name?: string;
  address?: string;
  location?: PropertyLocation;
}

/* ---------------- Component ---------------- */

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maptilersdk.Map | null>(null);
  const markersRef = useRef<maptilersdk.Marker[]>([]);

  const filters = useAppSelector((state) => state.global.filters);

  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  /* ---------------- Helpers ---------------- */

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  }, []);

  const addMarkers = useCallback(
    (map: maptilersdk.Map, items: PropertyMapItem[]) => {
      clearMarkers();

      items.forEach((property) => {
        const coords = property.location?.coordinates;
        if (!coords) return;

        const marker = new maptilersdk.Marker({
          color: "#3B82F6",
        })
          .setLngLat([coords.longitude, coords.latitude])
          .setPopup(
            new maptilersdk.Popup({ offset: 25 }).setHTML(`
              <div class="p-2">
                <h3 class="font-semibold">${property.name ?? "Property"}</h3>
                <p class="text-sm">${property.address ?? ""}</p>
              </div>
            `)
          )
          .addTo(map);

        markersRef.current.push(marker);
      });
    },
    [clearMarkers]
  );

  /* ---------------- Initialize Map (ONCE) ---------------- */

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const style = process.env.NEXT_PUBLIC_MAPTILER_STYLE_ID
      ? `https://api.maptiler.com/maps/${process.env.NEXT_PUBLIC_MAPTILER_STYLE_ID}/style.json`
      : maptilersdk.MapStyle.STREETS;

    const map = new maptilersdk.Map({
      container: mapContainerRef.current,
      style,
      center: [78.9629, 20.5937], // India
      zoom: 5,
    });

    map.addControl(new maptilersdk.NavigationControl(), "top-right");

    mapRef.current = map;

    return () => {
      clearMarkers();
      map.remove();
      mapRef.current = null;
    };
  }, [clearMarkers]);

  /* ---------------- Update Markers ---------------- */

  useEffect(() => {
    if (!mapRef.current || !properties) return;
    addMarkers(mapRef.current, properties);
  }, [properties, addMarkers]);

  /* ---------------- React to Coordinate Filter ---------------- */

  useEffect(() => {
    if (!mapRef.current) return;

    const [lng, lat] = filters.coordinates ?? [];
    if (!lng || !lat) return;

    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: 12,
      essential: true,
    });
  }, [filters.coordinates]);

  /* ---------------- UI States ---------------- */

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        Failed to load map data
      </div>
    );
  }

  /* ---------------- Render ---------------- */

  return (
    <div className="relative grow basis-5/12 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
      <div
        ref={mapContainerRef}
        className="absolute inset-0"
        style={{ minHeight: "500px" }}
      />
    </div>
  );
};

export default Map;
