import http from "@/lib/axios";
import type {
  Booking,
  PaginatedBookingsResponse,
  BookingResponse,
} from "../types/booking.type";

const RESOURCE = "/bookings";

// GET paginated bookings with optional search
export async function fetchPaginatedBookings(
  page = 1,
  limit = 10,
  sort?: string,
  keyword?: string
) {
  const params: Record<string, string | number> = { page, limit };
  if (keyword) params.keyword = keyword;
  if (sort) params.sort = sort;

  const { data } = await http.get<PaginatedBookingsResponse>(RESOURCE, {
    params,
  });

  // Axios wraps response in `data`, API also wraps in `data`
  return data;
}

// GET all bookings
export async function fetchBookings() {
  const { data } = await http.get<Booking[]>(RESOURCE);
  return data;
}

// GET single booking by id
export async function fetchBookingById(id: string) {
  const { data } = await http.get<BookingResponse>(`${RESOURCE}/${id}`);
  return data.data; // actual booking
}

export async function cancelBooking(id: string) {
  const { data } = await http.patch(`/bookings/${id}/cancel`);
  return data;
}

export async function confirmBooking(id: string) {
  const { data } = await http.put(`/bookings/${id}/confirm`);
  return data;
}
