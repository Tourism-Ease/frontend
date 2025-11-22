import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Spinner } from "../../../../components/ui/Spinner";
import usePackage from "../hook/usePackage";
import { useHotel } from "../../Hotel/hook/useHotel";
import HotelCard from "../../Hotel/components/HotelCard";
import BookingModal from "../../booking/components/BookingModal";
import {
  FaExclamationTriangle,
  FaDollarSign,
  FaClock,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaRoute,
  FaHotel,
  FaBook,
} from "react-icons/fa";

export default function PackageDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: pkg, isLoading, isError, error } = usePackage(id!);
  const { data: hotel, isLoading: hotelLoading } = useHotel(
    pkg?.hotel?.id ?? ""
  );

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBooking, setShowBooking] = useState(false);

  const closeModal = () => setIsOpen(false);
  const nextImage = () =>
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (isLoading || hotelLoading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner className="size-10" />
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex justify-center items-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center max-w-md shadow-md">
          <FaExclamationTriangle
            className="mx-auto text-red-500 mb-4"
            size={48}
          />
          <h2 className="text-2xl font-semibold text-red-600 mb-2">
            Something went wrong
          </h2>
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

  if (!pkg) return <p>Package not found</p>;

  const cover = pkg.imageCoverUrl;
  const images = (pkg.images || []).map(
    (img) => `https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/${img}`
  );
  const allImages = [cover, ...images];
  const gallery = allImages.slice(0, 5);

  const openModal = (i: number) => {
    setCurrentIndex(i);
    setIsOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-30">
      <h1 className="text-3xl font-bold mb-4">{pkg.title}</h1>

      {/* Image Gallery */}
      <div className="grid grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-2 md:gap-3 rounded-xl overflow-hidden mb-6">
        <div
          className="col-span-4 md:col-span-2 row-span-2 relative cursor-pointer"
          onClick={() => openModal(0)}
        >
          <img
            src={gallery[0]}
            className="w-full h-[250px] md:h-[420px] object-cover rounded-xl"
          />
        </div>

        {gallery.slice(1).map((img, i) => (
          <div
            key={i}
            className="relative cursor-pointer"
            onClick={() => openModal(i + 1)}
          >
            <img
              src={img}
              className="w-full h-[120px] hidden lg:flex md:h-[205px] object-cover rounded-xl"
            />
            {i === gallery.length - 2 && (
              <button className="absolute bottom-3 md:bottom-8 lg:bottom-2 right-2 bg-white px-3 py-1.5 w-40 rounded-lg text-sm font-semibold uppercase cursor-pointer hover:bg-gray-300 transition">
                show more
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="relative w-full max-w-5xl p-4">
            <img
              src={allImages[currentIndex]}
              className="w-2/3 mx-auto lg:w-full max-h-[80vh] object-contain rounded-lg"
            />

            <button
              className="absolute -top-8 right-4 text-white text-3xl font-bold hover:text-gray-300 transition cursor-pointer"
              onClick={closeModal}
            >
              ✕
            </button>

            <button
              className="absolute top-1/2 left-4 -translate-y-1/2 text-white text-4xl font-bold hover:text-gray-300 transition cursor-pointer"
              onClick={prevImage}
            >
              ❮
            </button>

            <button
              className="absolute top-1/2 right-4 -translate-y-1/2 text-white text-4xl font-bold hover:text-gray-300 transition cursor-pointer"
              onClick={nextImage}
            >
              ❯
            </button>
          </div>
        </div>
      )}

      {/* Package Details */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-3 md:space-y-0">
        <p className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium border border-blue-200 shadow-sm">
          <FaDollarSign /> Price: {pkg!.prices.egyptianPrice} EGP
        </p>
        <p className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full font-medium border border-green-200 shadow-sm">
          <FaClock /> Duration: {pkg.durationDays} Days
        </p>
      </div>

      {/* Pickup Locations */}
      <div className="bg-white p-6 mt-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-xl font-semibold mb-1 flex items-center gap-2">
          <FaMapMarkerAlt /> Pick-up Locations:
        </h3>
        <ul className="ml-4 list-disc space-y-1 text-gray-700">
          {pkg.pickupLocations.map((pickup, idx) => (
            <li key={idx}>
              <span className="font-medium">{pickup.city}</span> -{" "}
              {pickup.place} at{" "}
              <span className="font-semibold">{pickup.time}</span>{" "}
              {pickup.priceAdjustment ? (
                <span className="text-green-600 font-medium">
                  (+{pickup.priceAdjustment} EGP)
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      {/* Overview */}
      <div className="bg-white mt-5 p-6 rounded-xl shadow-md border border-gray-300">
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 flex items-center gap-2">
          <FaInfoCircle /> Overview
        </h3>
        <p className="text-gray-700 leading-relaxed">{pkg.description}</p>
      </div>

      {/* Itinerary */}
      <div className="bg-white mt-5 p-6 rounded-xl shadow-md border border-gray-300">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
          <FaRoute /> Itinerary
        </h2>
        {(pkg.itinerary || []).length ? (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
            {pkg.itinerary.map((item, idx) => (
              <div
                key={idx}
                className="p-4 border-l-4 border-cyan-500 rounded-lg bg-cyan-50 shadow-sm"
              >
                <h3 className="font-bold text-gray-900">
                  Day {item.day}: {item.title}
                </h3>
                <p className="text-gray-700 mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No itinerary available</p>
        )}
      </div>

      {/* Hotel Display */}
      {hotel && (
        <div className="bg-white p-6 rounded-xl w-fit mt-7 justify-center shadow-md border border-gray-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
            <FaHotel /> Hotel
          </h2>
          <div className="flex justify-center">
            <HotelCard
              key={hotel.id}
              id={hotel.id}
              name={hotel.name}
              city={hotel.address.city}
              country={hotel.address.country}
              stars={hotel.stars}
              image={hotel.imageCoverUrl}
              description={hotel.Description}
            />
          </div>
        </div>
      )}
      {/* Book Now */}
      <div className="flex justify-center mt-6">
        <button
          className="flex items-center justify-center gap-2 text-white px-6 py-3 rounded-xl w-full md:w-72 bg-gradient-to-r from-cyan-500 to-blue-500 hover:brightness-105 shadow-lg transition duration-300 font-semibold text-lg cursor-pointer"
          onClick={() => setShowBooking(true)}
        >
          <FaBook /> Book Now
        </button>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <BookingModal
          onClose={() => setShowBooking(false)}
          bookingType="Package"
          item={pkg}
        />
      )}
    </div>
  );
}
