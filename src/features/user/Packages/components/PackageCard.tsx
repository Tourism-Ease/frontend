import { Link } from "react-router";
import { useState, useRef } from "react";
import { FaUsers } from "react-icons/fa";

interface PackageProps {
  id: string;
  title: string;
  shortDesc: string;
  durationDays: number;
  imageCoverUrl: string;
  images?: string[];
  availableSeats: number;
}

export default function PackageCard({
  id,
  title,
  shortDesc,
  durationDays,
  imageCoverUrl,
  images = [],
  availableSeats,
}: PackageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const allImages = [
    imageCoverUrl,
    ...images.map(
      (img) => `https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/${img}`
    ),
  ];

  const startCycle = () => {
    if (allImages.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }, 1200);
  };

  const stopCycle = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentIndex(0);
  };

  return (
    <Link to={`/Packages/${id}`}>
      <div
        className="block bg-white rounded-xl shadow hover:shadow-lg transition p-3 cursor-pointer"
        onMouseEnter={startCycle}
        onMouseLeave={stopCycle}
      >
        <div className="relative h-48 w-full overflow-hidden rounded-lg">
          {allImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={title}
              className={`
                absolute inset-0 h-full w-full object-cover rounded-lg
                transition-opacity duration-700
                ${idx === currentIndex ? "opacity-100" : "opacity-0"}
              `}
            />
          ))}

          <span className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs">
            {durationDays} Days
          </span>
        </div>

        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap">
            {title}
          </h2>

          {/* Seats with icon */}
          <span className="inline-flex items-center gap-1 mt-1 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-md">
            <FaUsers className="text-blue-700 text-sm" />
            {availableSeats} Seats
          </span>

          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
            {shortDesc}
          </p>
        </div>
      </div>
    </Link>
  );
}
