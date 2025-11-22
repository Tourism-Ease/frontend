// hooks/usePackages.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fetchPaginatedPackages,
  fetchPackages,
  fetchPackageById,
  createPackage,
  updatePackage,
  deletePackage,
} from '../api/package.api';
import type {
  Package,
  PaginatedPackagesResponse,
} from '../types/package.type';

// Query keys
export const Packages_QK = ['packages'] as const;

interface PaginatedParams {
  page: number;
  limit: number;
  keyword?: string;
}

// Paginated packages query
export function usePaginatedPackagesQuery({
  page,
  limit,
  keyword,
}: PaginatedParams) {
  return useQuery<PaginatedPackagesResponse>({
    queryKey: [...Packages_QK, 'paginated', page, limit, keyword],
    queryFn: () => fetchPaginatedPackages(page, limit, keyword),
    enabled: page > 0 && limit > 0,
    staleTime: 30_000,
  });
}

// All packages query
export function usePackagesQuery() {
  return useQuery<Package[]>({
    queryKey: [...Packages_QK, 'all'],
    queryFn: fetchPackages,
    staleTime: 30_000,
  });
}

// Package by ID query
export function usePackageByIdQuery(id: string) {
  return useQuery<Package>({
    queryKey: [...Packages_QK, id],
    queryFn: () => fetchPackageById(id),
    enabled: !!id,
    staleTime: 30_000,
  });
}

// CREATE package mutation
export function useCreatePackageMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: FormData) => createPackage(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: Packages_QK });
      toast.success('Package created successfully!');
    },
    onError: (error: any) => {
      console.error('Create package error:', error);
      toast.error(error.response?.data?.message || 'Failed to create package.');
    },
  });
}

// UPDATE package mutation
export function useUpdatePackageMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
      updatePackage(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: Packages_QK });
      toast.success('Package updated successfully!');
    },
    onError: (error: any) => {
      console.error('Update package error:', error);
      toast.error(error.response?.data?.message || 'Failed to update package.');
    },
  });
}

// DELETE package mutation
export function useDeletePackageMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePackage(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: Packages_QK });
      toast.success('Package deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Delete package error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete package.');
    },
  });
}