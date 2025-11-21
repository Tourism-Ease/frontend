import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  fetchPaginatedHotels,
  fetchHotels,
  fetchHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} from '../api/hotel.api';

import type {
  Hotel,
  CreateHotelDto,
  UpdateHotelDto,
  PaginatedHotelsResponse,
} from '../types/hotel.type';

// Query key
export const HOTELS_QK = ['hotels'] as const;

interface PaginatedParams {
  page: number;
  limit: number;
  sort?: string;
  keyword?: string;
}

//
// ===============================
//      PAGINATED QUERY
// ===============================
//
export function usePaginatedHotelsQuery({
  page,
  limit,
  sort,
  keyword,
}: PaginatedParams) {
  return useQuery<PaginatedHotelsResponse>({
    queryKey: [...HOTELS_QK, page, limit, sort, keyword],
    queryFn: () => fetchPaginatedHotels(page, limit, sort, keyword),
    enabled: page > 0 && limit > 0,
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

//
// ===============================
//      QUERIES
// ===============================
//
export function useHotelsQuery() {
  return useQuery<Hotel[]>({
    queryKey: HOTELS_QK,
    queryFn: fetchHotels,
    initialData: [],
  });
}

export function useHotelByIdQuery(id: string) {
  return useQuery<Hotel>({
    queryKey: [...HOTELS_QK, id],
    queryFn: () => fetchHotelById(id),
    enabled: !!id,
  });
}

//
// ===============================
//      MUTATIONS
// ===============================
//
export function useCreateHotelMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateHotelDto) => createHotel(payload),

    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: HOTELS_QK });

      const prev = qc.getQueryData<Hotel[]>(HOTELS_QK) ?? [];

      // Optimistic hotel
      const optimistic: Hotel = {
        id: `temp-${Date.now()}`,
        name: payload.name,
        description: payload.description,
        stars: Number(payload.stars),

        address: payload.address,

        propertyHighlights: payload.propertyHighlights,

        location: payload.location,

        imageCover: '',
        images: [],

        _optimistic: true,
      };

      qc.setQueryData<Hotel[]>(HOTELS_QK, [...prev, optimistic]);

      return { prev };
    },

    onError: (_err, _payload, ctx) => {
      if (ctx?.prev) qc.setQueryData(HOTELS_QK, ctx.prev);
    },

    onSuccess: (res) => {
      qc.setQueryData<Hotel[]>(HOTELS_QK, (old) =>
        old?.map((h) => (h._optimistic ? res.data : h))
      );
    },

    onSettled: () => qc.invalidateQueries({ queryKey: HOTELS_QK }),
  });
}

export function useUpdateHotelMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateHotelDto }) =>
      updateHotel(id, payload),

    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries({ queryKey: HOTELS_QK });

      const prev = qc.getQueryData<Hotel[]>(HOTELS_QK) ?? [];

      qc.setQueryData<Hotel[]>(
        HOTELS_QK,
        prev.map((h) => (h.id === id ? { ...h, ...payload } : h))
      );

      return { prev };
    },

    onError: (_err, _payload, ctx) => {
      if (ctx?.prev) qc.setQueryData(HOTELS_QK, ctx.prev);
    },

    onSettled: () => qc.invalidateQueries({ queryKey: HOTELS_QK }),
  });
}

export function useDeleteHotelMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteHotel(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: HOTELS_QK });

      const prev = qc.getQueryData<Hotel[]>(HOTELS_QK) ?? [];

      qc.setQueryData<Hotel[]>(
        HOTELS_QK,
        prev.filter((h) => h.id !== id)
      );

      return { prev };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(HOTELS_QK, ctx.prev);
    },

    onSettled: () => qc.invalidateQueries({ queryKey: HOTELS_QK }),
  });
}
