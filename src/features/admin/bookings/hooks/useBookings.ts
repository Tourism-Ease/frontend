import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPaginatedBookings,
  fetchBookings,
  fetchBookingById,
} from "../api/booking.api";
import type { Booking, PaginatedBookingsResponse } from "../types/booking.type";
import { cancelBooking, confirmBooking } from "../api/booking.api";

export const BOOKINGS_QK = ["booking"] as const;

interface PaginatedParams {
  page: number;
  limit: number;
  sort?: string;
  keyword?: string;
}

export function usePaginatedBookingsQuery({
  page,
  limit,
  sort,
  keyword,
}: PaginatedParams) {
  return useQuery<PaginatedBookingsResponse>({
    queryKey: [...BOOKINGS_QK, page, limit, sort, keyword],
    queryFn: () => fetchPaginatedBookings(page, limit, sort, keyword),
    enabled: page > 0 && limit > 0,
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

export function useBookingsQuery() {
  return useQuery<Booking[]>({ queryKey: BOOKINGS_QK, queryFn: fetchBookings });
}

export function useBookingByIdQuery(id: string) {
  return useQuery<Booking>({
    queryKey: [...BOOKINGS_QK, id],
    queryFn: () => fetchBookingById(id),
    enabled: !!id,
  });
}

// Hook for cancel booking
export function useCancelBookingMutation(id?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cancelBooking(id!),
    onSuccess: () => {
      queryClient.invalidateQueries(["booking", id]);
    },
  });
}

// Hook for confirm booking
export function useConfirmBookingMutation(id?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => confirmBooking(id!),
    onSuccess: () => {
      queryClient.invalidateQueries(["booking", id]);
    },
  });
}
