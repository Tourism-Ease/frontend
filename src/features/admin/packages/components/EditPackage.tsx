import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { PageContainer } from '@/components/admin/PageContainer';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { PageHeader } from '@/components/admin/PageHeader';
import { BackButton } from '@/components/admin/BackButton';
import { PackageForm } from './PackageForm';
import {
    useUpdatePackageMutation,
    usePackageByIdQuery,
} from '../hooks/usePackages';

export default function EditPackage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: pkg, isLoading, isError, error } = usePackageByIdQuery(id!);
    const editMutation = useUpdatePackageMutation();

    const handleSubmit = async (formData: FormData) => {
        if (!id) return;

        try {
            await editMutation.mutateAsync({ id, payload: formData });
            toast.success('Package updated successfully!');
            navigate('/admin/packages');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to update package.');
            console.error(err);
        }
    };

    // Handle loading state
    if (isLoading) {
        return (
            <PageContainer>
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <span className="ml-2">Loading package...</span>
                </div>
            </PageContainer>
        );
    }

    // Handle error state
    if (isError || !pkg) {
        return (
            <PageContainer>
                <div className="text-center py-8">
                    <p className="text-red-600 mb-4">
                        {error?.message || 'Package not found or failed to load.'}
                    </p>
                    <BackButton />
                </div>
            </PageContainer>
        );
    }

    // Format departure date safely
    const formatDepartureDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        } catch {
            return dateString.split('T')[0];
        }
    };

    return (
        <PageContainer>
            <AdminBreadcrumb
                items={[
                    { label: 'Dashboard', to: '/admin/dashboard' },
                    { label: 'Packages', to: '/admin/packages' },
                    { label: 'Edit' },
                ]}
            />

            <PageHeader
                title={`Edit Package: ${pkg.title}`}
                description="Update the details of this travel package."
            />

            <PackageForm
                defaultValues={{
                    title: pkg.title,
                    hotel: pkg.hotel.id,
                    destination: pkg.destination.id,
                    pickupLocations: pkg.pickupLocations,
                    durationDays: pkg.durationDays,
                    shortDesc: pkg.shortDesc,
                    description: pkg.description,
                    itinerary: pkg.itinerary,
                    transportation: pkg.transportation?.transportationId || pkg.transportation?.id || '',
                    egyptianPrice: pkg.egyptianPrice,
                    childrenPrice: pkg.childrenPrice,
                    foreignerPrice: pkg.foreignerPrice,
                    capacity: pkg.capacity,
                    departureDate: formatDepartureDate(pkg.departureDate),
                    imageCoverUrl: pkg.imageCoverUrl,
                    imagesUrls: pkg.imagesUrls || [],
                }}
                onSubmit={handleSubmit}
                isLoading={editMutation.isPending}
            />

            <BackButton />
        </PageContainer>
    );
}