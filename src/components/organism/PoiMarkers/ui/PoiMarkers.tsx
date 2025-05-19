import { useEffect, useRef, useState } from "react";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import type { Poi } from "@/types/Poi";
import carMarker from "@/assets/carMarker.svg";
import { MarkerClusterer, type Marker } from "@googlemaps/markerclusterer";

const PoiMarkers: React.FC<{ pois: Poi[] }> = ({ pois }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  // Initialize MarkerClusterer, if the map has changed
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  // Update markers, if the markers array has changed
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };
  return (
    <>
      {pois.map((poi: Poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          ref={(marker) => setMarkerRef(marker, poi.key)}
        >
          <div className="w-[47.05px] h-[47px] flex items-center justify-center rounded-[40px] bg-[rgba(64, 60, 137, 0.2)]">
            <div className="w-[31.87px] h-[31.84px] flex justify-center items-center rounded-[30px] bg-[var(--color-primary-3)]">
              <img src={carMarker} alt="carMarker" />
            </div>
          </div>
        </AdvancedMarker>
      ))}
    </>
  );
};

export default PoiMarkers;
