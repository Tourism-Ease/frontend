import { useCallback, useState } from "react";
import { Link } from "react-router";
import { PageContainer } from "@/components/admin/PageContainer";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    Trash2,
    Edit,
    Plus,
    Calendar,
    Users,
    Star,
    MapPin,
} from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";

import {
    usePaginatedPackagesQuery,
    useDeletePackageMutation,
} from "../hooks/usePackages";
import type { Package } from "../types/package.type";
import useDebounce from "@/hooks/useDebounce";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/Button";

export default function PackagesList() {
    const [page, setPage] = useState(1);
    const [limit] = useState(6);
    const [search, setSearch] = useState("");

    const debouncedKeyword = useDebounce(search, 300);

    const { data, isLoading } = usePaginatedPackagesQuery({
        page,
        limit,
        keyword: debouncedKeyword,
    });

    const deleteMutation = useDeletePackageMutation();

    const handleDeleteConfirmed = useCallback(
        (pkg: Package) => {
            const loadingId = toast.loading("Deleting package...");
            deleteMutation.mutate(pkg.id, {
                onSuccess: () => {
                    toast.success("Package deleted!", { id: loadingId });
                    if (data && data.data.length === 1 && page > 1) setPage((p) => p - 1);
                },
                onError: () =>
                    toast.error("Failed to delete package.", { id: loadingId }),
            });
        },
        [deleteMutation, data, page]
    );

    return (
        <PageContainer>
            <div className="flex flex-col min-h-[85vh]">
                <AdminBreadcrumb
                    items={[
                        { label: "Dashboard", to: "/admin/dashboard" },
                        { label: "Packages" },
                    ]}
                />

                {/* Header + Search */}
                <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-6 mt-4">
                    <h1 className="text-2xl font-bold">Packages</h1>

                    <div className="flex gap-2 flex-wrap md:items-center">
                        <Input
                            placeholder="Search packages..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="md:w-72"
                        />
                        <Link to="/admin/packages/add">
                            <Button className="flex items-center gap-1" variant="default">
                                <Plus size={16} /> Create Package
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Packages Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-auto flex-1 pb-24">
                    {isLoading ? (
                        <div className="col-span-full text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                            <p className="mt-2 text-muted-foreground">Loading packages...</p>
                        </div>
                    ) : data?.data.length ? (
                        data.data.map((pkg) => (
                            <div
                                key={pkg.id}
                                className="bg-white dark:bg-gray-800 border border-border rounded-xl shadow hover:shadow-lg transition-shadow duration-200 flex flex-col"
                            >
                                <Link
                                    to={`/admin/packages/${pkg.id}`}
                                    className="group relative overflow-hidden rounded-t-xl"
                                >
                                    <img
                                        src={pkg.imageCoverUrl}
                                        alt={pkg.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded-md text-sm flex items-center gap-1">
                                        <Calendar size={14} />
                                        {pkg.durationDays}d
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
                                        {formatCurrency(pkg.egyptianPrice)}
                                    </div>
                                </Link>

                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h2 className="font-bold text-lg mb-1 line-clamp-1">
                                            {pkg.title}
                                        </h2>
                                        <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                                            <MapPin size={14} />
                                            {pkg.destination.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                                            <Star size={14} />
                                            {pkg.hotel.name}
                                        </p>
                                        <p className="text-sm line-clamp-2 mb-2">{pkg.shortDesc}</p>

                                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                            <div className="flex items-center gap-1">
                                                <Users size={14} />
                                                {pkg.availableSeats}/{pkg.capacity} seats
                                            </div>
                                            <div>{formatDate(pkg.departureDate)}</div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                                Egyptian: {formatCurrency(pkg.egyptianPrice)}
                                            </span>
                                            <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                                                Child: {formatCurrency(pkg.childrenPrice)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 mt-4 items-center">
                                        <Link to={`/admin/packages/edit/${pkg.id}`}>
                                            <Button
                                                size="sm"
                                                className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border border-blue-200 flex items-center gap-1 transition-colors"
                                            >
                                                <Edit size={16} />
                                                Edit
                                            </Button>
                                        </Link>

                                        <DeleteConfirmationDialog
                                            trigger={
                                                <Button
                                                    size="sm"
                                                    className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border border-red-200 flex items-center gap-1 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                    Delete
                                                </Button>
                                            }
                                            itemName={pkg.title}
                                            onConfirm={() => handleDeleteConfirmed(pkg)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8 text-muted-foreground">
                            <div className="text-lg font-medium mb-2">No packages found</div>
                            <p className="text-sm">
                                Create your first package to get started.
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination Footer */}
                {data && data.paginationResult.numberOfPages > 1 && (
                    <div className="sticky bottom-0 left-0 bg-white dark:bg-gray-900 border-t border-border py-3 flex justify-between items-center mt-6">
                        <span className="text-sm text-muted-foreground">
                            Page {page} of {data?.paginationResult.numberOfPages || 1}
                        </span>

                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={page === 1}
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            >
                                Previous
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={page === data?.paginationResult.numberOfPages}
                                onClick={() =>
                                    setPage((p) =>
                                        Math.min(p + 1, data?.paginationResult.numberOfPages || p)
                                    )
                                }
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </PageContainer>
    );
}
