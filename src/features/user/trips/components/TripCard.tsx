import { useState, useRef } from "react";
import type { Trip } from "../types/Trip";
import { Link } from "react-router";

interface TripCardProps {
  trip: Trip & {
    imagesUrls?: string[];
    egyptianPrice?: number;
    foreignerPrice?: number;
    childrenPrice?: number;
  };
}

export default function TripCard({ trip }: TripCardProps) {
  const [currentImage, setCurrentImage] = useState(trip.imageCoverUrl);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const images = [
    trip.imageCoverUrl,
    ...(trip.imagesUrls && trip.imagesUrls.length > 0
      ? trip.imagesUrls
      : trip.images.map(
        (img) =>
          `https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/${img}`
      )),
  ];

  const startCycle = () => {
    let index = 1;
    intervalRef.current = setInterval(() => {
      setCurrentImage(images[index]);
      index = (index + 1) % images.length;
    }, 1000);
  };

  const stopCycle = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentImage(trip.imageCoverUrl);
  };

  const displayPrice = trip.egyptianPrice ?? null;

  return (
    <Link to={`/trips/${trip.id}`}>
      <div
        className="block max-w-sm rounded-lg overflow-hidden cursor-pointer"
        onMouseEnter={startCycle}
        onMouseLeave={stopCycle}
      >
        <img
          className="rounded-lg h-48 w-full object-cover transition-all duration-300"
          src={currentImage}
          alt={trip.title}
        />

        <div className="p-2 text-center">
          <h5
            className="text-xl font-semibold pb-2 overflow-hidden text-ellipsis whitespace-nowrap"
            title={trip.title}
          >
            {trip.title}
          </h5>

          <div className="flex justify-between items-center">
            <p className="overflow-hidden text-ellipsis whitespace-nowrap">
              {trip.destination.name}
            </p>
            {displayPrice !== null && <p>{displayPrice} EGP</p>}
          </div>
        </div>
      </div>
    </Link>
  );
}
