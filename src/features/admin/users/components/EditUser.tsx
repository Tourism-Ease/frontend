import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageContainer } from '@/components/admin/PageContainer';
import { toast } from 'react-hot-toast';
import { fetchUserById, updateUser } from '../api/user.api';
import type { UpdateUserDto } from '../types/user.type';
import { UserForm } from './UserForm';

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch user data
  const { data: user, isLoading, isError } = useQuery(['user', id], () => fetchUserById(id!), {
    enabled: !!id,
  });

  // Update mutation
  const mutation = useMutation({
    mutationFn: (updatedUser: UpdateUserDto) => updateUser(id!, updatedUser),
    onSuccess: () => {
      toast.success('User updated successfully!');
      queryClient.invalidateQueries(['users']);
      navigate('/admin/users'); // Go back to users list
    },
    onError: () => {
      toast.error('Failed to update user.');
    },
  });

  if (isLoading) return <PageContainer>Loading user data...</PageContainer>;
  if (isError || !user) return <PageContainer>User not found</PageContainer>;

  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold mb-6">Edit User</h1>
      <UserForm<UpdateUserDto>
        defaultValues={user}
        isEditMode
        onSubmit={(data) => mutation.mutate(data)}
        isLoading={mutation.isPending}
      />
    </PageContainer>
  );
}
