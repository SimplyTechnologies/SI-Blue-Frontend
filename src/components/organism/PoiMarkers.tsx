import { useEffect, useRef, useState } from 'react';
import { AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import type { Poi } from '@/types/Poi';
import carMarker from '@/assets/carMarker.svg';
import { MarkerClusterer, type Marker } from '@googlemaps/markerclusterer';

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

    setMarkers(prev => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  const parsedPois: Poi[] = pois
    .filter(poi => poi.lat && poi.lng)
    .map(poi => ({
      ...poi,
      lat: typeof poi.lat === 'string' ? parseFloat(poi.lat) : poi.lat,
      lng: typeof poi.lng === 'string' ? parseFloat(poi.lng) : poi.lng,
    }));

  return (
    <>
      {parsedPois.map((poi: Poi) => (
        <AdvancedMarker
          key={poi.id}
          position={{ lat: poi.lat, lng: poi.lng }}
          ref={marker => setMarkerRef(marker, poi.id.toString())}
        >
          <div className="w-[47.05px] h-[47px] flex items-center justify-center rounded-[40px] bg-[#403C89]/20">
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
