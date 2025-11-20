import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import useTrip from "../hooks/useTrip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "../../../../components/ui/Spinner";

export default function TripDetails() {
    const { id } = useParams<{ id: string }>();
    const { data: trip, isLoading, isError, error } = useTrip(id!);

    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const closeModal = useCallback(() => setIsOpen(false), []);

    const nextImage = useCallback(() => {
        setCurrentIndex((prev) => prev + 1);
    }, []);

    const prevImage = useCallback(() => {
        setCurrentIndex((prev) => prev - 1);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen, closeModal, nextImage, prevImage]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    if (isLoading)
        return <div className="min-h-screen flex justify-center items-center">
            <Spinner className="size-10" />
        </div>
    if (isError)
        return (
            <p className="text-center mt-20 text-red-500">{error.message}</p>
        );
    if (!trip) return <p>Trip not found</p>;

    const cover = trip.imageCoverUrl;
    const images = trip.images.map((img) => `https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/${img}`);

    const allImages = [cover, ...images];
    const gallery = allImages.slice(0, 5);

    const openModal = (i: number) => {
        setCurrentIndex(i);
        setIsOpen(true);
    };

    return (
        <div className="container mx-auto px-4 py-20">
            <h1 className="text-3xl font-bold">{trip.title}</h1>

            <div className="flex gap-1 items-center mb-4 text-gray-500">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <span>{trip.destination}</span>
            </div>

            {/* Integrated Image Slider */}
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

            {/* MODAL */}
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

                        {/* Close */}
                        <button
                            className="absolute -top-8 right-4 text-white text-3xl font-bold hover:text-gray-300 transition cursor-pointer"
                            onClick={closeModal}
                        >
                            ✕
                        </button>

                        {/* Prev */}
                        <button
                            className="absolute top-1/2 left-4 -translate-y-1/2 text-white text-4xl font-bold hover:text-gray-300 transition cursor-pointer"
                            onClick={() =>
                                setCurrentIndex((prev) =>
                                    prev === 0 ? allImages.length - 1 : prev - 1
                                )
                            }
                        >
                            ❮
                        </button>

                        {/* Next */}
                        <button
                            className="absolute top-1/2 right-4 -translate-y-1/2 text-white text-4xl font-bold hover:text-gray-300 transition cursor-pointer"
                            onClick={() =>
                                setCurrentIndex((prev) =>
                                    (prev + 1) % allImages.length
                                )
                            }
                        >
                            ❯
                        </button>
                    </div>
                </div>
            )}

            {/* Trip Details */}
            <div className="flex flex-col gap-2.5 lg:flex-row lg:justify-between text-lg font-semibold mb-8">
                <p>Price: {trip.price} EGP</p>
                <p>Duration: {trip.price} Minutes</p>
                <p>Pick-up: {trip.pickUp}</p>
            </div>

            <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-2">Overview</h3>
                <p className="text-lg text-gray-800">{trip.overview}</p>
            </div>

            {/* Highlights */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-3 text-gray-900">Highlights</h2>
                {trip.highlights.length ? (
                    <div className="flex flex-wrap gap-2">
                        {trip.highlights.map((h, idx) => (
                            <span
                                key={idx}
                                className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium hover:bg-blue-200 transition"
                            >
                                {h}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No highlights provided</p>
                )}
            </div>

            {/* What to Bring */}
            <div>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900">What to Bring</h2>
                {trip.whatToBring.length ? (
                    <div className="flex flex-wrap gap-2">
                        {trip.whatToBring.map((w, idx) => (
                            <span
                                key={idx}
                                className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium hover:bg-green-200 transition"
                            >
                                {w}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No specific items</p>
                )}
            </div>
        </div>
    );
}
