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
import { FaExclamationTriangle } from "react-icons/fa";

export default function HotelDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: hotel, isLoading, isError, error } = useHotel(id!);
  const { data: rooms } = useRooms(id!);

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner className="size-10" />
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex justify-center items-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center max-w-md shadow-md">
          <FaExclamationTriangle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Something went wrong</h2>
          <p className="text-red-500 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );

  if (!hotel) return <div>No hotel found</div>;

  return (
    <div className="container mx-auto px-4 py-30">
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
