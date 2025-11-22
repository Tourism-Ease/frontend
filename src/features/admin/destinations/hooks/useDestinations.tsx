import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchPaginatedDestinations,
  fetchDestinations,
  fetchDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../api/destination.api';
import type {
  Destination,
  CreateDestinationDto,
  UpdateDestinationDto,
  PaginatedDestinationsResponse,
<<<<<<< HEAD
  DestinationResponse,
=======
>>>>>>> 4dd052fc99ba24b1477e4abad02f5623e00a78c2
} from '../types/destination.type';

// Query key
export const DESTINATIONS_QK = ['destinations'] as const;

interface PaginatedParams {
  page: number;
  limit: number;
  sort?: string;
  keyword?: string;
}

// ==========================
//  PAGINATED QUERY
// ==========================
export function usePaginatedDestinationsQuery({
  page,
  limit,
  sort,
  keyword,
}: PaginatedParams) {
  return useQuery<PaginatedDestinationsResponse>({
    queryKey: [...DESTINATIONS_QK, page, limit, sort, keyword],
    queryFn: () => fetchPaginatedDestinations(page, limit, sort, keyword),
    enabled: page > 0 && limit > 0,
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

// ==========================
//      QUERIES
// ==========================
export function useDestinationsQuery() {
  return useQuery<DestinationResponse[]>({
    queryKey: DESTINATIONS_QK,
    queryFn: fetchDestinations,
    initialData: [],
  });
}

export function useDestinationByIdQuery(id: string) {
  return useQuery<Destination>({
    queryKey: [...DESTINATIONS_QK, id],
    queryFn: () => fetchDestinationById(id),
    enabled: !!id,
  });
}

// ==========================
//      MUTATIONS
// ==========================
export function useCreateDestinationMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDestinationDto) => createDestination(payload),

    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: DESTINATIONS_QK });

      const prev = qc.getQueryData<Destination[]>(DESTINATIONS_QK) ?? [];

      const optimistic: Destination = {
        id: `temp-${Date.now()}`,
        name: payload.name,
        country: payload.country,
        city: payload.city,
        description: payload.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _optimistic: true,
      };

      qc.setQueryData<Destination[]>(DESTINATIONS_QK, [...prev, optimistic]);

      return { prev };
    },

    onError: (_err, _payload, ctx) => {
      if (ctx?.prev) qc.setQueryData(DESTINATIONS_QK, ctx.prev);
    },

    onSuccess: (res) => {
      qc.setQueryData<Destination[]>(DESTINATIONS_QK, (old) =>
        old?.map((d) => (d._optimistic ? res.data : d))
      );
    },

    onSettled: () => qc.invalidateQueries({ queryKey: DESTINATIONS_QK }),
  });
}

export function useUpdateDestinationMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateDestinationDto;
    }) => updateDestination(id, payload),

    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries({ queryKey: DESTINATIONS_QK });

      const prev = qc.getQueryData<Destination[]>(DESTINATIONS_QK) ?? [];

      qc.setQueryData<Destination[]>(
        DESTINATIONS_QK,
        prev.map((d) => (d.id === id ? { ...d, ...payload } : d))
      );

      return { prev };
    },

    onError: (_err, _payload, ctx) => {
      if (ctx?.prev) qc.setQueryData(DESTINATIONS_QK, ctx.prev);
    },

    onSettled: () => qc.invalidateQueries({ queryKey: DESTINATIONS_QK }),
  });
}

export function useDeleteDestinationMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDestination(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: DESTINATIONS_QK });

      const prev = qc.getQueryData<Destination[]>(DESTINATIONS_QK) ?? [];

      qc.setQueryData<Destination[]>(
        DESTINATIONS_QK,
        prev.filter((d) => d.id !== id)
      );

      return { prev };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(DESTINATIONS_QK, ctx.prev);
    },

    onSettled: () => qc.invalidateQueries({ queryKey: DESTINATIONS_QK }),
  });
}
