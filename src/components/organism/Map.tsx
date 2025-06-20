import { Map as GoogleMap } from '@vis.gl/react-google-maps';
import PoiMarkers from '@/components/organism/PoiMarkers';
import type { Poi } from '@/types/Poi';

const mapID = import.meta.env.VITE_MAP_ID;

interface MapProps {
  cords?: Poi[];
}

const Map: React.FC<MapProps> = ({ cords }) => {
  return (
    <GoogleMap
      mapId={mapID}
      style={{ width: '100%', height: '100%' }}
      defaultCenter={{ lat: -25.2744, lng: 133.7751 }} // Australia
      defaultZoom={4}
      minZoom={4}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
    >
      <PoiMarkers pois={cords?.length ? cords : []} />
    </GoogleMap>
  );
};

export default Map;
