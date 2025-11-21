import { useParams } from "react-router";
import { useHotel } from "../hook/useHotel";
import HotelImages from "../components/HotelImages";
import HotelMap from "./HotelMap";
import HotelRooms from "./HotelRooms";
import { useRooms } from "../hook/useRooms";
import { Spinner } from "../../../../components/ui/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import HotelRating from "./HotelRating";

export default function HotelDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: hotel, isLoading, error } = useHotel(id!);
  const { data: rooms } = useRooms(id!);

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner className="size-10" />
      </div>
    );
  if (error)
    return <p className="text-center mt-20 text-red-500">{error.message}</p>;
  if (!hotel) return <div className="p-6">No hotel found</div>;

  return (
    <div className="p-6 mt-10">
      {/* Basic Info */}
      <h1 className="text-3xl font-bold">{hotel.name}</h1>
      <div className="flex gap-1 items-center mb-4 text-gray-500">
        <FontAwesomeIcon icon={faMapMarkerAlt} />
        <span>
          {hotel.address.city}, {hotel.address.country}
        </span>
      </div>

      {/* Images */}
      <HotelImages cover={hotel.imageCoverUrl} images={hotel.imagesUrls} />

      {/* Rating  */}
      <HotelRating averageRating={hotel.averageRating} />

      {/* Description */}
      <p className="mt-4 text-gray-700 leading-relaxed">{hotel.Description}</p>

      {/* Room */}
      <HotelRooms rooms={rooms || []} />

      {/* Map */}
      <HotelMap
        latitude={hotel.location.coordinates[1]}
        longitude={hotel.location.coordinates[0]}
        name={hotel.name}
      />
    </div>
  );
}
