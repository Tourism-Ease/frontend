import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPaginatedUsers, fetchUserById, createUser, updateUser, deleteUser } from '../api/user.api';
import type { User, CreateUserDto, UpdateUserDto, PaginatedUsersResponse } from '../types/user.type';

export const USERS_QK = ['users'] as const;

interface PaginatedParams {
  page: number;
  limit: number;
  keyword?: string;
}

// Paginated
export function usePaginatedUsersQuery({ page, limit, keyword }: PaginatedParams) {
  return useQuery<PaginatedUsersResponse>({
    queryKey: [...USERS_QK, page, limit, keyword],
    queryFn: () => fetchPaginatedUsers(page, limit, keyword),
    enabled: page > 0 && limit > 0,
    staleTime: 30_000,
  });
}

// By ID
export function useUserByIdQuery(id: string) {
  return useQuery<User>({
    queryKey: [...USERS_QK, id],
    queryFn: () => fetchUserById(id),
    enabled: !!id,
  });
}

// CREATE
export function useCreateUserMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserDto) => createUser(payload),
    onSettled: () => qc.invalidateQueries({ queryKey: USERS_QK }),
  });
}

// UPDATE
export function useUpdateUserMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserDto }) => updateUser(id, payload),
    onSettled: () => qc.invalidateQueries({ queryKey: USERS_QK }),
  });
}

// DELETE
export function useDeleteUserMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSettled: () => qc.invalidateQueries({ queryKey: USERS_QK }),
  });
}
