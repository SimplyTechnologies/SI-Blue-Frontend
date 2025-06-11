import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { MarkerClusterer, type Marker } from '@googlemaps/markerclusterer';
import type { Poi } from '@/types/Poi';
import getMapData from '@/utils/getMapData';
import carMarker from '@/assets/carMarker.svg';

const PoiMarkers: React.FC<{ pois: Poi[] }> = ({ pois }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});

  const clusterer = useRef<MarkerClusterer | null>(null);
  const navigate = useNavigate();

  // Initialize clusterer
  useEffect(() => {
    if (map && !clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  // When pois change, clear and rebuild markers
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) return;

    clusterer.current = new MarkerClusterer({ map });
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    const marker = Object.values(markers);
    clusterer.current?.addMarkers(marker);
  }, [markers]);

  useEffect(() => {
    if (!map) return;
    if (!pois?.length || pois.length !== 1) {
      map.setCenter({ lat: -25.2744, lng: 133.7751 });
      map.setZoom(4);
      return;
    }

    const poi = pois[0];

    // Wait one frame or short delay to ensure marker is in the DOM
    const timeout = setTimeout(() => {
      map.setZoom(16);
      map.setCenter({ lat: parseFloat(poi.lat), lng: parseFloat(poi.lng) });
    }, 100);

    return () => clearTimeout(timeout);
  }, [map, pois]);

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
  return (
    <>
      {getMapData(pois).map(poi => (
        <AdvancedMarker
          key={poi.id}
          position={{ lat: poi.lat, lng: poi.lng }}
          ref={marker => setMarkerRef(marker, poi.id.toString())}
          onClick={() => navigate(`/vehicles/${poi.id}`)}
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
