import { Spinner } from "../../../../components/ui/Spinner";
import { FaExclamationTriangle } from "react-icons/fa";
import TripCard from "../components/TripCard";
import useTrips from "../hooks/useTrips";

export default function Trips() {
    const { data: trips = [], isLoading, isError, error } = useTrips();

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

    return (
        <section className="bg-white py-30 ">
            <div className="container mx-auto px-4 flex flex-col items-center text-center">
                <h1 className="text-4xl font-bold mb-4">Explore Our Trips</h1>
                <p className="text-gray-600 mb-10 max-w-xl">
                    Discover amazing destinations and unique experiences just for you.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
                    {trips.map((trip) => (
                        <TripCard
                            key={trip.id}
                            trip={trip}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
