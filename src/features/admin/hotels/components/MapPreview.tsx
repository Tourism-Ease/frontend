import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapPreviewProps {
  lat: number;
  lng: number;
  height?: string;
}

export function MapPreview({ lat, lng, height = "350px" }: MapPreviewProps) {
  return (
    <div className="w-full rounded-xl overflow-hidden border">
      <MapContainer
        center={[lat, lng]}
        zoom={12}
        style={{ height }}
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} icon={markerIcon}>
          <Popup>Location preview</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
