// api/transportation.api.ts
import http from '@/lib/axios';
import type {
  Transportation,
  CreateTransportationDto,
  UpdateTransportationDto,
  PaginatedTransportationsResponse,
  TransportationResponse,
} from '../types/transportation.type';

const RESOURCE = '/transportations';

// GET paginated
export async function fetchPaginatedTransportations(
  page = 1,
  limit = 10,
  keyword?: string
) {
  try {
    const params: Record<string, string | number> = { page, limit };
    if (keyword) params.keyword = keyword;

    const { data } = await http.get<PaginatedTransportationsResponse>(
      RESOURCE,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error fetching paginated transportations:', error);
    throw error;
  }
}

// GET all
export async function fetchTransportations() {
  try {
    const { data } = await http.get<Transportation[]>(RESOURCE);
    return data;
  } catch (error) {
    console.error('Error fetching transportations:', error);
    throw error;
  }
}

// GET by ID
export async function fetchTransportationById(id: string) {
  try {
    const { data } = await http.get<TransportationResponse>(
      `${RESOURCE}/${id}`
    );
    return data.data;
  } catch (error) {
    console.error('Error fetching transportation by ID:', error);
    throw error;
  }
}

// CREATE
export async function createTransportation(payload: CreateTransportationDto) {
  try {
    const { data } = await http.post(RESOURCE, payload);
    return data;
  } catch (error) {
    console.error('Error creating transportation:', error);
    throw error;
  }
}

// UPDATE
export async function updateTransportation(
  id: string,
  payload: UpdateTransportationDto
) {
  try {
    const { data } = await http.put<Transportation>(
      `${RESOURCE}/${id}`,
      payload
    );
    return data;
  } catch (error) {
    console.error('Error updating transportation:', error);
    throw error;
  }
}

// DELETE
export async function deleteTransportation(id: string) {
  try {
    const { data } = await http.delete(`${RESOURCE}/${id}`);
    return data;
  } catch (error) {
    console.error('Error deleting transportation:', error);
    throw error;
  }
}
