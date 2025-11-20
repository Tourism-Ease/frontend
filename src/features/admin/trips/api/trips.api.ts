import http from '@/lib/axios';
import type {
  Trip,
  CreateTripDto,
  UpdateTripDto,
  PaginatedTripsResponse,
  TripResponse,
} from '../types/trip.type';

const RESOURCE = '/trips';

// ---------------------------------------------------------
// GET paginated trips
// ---------------------------------------------------------
export const fetchPaginatedTrips = async (
  page = 1,
  limit = 10,
  keyword?: string
) => {
  const params: Record<string, string | number> = { page, limit };
  if (keyword) params.keyword = keyword;

  const { data } = await http.get<PaginatedTripsResponse>(RESOURCE, {
    params,
  });

  return data; // { results, paginationResult, data: Trip[] }
};

// ---------------------------------------------------------
// GET all trips
// ---------------------------------------------------------
export const fetchTrips = async () => {
  const { data } = await http.get<Trip[]>(RESOURCE);
  return data;
};

// ---------------------------------------------------------
// GET trip by ID
// ---------------------------------------------------------
export const fetchTripById = async (id: string) => {
  const { data } = await http.get<TripResponse>(`${RESOURCE}/${id}`);
  return data.data; // Trip
};

// ---------------------------------------------------------
// CREATE trip
// ---------------------------------------------------------
export const createTrip = async (payload: CreateTripDto | FormData) => {
  const isFormData = payload instanceof FormData;

  const { data } = await http.post<TripResponse>(RESOURCE, payload, {
    headers: isFormData
      ? { 'Content-Type': 'multipart/form-data' }
      : undefined,
  });

  return data.data; // trip
};

// ---------------------------------------------------------
// UPDATE trip
// ---------------------------------------------------------
export const updateTrip = async (
  id: string,
  payload: UpdateTripDto | FormData
) => {
  const isFormData = payload instanceof FormData;

  const { data } = await http.put<TripResponse>(
    `${RESOURCE}/${id}`,
    payload,
    {
      headers: isFormData
        ? { 'Content-Type': 'multipart/form-data' }
        : undefined,
    }
  );

  return data.data; // updated trip
};

// ---------------------------------------------------------
// DELETE trip
// ---------------------------------------------------------
export const deleteTrip = async (id: string) => {
  const { data } = await http.delete<{ message: string }>(
    `${RESOURCE}/${id}`
  );

  return data; // { message: "Deleted successfully" }
};
