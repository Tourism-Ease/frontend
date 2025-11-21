// api/user.api.ts
import http from "@/lib/axios";
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  PaginatedUsersResponse,
  UserResponse,
} from "../types/user.type";

const RESOURCE = "/users";

// GET paginated
export async function fetchPaginatedUsers(
  page = 1,
  limit = 10,
  keyword?: string
) {
  try {
    const params: Record<string, string | number> = { page, limit };
    if (keyword) params.keyword = keyword;

    const { data } = await http.get<PaginatedUsersResponse>(RESOURCE, {
      params,
    });
    return data;
  } catch (error) {
    console.error("Error fetching paginated users:", error);
    throw error;
  }
}

// GET by ID
export async function fetchUserById(id: string) {
  try {
    const { data } = await http.get<UserResponse>(`${RESOURCE}/${id}`);
    return data.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
}

// CREATE
export async function createUser(payload: CreateUserDto) {
  try {
    const { data } = await http.post<User>(RESOURCE, payload);
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// UPDATE
export async function updateUser(id: string, payload: UpdateUserDto) {
  try {
    const { data } = await http.put<User>(`${RESOURCE}/${id}`, payload);
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// DELETE
export async function deleteUser(id: string) {
  try {
    const { data } = await http.delete(`${RESOURCE}/${id}`);
    return data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
