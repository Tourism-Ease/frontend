import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { PageContainer } from '@/components/admin/PageContainer';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { PageHeader } from '@/components/admin/PageHeader';
import { BackButton } from '@/components/admin/BackButton';
import { DestinationForm } from '../components/DestinationForm';
import {
  useUpdateDestinationMutation,
  useDestinationByIdQuery,
} from '../hooks/useDestinations';
import type { UpdateDestinationDto } from '../types/destination.type';

export default function EditDestination() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: destination, isLoading } = useDestinationByIdQuery(id!);
  const editMutation = useUpdateDestinationMutation();

  const handleSubmit = async (formData: UpdateDestinationDto) => {
    if (!id) return;

    try {
      await editMutation.mutateAsync({ id, payload: formData });
      toast.success('Destination updated successfully!');
      navigate('/admin/destinations');
    } catch (err) {
      toast.error('Failed to update destination.');
      console.error(err);
    }
  };

  if (isLoading || !destination) {
    return (
      <PageContainer>
        <p>Loading destination...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <AdminBreadcrumb
        items={[
          { label: 'Dashboard', to: '/admin/dashboard' },
          { label: 'Destinations', to: '/admin/destinations' },
          { label: 'Edit' },
        ]}
      />

      <PageHeader
        title={`Edit Destination: ${destination.name}`}
        description="Update the details of this destination."
      />

      <DestinationForm
        defaultValues={{
          name: destination.name,
          country: destination.country,
          city: destination.city,
          description: destination.description,
        }}
        onSubmit={handleSubmit}
        isLoading={editMutation.isPending}
      />

      <BackButton />
    </PageContainer>
  );
}
