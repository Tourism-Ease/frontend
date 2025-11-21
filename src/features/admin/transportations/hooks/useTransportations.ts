// hooks/useTransportations.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchPaginatedTransportations,
  fetchTransportations,
  fetchTransportationById,
  createTransportation,
  updateTransportation,
  deleteTransportation,
} from '../api/transportation.api';
import type {
  Transportation,
  CreateTransportationDto,
  UpdateTransportationDto,
  PaginatedTransportationsResponse,
} from '../types/transportation.type';

export const TRANSPORTATIONS_QK = ['transportations'] as const;

interface PaginatedParams {
  page: number;
  limit: number;
  keyword?: string;
}

// Paginated
export function usePaginatedTransportationsQuery({
  page,
  limit,
  keyword,
}: PaginatedParams) {
  return useQuery<PaginatedTransportationsResponse>({
    queryKey: [...TRANSPORTATIONS_QK, page, limit, keyword],
    queryFn: () => fetchPaginatedTransportations(page, limit, keyword),
    enabled: page > 0 && limit > 0,
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

// All
export function useTransportationsQuery() {
  return useQuery<Transportation[]>({
    queryKey: TRANSPORTATIONS_QK,
    queryFn: fetchTransportations,
    initialData: [],
  });
}

// By ID
export function useTransportationByIdQuery(id: string) {
  return useQuery<Transportation>({
    queryKey: [...TRANSPORTATIONS_QK, id],
    queryFn: () => fetchTransportationById(id),
    enabled: !!id,
  });
}

// CREATE
export function useCreateTransportationMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransportationDto) =>
      createTransportation(payload),

    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: TRANSPORTATIONS_QK });
      const prev = qc.getQueryData<Transportation[]>(TRANSPORTATIONS_QK) ?? [];

      const optimistic: Transportation = {
        id: `temp-${Date.now()}`,
        companyName: payload.companyName,
        type: payload.type,
        class: payload.class || 'Economy',
        description: payload.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _optimistic: true,
      };

      qc.setQueryData<Transportation[]>(TRANSPORTATIONS_QK, [
        ...prev,
        optimistic,
      ]);
      return { prev };
    },

    onError: (_err, _payload, ctx) => {
      if (ctx?.prev) qc.setQueryData(TRANSPORTATIONS_QK, ctx.prev);
    },

    onSuccess: (res) => {
      qc.setQueryData<Transportation[]>(TRANSPORTATIONS_QK, (old) =>
        old?.map((t) => (t._optimistic ? res.data : t))
      );
    },

    onSettled: () => qc.invalidateQueries({ queryKey: TRANSPORTATIONS_QK }),
  });
}

// UPDATE
export function useUpdateTransportationMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTransportationDto;
    }) => updateTransportation(id, payload),

    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries({ queryKey: TRANSPORTATIONS_QK });
      const prev = qc.getQueryData<Transportation[]>(TRANSPORTATIONS_QK) ?? [];
      qc.setQueryData<Transportation[]>(
        TRANSPORTATIONS_QK,
        prev.map((t) => (t.id === id ? { ...t, ...payload } : t))
      );
      return { prev };
    },

    onError: (_err, _payload, ctx) => {
      if (ctx?.prev) qc.setQueryData(TRANSPORTATIONS_QK, ctx.prev);
    },

    onSettled: () => qc.invalidateQueries({ queryKey: TRANSPORTATIONS_QK }),
  });
}

// DELETE
export function useDeleteTransportationMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTransportation(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: TRANSPORTATIONS_QK });
      const prev = qc.getQueryData<Transportation[]>(TRANSPORTATIONS_QK) ?? [];
      qc.setQueryData<Transportation[]>(
        TRANSPORTATIONS_QK,
        prev.filter((t) => t.id !== id)
      );
      return { prev };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(TRANSPORTATIONS_QK, ctx.prev);
    },

    onSettled: () => qc.invalidateQueries({ queryKey: TRANSPORTATIONS_QK }),
  });
}
