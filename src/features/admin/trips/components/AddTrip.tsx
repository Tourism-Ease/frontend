import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { PageContainer } from '@/components/admin/PageContainer';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { PageHeader } from '@/components/admin/PageHeader';
import { BackButton } from '@/components/admin/BackButton';
import { TripForm } from './TripForm';
import { useCreateTripMutation } from '../hooks/useTrips';
import type { CreateTripDto } from '../types/trip.type';

export default function AddTrip() {
  const navigate = useNavigate();
  const createMutation = useCreateTripMutation();

  const handleSubmit = (data: CreateTripDto) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Trip created successfully!");
        navigate("/admin/trips");
      },
      onError: (error) => {
        toast.error("Failed to create trip.");
        console.error(error);
      },
    });
  };

  return (
    <PageContainer>
      <AdminBreadcrumb
        items={[
          { label: 'Dashboard', to: '/admin/dashboard' },
          { label: 'trips', to: '/admin/trips' },
          { label: 'New' },
        ]}
      />

      <PageHeader
        title="Add New trip"
        description="Fill in the details for the new trip."
      />

      <TripForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />

      <BackButton />
    </PageContainer>
  );
}
