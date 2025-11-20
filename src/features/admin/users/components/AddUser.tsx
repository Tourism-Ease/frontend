import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { PageContainer } from '@/components/admin/PageContainer';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { PageHeader } from '@/components/admin/PageHeader';
import { BackButton } from '@/components/admin/BackButton';
import { useCreateUserMutation } from '../hooks/useUsers';
import type { CreateUserDto } from '../types/user.type';
import { UserForm } from './UserForm';

export default function AddUser() {
  const navigate = useNavigate();
  const createMutation = useCreateUserMutation();

  const handleSubmit = async (data: CreateUserDto) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('User created successfully!');
      navigate('/admin/users');
    } catch {
      toast.error('Failed to create user.');
    }
  };

  return (
    <PageContainer>
      <AdminBreadcrumb
        items={[
          { label: 'Dashboard', to: '/admin/dashboard' },
          { label: 'Users', to: '/admin/users' },
          { label: 'New' },
        ]}
      />
      <PageHeader title="Add New User" description="Fill in the details for the new user account." />
      <UserForm onSubmit={handleSubmit} isLoading={createMutation.isPending} isEditMode={false} />
      <BackButton />
    </PageContainer>
  );
}
