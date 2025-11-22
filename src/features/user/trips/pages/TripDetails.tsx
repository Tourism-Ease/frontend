import { useParams } from "react-router";
import useTrip from "../hooks/useTrip";
import { Spinner } from "../../../../components/ui/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import TripGallery from "../components/TripGallery";
import TripInfo from "../components/TripInfo";
import TripOverview from "../components/TripOverview";
import TripHighlights from "../components/TripHighlights";
import TripWhatToBring from "../components/TripWhatToBring";
import { useState, useEffect } from "react";
import BookingModal from "../../booking/components/BookingModal";
import { FaExclamationTriangle, FaClock, FaInfoCircle, FaStar, FaShoppingBag, FaBook } from "react-icons/fa";

export default function TripDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: trip, isLoading, isError, error } = useTrip(id!);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showBooking ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showBooking]);

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
          <FaExclamationTriangle
            className="mx-auto text-red-500 mb-4"
            size={48}
          />
          <h2 className="text-2xl font-semibold text-red-600 mb-2">
            Something went wrong
          </h2>
          <p className="text-red-500 mb-4">{error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );

  if (!trip) return <p>Trip not found</p>;

  const cover = trip.imageCoverUrl;
  const images = trip.images.map(
    (img) => `https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/${img}`
  );

  return (
    <div className="container mx-auto mt-12 px-4 py-20 space-y-12">
      <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
        {trip.title}
      </h1>
      <div className="flex items-center gap-2 text-gray-500 mb-6 ">
        <FontAwesomeIcon icon={faMapMarkerAlt} />
        <span>{trip.destination.name}</span>
      </div>

      <TripGallery cover={cover} images={images} />

      {/* Trip Info */}
      <div className="bg-white p-6 rounded-xl flex md:flex-row md:space-x-6">
        <div className="flex items-center gap-2">
          <FaClock className="text-cyan-500" />
          <TripInfo duration={trip.duration} pickUp={trip.pickUp} />
        </div>
      </div>

      {/* Overview */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="flex items-center gap-2 text-2xl font-semibold mb-4 text-gray-900">
          <FaInfoCircle /> Overview
        </h3>
        <TripOverview overview={trip.overview} />
      </div>

      {/* Highlights */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="flex items-center gap-2 text-2xl font-semibold mb-4 text-gray-900">
          <FaStar /> Highlights
        </h3>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
          <TripHighlights highlights={trip.highlights} />
        </div>
      </div>

      {/* What to Bring */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="flex items-center gap-2 text-2xl font-semibold mb-4 text-gray-900">
          <FaShoppingBag /> What to Bring
        </h3>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
          <TripWhatToBring items={trip.whatToBring} />
        </div>
      </div>

      {/* Book Now */}
      <div className="flex justify-center mt-6">
        <button
          className="flex items-center justify-center gap-2 text-white px-6 py-3 rounded-xl w-full md:w-72 bg-gradient-to-r from-cyan-500 to-blue-500 hover:brightness-105 shadow-lg transition duration-300 font-semibold text-lg cursor-pointer"
          onClick={() => setShowBooking(true)}
        >
          <FaBook /> Book Now
        </button>
      </div>

      {showBooking && (
        <BookingModal
          onClose={() => setShowBooking(false)}
          bookingType="Trip"
          item={{
            id: trip.id,
            title: trip.title,
          }}
        />
      )}
    </div>
  );
}
