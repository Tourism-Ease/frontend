import http from '@/lib/axios';
import type {
  Destination,
  CreateDestinationDto,
  UpdateDestinationDto,
  PaginatedDestinationsResponse,
  DestinationResponse,
} from '../types/destination.type';

const RESOURCE = '/destinations';

// GET paginated + filters
export async function fetchPaginatedDestinations(
  page = 1,
  limit = 10,
  sort?: string,
  keyword?: string
) {
  try {
    const params: Record<string, string | number> = { page, limit };
    if (sort) params.sort = sort;
    if (keyword) params.keyword = keyword;

    const { data } = await http.get<PaginatedDestinationsResponse>(RESOURCE, {
      params,
    });
    return data;
  } catch (error) {
    console.error('Error fetching paginated destinations:', error);
    throw error;
  }
}

// GET all destinations (non-paginated)
export async function fetchDestinations() {
  try {
    const { data } = await http.get<Destination[]>(RESOURCE);
    return data;
  } catch (error) {
    console.error('Error fetching destinations:', error);
    throw error;
  }
}

// GET by ID
export async function fetchDestinationById(id: string) {
  try {
    const { data } = await http.get<DestinationResponse>(`${RESOURCE}/${id}`);
    return data.data;
  } catch (error) {
    console.error('Error fetching destination by ID:', error);
    throw error;
  }
}

// CREATE
export async function createDestination(payload: CreateDestinationDto) {
  try {
    const { data } = await http.post(RESOURCE, payload);
    return data;
  } catch (error) {
    console.error('Error creating destination:', error);
    throw error;
  }
}

// UPDATE
export async function updateDestination(
  id: string,
  payload: UpdateDestinationDto
) {
  try {
    const { data } = await http.patch<Destination>(`${RESOURCE}/${id}`, payload);
    return data;
  } catch (error) {
    console.error('Error updating destination:', error);
    throw error;
  }
}

// DELETE
export async function deleteDestination(id: string) {
  try {
    const { data } = await http.delete(`${RESOURCE}/${id}`);
    return data;
  } catch (error) {
    console.error('Error deleting destination:', error);
    throw error;
  }
}
