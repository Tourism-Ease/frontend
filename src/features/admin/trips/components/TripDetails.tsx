import { Link, useParams, useNavigate } from "react-router";
import { PageContainer } from "@/components/admin/PageContainer";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
    Edit,
    Trash2,
    MapPin,
    Images,
    Sparkles,
    CheckCircle,
    Clock,
    Wallet,
    Handbag,
} from "lucide-react";

import {
    useTripByIdQuery,
    useDeleteTripMutation,
} from "../hooks/useTrips";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";
import { formatCurrency } from "@/utils/formatCurrency";

export default function TripDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: trip, isLoading, isError } = useTripByIdQuery(id!);
    const deleteMutation = useDeleteTripMutation();

    const handleDelete = () => {
        const toastId = toast.loading("Deleting...");
        deleteMutation.mutate(id!, {
            onSuccess: () => {
                toast.success("Trip deleted!", { id: toastId });
                navigate("/admin/trips");
            },
            onError: () =>
                toast.error("Failed to delete trip.", { id: toastId }),
        });
    };

    if (isLoading)
        return (
            <PageContainer>
                <p>Loading trip...</p>
            </PageContainer>
        );

    if (isError || !trip)
        return (
            <PageContainer>
                <p>Trip not found.</p>
            </PageContainer>
        );

    return (
        <PageContainer>
            {/* Breadcrumbs */}
            <AdminBreadcrumb
                items={[
                    { label: "Dashboard", to: "/admin/dashboard" },
                    { label: "Trips", to: "/admin/trips" },
                    { label: trip.title },
                ]}
            />

            {/* Page Header */}
            <PageHeader
                title={trip.title}
                description={`Destination: ${trip.destination?.name ?? "Unknown"}`}
                actions={
                    <div className="flex gap-2">
                        <Link to={`/admin/trips/edit/${trip.id}`}>
                            <Button className="flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200">
                                <Edit size={16} /> Edit
                            </Button>
                        </Link>

                        <DeleteConfirmationDialog
                            itemName={trip.title}
                            onConfirm={handleDelete}
                            trigger={
                                <Button className="flex items-center gap-1 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200">
                                    <Trash2 size={16} /> Delete
                                </Button>
                            }
                        />
                    </div>
                }
            />

            {/* === IMAGES (Cover + Gallery) === */}
            {(trip.imageCoverUrl || trip.imagesUrls?.length > 0) && (
                <section className="mt-6">
                    <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
                        <Images size={20} className="text-purple-600" />
                        Gallery
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                        {/* Cover image first */}
                        {trip.imageCoverUrl && (
                            <div className="w-full h-48 rounded-lg overflow-hidden border shadow-sm">
                                <img
                                    src={trip.imageCoverUrl}
                                    alt="Cover"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                                />
                            </div>
                        )}

                        {/* Other gallery images */}
                        {trip.imagesUrls?.map((url, idx) => (
                            <div
                                key={idx}
                                className="w-full h-48 rounded-lg overflow-hidden border shadow-sm"
                            >
                                <img
                                    src={url}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* === INFO BOXES ROW: Destination + Pickup === */}
            <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Destination */}
                <section className="mt-6 bg-white dark:bg-gray-900 border rounded-xl p-5 shadow-sm">
                    <h2 className="flex items-center gap-2 text-lg font-semibold mb-2">
                        <MapPin size={18} className="text-blue-600" />
                        Destination
                    </h2>
                    <p className="text-sm">{trip.destination?.name ?? "Unknown destination"}</p>
                </section>

                {trip.pickUp && (
                    <section className="mt-6 bg-white dark:bg-gray-900 border rounded-xl p-5 shadow-sm">
                        <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
                            <Clock size={20} className="text-yellow-600" />
                            Pickup Details
                        </h2>
                        <p className="text-sm"><strong>Time:</strong> {trip.pickUp.time}</p>
                        <p className="text-sm"><strong>Place:</strong> {trip.pickUp.place}</p>
                    </section>
                )}
            </section>

            {/* === OVERVIEW === */}
            <section className="mt-6 bg-white dark:bg-gray-900 border rounded-xl p-5 shadow-sm">
                <h2 className="flex items-center gap-2 text-lg font-semibold mb-2">
                    <Sparkles size={18} className="text-orange-600" />
                    Overview
                </h2>
                <p className="text-sm leading-relaxed">{trip.overview}</p>
            </section>


            {/* === PRICES === */}
            <section className="mt-6 bg-white dark:bg-gray-900 border rounded-xl p-5 shadow-sm">
                <h2 className="flex items-center gap-2 text-lg font-semibold mb-2">
                    <Wallet size={18} className="text-green-600" />
                    Prices
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="font-medium text-green-700">Egyptians</p>
                        <p className="text-lg font-semibold">
                            {formatCurrency(trip.egyptianPrice)}
                        </p>
                    </div>

                    {trip.childrenPrice != null && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="font-medium text-blue-700">Children</p>
                            <p className="text-lg font-semibold">
                                {formatCurrency(trip.childrenPrice)}
                            </p>
                        </div>
                    )}

                    {trip.foreignerPrice != null && (
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <p className="font-medium text-purple-700">Foreigners</p>
                            <p className="text-lg font-semibold">
                                {formatCurrency(trip.foreignerPrice)}
                            </p>
                        </div>
                    )}
                </div>
            </section>


            {/* === HIGHLIGHTS === */}
            {trip.highlights.length > 0 && (
                <section className="mt-6 bg-white dark:bg-gray-900 border rounded-xl p-5 shadow-sm">
                    <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
                        <Sparkles size={20} className="text-purple-600" />
                        Highlights
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {trip.highlights.map((item) => (
                            <span
                                key={item}
                                className="flex items-center text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 gap-1"
                            >
                                <CheckCircle size={14} className="text-blue-600" />
                                {item}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* === WHAT TO BRING === */}
            {trip.whatToBring.length > 0 && (<section className="mt-6 bg-white dark:bg-gray-900 border rounded-xl p-5 shadow-sm"> <h2 className="flex items-center gap-2 text-xl font-semibold mb-3"> <Handbag size={20} className="text-amber-600" />
                What to Bring </h2> <div className="flex flex-wrap gap-2">
                    {trip.whatToBring.map((item) => (<span
                        key={item}
                        className="bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-sm font-medium border border-amber-100 shadow-sm hover:bg-amber-100 transition-colors"
                    >
                        {item} </span>
                    ))} </div> </section>
            )}





        </PageContainer>
    );
}
