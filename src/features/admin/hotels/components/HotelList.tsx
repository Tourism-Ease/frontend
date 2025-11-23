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
    usePaginatedHotelsQuery,
    useDeleteHotelMutation,
} from '../hooks/useHotels';
import type { Hotel } from '../types/hotel.type';
import useDebounce from '@/hooks/useDebounce';
import { AdminSpinner, Spinner } from '@/components/ui/Spinner';

export default function HotelList() {
    const [page, setPage] = useState(1);
    const [limit] = useState(6);
    const [search, setSearch] = useState('');

    const debouncedKeyword = useDebounce(search, 300)

    const { data, isLoading } = usePaginatedHotelsQuery({
        page,
        limit,
        keyword: debouncedKeyword,
    });

    const deleteMutation = useDeleteHotelMutation();

    const handleDeleteConfirmed = useCallback(
        (hotel: Hotel) => {
            const loadingId = toast.loading('Deleting...');
            deleteMutation.mutate(hotel.id, {
                onSuccess: () => {
                    toast.success('Hotel deleted!', { id: loadingId });
                    if (data && data.data.length === 1 && page > 1) setPage((p) => p - 1);
                },
                onError: () => toast.error('Failed to delete hotel.', { id: loadingId }),
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
                        { label: 'Hotels' },
                    ]}
                />

                {/* Header + Search */}
                <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-6 mt-4">
                    <h1 className="text-2xl font-bold">Hotels</h1>

                    <div className="flex gap-2 flex-wrap md:items-center">
                        <Input
                            placeholder="Search hotels..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="md:w-72"
                        />
                        <Link to="/admin/hotels/add">
                            <Button className="flex items-center gap-1" variant="default">
                                <Plus size={16} /> Create Hotel
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Hotels Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-auto flex-1 pb-24">
                    {isLoading ? (
                        <AdminSpinner />
                    ) : data?.data.length ? (
                        data.data.map((hotel) => (
                            <div
                                key={hotel.id}
                                className="bg-white dark:bg-gray-800 border border-border rounded-xl shadow hover:shadow-lg transition-shadow duration-200 flex flex-col"
                            >
                                <Link
                                    to={`/admin/hotels/${hotel.id}`}
                                    className="group relative overflow-hidden rounded-t-xl"
                                >
                                    <img
                                        src={hotel.imageCoverUrl}
                                        alt={hotel.name}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
                                        {hotel.stars} ⭐
                                    </div>
                                </Link>

                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h2 className="font-bold text-lg mb-1">{hotel.name}</h2>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {hotel.address.city}, {hotel.address.country}
                                        </p>
                                        <p className="text-sm line-clamp-3 mb-2">{hotel.description}</p>

                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {hotel.propertyHighlights.map((highlight) => (
                                                <span
                                                    key={highlight}
                                                    className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 
                       border border-blue-100 font-medium"
                                                >
                                                    {highlight}
                                                </span>
                                            ))}
                                        </div>

                                    </div>



                                    {/* Actions */}

                                    <div className="flex gap-2 mt-4 items-center">
                                        {/* Edit */}
                                        <Link to={`/admin/hotels/edit/${hotel.id}`}>
                                            <Button
                                                size="sm"
                                                className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 
                       border border-blue-200 flex items-center gap-1 transition-colors"
                                            >
                                                <Edit size={16} />
                                                Edit
                                            </Button>
                                        </Link>

                                        {/* Delete */}
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
                                            itemName={hotel.name}
                                            onConfirm={() => handleDeleteConfirmed(hotel)}
                                        />
                                    </div>



                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center py-8 text-muted-foreground">
                            No hotels found.
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
