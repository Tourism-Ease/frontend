// components/AdminProfile.tsx
import { PageContainer } from '@/components/admin/PageContainer';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { PageHeader } from '@/components/admin/PageHeader';
import { ProfileForm } from './ProfileForm';
import { useProfileQuery } from '../hooks/useProfile';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminProfile() {
  const { data: user, isLoading, error } = useProfileQuery();

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageContainer>
    );
  }

  if (error || !user) {
    return (
      <PageContainer>
        <div className="text-center py-8">
          <p className="text-red-600">Failed to load profile data</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <AdminBreadcrumb
        items={[
          { label: 'Dashboard', to: '/admin/dashboard' },
          { label: 'Profile' },
        ]}
      />

      <PageHeader
        title="My Profile"
        description="Manage your personal information and account settings"
      />

      <ProfileForm user={user} />
    </PageContainer>
  );
}