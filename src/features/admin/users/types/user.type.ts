// types/user.type.ts
export type UserRole = "user" | "admin" | "employee";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  active: boolean;
  isEmailVerified: boolean;
  avatarUrl?: string;
  avatar?: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
  passwordChangedAt?: string;
  _optimistic?: boolean;
}

// For form data that might include File objects
export interface UpdateProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: File;
}

// For API calls (only strings)
export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

// Rest of your types remain the same...
export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: UserRole;
  active?: boolean;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  data: User;
  token: string;
}

export interface PaginationMeta {
  currentPage: number;
  limit: number;
  numberOfPages: number;
  totalDocs: number;
  next: number | null;
  previous: number | null;
}

export interface PaginatedUsersResponse {
  results: number;
  paginationResult: PaginationMeta;
  data: User[];
}

export interface UserResponse {
  data: User;
}

export interface ProfileResponse {
  data: User;
}