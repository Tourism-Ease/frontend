import { Link } from "react-router";
import { useState, useRef } from "react";

interface PackageProps {
  id: string;
  title: string;
  shortDesc: string;
  durationDays: number;
  imageCoverUrl: string;
  images?: string[];
}

export default function PackageList({
  id,
  title,
  shortDesc,
  durationDays,
  imageCoverUrl,
  images = [],
}: PackageProps) {
  const [currentImage, setCurrentImage] = useState(imageCoverUrl);
  const intervalRef = useRef<number | null>(null);

  const allImages = [
    imageCoverUrl,
    ...images.map(
      (img) => `https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/${img}`
    ),
  ];

  const startCycle = () => {
    if (allImages.length <= 1) return;

    let index = 1;
    intervalRef.current = window.setInterval(() => {
      setCurrentImage(allImages[index]);
      index = (index + 1) % allImages.length;
    }, 1000);
  };

  const stopCycle = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentImage(imageCoverUrl);
  };

  return (
    <Link to={`/Packages/${id}`}>
      <div
        className="block bg-white rounded-xl shadow hover:shadow-lg transition p-3 cursor-pointer"
        onMouseEnter={startCycle}
        onMouseLeave={stopCycle}
      >
        <div className="relative h-48 w-full">
          <img
            src={currentImage}
            className="h-full w-full object-cover rounded-lg transition-all duration-300"
            alt={title}
          />

          <span className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs">
            {durationDays} Days
          </span>
        </div>

        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap">
            {title}
          </h2>

          <p className="text-gray-600 text-sm mt-2 line-clamp-2">{shortDesc}</p>
        </div>
      </div>
    </Link>
  );
}
