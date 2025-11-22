import type { Room } from "../api/room.api";

interface HotelRoomsProps {
  rooms: Room[];
}

export default function HotelRooms({ rooms }: HotelRoomsProps) {
  if (!rooms || rooms.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold mb-6">Available Rooms</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="border rounded-2xl p-6 shadow-sm bg-white "
          >
            {/* Title */}
            <h3 className="font-semibold text-2xl">{room.name}</h3>

            {/* Capacity */}
            <p className="text-gray-500 mt-2">
              👥 <span className="font-medium">{room.capacity}</span> Guests
            </p>

            {/* Price */}
            <p className="text-gray-800 font-semibold text-xl mt-3">
              {room.price}{" "}
              <span className="text-sm font-normal text-gray-500">
                EGP / night
              </span>
            </p>

            {/* Divider */}
            <div className="my-4 border-t" />

            {/* Amenities */}
            <p className="font-medium text-gray-700 mb-2">Amenities:</p>

            <div className="flex flex-wrap gap-2">
              {room.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="px-3 py-1 bg-blue-100 text-gray-700 rounded-full text-sm font-medium border"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
