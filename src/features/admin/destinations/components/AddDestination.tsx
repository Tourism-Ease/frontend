import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { PageContainer } from '@/components/admin/PageContainer';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { PageHeader } from '@/components/admin/PageHeader';
import { BackButton } from '@/components/admin/BackButton';
import { DestinationForm } from '../components/DestinationForm';
import { useCreateDestinationMutation } from '../hooks/useDestinations';
import type { CreateDestinationDto } from '../types/destination.type';

export default function AddDestination() {
  const navigate = useNavigate();
  const createMutation = useCreateDestinationMutation();

  const handleSubmit = async (data: CreateDestinationDto) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Destination created successfully!');
      navigate('/admin/destinations');
    } catch (err) {
      toast.error('Failed to create destination.');
      console.error(err);
    }
  };

  return (
    <PageContainer>
      <AdminBreadcrumb
        items={[
          { label: 'Dashboard', to: '/admin/dashboard' },
          { label: 'Destinations', to: '/admin/destinations' },
          { label: 'New' },
        ]}
      />

      <PageHeader
        title="Add New Destination"
        description="Fill in the details for the new destination."
      />

      <DestinationForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />

      <BackButton />
    </PageContainer>
  );
}
