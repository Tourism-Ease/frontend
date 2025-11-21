import { Spinner } from "../../../../components/ui/Spinner";
import TripCard from "../components/TripCard";
import useTrips from "../hooks/useTrips";


export default function Trips() {
    const { data: trips = [], isLoading, isError, error } = useTrips();

    if (isLoading)
        return <div className="min-h-screen flex justify-center items-center">
            <Spinner className="size-10" />
        </div>

    if (isError)
        return <p className="text-center mt-20 text-red-500">{error.message}</p>;

    return (
        <>
            {/* Trips Grid */}
            <section className="bg-white mt-20 py-5">
                <div className="container mx-auto px-4 flex flex-col items-center text-center">
                    <h1 className="text-4xl font-bold mb-4">Explore Our Trips</h1>
                    <p className="text-gray-600 mb-10 max-w-xl">
                        Discover amazing destinations and unique experiences curated just for you. 
                        Find your next adventure and start planning your journey today.
                    </p>

                    {/* Trips Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
                        {trips.map((trip) => (
                            <TripCard key={trip.id} trip={trip} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
