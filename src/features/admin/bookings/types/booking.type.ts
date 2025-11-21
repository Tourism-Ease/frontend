import type { Hotel } from "@/features/admin/hotels/types/hotel.type";

export interface Booking {
  id: string;
  bookingNumber: string;
  bookingType: string;
  title: string;
  shortDesc: string;
  bookingStatus: string;
  hotel?: Hotel;
  tripId?: string;
  packageId?: string;
  durationDays?: number;
  description?: string;
  itinerary?: string[];
  totalPrice: number;
  people?: {
    adults?: number;
    children?: number;
    foreigners?: number;
  };

  paymentType?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  paidAmount?: number;
  remainingAmount?: number;
  refundAmount?: number;
  refundDate?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  currentPage: number;
  limit: number;
  numberOfPages: number;
  totalDocs: number;
  next: number | null;
  previous: number | null;
}

export interface PaginatedBookingsResponse {
  results: number;
  paginationResult: PaginationMeta;
  data: Booking[];
}

// Single booking response
export interface BookingResponse {
  data: Booking;
}
