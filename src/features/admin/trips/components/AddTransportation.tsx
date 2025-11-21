import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { PageContainer } from '@/components/admin/PageContainer';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { PageHeader } from '@/components/admin/PageHeader';
import { BackButton } from '@/components/admin/BackButton';
import { TransportationForm } from './TransportationForm';
import { useCreateTransportationMutation } from '../hooks/useTrips';
import type { CreateTransportationDto } from '../types/trip.type';

export default function AddTransportation() {
  const navigate = useNavigate();
  const createMutation = useCreateTransportationMutation();

  const handleSubmit = async (data: CreateTransportationDto) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Transportation created successfully!');
      navigate('/admin/transportations');
    } catch (err) {
      toast.error('Failed to create transportation.');
      console.error(err);
    }
  };

  return (
    <PageContainer>
      <AdminBreadcrumb
        items={[
          { label: 'Dashboard', to: '/admin/dashboard' },
          { label: 'Transportations', to: '/admin/transportations' },
          { label: 'New' },
        ]}
      />

      <PageHeader
        title="Add New Transportation"
        description="Fill in the details for the new transportations."
      />

      <TransportationForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />

      <BackButton />
    </PageContainer>
  );
}
