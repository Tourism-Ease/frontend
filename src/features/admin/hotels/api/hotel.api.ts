import http from '@/lib/axios';
import type {
  Hotel,
  CreateHotelDto,
  UpdateHotelDto,
  PaginatedHotelsResponse,
  HotelResponse,
} from '../types/hotel.type';

const RESOURCE = '/hotels';

// GET paginated + filters
export async function fetchPaginatedHotels(
  page = 1,
  limit = 10,
  sort?: string,
  keyword?: string
) {
  try {
    const params: Record<string, string | number> = { page, limit };
    if (sort) params.sort = sort;
    if (keyword) params.keyword = keyword;

    const { data } = await http.get<PaginatedHotelsResponse>(RESOURCE, {
      params,
    });
    return data;
  } catch (error) {
    console.error('Error fetching paginated hotels:', error);
    throw error;
  }
}

// GET all hotels (non-paginated)
export async function fetchHotels() {
  try {
    const { data } = await http.get<Hotel[]>(RESOURCE);
    return data;
  } catch (error) {
    console.error('Error fetching hotels:', error);
    throw error;
  }
}

// GET by ID
export async function fetchHotelById(id: string) {
  try {
    const { data } = await http.get<HotelResponse>(`${RESOURCE}/${id}`);
    return data.data;
  } catch (error) {
    console.error('Error fetching hotel by ID:', error);
    throw error;
  }
}

// CREATE (with images)
export async function createHotel(payload: FormData) {
  try {
    const isFormData = payload instanceof FormData;

    const { data } = await http.post(RESOURCE, payload, {
      headers: isFormData
        ? { 'Content-Type': 'multipart/form-data' }
        : undefined,
    });
    return data;
  } catch (error) {
    console.error('Error creating hotel:', error);
    throw error;
  }
}

// UPDATE
export async function updateHotel(id: string, payload: FormData) {
  try {
    const isFormData = payload instanceof FormData;

    const { data } = await http.patch(`${RESOURCE}/${id}`, payload, {
      headers: isFormData
        ? { 'Content-Type': 'multipart/form-data' }
        : undefined,
    });
    return data;
  } catch (error) {
    console.error('Error updating hotel:', error);
    throw error;
  }
}

// DELETE
export async function deleteHotel(id: string) {
  try {
    const { data } = await http.delete(`${RESOURCE}/${id}`);
    return data;
  } catch (error) {
    console.error('Error deleting hotel:', error);
    throw error;
  }
}
