import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { PageContainer } from '@/components/admin/PageContainer';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { PageHeader } from '@/components/admin/PageHeader';
import { BackButton } from '@/components/admin/BackButton';
import { PackageForm } from './PackageForm';
import { useCreatePackageMutation } from '../hooks/usePackages';

export default function AddPackage() {
    const navigate = useNavigate();
    const createMutation = useCreatePackageMutation();

    const handleSubmit = async (data: FormData) => {
        try {
            await createMutation.mutateAsync(data);
            toast.success('Package created successfully!');
            navigate('/admin/packages');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to create package.');
            console.error(err);
        }
    };

    return (
        <PageContainer>
            <AdminBreadcrumb
                items={[
                    { label: 'Dashboard', to: '/admin/dashboard' },
                    { label: 'Packages', to: '/admin/packages' },
                    { label: 'New' },
                ]}
            />

            <PageHeader
                title="Add New Package"
                description="Fill in the details for the new travel package."
            />

            <PackageForm onSubmit={handleSubmit} isLoading={createMutation.isPending} />

            <BackButton />
        </PageContainer>
    );
}