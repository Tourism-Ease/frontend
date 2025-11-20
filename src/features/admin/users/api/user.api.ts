import http from '@/lib/axios';
import type { User, CreateUserDto, UpdateUserDto, PaginatedUsersResponse } from '../types/user.type';

const RESOURCE = '/users';

export async function fetchPaginatedUsers(page = 1, limit = 10, keyword?: string) {
  const params: Record<string, string | number> = { page, limit };
  if (keyword) params.keyword = keyword;

  const { data } = await http.get<PaginatedUsersResponse>(RESOURCE, { params });
  return data;
}

export async function fetchUserById(id: string) {
  const { data } = await http.get<User>(`${RESOURCE}/${id}`);
  return data;
}

export async function createUser(payload: CreateUserDto) {
  const { data } = await http.post(RESOURCE, payload);
  return data;
}

export async function updateUser(id: string, payload: UpdateUserDto) {
  const { data } = await http.put(`${RESOURCE}/${id}`, payload);
  return data;
}

export async function deleteUser(id: string) {
  await http.delete(`${RESOURCE}/${id}`);
}
