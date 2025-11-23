import { useState, useRef } from "react";
import type { Trip } from "../types/Trip";
import { Link } from "react-router";
import { formatCurrency } from "@/utils/formatCurrency";
import { Badge } from "@/components/ui/badge";

interface TripCardProps {
  trip: Trip & {
    imagesUrls?: string[];
    egyptianPrice?: number;
  };
}

export default function TripCard({ trip }: TripCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const images = [
    trip.imageCoverUrl,
    ...(trip.imagesUrls && trip.imagesUrls.length > 0
      ? trip.imagesUrls
      : trip.images.map((img) => `https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/${img}`)),
  ];

  const startCycle = () => {
    if (images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 1500); // slower cycle for smoother feel
  };

  const stopCycle = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentIndex(0);
  };

  const displayPrice = trip.egyptianPrice ?? null;
  const overviewLimit = 100;

  return (
    <Link to={`/trips/${trip.id}`}> <div
      className="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
      onMouseEnter={startCycle}
      onMouseLeave={stopCycle}
    > <div className="relative h-48 w-full">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={trip.title}
            className={`absolute inset-0 h-full w-full object-cover rounded-t-lg transition-opacity duration-700 ${idx === currentIndex ? "opacity-100" : "opacity-0"
              }`}
          />
        ))}
        {displayPrice !== null && (<Badge
          variant="secondary"
          className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 text-xs"
        >
          Starts from {formatCurrency(displayPrice)} </Badge>
        )} </div>


      <div className="p-4">
        <p className="text-gray-600 text-sm font-bold mb-1">{trip.destination.name}</p>
        <p className="text-gray-700 text-sm">
          {trip.overview.length > overviewLimit
            ? trip.overview.slice(0, overviewLimit) + "..."
            : trip.overview}
        </p>
      </div>
    </div>
    </Link>


  );
}
