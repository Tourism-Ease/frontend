// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchPaginatedUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../api/user.api";
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  PaginatedUsersResponse,
} from "../types/user.type";

export const USERS_QK = ['users'] as const;

interface PaginatedParams {
  page: number;
  limit: number;
  keyword?: string;
}

// Paginated
export function usePaginatedUsersQuery({
  page,
  limit,
  keyword,
}: PaginatedParams) {
  return useQuery<PaginatedUsersResponse>({
    queryKey: [...USERS_QK, page, limit, keyword],
    queryFn: () => fetchPaginatedUsers(page, limit, keyword),
    enabled: page > 0 && limit > 0,
    staleTime: 30_000,
    placeholderData: (prev) => prev,
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

// Helper function to clean phone number
const cleanPhoneNumber = (phone?: string): string | undefined => {
  if (!phone) return undefined;
  const cleaned = phone.trim();
  return cleaned === '' ? undefined : cleaned;
};

// CREATE
export function useCreateUserMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserDto) => {
      // Clean phone number before sending
      const cleanedPayload = {
        ...payload,
        phone: cleanPhoneNumber(payload.phone),
      };
      return createUser(cleanedPayload);
    },

    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: USERS_QK });
      const prev = qc.getQueryData<User[]>(USERS_QK) ?? [];

      const optimistic: User = {
        id: `temp-${Date.now()}`,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: cleanPhoneNumber(payload.phone),
        role: payload.role,
        active: true,
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _optimistic: true,
      };

      qc.setQueryData<User[]>(USERS_QK, [...prev, optimistic]);
      
      // Show loading toast
      toast.loading("Creating user...", {
        id: 'create-user',
      });
      
      return { prev };
    },

    onError: (error, _payload, ctx) => {
      if (ctx?.prev) qc.setQueryData(USERS_QK, ctx.prev);
      
      toast.error("Failed to create user", {
        id: 'create-user',
        description: "Please try again later.",
      });
      console.error('Error creating user:', error);
    },

    onSuccess: (res) => {
      qc.setQueryData<User[]>(USERS_QK, (old) =>
        old?.map((u) => (u._optimistic ? res : u))
      );

      toast.success("User created successfully!", {
        id: 'create-user',
        description: `${res.firstName} ${res.lastName} has been added.`,
      });
    },

    onSettled: () => qc.invalidateQueries({ queryKey: USERS_QK }),
  });
}

// UPDATE
export function useUpdateUserMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserDto }) => {
      // Clean phone number before sending
      const cleanedPayload = {
        ...payload,
        phone: cleanPhoneNumber(payload.phone),
      };
      return updateUser(id, cleanedPayload);
    },

    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries({ queryKey: USERS_QK });
      const prev = qc.getQueryData<User[]>(USERS_QK) ?? [];
      
      const updatedUser = prev.find(u => u.id === id);
      
      qc.setQueryData<User[]>(
        USERS_QK,
        prev.map((u) => (u.id === id ? { ...u, ...payload, phone: cleanPhoneNumber(payload.phone) } : u))
      );

      // Show loading toast
      toast.loading("Updating user...", {
        id: 'update-user',
      });
      
      return { prev, updatedUser };
    },

    onError: (error, { id }, ctx) => {
      if (ctx?.prev) qc.setQueryData(USERS_QK, ctx.prev);
      
      toast.error("Failed to update user", {
        id: 'update-user',
        description: "Please try again later.",
      });
      console.error('Error updating user:', error);
    },

    onSuccess: (res, { payload }) => {
      toast.success("User updated successfully!", {
        id: 'update-user',
        description: `${payload.firstName || res.firstName} ${payload.lastName || res.lastName} has been updated.`,
      });
    },

    onSettled: () => qc.invalidateQueries({ queryKey: USERS_QK }),
  });
}

// DELETE
export function useDeleteUserMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: USERS_QK });
      const prev = qc.getQueryData<User[]>(USERS_QK) ?? [];
      
      const userToDelete = prev.find(u => u.id === id);
      
      qc.setQueryData<User[]>(
        USERS_QK,
        prev.filter((u) => u.id !== id)
      );

      // Show loading toast
      if (userToDelete) {
        toast.loading("Deleting user...", {
          id: 'delete-user',
        });
      }
      
      return { prev, userToDelete };
    },

    onError: (error, id, ctx) => {
      if (ctx?.prev) qc.setQueryData(USERS_QK, ctx.prev);
      
      toast.error("Failed to delete user", {
        id: 'delete-user',
        description: "Please try again later.",
      });
      console.error('Error deleting user:', error);
    },

    onSuccess: (_res, id, ctx) => {
      if (ctx?.userToDelete) {
        toast.success("User deleted successfully!", {
          id: 'delete-user',
          description: `${ctx.userToDelete.firstName} ${ctx.userToDelete.lastName} has been removed.`,
        });
      }
    },

    onSettled: () => qc.invalidateQueries({ queryKey: USERS_QK }),
  });
}

// Additional hook for user status toggling
export function useToggleUserStatusMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      updateUser(id, { active }),

    onMutate: async ({ id, active }) => {
      await qc.cancelQueries({ queryKey: USERS_QK });
      const prev = qc.getQueryData<User[]>(USERS_QK) ?? [];
      
      const user = prev.find(u => u.id === id);
      
      qc.setQueryData<User[]>(
        USERS_QK,
        prev.map((u) => (u.id === id ? { ...u, active } : u))
      );

      toast.loading(`${active ? 'Activating' : 'Deactivating'} user...`, {
        id: 'toggle-user-status',
      });
      
      return { prev, user };
    },

    onError: (error, { id, active }, ctx) => {
      if (ctx?.prev) qc.setQueryData(USERS_QK, ctx.prev);
      
      toast.error(`Failed to ${active ? 'activate' : 'deactivate'} user`, {
        id: 'toggle-user-status',
        description: "Please try again later.",
      });
      console.error('Error toggling user status:', error);
    },

    onSuccess: (_res, { active }, ctx) => {
      if (ctx?.user) {
        toast.success(`User ${active ? 'activated' : 'deactivated'} successfully!`, {
          id: 'toggle-user-status',
          description: `${ctx.user.firstName} ${ctx.user.lastName} has been ${active ? 'activated' : 'deactivated'}.`,
        });
      }
    },

    onSettled: () => qc.invalidateQueries({ queryKey: USERS_QK }),
  });
}