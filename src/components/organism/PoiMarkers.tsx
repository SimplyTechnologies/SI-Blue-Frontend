import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useMap } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import carMarker from '@/assets/marker.png';
import type { Poi } from '@/types/Poi';

const PoiMarkers: React.FC<{ pois: Poi[] }> = ({ pois }) => {
  const map = useMap();
  const navigate = useNavigate();
  const clusterer = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<{
    [key: string]: InstanceType<typeof google.maps.marker.AdvancedMarkerElement>;
  }>({});
  const prevPoisRef = useRef<Poi[]>([]);

  useEffect(() => {
    if (map && !clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
    return () => {
      clusterer.current?.clearMarkers();
      clusterer.current = null;
    };
  }, [map]);

  useEffect(() => {
    if (!map || !clusterer.current) return;

    Object.values(markersRef.current).forEach(marker => {
      marker.map = null;
    });
    markersRef.current = {};

    pois.forEach(poi => {
      if (poi.lat && poi.lng) {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: { lat: Number(poi.lat), lng: Number(poi.lng) },
          map,
          content: (() => {
            const img = document.createElement('img');
            img.src = carMarker;
            img.alt = 'carMarker';
            img.width = 47;
            img.height = 47;
            return img;
          })(),
        });
        marker.addListener('click', () => {
          navigate(`/vehicles/${poi.id}`);
        });
        markersRef.current[poi.id] = marker;
      }
    });

    clusterer.current.clearMarkers();
    clusterer.current.addMarkers(
      Object.values(markersRef.current) as unknown as google.maps.marker.AdvancedMarkerElement[],
    );
  }, [pois, map]);

  useEffect(() => {
    if (!map || !pois.length) return;
    const prevPois = prevPoisRef.current;
    if (JSON.stringify(prevPois) !== JSON.stringify(pois)) {
      const first = pois[0];
      if (pois.length > 1) {
        map.setZoom(4);
      } else if (first.lat && first.lng) {
        map.panTo({ lat: Number(first.lat), lng: Number(first.lng) });
        const zoom = map.getZoom();
        if (typeof zoom === 'number' && zoom < 7) {
          map.setZoom(7);
        }
      }
    }
    prevPoisRef.current = pois;
  }, [pois, map]);

  return null;
};

export default PoiMarkers;
