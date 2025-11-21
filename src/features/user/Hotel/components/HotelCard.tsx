import { Link } from "react-router";

interface HotelCardProps {
  id: string;
  name: string;
  city: string;
  country: string;
  stars: number;
  image: string;
  Description: string;
}

export default function HotelCard({
  id,
  name,
  city,
  country,
  stars,
  image,
  Description,
}: HotelCardProps) {
  return (
    <Link
      to={`/HotelDetails/${id}`}
      className="block bg-white rounded-xl shadow hover:shadow-lg transition p-3"
    >
      <img
        src={image}
        className="w-full h-48 object-cover rounded-lg"
        alt={name}
      />

      <div className="mt-3">
        <h2 className="text-lg font-semibold">{name}</h2>

        <p className="text-gray-500 text-sm">
          {city}, {country}
        </p>

        <p className="text-yellow-500 text-sm">⭐ {stars} / 5</p>

        <p className="text-gray-700 text-sm mt-2 line-clamp-2">{Description}</p>
      </div>
    </Link>
  );
}
