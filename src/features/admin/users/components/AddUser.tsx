import { useNavigate } from 'react-router';
import { PageContainer } from '@/components/admin/PageContainer';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { PageHeader } from '@/components/admin/PageHeader';
import { BackButton } from '@/components/admin/BackButton';
import { useCreateUserMutation } from '../hooks/useUsers';
import type { CreateUserDto } from '../types/user.type';
import { UserForm } from './UserForm';
import { ConfirmModal } from './ConfirmModal';
import { useState } from 'react';

export default function AddUser() {
  const navigate = useNavigate();
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateUserDto | null>(null);
  
  const createMutation = useCreateUserMutation();

  const handleSubmit = async (data: CreateUserDto) => {
    // Store form data and open confirmation modal
    setFormData(data);
    setSaveModalOpen(true);
  };

  const handleSaveConfirmed = async () => {
    if (!formData) return;

    try {
      await createMutation.mutateAsync(formData);
      // Success toast is handled in the mutation hook
      setSaveModalOpen(false);
      setFormData(null);
      navigate('/admin/users');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Error toast is handled in the mutation hook
      setSaveModalOpen(false);
      setFormData(null);
    }
  };

  return (
    <>
      <PageContainer>
        <AdminBreadcrumb
          items={[
            { label: 'Dashboard', to: '/admin/dashboard' },
            { label: 'Users', to: '/admin/users' },
            { label: 'New' },
          ]}
        />

        <PageHeader
          title="Add New User"
          description="Fill in the details for the new user account."
        />

        <UserForm
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
        />

        <BackButton />
      </PageContainer>

      {/* Save Confirmation Modal */}
      <ConfirmModal
        isOpen={saveModalOpen}
        onClose={() => {
          setSaveModalOpen(false);
          setFormData(null);
        }}
        onConfirm={handleSaveConfirmed}
        title="Create User"
        description="Are you sure you want to create this new user account?"
        type="save"
        isLoading={createMutation.isPending}
        confirmText="Create User"
      />
    </>
  );
}