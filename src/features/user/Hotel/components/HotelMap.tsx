import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

interface HotelMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

export default function HotelMap({ latitude, longitude, name }: HotelMapProps) {
  const position: [number, number] = [latitude, longitude];

  const customIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [35, 35],
    iconAnchor: [17, 34],
  });

  return (
    <div className="mt-10 mx-auto w-2/3 h-[350px] rounded-xl overflow-hidden shadow ">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        className="w-4x1 h-full position-absolute"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={position} icon={customIcon}>
          <Popup>{name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
