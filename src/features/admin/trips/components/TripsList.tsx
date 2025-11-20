import { useCallback, useState } from 'react';
import { Link } from 'react-router';
import { PageContainer } from '@/components/admin/PageContainer';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Trash2, Edit, Plus } from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/admin/DeleteConfirmationDialog';

import {
    usePaginatedTripsQuery,
    useDeleteTripMutation,
} from '../hooks/useTrips';
import type { Trip } from '../types/trip.type';
import useDebounce from '@/hooks/useDebounce';
import { formatCurrency } from '@/utils/formatCurrency';

export default function TripsList() {
    const [page, setPage] = useState(1);
    const [limit] = useState(6);
    const [search, setSearch] = useState('');

    const debouncedKeyword = useDebounce(search, 300);

    const { data, isLoading } = usePaginatedTripsQuery({
        page,
        limit,
        keyword: debouncedKeyword,
    });

    const deleteMutation = useDeleteTripMutation();

    const handleDeleteConfirmed = useCallback(
        (trip: Trip) => {
            const loadingId = toast.loading('Deleting trip...');
            deleteMutation.mutate(trip.id, {
                onSuccess: () => {
                    toast.success('Trip deleted!', { id: loadingId });
                    if (data && data.data.length === 1 && page > 1) setPage((p) => p - 1);
                },
                onError: () => toast.error('Failed to delete trip.', { id: loadingId }),
            });
        },
        [deleteMutation, data, page]
    );

    return (
        <PageContainer>
            <div className="flex flex-col min-h-[85vh]">
                <AdminBreadcrumb
                    items={[
                        { label: 'Dashboard', to: '/admin/dashboard' },
                        { label: 'Trips' },
                    ]}
                />

                {/* Header + Search */}
                <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-6 mt-4">
                    <h1 className="text-2xl font-bold">Trips</h1>

                    <div className="flex gap-2 flex-wrap md:items-center">
                        <Input
                            placeholder="Search trips..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="md:w-72"
                        />
                        <Link to="/admin/trips/add">
                            <Button className="flex items-center gap-1" variant="default">
                                <Plus size={16} /> Create Trip
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Trips Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-auto flex-1 pb-24">
                    {isLoading ? (
                        <p>Loading trips...</p>
                    ) : data?.data.length ? (
                        data.data.map((trip) => (
                            <div
                                key={trip.id}
                                className="bg-white dark:bg-gray-800 border border-border rounded-xl shadow hover:shadow-lg transition-shadow duration-200 flex flex-col"
                            >
                                <Link
                                    to={`/admin/trips/${trip.id}`}
                                    className="group relative overflow-hidden rounded-t-xl"
                                >
                                    <img
                                        src={trip.imageCoverUrl}
                                        alt={trip.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
                                        {formatCurrency(trip.price)} | {trip.duration}
                                    </div>
                                </Link>

                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h2 className="font-bold text-lg mb-1">{trip.title}</h2>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Destination: {trip.destination}
                                        </p>
                                        <p className="text-sm line-clamp-3 mb-2">{trip.overview}</p>

                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {trip.highlights.map((highlight) => (
                                                <span
                                                    key={highlight}
                                                    className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 
                       border border-green-100 font-medium"
                                                >
                                                    {highlight}
                                                </span>
                                            ))}
                                        </div>

                                        {/* <div className="mt-2 text-xs text-muted-foreground">
                                            Transportation Price: ${trip.transportation.price}
                                        </div> */}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 mt-4 items-center">
                                        <Link to={`/admin/trips/edit/${trip.id}`}>
                                            <Button
                                                size="sm"
                                                className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 
                       border border-blue-200 flex items-center gap-1 transition-colors"
                                            >
                                                <Edit size={16} />
                                                Edit
                                            </Button>
                                        </Link>

                                        <DeleteConfirmationDialog
                                            trigger={
                                                <Button
                                                    size="sm"
                                                    className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 
                           border border-red-200 flex items-center gap-1 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                    Delete
                                                </Button>
                                            }
                                            itemName={trip.title}
                                            onConfirm={() => handleDeleteConfirmed(trip)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center py-8 text-muted-foreground">
                            No trips found.
                        </p>
                    )}
                </div>

                {/* Pagination Footer */}
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
            </div>
        </PageContainer>
    );
}
