import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';

interface MapPreviewProps {
  lat: number;
  lng: number;
  height?: string;
}

const libraries: ("places")[] = []; // no need for "places" here unless you want search

export function MapPreview({ lat, lng, height = "350px" }: MapPreviewProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="w-full rounded-xl overflow-hidden border" style={{ height }}>
      <GoogleMap
        center={{ lat, lng }}
        zoom={12}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        options={{ fullscreenControl: false, streetViewControl: false }}
      >
        <Marker position={{ lat, lng }} />
      </GoogleMap>
    </div>
  );
}
