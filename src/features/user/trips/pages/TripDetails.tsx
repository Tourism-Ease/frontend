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
import { FaExclamationTriangle } from "react-icons/fa";

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
                    <FaExclamationTriangle className="mx-auto text-red-500 mb-4" size={48} />
                    <h2 className="text-2xl font-semibold text-red-600 mb-2">Something went wrong</h2>
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
        <div className="container mx-auto px-4 py-20">
            <h1 className="text-3xl font-bold">{trip.title}</h1>
            <div className="flex gap-1 items-center mb-4 text-gray-500">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <span>{trip.destination.name}</span>
            </div>

            <TripGallery cover={cover} images={images} />
            <TripInfo duration={trip.duration} pickUp={trip.pickUp} />
            <TripOverview overview={trip.overview} />
            <TripHighlights highlights={trip.highlights} />
            <TripWhatToBring items={trip.whatToBring} />

            <button
                className="text-white px-4 py-2 rounded-md mt-14 w-full md:w-60 bg-linear-to-r from-cyan-500 to-blue-500 hover:brightness-105 transition duration-300 cursor-pointer"
                onClick={() => setShowBooking(true)}
            >
                Book Now
            </button>

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
