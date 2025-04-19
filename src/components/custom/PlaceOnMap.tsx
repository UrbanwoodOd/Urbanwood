"use client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";

interface PlaceOnMapProps {
  center: [number, number];
  zoom?: number;
}

export const PlaceOnMap = ({ center, zoom = 14 }: PlaceOnMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: center,
        zoom: zoom,
      });

      map.current.on("load", () => {
        setMapLoaded(true);
      });
    }

    // Update map center when props change
    if (map.current && mapLoaded) {
      map.current.flyTo({
        center: center,
        zoom: zoom,
        essential: true,
      });
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, zoom, mapLoaded]);

  // Add a marker at the center point
  useEffect(() => {
    if (map.current && mapLoaded) {
      // Remove any existing markers
      const markers = document.getElementsByClassName("mapboxgl-marker");
      while (markers[0]) {
        markers[0].remove();
      }

      // Add a new marker
      new mapboxgl.Marker().setLngLat(center).addTo(map.current);
    }
  }, [center, mapLoaded]);

  return (
    <section className="container mx-auto py-12 px-4">
      <h2 className="text-2xl font-semibold mb-6">Location</h2>
      <div
        ref={mapContainer}
        className="w-full h-[400px] rounded-md overflow-hidden border border-gray-200 shadow-sm"
      />
    </section>
  );
};
