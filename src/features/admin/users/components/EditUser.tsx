import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { PageContainer } from '@/components/admin/PageContainer';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { PageHeader } from '@/components/admin/PageHeader';
import { BackButton } from '@/components/admin/BackButton';
import { UserForm } from './UserForm';
import {
  useUpdateUserMutation,
  useUserByIdQuery,
} from '../hooks/useUsers';
import type { UpdateUserDto } from '../types/user.type';
import { ConfirmModal } from './ConfirmModal';
import { useState } from 'react';

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [formData, setFormData] = useState<UpdateUserDto | null>(null);

  const { data: user, isLoading, error } = useUserByIdQuery(id!);
  const editMutation = useUpdateUserMutation();

  // Handle loading and error states with toasts
  if (error) {
    toast.error('Failed to load user data', {
      description: 'Please try refreshing the page.',
    });
  }

  const handleSubmit = async (submitData: UpdateUserDto) => {
    if (!id) {
      toast.error('User ID is missing');
      return;
    }

    // Store form data and open confirmation modal
    setFormData(submitData);
    setSaveModalOpen(true);
  };

  const handleSaveConfirmed = async () => {
    if (!id || !formData) return;

    try {
      await editMutation.mutateAsync({ id, payload: formData });
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

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading user data...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer>
        <div className="text-center py-8">
          <p className="text-red-600">User not found</p>
          <button 
            onClick={() => navigate('/admin/users')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Back to Users
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer>
        <AdminBreadcrumb
          items={[
            { label: 'Dashboard', to: '/admin/dashboard' },
            { label: 'Users', to: '/admin/users' },
            { label: 'Edit' },
          ]}
        />

        <PageHeader
          title={`Edit User: ${user.firstName} ${user.lastName}`}
          description="Update the details of this user."
        />

        <UserForm
          defaultValues={{
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone || '',
            role: user.role,
            active: user.active,
          }}
          onSubmit={handleSubmit}
          isLoading={editMutation.isPending}
        />

        <BackButton />
      </PageContainer>

      {/* Save Changes Confirmation Modal */}
      <ConfirmModal
        isOpen={saveModalOpen}
        onClose={() => {
          setSaveModalOpen(false);
          setFormData(null);
        }}
        onConfirm={handleSaveConfirmed}
        title="Save Changes"
        description="Are you sure you want to save these changes to the user profile?"
        type="save"
        isLoading={editMutation.isPending}
        confirmText="Save Changes"
      />
    </>
  );
}