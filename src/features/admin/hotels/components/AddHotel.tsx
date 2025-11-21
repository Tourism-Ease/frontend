import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { PageContainer } from '@/components/admin/PageContainer';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { PageHeader } from '@/components/admin/PageHeader';
import { BackButton } from '@/components/admin/BackButton';
import { HotelForm } from '../components/HotelForm';
import { useCreateHotelMutation } from '../hooks/useHotels';

// ⚠️ We no longer import HotelFormData because we are now dealing with FormData
// import type { HotelFormData } from '../schema/hotel.schema'; 

export default function AddHotel() {
    const navigate = useNavigate();
    const createMutation = useCreateHotelMutation();

    // 💥 FIX 1: Change the type of 'data' to FormData
    const handleSubmit = async (data: FormData) => { 
        try {
            // 💥 FIX 2: Pass the FormData object directly to the mutation
            await createMutation.mutateAsync(data); 
            
            toast.success('Hotel created successfully!');
            navigate('/admin/hotels');
        } catch (err) {
            toast.error('Failed to create hotel.');
            console.error(err);
        }
    };

    return (
        <PageContainer>
            <AdminBreadcrumb
                items={[
                    { label: 'Dashboard', to: '/admin/dashboard' },
                    { label: 'Hotels', to: '/admin/hotels' },
                    { label: 'New' },
                ]}
            />

            <PageHeader
                title="Add New Hotel"
                description="Fill in the details for the new hotel."
            />

            <HotelForm onSubmit={handleSubmit} isLoading={createMutation.isPending} />

            <BackButton />
        </PageContainer>
    );
}