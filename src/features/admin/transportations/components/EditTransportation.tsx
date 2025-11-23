import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { PageContainer } from '@/components/admin/PageContainer';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { PageHeader } from '@/components/admin/PageHeader';
import { BackButton } from '@/components/admin/BackButton';
import { TransportationForm } from './TransportationForm';
import {
  useUpdateTransportationMutation,
  useTransportationByIdQuery,
} from '../hooks/useTransportations';
import type { UpdateTransportationDto } from '../types/transportation.type';
import { AdminSpinner, Spinner } from '@/components/ui/Spinner';

export default function EditTransportation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: transportation, isLoading } = useTransportationByIdQuery(id!);
  const editMutation = useUpdateTransportationMutation();

  const handleSubmit = async (formData: UpdateTransportationDto) => {
    if (!id) return;

    try {
      await editMutation.mutateAsync({ id, payload: formData });
      toast.success('Transportation updated successfully!');
      navigate('/admin/transportations');
    } catch (err) {
      toast.error('Failed to update transportation.');
      console.error(err);
    }
  };

  if (isLoading || !transportation) {
    return (
      <PageContainer>
        <AdminSpinner />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <AdminBreadcrumb
        items={[
          { label: 'Dashboard', to: '/admin/dashboard' },
          { label: 'Transportations', to: '/admin/transportaions' },
          { label: 'Edit' },
        ]}
      />

      <PageHeader
        title={`Edit Transporation: ${transportation.companyName}`}
        description="Update the details of this transporation."
      />

      <TransportationForm
        defaultValues={{
          companyName: transportation.companyName,
          type: transportation.type,
          class: transportation.class,
          description: transportation.description,
        }}
        onSubmit={handleSubmit}
        isLoading={editMutation.isPending}
      />

      <BackButton />
    </PageContainer>
  );
}
