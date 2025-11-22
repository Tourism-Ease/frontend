import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchPaginatedTrips,
  fetchTrips,
  fetchTripById,
  createTrip,
  updateTrip,
  deleteTrip,
} from '../api/trips.api';
import type {
  Trip,
  CreateTripDto,
  UpdateTripDto,
  PaginatedTripsResponse,
} from '../types/trip.type';

export const Trips_QK = ['trips'] as const;

interface PaginatedParams {
  page: number;
  limit: number;
  keyword?: string;
  filters?: Record<string, string>;
}

export function usePaginatedTripsQuery({
  page,
  limit,
  keyword,
  filters, // <- changed param name
}: PaginatedParams) {
  return useQuery<PaginatedTripsResponse>({
    queryKey: [
      ...Trips_QK,
      page,
      limit,
      keyword ?? null,
      JSON.stringify(filters ?? {}),
    ],
    queryFn: () => fetchPaginatedTrips(page, limit, keyword, filters),
    enabled: page > 0 && limit > 0,
    staleTime: 30_000,
    // placeholderData: (prev) => prev, // optional
  });
}

// All
export function useTripsQuery() {
  return useQuery<Trip[]>({
    queryKey: Trips_QK,
    queryFn: fetchTrips,
    initialData: [],
  });
}

// By ID
export function useTripByIdQuery(id: string) {
  return useQuery<Trip>({
    queryKey: [...Trips_QK, id],
    queryFn: () => fetchTripById(id),
    enabled: !!id,
  });
}

// CREATE
export function useCreateTripMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTripDto) => createTrip(payload),

    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: Trips_QK });
      const prev = qc.getQueryData<Trip[]>(Trips_QK) ?? [];

      const optimistic: Trip = {
        id: `temp-${Date.now()}`,

        title: payload.title,
        destination: payload.destination,

        egyptianPrice: payload.egyptianPrice,
        foreignerPrice: payload.foreignerPrice,
        childrenPrice: payload.childrenPrice,

        duration: payload.duration,
        pickUp: payload.pickUp,

        overview: payload.overview,

        highlights: payload.highlights ?? [],
        whatToBring: payload.whatToBring ?? [],

        // Images — use temporary URLs if File is uploaded
        imageCover:
          payload.imageCover instanceof File
            ? URL.createObjectURL(payload.imageCover)
            : payload.imageCover ?? '',

        images:
          payload.images?.map((img) =>
            img instanceof File ? URL.createObjectURL(img) : img
          ) ?? [],

        // Backend URL fields — empty during optimistic update
        imageCoverUrl: '',
        imagesUrls: [],

        createdAt: new Date().toISOString(),

        // internal flag
        _optimistic: true,
      };

      qc.setQueryData<Trip[]>(Trips_QK, [...prev, optimistic]);
      return { prev };
    },

    onError: (_err, _payload, ctx) => {
      if (ctx?.prev) qc.setQueryData(Trips_QK, ctx.prev);
    },

    onSuccess: (res) => {
      qc.setQueryData<Trip[]>(Trips_QK, (old) =>
        old?.map((t) => (t._optimistic ? res.data : t))
      );
    },

    onSettled: () => qc.invalidateQueries({ queryKey: Trips_QK }),
  });
}

// UPDATE
export function useUpdateTripMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTripDto }) =>
      updateTrip(id, payload),

    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries({ queryKey: Trips_QK });
      const prev = qc.getQueryData<Trip[]>(Trips_QK) ?? [];
      qc.setQueryData<Trip[]>(
        Trips_QK,
        prev.map((t) => (t.id === id ? { ...t, ...payload } : t))
      );
      return { prev };
    },

    onError: (_err, _payload, ctx) => {
      if (ctx?.prev) qc.setQueryData(Trips_QK, ctx.prev);
    },

    onSettled: () => qc.invalidateQueries({ queryKey: Trips_QK }),
  });
}

// DELETE
export function useDeleteTripMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTrip(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: Trips_QK });
      const prev = qc.getQueryData<Trip[]>(Trips_QK) ?? [];
      qc.setQueryData<Trip[]>(
        Trips_QK,
        prev.filter((t) => t.id !== id)
      );
      return { prev };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(Trips_QK, ctx.prev);
    },

    onSettled: () => qc.invalidateQueries({ queryKey: Trips_QK }),
  });
}
