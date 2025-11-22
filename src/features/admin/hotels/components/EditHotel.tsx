import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { PageContainer } from '@/components/admin/PageContainer';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { PageHeader } from '@/components/admin/PageHeader';
import { BackButton } from '@/components/admin/BackButton';
import { HotelForm } from '../components/HotelForm';
import {
    useUpdateHotelMutation,
    useHotelByIdQuery,
} from '../hooks/useHotels';
import type { UpdateHotelDto } from '../types/hotel.type';

export default function EditHotel() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: hotel, isLoading } = useHotelByIdQuery(id!);
    const editMutation = useUpdateHotelMutation();

    const handleSubmit = async (formData: UpdateHotelDto) => {
        if (!id) return;

        try {
            await editMutation.mutateAsync({ id, payload: formData });
            toast.success('Hotel updated successfully!');
            navigate('/admin/hotels');
        } catch (err) {
            toast.error('Failed to update hotel.');
            console.error(err);
        }
    };

    if (isLoading || !hotel) {
        return (
            <PageContainer>
                <p>Loading hotel...</p>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <AdminBreadcrumb
                items={[
                    { label: 'Dashboard', to: '/admin/dashboard' },
                    { label: 'Hotels', to: '/admin/hotels' },
                    { label: 'Edit' },
                ]}
            />

            <PageHeader
                title={`Edit hotel: ${hotel.name}`}
                description="Update the details of this hotel."
            />

            <HotelForm
                defaultValues={{
                    name: hotel.name,
                    address: hotel.address,
                    description: hotel.description,
                    stars: hotel.stars,
                    propertyHighlights: hotel.propertyHighlights,
                    location: hotel.location,
                    imageCoverUrl: hotel.imageCoverUrl, // <- here
                    imagesUrls: hotel.imagesUrls,       // <- and here
                }}
                onSubmit={handleSubmit}
                isLoading={editMutation.isPending}
            />

            <BackButton />
        </PageContainer>
    );
}
