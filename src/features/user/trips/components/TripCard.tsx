import { useState, useRef } from "react";
import type { Trip } from "../types/Trip";
import { Link } from "react-router";

interface TripCardProps {
  trip: Trip;
}

export default function TripCard({ trip }: TripCardProps) {
  const [currentImage, setCurrentImage] = useState(trip.imageCoverUrl);
  const intervalRef = useRef<number | null>(null);

  const images = [
    trip.imageCoverUrl,
    ...trip.images.map(
      (img) => `https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/${img}`
    ),
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
              {trip.destination} - <span className="italic">Tour</span>
            </p>
            <p>{trip.price} EGP</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
