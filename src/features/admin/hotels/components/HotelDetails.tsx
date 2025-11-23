import { Link, useParams, useNavigate } from "react-router";
import { PageContainer } from "@/components/admin/PageContainer";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Edit, Trash2, MapPin, Info, Images, Star, CheckCircle, Sparkles } from "lucide-react";

import {
    useHotelByIdQuery,
    useDeleteHotelMutation,
} from "../hooks/useHotels";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";
import { MapPreview } from "./MapPreview";
import { RoomTypesSection } from "./RoomTypes";
import { AdminSpinner, Spinner } from "@/components/ui/Spinner";

export default function HotelDetails() {
    const { id } = useParams();
    const navigate = useNavigate();


    const { data: hotel, isLoading, isError } = useHotelByIdQuery(id!);
    const deleteMutation = useDeleteHotelMutation();

    const handleDelete = () => {
        const toastId = toast.loading("Deleting...");
        deleteMutation.mutate(id!, {
            onSuccess: () => {
                toast.success("Hotel deleted!", { id: toastId });
                navigate("/admin/hotels");
            },
            onError: () =>
                toast.error("Failed to delete hotel.", { id: toastId }),
        });
    };

    if (isLoading)
        return (
            <PageContainer>
                <AdminSpinner />
            </PageContainer>
        );

    if (isError || !hotel)
        return (
            <PageContainer>
                <p>Hotel not found.</p>
            </PageContainer>
        );

    return (
        <PageContainer>
            {/* Breadcrumbs */}
            <AdminBreadcrumb
                items={[
                    { label: "Dashboard", to: "/admin/dashboard" },
                    { label: "Hotels", to: "/admin/hotels" },
                    { label: hotel.name },
                ]}
            />

            {/* Page Header */}
            <PageHeader
                title={hotel.name}
                description={`${hotel.address.city}, ${hotel.address.country}, ${hotel.address.street ?? ""}`}
                actions={
                    <div className="flex gap-2">
                        <Link to={`/admin/hotels/edit/${hotel.id}`}>
                            <Button className="flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200">
                                <Edit size={16} /> Edit
                            </Button>
                        </Link>

                        <DeleteConfirmationDialog
                            itemName={hotel.name}
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



            {/* Cover Image */}
            <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow mt-4">
                <img
                    src={hotel.imageCoverUrl}
                    alt={hotel.name}
                    className="w-full h-full object-cover bg-gray-100"
                />
                {/* Stars */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                    <Star size={16} className="text-yellow-400" />
                    {hotel.stars}-Star
                </div>
            </div>

            {/* Location */}
            <section className="mt-8 bg-white dark:bg-gray-900 border rounded-xl p-5 shadow-sm">
                <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
                    <MapPin size={20} className="text-blue-600" />
                    Map
                </h2>



                {hotel.location?.coordinates && (
                    <div className="mt-4 z-0 relative">
                        <MapPreview
                            lng={hotel.location.coordinates[0]}
                            lat={hotel.location.coordinates[1]}
                            height="300px"
                        />
                    </div>
                )}
            </section>

            {/* Description */}
            <section className="mt-8 bg-white dark:bg-gray-900 border rounded-xl p-5 shadow-sm">
                <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
                    <Info size={20} className="text-green-600" />
                    Description
                </h2>

                <p className="text-sm leading-relaxed">{hotel.description}</p>
            </section>

            {/* Highlights */}
            {hotel.propertyHighlights.length > 0 && (
                <section className="mt-8 bg-white dark:bg-gray-900 border rounded-xl p-5 shadow-sm">
                    <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
                        <Sparkles size={20} className="text-purple-600" />
                        Property Highlights
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {hotel.propertyHighlights.map((item) => (
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

            {/* Image Gallery */}
            {hotel.imagesUrls?.length > 0 && (
                <section className="mt-10">
                    <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
                        <Images size={20} className="text-purple-600" />
                        Gallery
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {hotel.imagesUrls.map((url, idx) => (
                            <div
                                key={idx}
                                className="w-full h-40 rounded-lg overflow-hidden border shadow-sm"
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
        </PageContainer>
    );

}
